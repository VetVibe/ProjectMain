import React, { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { clientServer } from "../../server";
import AppointmentCard from "../../components/AppointmentCard/AppointmentCard";

export default function AppointmentsScreen({ navigation, route }) {
  const [appointmentList, setAppointmentList] = useState([]);
  const [petOwnerId, setPetOwnerId] = useState(route.params?.petOwnerId || null);
  const [userType, setUserType] = useState(null);

  const vetId = route.params?.vetId || null;
  const day = route.params?.day || null;

  const fetchAllPetOwnerAppointments = async (petOwnerId) => {
    try {
      const appointments = await clientServer.getAppointmentsByOwner(petOwnerId);
      const updatedAppointments = await Promise.all(
        appointments.map(async (appointment) => {
          let { name, phoneNumber } = await clientServer.getVetInfo(appointment.vetId);
          return {
            ...appointment,
            name: name,
            phoneNumber: phoneNumber,
          };
        })
      );
      setAppointmentList(updatedAppointments);
    } catch (error) {
      console.log("Error fetching appointments by owner:", error);
    }
  };

  const fetchAllVetAppointments = async (vetId) => {
    try {
      const appointments = await clientServer.getAppointmentsByVet(vetId);
      console.log(day);
      const appointmentsByDay = appointments.filter((appointment) => appointment.date === day);
      console.log("Appointments by vet and day:", appointmentsByDay);

      setAppointmentList(appointmentsByDay);
    } catch (error) {
      console.log("Error fetching appointments by vet:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          const type = await AsyncStorage.getItem("userType");
          setUserType(type);

          if (type == "vet") {
            fetchAllVetAppointments(vetId);
          } else if (type == "petOwner") {
            const id = petOwnerId || (await AsyncStorage.getItem("userId"));
            setPetOwnerId(id);
            fetchAllPetOwnerAppointments(id);
          }
        } catch (error) {
          console.log(error);
        }
      };

      fetchData();
    }, [])
  );

  const handleVetSearch = () => {
    navigation.navigate("Find Vets", {
      petOwnerId: petOwnerId,
      vetId: vetId,
    });
  };
  async function removeAppointment(appointmentId) {
    try {
      setAppointmentList((prevAppointments) => {
        return prevAppointments.filter((appointment) => appointment._id !== appointmentId);
      });

      await clientServer.deleteAppointment(appointmentId);
    } catch (error) {
      console.error(error);
    }
  }

  const handleCancel = (appointment) => {
    Alert.alert("Are you sure you want to delete appointment?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Yes",
        onPress: () => removeAppointment(appointment._id),
      },
    ]);
  };

  return (
    <ScrollView>
      <Text style={styles.header_text}>Your appointments</Text>
      <View style={styles.list_container}>
        {userType === "petOwner" && (
          <TouchableOpacity onPress={handleVetSearch}>
            <FontAwesome name="search" size={24} color="black" />
          </TouchableOpacity>
        )}
        {!appointmentList || appointmentList?.length === 0 ? (
          <>
            <Text style={styles.emptyViewText}>No appointments.</Text>
            {userType === "petOwner" && (
              <TouchableOpacity onPress={handleVetSearch}>
                <Text style={styles.emptyViewText}>Make an appointment</Text>
              </TouchableOpacity>
            )}
          </>
        ) : (
          <View>
            {appointmentList.map((appointment) => {
              return (
                <AppointmentCard
                  appointment={appointment}
                  key={appointment._id}
                  onPressCancel={() => handleCancel(appointment)}
                />
              );
            })}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 48,
  },
  header_text: {
    marginHorizontal: 24,
    marginVertical: 16,
    fontSize: 30,
  },
  list_container: {
    flex: 1,
    justifyContent: "center",
  },
  emptyViewText: {
    fontSize: 24,
    alignItems: "center",
    marginHorizontal: 24,
  },
  loading_container: {
    position: "absolute",
  },
});
