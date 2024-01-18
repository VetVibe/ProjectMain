import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { titleMappings, mapPetDetails } from "./support/utils";
import axios from "axios";
import DetailsContainer from "./DetailsContainer";
import tw from "twrnc";

export default function PetProfileScreen({ route, navigation }) {
  const [petDetails, setPetDetails] = useState({});

  const petId = route.params.petId;

  useEffect(() => {
    axios
      .get(`http://localhost:3000/pet/${petId}`)
      .then((response) => {
        const mapedPetDetails = mapPetDetails(response.data);
        setPetDetails(mapedPetDetails);
      })
      .catch((error) => {
        console.error("Error fetching pet details:", error);
      });
  }, [petId]);

  const navigateToEditScreen = () => {
    navigation.navigate("Pet Profile Screen Edit", { petId: petId });
  };

  return (
    <View>
      <TouchableOpacity onPress={navigateToEditScreen} style={styles.editButton}>
        <Text style={tw`text-2xl font-semibold pr-2 tracking-wide`}>Edit Profile</Text>
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
                  <DetailsContainer key={key} title={titleMappings[key]} value={value} />
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
    flexDirection: "row-reverse", // Change from 'row' to 'row-reverse'
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
