import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../auth";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { Calendar } from "react-native-calendars";
import moment from "moment";
import { getTimesNum, availableSlotsByDate, fullyBookedDates } from "../../utils";
import { colors, sizes } from "../../constants";
import { TimeContainer, Button } from "../../components";
import { clientServer } from "../../server";

export default function MakeAppointmentScreen({ route, navigation }) {
  const { authState } = useContext(AuthContext);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [vetAppointments, setVetAppointments] = useState({});
  const [availableTimes, setAvailableTimes] = useState([]);
  const [timeSlots, setTimeSlots] = useState();
  const [bookedDays, setBookedDays] = useState([]);
  const vetId = route.params.vetId;

  const today = moment().format("YYYY-MM-DD");
  const oneMonthsLater = moment().add(1, "months").format("YYYY-MM-DD");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const appointments = await clientServer.getAppointmentsByVet(vetId);
        setVetAppointments(appointments);

        const vetDetails = await clientServer.getVetInfo(vetId);
        const slots = getTimesNum(vetDetails.start, vetDetails.end);
        setTimeSlots(slots);
        setBookedDays(fullyBookedDates(appointments, slots));
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [vetId]);

  const onDateSelect = async (day) => {
    try {
      setSelectedDate(day.dateString);
      const availableSlots = availableSlotsByDate(vetAppointments, new Date(day.dateString), timeSlots);
      setAvailableTimes(availableSlots);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddAppointment = async () => {
    try {
      const appointment = {
        vetId: vetId,
        date: new Date(selectedDate),
        time: selectedTime,
      };
      await clientServer.addAppointmentsByOwner(authState.id, appointment);
      navigation.reset({
        index: 0,
        routes: [{ name: "Pet Owner Appointments" }],
      });
    } catch (error) {
      console.error(error);
    }
  };

  const renderAvailableTimes = () => {
    return (
      <>
        {availableTimes.map((time) => (
          <TimeContainer
            key={time}
            time={time}
            onPress={(time) => setSelectedTime(time)}
            isSelected={selectedTime === time}
          />
        ))}
      </>
    );
  };

  return (
    <View style={styles.screen_container}>
      <ScrollView style={styles.container}>
        <View style={styles.header_container}>
          <Text style={styles.header}>Selecte day</Text>
        </View>

        <Calendar
          onDayPress={onDateSelect}
          markedDates={{
            ...bookedDays.reduce((obj, date) => {
              obj[date] = { disabled: true, disableTouchEvent: true };
              return obj;
            }, {}),
            [selectedDate]: {
              selected: true,
              disableTouchEvent: true,
              selectedColor: colors.primary,
              selectedTextColor: colors.white,
            },
          }}
          minDate={today}
          maxDate={oneMonthsLater}
        />
        {selectedDate && (
          <View style={styles.time_container}>
            {availableTimes.map((time) => (
              <TimeContainer
                key={time}
                time={time}
                onPress={(time) => setSelectedTime(time)}
                isSelected={selectedTime === time}
              />
            ))}
          </View>
        )}

        {selectedTime && <Button text={"Book"} onPress={handleAddAppointment} style={styles.book_button} />}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen_container: { flex: 1, backgroundColor: colors.white },
  container: {
    marginTop: 50,
  },
  header_container: {
    flex: 1,
    margin: 16,
  },
  header: {
    fontSize: sizes.h1,
    color: colors.primary,
    fontWeight: "bold",
    flex: 1,
  },
  time_container: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 16,
    justifyContent: "space-between",
  },
  book_button: {
    container: {
      marginHorizontal: 24,
      marginBottom: 12,
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
