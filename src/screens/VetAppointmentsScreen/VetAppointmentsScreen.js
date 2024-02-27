import React, { useState, useCallback, useContext, useEffect, useMemo } from "react";
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
  const [petOwners, setPetOwners] = useState({});
  const [isOpenForBooking, setIsOpenForBooking] = useState(false);
  const today = moment().format("YYYY-MM-DD");
  const [selectedDate, setSelectedDate] = useState(today);

  const agendaFormat = () => {
    const agendaData = {};
    if (vetAppointments && vetAppointments.length > 0) {
      vetAppointments.forEach((appointment) => {
        const date = new Date(appointment.date).toISOString().split("T")[0];
        if (!agendaData[date]) {
          agendaData[date] = [];
        }
        agendaData[date].push({
          _id: appointment._id,
          start: `${appointment.time}:00`,
          end: `${appointment.time + 1}:00`,
          title: petOwners[appointment.petOwnerId]?.name,
          summary: petOwners[appointment.petOwnerId]?.phoneNumber,
        });
      });
    }
    return agendaData;
  };

  useFocusEffect(
    useCallback(() => {
      const fetchAvailableHours = async () => {
        const vetDetails = await clientServer.getVetInfo(authState.id);
        setIsOpenForBooking(vetDetails.start && vetDetails.end);
      };
      fetchAvailableHours();

      const fetchAppointments = async () => {
        const appointmentsData = await clientServer.getAppointmentsByVet(authState.id);
        setVetAppointments(appointmentsData);
      };
      fetchAppointments();
    }, [authState.id])
  );

  useEffect(() => {
    const fetchPetOwnersInfo = async () => {
      const uniqueIds = Array.from(new Set(vetAppointments?.map((appointment) => appointment.petOwnerId)));
      uniqueIds.forEach(async (petOwnerId) => {
        if (!petOwners[petOwnerId]) {
          const petOwnerDetails = await clientServer.getPetOwnerInfo(petOwnerId);
          setPetOwners((prevOwners) => ({
            ...prevOwners,
            [petOwnerId]: {
              name: petOwnerDetails.name,
              phoneNumber: petOwnerDetails.phoneNumber,
            },
          }));
        }
      });
    };
    fetchPetOwnersInfo();
  }, [vetAppointments]);

  const appointmentList = useMemo(() => agendaFormat(), [vetAppointments, petOwners]);

  const renderItem = (item, firstItemInDay) => {
    return (
      <View style={styles.item}>
        <View style={styles.item_content}>
          <Text style={styles.item_title}>{item.title}</Text>
          <Text style={styles.item_summary}>{item.summary}</Text>
        </View>
        <TouchableOpacity onPress={() => handleDelete(item._id)}>
          <Text style={styles.deleteButton}>Cancel</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderDay = (day, item) => {
    if (day) {
      return (
        <View style={styles.time_container}>
          <Text style={styles.time}>{item.start}</Text>
          <Text style={styles.time}>{item.end}</Text>
        </View>
      );
    }
    return <View style={styles.dayItem} />;
  };

  const renderEmptyData = () => {
    if (!isOpenForBooking) {
      return (
        <View>
          <Text style={styles.title}>Appointment manager isn't available.</Text>
          <Text>Set your working hours to enable it.</Text>
        </View>
      );
    }
    return (
      <View>
        <Text>No appointments</Text>
      </View>
    );
  };

  const deleteAppointment = async (appointmentId) => {
    try {
      await clientServer.deleteAppointment(appointmentId);
      setVetAppointments((prevAppointments) => {
        prevAppointments.filter((appointment) => appointment._id !== appointmentId);
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
    <Agenda
      items={appointmentList}
      onDayPress={(day) => {
        setSelectedDate(day.dateString);
      }}
      selected={selectedDate}
      current={selectedDate}
      initialDate={today}
      renderItem={(item, firstItemInDay) => renderItem(item, firstItemInDay)}
      renderDay={(day, item) => renderDay(day, item)}
      renderEmptyData={renderEmptyData}
      rowHasChanged={(r1, r2) => {
        return r1.text !== r2.text;
      }}
      showClosingKnob={appointmentList ? true : false}
      markedDates={{
        [Object.keys(appointmentList)]: {
          marked: true,
          disabled: false,
          dotColor: colors.primary,
        },
        [selectedDate]: {
          selected: true,
          selectedColor: colors.primary,
          selectedTextColor: colors.white,
        },
      }}
      showOnlySelectedDayItems={true}
      disabledByDefault={true}
      pastScrollRange={1}
      futureScrollRange={1}
      hideExtraDays={true}
    />
  );
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 5,
    marginVertical: 8,
    marginHorizontal: 10,
    borderWidth: 1,
    borderColor: colors.light_gray,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  item_content: {
    flex: 1,
  },
  item_title: {
    fontSize: sizes.h3,
    fontWeight: "bold",
    marginBottom: 8,
  },
  item_summary: {
    fontSize: sizes.body2,
    color: colors.grey,
  },
  deleteButton: {
    color: colors.error,
  },
  time_container: {
    alignItems: "center",
    marginVertical: 12,
  },
  time: {
    fontSize: sizes.h4,
    color: colors.gray,
    margin: 5,
  },
  dayItem: {
    marginLeft: 34,
  },
});
