import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../auth";
import { View, StyleSheet, Text, TouchableOpacity, Alert } from "react-native";
import { Agenda, Timeline } from "react-native-calendars";
import moment from "moment";
import { clientServer } from "../../server";

export default function VetAppointmentsScreen() {
  const { authState } = useContext(AuthContext);
  const [vetAppointments, setVetAppointments] = useState([]);
  const [isOpenForBooking, setIsOpenForBooking] = useState(false);

  useEffect(() => {
    const checkVetAvailability = async () => {
      try {
        const vetDetails = await clientServer.getVetInfo(authState.id);
        setIsOpenForBooking(vetDetails.start && vetDetails.end);
      } catch (error) {
        console.log(error);
      }
    };
    checkVetAvailability();
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const appointments = await clientServer.getAppointmentsByVet(authState.id);
      const appointmentsWithDetails = await Promise.all(
        appointments.map(async (appointment) => {
          const petOwnerDetails = await clientServer.getPetOwnerInfo(appointment.petOwnerId);
          return {
            ...appointment,
            name: petOwnerDetails.name,
            phoneNumber: petOwnerDetails.phoneNumber,
          };
        })
      );

      const items = appointmentsWithDetails.reduce((obj, appointment) => {
        const date = moment(appointment.date).format("YYYY-MM-DD");
        if (!obj[date]) {
          obj[date] = [];
        }
        obj[date].push(appointment);
        return obj;
      }, {});

      setVetAppointments(items);
    } catch (error) {
      console.error("Error fetching vet appointments:", error);
    }
  };

  const renderItem = (item) => {
    return (
      <TouchableOpacity style={styles.item}>
        <Text>{item.name}</Text>
        <Text>{item.phoneNumber}</Text>
        <TouchableOpacity onPress={() => handleDelete(item._id)}>
          <Text style={styles.deleteButton}>Delete</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  const renderDay = (time) => {
    if (time) {
      return (
        <View style={styles.customDay}>
          <Text>{`${String(time).padStart(2, "0")}:00`}</Text>
          <Text>{`${String(time + 1).padStart(2, "0")}:00`}</Text>
        </View>
      );
    }
    return <View style={styles.dayItem} />;
  };

  const renderEmptyDate = () => {
    return (
      <View style={styles.emptyDate}>
        <Text>No appointments</Text>
      </View>
    );
  };

  const deleteAppointment = async (appointmentId) => {
    try {
      await clientServer.deleteAppointment(appointmentId);
      fetchAppointments();
    } catch (error) {
      console.error("Error deleting appointment:", error);
    }
  };

  const handleDelete = (appointmentId) => {
    Alert.alert("Cancel appointment", "Are you sure you want to cancel the appointment?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Yes",
        onPress: () => deleteAppointment(appointmentId),
      },
    ]);
  };

  return (
    <View style={styles.container}>
      {isOpenForBooking ? (
        <View>
          <Text style={styles.title}>Vet Appointments</Text>
          {vetAppointments && vetAppointments.length > 0 ? (
            <Agenda
              items={vetAppointments}
              renderItem={renderItem}
              rowHasChanged={(r1, r2) => r1.name !== r2.name}
              renderEmptyDate={renderEmptyDate}
              renderDay={(date, item) => renderDay(item.time)}
              showOnlySelectedDayItems
            />
          ) : (
            <Text>No appointments</Text>
          )}
        </View>
      ) : (
        <View>
          <Text style={styles.title}>Appointment manager isn't available.</Text>
          <Text>Set your working hours to enable it.</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  item: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 5,
    marginVertical: 8,
    marginHorizontal: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  deleteButton: {
    color: "red",
  },
  emptyDate: {
    height: 15,
    flex: 1,
    paddingTop: 30,
  },
  customDay: {
    padding: 20,
    borderRadius: 5,
    marginVertical: 8,
    marginHorizontal: 10,
  },
  dayItem: {
    marginLeft: 34,
  },
});
