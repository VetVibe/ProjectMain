import React, { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import DetailsContainer from "../../components/DetailsContainer/DetailsContainer";
import { MaterialIcons } from "@expo/vector-icons";
import { mapPetDetails } from "../../utils";
import { TITELS } from "../../constants";
import { clientServer } from "../../server";
import tw from "twrnc";

export default function PetProfileScreen({ route, navigation }) {
  const [petDetails, setPetDetails] = useState({});
  const petId = route.params.petId;

  useFocusEffect(
    useCallback(() => {
      const fetchPetDetails = async () => {
        const mappedPetDetails = mapPetDetails(await clientServer.getPetDetails(petId));
        setPetDetails(mappedPetDetails);
      };

      fetchPetDetails();
    }, [petId])
  );

  const navigateToEditScreen = () => {
    navigation.navigate("Edit Pet Profile", { petId: petId });
  };

  const deletePet = async () => {
    await clientServer.deletePet(petId);
    navigation.goBack();
  };

  return (
    <View>
      <TouchableOpacity onPress={navigateToEditScreen} style={styles.editButton}>
        <MaterialIcons name="edit" size={24} color="black" />
      </TouchableOpacity>

      <TouchableOpacity onPress={deletePet} style={styles.deleteButton}>
        <MaterialIcons name="delete" size={24} color="black" />
      </TouchableOpacity>

      <Image source={{ uri: petDetails.imgSrc }} style={styles.petImage} />
      <ScrollView>
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
