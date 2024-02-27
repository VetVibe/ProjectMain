import React, { useState, useEffect, useContext, useCallback, useMemo } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { AuthContext } from "../../auth";
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { colors, sizes } from "../../constants";
import { clientServer } from "../../server";
import { AppointmentCard } from "../../components";

const CARD_WIDTH = sizes.width / 1.5;

export default function AppointmentsScreen({ navigation }) {
  const { authState } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);
  const [vetDetailsMap, setVetDetailsMap] = useState({});

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        const appointmentsData = await clientServer.getAppointmentsByOwner(authState.id);
        setAppointments(appointmentsData);
      };
      fetchData();
    }, [authState.id])
  );

  useEffect(() => {
    const fetchVetDetails = async () => {
      const uniqueVetIds = Array.from(new Set(appointments.map((appointment) => appointment.vetId)));
      uniqueVetIds.forEach(async (vetId) => {
        if (!vetDetailsMap[vetId]) {
          const vetDetails = await clientServer.getVetInfo(vetId);
          setVetDetailsMap((prevDetails) => ({
            ...prevDetails,
            [vetId]: {
              name: vetDetails.name,
              phoneNumber: vetDetails.phoneNumber,
            },
          }));
        }
      });

      setLoading(false);
    };

    fetchVetDetails();
  }, [appointments]);

  const appointmentList = useMemo(() => {
    return appointments.map((appointment) => ({
      ...appointment,
      name: vetDetailsMap[appointment.vetId]?.name,
      phoneNumber: vetDetailsMap[appointment.vetId]?.phoneNumber,
    }));
  }, [appointments, vetDetailsMap]);

  const handleVetSearch = useCallback(() => {
    navigation.navigate("Find Vets");
  }, [navigation]);

  const removeAppointment = useCallback(async (appointmentId) => {
    try {
      setAppointments((prevAppointments) => {
        return prevAppointments.filter((appointment) => appointment._id !== appointmentId);
      });

      await clientServer.deleteAppointment(appointmentId);
    } catch (error) {
      console.error(error);
    }
  }, []);

  return (
    <View>
      {loading ? (
        <ActivityIndicator style={styles.loadingIndicator} size="large" />
      ) : (
        <View style={styles.container}>
          <View style={styles.list_container}>
            <FlatList
              snapToInterval={CARD_WIDTH + 24}
              decelerationRate={"fast"}
              showsHorizontalScrollIndicator={false}
              initialNumToRender={6}
              data={appointmentList}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <AppointmentCard appointment={item} onPressCancel={() => removeAppointment(item._id)} />
              )}
              ListHeaderComponent={
                <View style={styles.header_container}>
                  <Text style={styles.header_text}>Your appointments</Text>
                  <AntDesign name="pluscircleo" size={24} style={styles.icon} onPress={handleVetSearch} />
                </View>
              }
              ListEmptyComponent={<Text style={styles.emptyViewText}>No appointments.</Text>}
            />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
