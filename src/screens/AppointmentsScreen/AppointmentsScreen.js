import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from "react-native";
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
      const response = await clientServer.getAppointmentsByOwner(petOwnerId);
      const { appointments } = response;
      // console.log("Appointments by owner:", appointments);
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
      const response = await clientServer.getAppointmentsByVet(vetId);
      const { appointments } = response; // Extracting the appointments array from the response
      const appointmentsByDay = appointments.filter((appointment) => appointment.date === day);
      console.log("Appointments by vet and day:", appointmentsByDay);

      setAppointmentList(appointmentsByDay);
    } catch (error) {
      console.log("Error fetching appointments by vet:", error);
    }
  };

  const fetchData = async () => {
    try {
      if (vetId) {
        setUserType("vet");
        fetchAllVetAppointments(vetId);
      } else if (petOwnerId) {
        setUserType("petOwner");
        fetchAllPetOwnerAppointments(petOwnerId);
      } else {
        const id = await AsyncStorage.getItem("userId");
        setPetOwnerId(id);
        fetchAllPetOwnerAppointments(id);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  async function removeAppointment(appointmentId) {
    try {
      await clientServer.deleteAppointment(appointmentId);
      await fetchData();
    } catch (error) {
      console.error(error);
    }
  }

  const handleCancel = (appointmentId) => {
    Alert.alert("Are you sure you want to delete appointment?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Yes",
        onPress: () => removeAppointment(appointmentId),
      },
    ]);
  };

  return (
    <ScrollView>
      <Text style={styles.header_text}>Your appointments</Text>
      <View style={styles.list_container}>
        {!appointmentList || appointmentList?.length === 0 ? (
          <>
            <Text style={styles.emptyViewText}>You dont have appointments!</Text>
            {userType === "petOwner" ? (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("Make Appointment", {
                    petOwnerId: petOwnerId,
                    vetId: vetId,
                  })
                }
              >
                <Text style={styles.emptyViewText}>Make an appointment</Text>
              </TouchableOpacity>
            ) : null}
          </>
        ) : (
          <View>
            {appointmentList.map((appointment) => (
              <AppointmentCard
                appointment={appointment}
                key={appointment._id}
                onPressCancel={() => handleCancel(appointment._id)}
              />
            ))}
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
