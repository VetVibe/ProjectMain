import React, { useState } from "react";
import { View, Text, Button, Image, StyleSheet, TouchableOpacity } from "react-native";
import InputDetailsContainer from "./InputDetailsContainer";

const EditPetProfileScreen = ({ route, navigation }) => {
  let petBasicInfo = route.params.petDetails.basicInfo;
  let petMedicalInfo = route.params.petDetails.medicalInfo;

  const [ petBasicInfoInput, setPetBasicInfoInput ] = useState(petBasicInfo);
  const [ petMedicalInfoInput, setMedicalInfoInput ] = useState(petMedicalInfo);
  const [activeTab, setActiveTab] = useState("petInfo"); // petInfo or medicalHistory
  const [petImage, setPetImage] = useState(route.params.petDetails.imgSrc || "https://placekitten.com/200/200"); // Default pet image
  const [medicalHistoryImage, setMedicalHistoryImage] = useState("https://example.com/medical_history_image.png"); // Default medical history image

  const handleTabPress = (tab) => {
    setActiveTab(tab);
  };

  function handleChange(inputIdentifier, newValue, activeTab) {
    if(activeTab == "petInfo") {
      setPetBasicInfoInput((prevUserInput) => {
        return {
          ...prevUserInput,
          [inputIdentifier]: {
            ...prevUserInput[inputIdentifier],
            value: newValue,
      }}});
    }
    else if(activeTab == "medicalHistory") {
      setMedicalInfoInput((prevUserInput) => {
        return {
          ...prevUserInput,
          [inputIdentifier]: {
            ...prevUserInput[inputIdentifier],
            value: newValue,
      }}});
    }
  }

  const TabButton = ({ tab, title }) => (
    <TouchableOpacity
      style={[styles.tabButton, activeTab === tab && styles.activeTab]}
      onPress={() => handleTabPress(tab)}
    >
      <Text style={styles.tabButtonText}>{title}</Text>
    </TouchableOpacity>
  );

  const saveChanges = () => {
    const updatedData = {
      basicInfo: {...petBasicInfoInput},
      medicalInfo: {...petMedicalInfoInput}
    }
    navigation.navigate("Pet Profile Screen", updatedData);
  };

  const handleImagePicker = () => {
    // Logic to open image picker and update petImage state
    // You need to implement the image picker functionality here
    // Example:
    // openImagePicker().then((selectedImage) => setPetImage(selectedImage));
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabsContainer}>
        <TabButton tab="petInfo" title="Pet Info" />
        <TabButton tab="medicalHistory" title="Medical History" />
      </View>
      {activeTab === "petInfo" && (
        <View>
          <TouchableOpacity onPress={handleImagePicker}>
            <Image source={{ uri: petImage }} style={styles.petImage} />
          </TouchableOpacity>

          <View>
            <InputDetailsContainer title={"Pet's Name:"} placeholder={"Pet's Name"} value={petBasicInfoInput.petName.value} onChangeText={(text) => handleChange('petName', text, activeTab)} />
            <InputDetailsContainer title={"Animal Type:"} placeholder={"Animal Type"} value={petBasicInfoInput.animalType.value} onChangeText={(text) => handleChange('animalType', text, activeTab)}/>
            <InputDetailsContainer title={"Age:"} placeholder={"age"} value={petBasicInfoInput.age.value} onChangeText={(text) => handleChange('age', text, activeTab)} />
            <InputDetailsContainer title={"Gender:"} placeholder={"Gender"} value={petBasicInfoInput.gender.value} onChangeText={(text) => handleChange('gender', text, activeTab)} />
          </View>
        </View>
      )}

      {activeTab === "medicalHistory" && (
        <View>
          <TouchableOpacity onPress={handleImagePicker}>
            <Image source={{ uri: petImage }} style={styles.petImage} />
          </TouchableOpacity>

          <View>
          <InputDetailsContainer title={"Last Vaccination Date"} placeholder={"Last Vaccination Date"} value={petMedicalInfoInput.lastVaccinationDate.value} onChangeText={(text) => handleChange('lastVaccinationDate', text, activeTab)} />
          <InputDetailsContainer title={"Last Vet Visit:"} placeholder={"Last Vet Visit"} value={petMedicalInfoInput.lastVetVisit.value} onChangeText={(text) => handleChange('lastVetVisit', text, activeTab)} />
          <InputDetailsContainer title={"Medications:"} placeholder={"Medications"} value={petMedicalInfoInput.medications.value} onChangeText={(text) => handleChange('medications', text, activeTab)} />
          <InputDetailsContainer title={"Allergies:"} placeholder={"Allergies"} value={petMedicalInfoInput.allergies.value} onChangeText={(text) => handleChange('allergies', text, activeTab)} />
          </View>
        </View>
      )}

      <Button title="Save Changes" onPress={saveChanges} />
    </View>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  container: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "flex-start",
    padding: 20,
    backgroundColor: "#FFFFFF", // White
  },
  tabsContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomColor: "#FFA500", // Bright orange
  },
  tabButtonText: {
    fontSize: 16,
  },
  petImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
  },
});

export default EditPetProfileScreen;
