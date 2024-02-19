import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../auth";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { colors, sizes } from "../../constants";
import { clientServer } from "../../server";
import AppointmentCard from "../../components/AppointmentCard/AppointmentCard";

export default function AppointmentsScreen({ navigation }) {
  const { authState } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true);
  const [appointmentList, setAppointmentList] = useState([]);

  useEffect(() => {
    clientServer
      .getAppointmentsByOwner(authState.id)
      .then((appointments) => {
        const promiseArray = appointments.map(async (appointment) => {
          return clientServer
            .getVetInfo(appointment.vetId)
            .then((vetInfo) => {
              appointment.name = vetInfo.name;
              appointment.phoneNumber = vetInfo.phoneNumber;
              return appointment;
            })
            .catch((error) => {
              console.log("Error fetching vet info:", error);
            });
        });
        return Promise.all(promiseArray);
      })
      .then((modified) => {
        setAppointmentList(modified);
      })
      .catch((error) => {
        console.log("Error fetching appointments by owner:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [authState.id]);

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
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator style={styles.loadingIndicator} size="large" />
      ) : (
        <ScrollView>
          <View style={styles.header_container}>
            <Text style={styles.header_text}>Your appointments</Text>
            <AntDesign name="pluscircleo" size={24} style={styles.icon} onPress={handleVetSearch} />
          </View>
          <View style={styles.list_container}>
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
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 40,
  },
  header_container: {
    marginVertical: 16,

    paddingHorizontal: 24,
    flexDirection: "row",
    alignItems: "center",
  },
  header_text: {
    flex: 1,
    fontSize: sizes.h1,
    color: colors.primary,
    fontWeight: "bold",
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
  loadingIndicator: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    color: colors.primary,
  },
  icon: {
    color: colors.primary,
  },
});
