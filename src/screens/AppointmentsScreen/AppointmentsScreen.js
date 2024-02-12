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
      const appointments = await clientServer.getAppointmentsByOwner(petOwnerId);
      setAppointmentList(appointments);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchAllVetAppointments = async (vetId) => {
    try {
      const allAppointments = await clientServer.getAppointmentsByVet(vetId);
      const appointmentsByDay = allAppointments.filter((appointment) => appointment.date === day);
      setAppointmentList(appointmentsByDay);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchData = async () => {
    try {
      if (vetId) {
        setUserType("vet");
        fetchAllVetAppointments();
      } else if (petOwnerId) {
        setUserType("petOwner");
        fetchAllPetOwnerAppointments();
      } else {
        const id = await AsyncStorage.getItem("userId");
        setPetOwnerId(id);
        fetchAllPetOwnerAppointments();
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [petOwnerId]);

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
        onPress: () => {
          removeAppointment(appointmentId);
        },
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
                onPress={() => navigation.navigate("Make Appointment", { petOwnerId: petOwnerId, vetId: vetId })}
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
                serviceInfo={appointment.serviceInfo}
                key={appointment.id}
                onPressCancel={() => handleCancel(appointment)}
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
