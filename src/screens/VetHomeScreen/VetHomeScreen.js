import React, { useState, useCallback } from "react";
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
import { useFocusEffect } from "@react-navigation/native";
import { COLORS, FONTS, SIZES } from "../../constants";
import { StatusBar } from "expo-status-bar";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { mapVetDetails } from "../../utils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Rating from "../../components/Rating/Rating";
import { clientServer } from "../../server";
import LoadingIndicator from "../../components/LoadingIndicator";

export default function VetHomeScreen({ route, navigation }) {
  const [vetId, setVetId] = useState(null);
  const [vetDetails, setVetDetails] = useState({});
  const [loading, setLoading] = useState(true);

  const userType = route.params?.userType || "vet";
  const petOwnerId = route.params?.petOwnerId || null;

  // Use useFocusEffect to fetch vet details when the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      const fetchVetDetails = async () => {
        const id = route.params?.vetId || (await AsyncStorage.getItem("vetId"));
        setVetId(id);

        try {
          const vetDetails = await clientServer.getVetInfo(id);
          const mapedVetDetails = mapVetDetails(vetDetails);
          setVetDetails(mapedVetDetails);
          setLoading(false);
        } catch (error) {
          console.log(error);
        }
      };

      fetchVetDetails();
    }, [vetId])
  );

  if (loading) {
    return <LoadingIndicator />;
  }

  const ShowTips = () => {
    navigation.navigate("Tips", { vetId: vetId, userType: userType });
  };

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <StatusBar backgroundColor={COLORS.gray} />
      <ScrollView>
        <View style={{ alignItems: "center" }}>
          {userType === "petOwner" ? (
            <>
              {/* <TouchableOpacity style={styles.tipsButton} onPress={ShowTips}>
                <MaterialIcons
                  name="my-library-books"
                  size={24}
                  color={COLORS.white}
                />
              </TouchableOpacity> */}
              <TouchableOpacity
                style={styles.makeAppointmentButton}
                onPress={() =>
                  navigation.navigate("Make Appointment", {
                    petOwnerId: petOwnerId,
                    vetId: vetId,
                    userType: userType,
                  })
                }
              />
            </>
          ) : (
            <TouchableOpacity
              onPress={() => navigation.navigate("Edit Vet Profile Screen")}
            >
              <MaterialIcons name="edit" size={24} color="black" />
            </TouchableOpacity>
          )}
          <Image
            source={{ uri: vetDetails.profilePicture }}
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
                {+vetDetails.clientsCount > 0
                  ? (+vetDetails.rate / +vetDetails.clientsCount).toFixed(1)
                  : 0}
              </Text>
              <Text style={{ ...FONTS.body4, color: "black" }}>Rating</Text>
            </View>
          </View>

          {vetDetails.about !== "" ? (
            <View style={styles.aboutContainer}>
              <Text style={styles.aboutTitle}>About</Text>
              <Text style={styles.description}>{vetDetails.about}</Text>
            </View>
          ) : null}

          {userType === "petOwner" ? (
            <Rating
              vetDetails={vetDetails}
              onNewRating={({ newRating, newRatingCount }) =>
                setVetDetails({
                  ...vetDetails,
                  rating: newRating,
                  ratingCount: newRatingCount,
                })
              }
            />
          ) : null}
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
  makeAppointmentButton: {
    position: "absolute",
    right: 20,
    top: 100,
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
    borderWidth: 3,
    marginTop: 50,
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
