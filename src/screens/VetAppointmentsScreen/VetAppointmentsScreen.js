import React, { useState, useCallback, useContext } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { AuthContext } from "../../auth";
import { View, StyleSheet, Text, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { Agenda } from "react-native-calendars";
import { colors, sizes } from "../../constants";
import moment from "moment";
import { clientServer } from "../../server";

export default function VetAppointmentsScreen() {
  const { authState } = useContext(AuthContext);
  const [vetAppointments, setVetAppointments] = useState();
  const [isOpenForBooking, setIsOpenForBooking] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      clientServer
        .getVetInfo(authState.id)
        .then((vetDetails) => {
          setIsOpenForBooking(vetDetails.start && vetDetails.end);
          return vetDetails.start && vetDetails.end;
        })
        .then(() => {
          clientServer
            .getAppointmentsByVet(authState.id)
            .then((appointments) => {
              const promiseArray = appointments.map(async (appointment) => {
                return clientServer
                  .getPetOwnerInfo(appointment.petOwnerId)
                  .then((petOwnerDetails) => {
                    appointment.name = petOwnerDetails.name;
                    appointment.phoneNumber = petOwnerDetails.phoneNumber;
                    return appointment;
                  })
                  .catch((error) => {
                    console.error("Error fetching pet owner info:", error);
                  });
              });
              return Promise.all(promiseArray);
            })
            .then((modefied) => {
              const items = modefied.reduce((obj, appointment) => {
                const date = moment(appointment.date).format("YYYY-MM-DD");
                if (!obj[date]) {
                  obj[date] = [];
                }
                obj[date].push(appointment);
                return obj;
              }, {});
              setVetAppointments(items);
            })
            .catch((error) => {
              console.error("Error fetching vet appointments:", error);
            });
        })
        .finally(() => {
          setIsLoading(false);
        });
    }, [authState.id])
  );
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
      setVetAppointments((prevAppointments) => {
        const newAppointments = { ...prevAppointments };
        for (const date in newAppointments) {
          newAppointments[date] = newAppointments[date].filter((appointment) => appointment._id !== appointmentId);
        }
        return newAppointments;
      });
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
      {isLoading ? (
        <ActivityIndicator style={styles.loadingIndicator} size="large" />
      ) : (
        <View>
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
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 40,
    padding: 20,
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    color: colors.primary,
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
