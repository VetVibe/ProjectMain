import React, { useState, useCallback, useContext } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { AuthContext } from "../../auth";
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { clientServer } from "../../server";
import AppointmentCard from "../../components/AppointmentCard/AppointmentCard";

export default function AppointmentsScreen({ navigation }) {
  const { authState } = useContext(AuthContext);
  const [appointmentList, setAppointmentList] = useState([]);

  const fetchAllPetOwnerAppointments = async () => {
    try {
      const appointments = await clientServer.getAppointmentsByOwner(authState.id);
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

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          fetchAllPetOwnerAppointments();
        } catch (error) {
          console.log(error);
        }
      };

      fetchData();
    }, [])
  );

  const handleVetSearch = () => {
    navigation.navigate("Find Vets");
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

  return (
    <ScrollView>
      <Text style={styles.header_text}>Your appointments</Text>
      <View style={styles.list_container}>
        <TouchableOpacity onPress={handleVetSearch}>
          <FontAwesome name="search" size={24} color="black" />
        </TouchableOpacity>
        {!appointmentList || appointmentList?.length === 0 ? (
          <Text style={styles.emptyViewText}>No appointments.</Text>
        ) : (
          <View>
            {appointmentList.map((appointment) => {
              return (
                <AppointmentCard
                  appointment={appointment}
                  key={appointment._id}
                  onPressCancel={() => removeAppointment(appointment._id)}
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
