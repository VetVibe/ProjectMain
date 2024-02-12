import React, { useState, useEffect } from "react";
import { TouchableOpacity, Text, View, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { clientServer } from "../../server";

export default function AppointmentCard({
  appointment,
  onPressCancel,
  userType,
}) {
  const [userDetails, setUserDetails] = useState(null);
  const { vetId, petOwnerId, date, time } = appointment;

  const formattedDate = new Date(date);
  const day = formattedDate.getDate();
  const month = formattedDate.toLocaleString("default", { month: "short" });

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        let userDetailsResponse;
        if (userType === "vet") {
          userDetailsResponse = await clientServer.getPetOwnerInfo(petOwnerId);
        } else if (userType === "petOwner") {
          userDetailsResponse = await clientServer.getVetInfo(vetId);
        }
        console.log("User details:", userDetailsResponse); // Add this line to check user details
        setUserDetails(userDetailsResponse);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    // Call fetchUserDetails only when userType, vetId, or petOwnerId change
    if (userType && vetId && petOwnerId) {
      fetchUserDetails();
    }
  }, [userType, vetId, petOwnerId]);

  return (
    <View>
      <View style={styles.container}>
        <View style={styles.date_container}>
          <View>
            <Text style={styles.date_text}>{day}</Text>
          </View>
          <View>
            <Text style={styles.month_text}>{month}</Text>
          </View>
        </View>
        <View style={styles.info_container}>
          <Text style={styles.appType}>{userDetails?.name}</Text>
          <Text style={styles.appType}>{userDetails?.phoneNumber}</Text>
          <Text style={styles.time}>
            {`${String(time).padStart(2, "0")}:00 - ${String(time + 1).padStart(
              2,
              "0"
            )}:00`}
          </Text>
        </View>
        <TouchableOpacity onPress={() => onPressCancel(appointment._id)}>
          <MaterialIcons name="delete" size={24} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    borderRadius: 20,
    marginHorizontal: 24,
    marginBottom: 16,
    paddingVertical: 8,
    backgroundColor: "#fff", // Add a background color
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    elevation: 6,
  },
  date_container: {
    marginHorizontal: 8,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff", // Add a background color
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  info_container: {
    flex: 1,
    justifyContent: "center",
  },
  date_text: {
    fontSize: 34,
  },
  month_text: {
    fontSize: 18,
  },
  appType: {
    fontSize: 18,
    padding: 8,
  },
  time: {
    fontSize: 14,
    padding: 8,
  },
});
