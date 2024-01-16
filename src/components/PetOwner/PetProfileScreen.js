import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import DetailsContainer from "./DetailsContainer";
import tw from "twrnc";

const initialPetDetails = {
  basicInfo: {
    petName: {
      title: 'Pet Name',
      value: '---'
    },
    animalType: {
      title: 'Animal Type', 
      value: '---'
    },
    age: {
      title: 'Age', 
      value: '---'
    },
    gender: {
      title: 'Gender', 
      value: '---'
    }
  },
  medicalInfo: {
    lastVaccinationDate: { 
      title: 'Last Vaccination Date', 
      value: '---' 
    },
    lastVetVisit: { 
      title: 'Last Vet Visit', 
      value: '---' 
    },
    medications: { 
      title: 'Medications', 
      value: '---' 
    },
    allergies: { 
      title: 'Allergies', 
      value: '---'
    }
  }
};

export default function PetProfileScreen({ route, navigation }){
  const [petDetails, setPetDetails] = useState({...initialPetDetails});

  useEffect(() => {
    // Check if there are updated details from EditPetProfileScreen
    if (route.params) {
      setPetDetails(route.params);
    }
  }, [route.params]);

  const navigateToEditScreen = () => {
    navigation.navigate("Pet Profile Screen Edit", {petDetails: petDetails});
  };

  const navigateToFindVetScreen = () => {
    navigation.navigate("Pet Owner Home Screen");
  };

  return (
    <ScrollView style={{ flexGrow: 1 }}>
      <TouchableOpacity onPress={navigateToEditScreen} style={styles.editButton}>
        <Text style={tw`text-2xl font-semibold pr-2 tracking-wide`}>Edit Profile</Text>
      </TouchableOpacity>

      <View style={styles.petImageContainer}>
        <Image style={styles.petImage} source={{ uri: "https://placekitten.com/200/200" }} // Replace with the actual image source
        />
      </View>

      <View style={tw`bg-white rounded-lg mt-3 px-4`}>  
        <View style={styles.sectionTitle}>
          <Text style={tw`text-2xl p-3 tracking-wide font-bold`}>Basic Info</Text>
        </View>
        {Object.values(petDetails.basicInfo).map((item, index) => <DetailsContainer key={index} title={item.title} value={item.value} />)}

        <View style={styles.sectionTitle}>
          <Text style={tw`text-2xl p-3 tracking-wide font-bold`}>Medical History</Text>
        </View>
        {Object.values(petDetails.medicalInfo).map((item, index) => <DetailsContainer key={index} title={item.title} value={item.value} />)}

        {/* Find Vet Button */}
        <TouchableOpacity onPress={navigateToFindVetScreen} style={styles.findVetButton}>
          <Text style={tw`text-2xl font-semibold pr-2 tracking-wide`}>Find a Vet Nearby</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

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
