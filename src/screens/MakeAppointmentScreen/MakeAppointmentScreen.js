import React, { useState, useEffect } from "react";
import { View, Text, Image, ScrollView, Button } from "react-native";
import { Calendar } from "react-native-calendars";
import moment from "moment";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StackActions } from "@react-navigation/native";
import { getTimesNum, appointmentsTime } from "../../utils";
import TimeContainer from "../../components/TimeContainer/TimeContainer";
import { clientServer } from "../../server";

export default function MakeAppointmentScreen({ route, navigation }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [vetAppointments, setVetAppointments] = useState({});
  const [availableTimes, setAvailableTimes] = useState([]);
  const [vetTimes, setVetTimes] = useState({ start: 8, end: 20 });

  const vetId = route.params?.vetId || (async () => await AsyncStorage.getItem("vetId"));

  const today = moment().format("YYYY-MM-DD");
  const oneMonthsLater = moment().add(1, "months").format("YYYY-MM-DD");
  const allTimes = getTimesNum(vetTimes.start, vetTimes.end);

  const petOwnerId = route.params?.petOwnerId || null;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const appointments = await clientServer.getAppointmentsByVet(vetId);
        setVetAppointments(appointments);

        const vetDetails = await clientServer.getVetInfo(vetId);
        setVetTimes(vetDetails.start, vetDetails.end);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [vetId]);

  const onDateSelect = async (day) => {
    try {
      if (petOwnerId) {
        setSelectedDate(day.dateString);
        const bookedTimes = vetAppointments ? appointmentsTime(vetAppointments, new Date(day)) : null;
        const availableTimes = bookedTimes ? allTimes.filter((time) => !bookedTimes.includes(time)) : allTimes;
        setAvailableTimes(availableTimes);
      } else {
        navigation.navigate("Appointments", {
          userId: vetId,
          day: selectedDate,
        });
      }
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
      await clientServer.addAppointmentsByOwner(petOwnerId, appointment);
      navigation.dispatch(
        StackActions.replace("Appointments", {
          petOwnerId: petOwnerId,
          userType: "petOwner",
        })
      );
    } catch (error) {
      console.error(error);
    }
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
            [selectedDate]: {
              selected: true,
              disableTouchEvent: true,
              selectedColor: "orange",
              selectedTextColor: "red",
            },
            [allTimes]: {
              disableTouchEvent: !petOwnerId && availableTimes == allTimes,
              customStyles: {
                container: {
                  backgroundColor: "white",
                  borderColor: "black",
                  borderWidth: 1,
                },
                text: {
                  color: "black",
                },
              },
            },
          }}
          minDate={today}
          maxDate={oneMonthsLater}
        />

        {selectedDate && (
          <View>
            <View>
              <Text>Select time:</Text>
            </View>
            <View>
              {availableTimes.map((time) => (
                <TimeContainer
                  key={time}
                  time={time}
                  onPress={(time) => setSelectedTime(time)}
                  isSelected={selectedTime === time}
                />
              ))}
            </View>
          </View>
        )}
      </ScrollView>
      <View>{petOwnerId && <Button title={"Book"} onPress={handleAddAppointment} />}</View>
    </View>
  );
}
