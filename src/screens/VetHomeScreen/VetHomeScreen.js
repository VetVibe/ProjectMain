import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Switch,
  StyleSheet,
} from "react-native";
import { COLORS, FONTS, SIZES, images } from "../../constants";
import { StatusBar } from "expo-status-bar";
import { MaterialIcons } from "@expo/vector-icons";
import { mapVetDetails } from "../../utils";
import axios from "axios";
import { style } from "twrnc";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function VetHomeScreen({ route, navigation }) {
  const [vetDetails, setVetDetails] = useState({});

  const vetId = route.params.userId;
  const userType = route.params.userType;

  useEffect(() => {
    axios
      .get(`http://localhost:3000/veterinarian/${vetId}`)
      .then((response) => {
        const mapedVetDetails = mapVetDetails(response.data);
        setVetDetails(mapedVetDetails);
      })
      .catch((error) => {
        console.error("Error fetching vet details:", error);
      });
  }, [vetId]);

  const toggleSwitch = () =>
    setVetDetails((prevUserInput) => {
      return {
        ...prevUserInput,
        ["isAvailable"]: !vetDetails.isAvailable,
      };
    });

  const EditVetProfileClick = () => {
    navigation.navigate("Edit Vet Profile Screen", { vetId: vetId });
  };
  const LogoutClick = () => {
    clearAuthToken();
    
  };
  const clearAuthToken = async () => {
    await AsyncStorage.removeItem("authToken");
    console.log("Cleared auth token");
    navigation.replace("Home");
  };
  const ShowTips = () => {
    navigation.navigate("Tips Screen", { vetId: vetId, userType: userType });
  };

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <StatusBar backgroundColor={COLORS.gray} />
      <ScrollView style={{ flex: 1 }}>
        <View style={{ alignItems: "center" }}>
          {userType === "vet" ? (
            <>
              <TouchableOpacity
                style={styles.editProfileButton}
                onPress={EditVetProfileClick}
              >
                <MaterialIcons name="edit" size={24} color={COLORS.white} />
              </TouchableOpacity>

              <TouchableOpacity style={styles.tipsButton} onPress={ShowTips}>
                <MaterialIcons
                  name="my-library-books"
                  size={24}
                  color={COLORS.white}
                />
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity onPress={ShowTips}>
                <MaterialIcons
                  name="my-library-books"
                  size={24}
                  color={COLORS.white}
                />
              </TouchableOpacity>
            </>
          )}
          <Image
            source={images.Vetprofile}
            resizeMode="contain"
            style={styles.vetProfileImage}
          />

          <Text style={styles.name}>{vetDetails.name}</Text>
          <Text style={styles.specialization}>{vetDetails.specialization}</Text>

          <View style={styles.detailsContainer}>
            <MaterialIcons name="location-on" size={24} color="black" />
            <Text style={styles.location}>{vetDetails.location}</Text>
          </View>

          <View style={styles.detailsContainer}>
            <MaterialIcons name="phone" size={24} color="black" />
            <Text style={styles.location}>{vetDetails.phoneNumber}</Text>
          </View>

          <View style={{ paddingVertical: 8, flexDirection: "row" }}>
            <View style={styles.infoBox}>
              <Text style={{ ...FONTS.h3, color: "black" }}>
                {vetDetails.rate}
              </Text>
              <Text style={{ ...FONTS.body4, color: "black" }}>Rating</Text>
            </View>
          </View>

          {vetDetails.about !== "" && (
            <View style={styles.aboutContainer}>
              <Text style={styles.aboutTitle}>About</Text>
              <Text style={styles.description}>{vetDetails.about}</Text>
            </View>
          )}
          <TouchableOpacity style={styles.logoutButton} onPress={LogoutClick}>
            <MaterialIcons name="logout" size={24} color={COLORS.white} />
          </TouchableOpacity>

          {userType === "vet" ? (
            <>
              <View style={styles.availabilityContainer}>
                <Text
                  style={{ ...FONTS.h4, color: COLORS.black, marginRight: 10 }}
                >
                  {vetDetails.isAvailable ? "Available" : "Unavailable"}
                </Text>
                <Switch
                  trackColor={{ false: "#767577", true: "#FFA500" }}
                  thumbColor={vetDetails.isAvailable ? "#FFFFFF" : "#FFFFFF"}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={toggleSwitch}
                  value={vetDetails.isAvailable}
                />
              </View>
            </>
          ) : (
            <>
              <View style={styles.availabilityContainer}>
                <Text style={{ ...FONTS.h4, color: COLORS.black, marginRight: 10 }}>
                  {vetDetails.isAvailable ? "Available" : "Unavailable"}
                </Text>
              </View>
            </>

          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaContainer: { flex: 1, backgroundColor: COLORS.white },
  detailsContainer: {
    flexDirection: "row",
    marginVertical: 6,
    alignItems: "center",
  },
  aboutContainer: { width: "100%", paddingHorizontal: SIZES.padding },
  button: {
    width: "90%",
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    marginBottom: 20,
  },
  availabilityContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "90%",
    height: 40,
    padding: 10,
    marginVertical: 20,
    backgroundColor: COLORS.lightGray,
    borderRadius: 10,
  },
  infoBox: {
    flexDirection: "column",
    alignItems: "center",
    marginHorizontal: SIZES.padding,
    backgroundColor: COLORS.gray,
    borderRadius: 10,
    padding: 10,
  },
  viewProfileButton: {
    position: "absolute",
    left: 20,
    top: 20,
    zIndex: 1,
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
    borderRadius: 10,
  },
  editProfileButton: {
    position: "absolute",
    right: 20,
    top: 20,
    zIndex: 1,
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
    borderRadius: 10,
  },
  tipsButton: {
    position: "absolute",
    right: 20,
    top: 60,
    zIndex: 2,
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
    borderRadius: 10,
  },
  vetProfileImage: {
    height: 155,
    width: 155,
    borderRadius: 20,
    borderColor: COLORS.primary,
    borderWidth: 2,
    marginTop: 80,
  },
  name: {
    ...FONTS.h2,
    color: COLORS.primary,
    marginVertical: 8,
  },
  specialization: { color: COLORS.black, ...FONTS.body4 },
  location: { ...FONTS.body4, marginLeft: 4 },
  aboutTitle: {
    ...FONTS.h2,
    color: COLORS.black,
    textAlign: "left",
    marginTop: 15,
  },
  description: {
    ...FONTS.body4,
    color: COLORS.darkgray,
    textAlign: "left",
    marginTop: 10,
  },
  shreTipButton: {
    width: "90%",
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    marginBottom: 20,
    marginTop: 20,
  },
  logoutButton: {
    position: "absolute",
    right: 20,
    top: 100, // Adjust the position based on your layout
    zIndex: 3,
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
    borderRadius: 10,
  },
});
