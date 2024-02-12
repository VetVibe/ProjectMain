import React, { useState, useEffect } from "react";
import { TouchableOpacity, Text, View, StyleSheet, Image } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export default function AppointmentCard({
  appointment,
  onPressCancel,
  userType,
  userDetails,
}) {
  const { _id, vetId, petOwnerId, date, time } = appointment;
  const { name, phoneNumber, imageUrl } = userDetails;
  console.log("vetId:", vetId);
  console.log("_id:", _id);
  console.log("petOwnerId:", petOwnerId);
  console.log("date:", date);
  console.log("time:", time);

  const formattedDate = new Date(date);
  const day = formattedDate.getDate();
  const month = formattedDate.toLocaleString("default", { month: "short" });

  const [profilePicture, setProfilePicture] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        let userDetailsResponse;
        if (userType === "vet") {
          // For vets, extract profile picture from vetId directly
          setProfilePicture(userDetailsResponse.profilePicture);
        } else if (userType === "petOwner") {
          userDetailsResponse = await clientServer.getVetInfo(vetId._id);
          console.log("User details response:", userDetailsResponse);
          // Decode Base64-encoded profile picture
          setProfilePicture(atob(userDetailsResponse.profilePicture));
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    // Call fetchUserDetails only when userType, vetId, or petOwnerId change
    if (userType && vetId._id && petOwnerId) {
      fetchUserDetails();
    }
  }, [userType, vetId._id, petOwnerId]);

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
          <View style={styles.info}>
            <View style={styles.textContainer}>
              {name && (
                <>
                  <Text style={styles.appType}>{name}</Text>
                  <Text style={styles.appType}>{phoneNumber}</Text>
                </>
              )}
              <Text style={styles.time}>
                {`${String(time).padStart(2, "0")}:00 - ${String(
                  time + 1
                ).padStart(2, "0")}:00`}
              </Text>
            </View>
            {profilePicture && (
              <Image
                source={{ uri: `data:image/jpeg;base64,${profilePicture}` }}
                style={styles.image}
              />
            )}
          </View>
        </View>
        <TouchableOpacity onPress={() => onPressCancel(_id)}>
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
    backgroundColor: "#fff",
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
    backgroundColor: "#fff",
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
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
});
