import React, { useState, useEffect } from "react";
import { View, Text, Image, ScrollView, Button } from "react-native";
import { Calendar } from "react-native-calendars";
import moment from "moment";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TabActions } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { getTimesNum, appointmentsTime, mapVetDetails } from "../../utils";
import TimeContainer from "../../components/TimeContainer/TimeContainer";
import { clientServer } from "../../server";

export default function MakeAppointmentScreen({ route, navigation }) {
  const [vetId, setVetId] = useState(null);
  const [vetTimes, setVetTimes] = useState({
    start: 8,
    end: 20,
  });
  const [vetDetails, setVetDetails] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [vetAppointments, setVetAppointments] = useState({});
  const [availableTimes, setAvailableTimes] = useState([]);
  const petOwnerId = route.params.petOwnerId || null;

  const today = moment().format("YYYY-MM-DD");
  const oneMonthsLater = moment().add(1, "months").format("YYYY-MM-DD");

  const fetchAllVetAppointments = async (vetId) => {
    try {
      const appointments = await clientServer.getAppointmentsByVet(vetId);
      setVetAppointments(appointments);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchVetDetails = async (vetId) => {
    try {
      const vetDetails = mapVetDetails(await clientServer.getVetInfo(vetId));
      setVetTimes({
        start: vetDetails.start || 8,
        end: vetDetails.end || 20,
      });
      setVetDetails(vetDetails);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const id = (await AsyncStorage.getItem("vetId")) || route.params.vetId;
        setVetId(id);

        await fetchAllVetAppointments(id);
        await fetchVetDetails(id);
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
        const allTimes = getTimesNum(vetTimes.start, vetTimes.end);
        const bookedTimes = vetAppointments
          ? appointmentsTime(vetAppointments, new Date(day))
          : null;
        const availableTimes = bookedTimes
          ? allTimes.filter((time) => !bookedTimes.includes(time))
          : allTimes;
        setAvailableTimes(availableTimes);
      } else {
        navigation.navigation("Appointments", {
          userId: vetId,
          date: selectedDate,
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
      const jumpToAction = TabActions.jumpTo("Appointments", {
        petOwnerId: petOwnerId,
        userType: "petOwner",
      });
      navigation.dispatch(jumpToAction);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View>
      <ScrollView>
        {/* Header */}
        <View>
          <Image
            source={
              vetDetails.profilePicture
                ? { uri: vetDetails.profilePicture }
                : {
                    uri: "https://mir-s3-cdn-cf.behance.net/projects/max_808_webp/3c6f95189614555.Y3JvcCwxMDI0LDgwMCwwLDExMQ.jpg",
                  }
            }
          />

          <View>
            <View>
              <Text>{vetDetails.name}</Text>
              <Text>{vetDetails.specialization}</Text>
            </View>
            <View>
              <Ionicons name="ios-location-outline" size={18} />
              <Text>{vetDetails.location}</Text>
            </View>
          </View>
        </View>

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
      <View>
        <Button title={"Book"} onPress={handleAddAppointment} />
      </View>
    </View>
  );
}
