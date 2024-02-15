import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../auth";
import { View, Text, ScrollView, Button } from "react-native";
import { Calendar } from "react-native-calendars";
import moment from "moment";
import { StackActions } from "@react-navigation/native";
import { getTimesNum, availableSlotsByDate, fullyBookedDates } from "../../utils";
import TimeContainer from "../../components/TimeContainer/TimeContainer";
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
    <View>
      <ScrollView>
        <View>
          <Text>Selecte day:</Text>
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
              selectedColor: "orange",
              selectedTextColor: "red",
            },
          }}
          minDate={today}
          maxDate={oneMonthsLater}
        />
        {selectedDate && (
          <>
            <Text>Available Times:</Text>
            {renderAvailableTimes()}
          </>
        )}

        {selectedTime && (
          <View>
            <Button title={"Book"} onPress={handleAddAppointment} />
          </View>
        )}
      </ScrollView>
    </View>
  );
}
