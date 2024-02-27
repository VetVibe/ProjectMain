import React, { useState, useEffect, useContext, useMemo } from "react";
import { useNavigation, TabActions } from "@react-navigation/native";
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import { AuthContext } from "../../auth";
import { CalendarProvider, ExpandableCalendar } from "react-native-calendars";
import { getTimesNum, availableSlotsByDate, fullyBookedDates, mapAppointmentsByDate } from "../../utils";
import { colors, sizes } from "../../constants";
import { TimeContainer, Button } from "../../components";
import { clientServer } from "../../server";
import moment from "moment";

export default function MakeAppointmentScreen({ route }) {
  const navigation = useNavigation();
  const { authState } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [vetAppointments, setVetAppointments] = useState(null);
  const [timeSlots, setTimeSlots] = useState();
  const vetId = route.params.vetId;

  const today = moment().format("YYYY-MM-DD");
  const oneMonthsLater = moment().add(1, "months").format("YYYY-MM-DD");

  useEffect(() => {
    const fetchAppointments = async () => {
      const appointments = await clientServer.getAppointmentsByVet(vetId);
      setVetAppointments(appointments);
    };
    fetchAppointments();

    const fetchWorkingHours = async () => {
      const vetDetails = await clientServer.getVetInfo(vetId);
      const slots = getTimesNum(vetDetails.start, vetDetails.end);
      setTimeSlots(slots);
    };
    fetchWorkingHours();
  }, [vetId]);

  const appointmentsByDate = useMemo(() => mapAppointmentsByDate(vetAppointments), [vetAppointments]);

  const bookedDatesList = useMemo(() => fullyBookedDates(appointmentsByDate, timeSlots), [appointmentsByDate]);

  const availableSlots = useMemo(() => {
    if (!selectedDate) return [];
    const slots = availableSlotsByDate(appointmentsByDate, new Date(selectedDate), timeSlots);
    setLoading(false);
    return slots;
  }, [selectedDate]);

  const handleAddAppointment = async () => {
    const appointment = {
      vetId: vetId,
      date: new Date(selectedDate),
      time: selectedTime,
    };
    await clientServer.addAppointmentsByOwner(authState.id, appointment);
    const jumpToAction = TabActions.jumpTo("Pet Owner Appointments");
    navigation.dispatch(jumpToAction);
    navigation.navigate("Pet Owner Appointments");
  };

  return (
    <View style={styles.screen_container}>
      <View style={styles.container}>
        <View style={styles.header_container}>
          <Text style={styles.header}>Selecte day</Text>
        </View>
        <View style={styles.calendar_container}>
          <CalendarProvider
            date={today}
            onDateChanged={(date) => {
              setLoading(true);
              setSelectedDate(date);
            }}
          >
            <ExpandableCalendar
              markedDates={{
                [bookedDatesList]: {
                  disabled: true,
                  disableTouchEvent: true,
                },
                [selectedDate]: {
                  selected: true,
                },
              }}
              minDate={today}
              maxDate={oneMonthsLater}
              disablePan={true}
              hideKnob={true}
              theme={{
                textSectionTitleColor: colors.primary,
                selectedDayBackgroundColor: colors.primary,
                selectedDayTextColor: colors.white,
                todayTextColor: colors.primary,
                dayTextColor: colors.primary,
                textDisabledColor: colors.gray,
                dotColor: colors.primary,
                selectedDotColor: colors.white,
                arrowColor: colors.primary,
                monthTextColor: colors.primary,
                textDayFontSize: 16,
                textMonthFontSize: 16,
                textDayHeaderFontSize: 16,
              }}
              disableAllTouchEventsForDisabledDays={true}
            />
          </CalendarProvider>
        </View>
        {selectedDate && (
          <View style={styles.time_container}>
            {loading ? (
              <ActivityIndicator size="large" />
            ) : (
              <FlatList
                data={availableSlots}
                horizontal={false}
                numColumns={2}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TimeContainer
                    time={item}
                    onPress={(time) => setSelectedTime(time)}
                    isSelected={selectedTime === item}
                  />
                )}
                contentContainerStyle={styles.time_content_container}
              />
            )}
          </View>
        )}

        {selectedTime && <Button text={"Book"} onPress={handleAddAppointment} style={styles.book_button} />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen_container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  container: {
    justifyContent: "center",
  },
  header_container: {
    alignSelf: "center",
    marginVertical: 16,
  },
  header: {
    fontSize: sizes.h1,
    color: colors.primary,
    fontWeight: "bold",
  },
  time_container: {
    marginTop: 150,
  },
  time_content_container: {
    alignItems: "center",
  },
  book_button: {
    container: {
      marginHorizontal: 24,
      marginVertical: 12,
      borderRadius: 20,
      padding: 8,
      shadowColor: colors.gray,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      width: "90%",
      backgroundColor: colors.primary,
    },
    text: {
      textAlign: "center",
      fontSize: sizes.h3,
      padding: 4,
      color: colors.white,
      fontWeight: "bold",
    },
  },
});
