import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import InputDetailsContainer from "./InputDetailsContainer";

const EditPetProfileScreen = ({ route, navigation }) => {
  let petBasicInfo = route.params.petDetails.basicInfo;
  let petMedicalInfo = route.params.petDetails.medicalInfo;

  const [activeTab, setActiveTab] = useState("petInfo"); // petInfo or medicalHistory
  const [petName, setPetName] = useState(petBasicInfo.petName.value || "");
  const [animalType, setAnimalType] = useState(petBasicInfo.animalType.value || "");
  const [age, setAge] = useState(petBasicInfo.age.value || "");
  const [gender, setGender] = useState(petBasicInfo.gender.value || "");
  
  const [lastVaccinationDate, setLastVaccinationDate] = useState(petMedicalInfo.lastVaccinationDate.value || "");
  const [lastVetVisit, setLastVetVisit] = useState(petMedicalInfo.lastVetVisit.value || "");
  const [medications, setMedications] = useState(petMedicalInfo.medications.value || "");
  const [allergies, setAllergies] = useState(petMedicalInfo.allergies.value || "");
  const [petImage, setPetImage] = useState("https://placekitten.com/200/200"); // Default pet image
  const [medicalHistoryImage, setMedicalHistoryImage] = useState("https://example.com/medical_history_image.png"); // Default medical history image

  const handleTabPress = (tab) => {
    setActiveTab(tab);
  };

  const TabButton = ({ tab, title }) => (
    <TouchableOpacity
      style={[styles.tabButton, activeTab === tab && styles.activeTab]}
      onPress={() => handleTabPress(tab)}
    >
      <Text style={styles.tabButtonText}>{title}</Text>
    </TouchableOpacity>
  );

  const saveChanges = () => {
    petBasicInfo.petName.value = petName;
    petBasicInfo.animalType.value = animalType;
    petBasicInfo.age.value = age;
    petBasicInfo.gender.value = gender;

    petMedicalInfo.lastVaccinationDate.value = lastVaccinationDate;
    petMedicalInfo.lastVetVisit.value = lastVetVisit;
    petMedicalInfo.medications.value = medications;
    petMedicalInfo.allergies.value = allergies;

    const updatedData = {
      basicInfo: {...petBasicInfo},
      medicalInfo: {...petMedicalInfo}
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
            <InputDetailsContainer title={"Pet's Name:"} placeholder={"Pet's Name"} value={petName} onChangeText={(text) => setPetName(text)} />
            <InputDetailsContainer title={"Animal Type:"} placeholder={"Animal Type"} value={animalType} onChangeText={(text) => setAnimalType(text)} />
            <InputDetailsContainer title={"Age:"} placeholder={"age"} value={age} onChangeText={(text) => setAge(text)} />
            <InputDetailsContainer title={"Gender:"} placeholder={"Gender"} value={gender} onChangeText={(text) => setGender(text)} />
          </View>
        </View>
      )}

      {activeTab === "medicalHistory" && (
        <View>
          <TouchableOpacity onPress={handleImagePicker}>
            <Image source={{ uri: petImage }} style={styles.petImage} />
          </TouchableOpacity>

          <View>
          <InputDetailsContainer title={"Last Vaccination Date"} placeholder={"Last Vaccination Date"} value={lastVaccinationDate} onChangeText={(text) => setLastVaccinationDate(text)} />
          <InputDetailsContainer title={"Last Vet Visit:"} placeholder={"Last Vet Visit"} value={lastVetVisit} onChangeText={(text) => setLastVetVisit(text)} />
          <InputDetailsContainer title={"Medications:"} placeholder={"Medications"} value={medications} onChangeText={(text) => setMedications(text)} />
          <InputDetailsContainer title={"Allergies:"} placeholder={"Allergies"} value={allergies} onChangeText={(text) => setAllergies(text)} />
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
