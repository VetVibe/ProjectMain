import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import DetailsContainer from "../../components/DetailsContainer/DetailsContainer";
import { mapPetDetails } from "../../utils";
import { TITELS } from "../../constants";
import axios from "axios";
import tw from "twrnc";

export default function PetProfileScreen({ route, navigation }) {
  const [petDetails, setPetDetails] = useState({});
  const petId = route.params.petId;

  useEffect(() => {
    const updatePetDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/pet/${petId}`);
        const mappedPetDetails = mapPetDetails(response.data);
        setPetDetails(mappedPetDetails);
      } catch (error) {
        console.error("Error updating pet details:", error);
      }
    };

    // Listen for changes and update petDetails
    const subscription = navigation.addListener("focus", updatePetDetails);

    // Clean up the subscription when the component unmounts
    return () => {
      if (subscription) {
        subscription();
      }
    };
  }, [petId, navigation]);

  const navigateToEditScreen = () => {
    navigation.navigate("Pet Profile Screen Edit", { petId: petId });
  };

  const deletePet = async () => {
    try {
      await axios.delete(`http://localhost:3000/pet/${petId}`);
      // Navigate back or to another screen after successful deletion
      navigation.goBack();
    } catch (error) {
      console.error("Error deleting pet:", error);
    }
  };

  return (
    <View>
      <TouchableOpacity onPress={navigateToEditScreen} style={styles.editButton}>
        <Text style={tw`text-2xl font-semibold pr-2 tracking-wide`}>Edit Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={deletePet} style={styles.deleteButton}>
      <Text style={tw`text-2xl font-semibold pr-2 tracking-wide text-red-500`}>Delete Pet</Text>
    </TouchableOpacity>

      <ScrollView style={{ flexGrow: 1 }}>
        <Image source={{ uri: petDetails.imgSrc }} style={styles.petImage} />

        <View style={tw`bg-white rounded-lg mt-3 px-4`}>
          {Object.entries(petDetails).map(([section, sectionDetails]) => {
            // Skip imgSrc section
            if (section === "imgSrc") {
              return null;
            }

            return (
              <View key={section} style={styles.sectionTitle}>
                <Text style={tw`text-2xl p-3 tracking-wide font-bold`}>{section}</Text>
                {Object.entries(sectionDetails).map(([key, value]) => (
                  <DetailsContainer key={key} title={TITELS[key]} value={value} />
                ))}
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  editButton: {
    flexDirection: "row-reverse",
    alignItems: "center",
    marginTop: 10,
  },
  deleteButton: {
    flexDirection: "row-reverse",
    alignItems: "center",
    marginTop: 10,
  },
  petImageContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  petImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  sectionTitle: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginBottom: 10,
    paddingBottom: 5,
  },
  findVetButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    justifyContent: "center",
    backgroundColor: "#FFA500",
    padding: 10,
    borderRadius: 8,
  },
});
