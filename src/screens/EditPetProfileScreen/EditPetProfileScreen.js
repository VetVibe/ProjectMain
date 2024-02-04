import React, { useState, useEffect } from "react";
import { View, Button, Image, StyleSheet, TouchableOpacity, ScrollView, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { StackActions } from "@react-navigation/native";
import TabsContainer from "../../components/TabsContainer/TabsContainer";
import InputContainer from "../../components/InputContainer/InputContainer";
import { mapPetDetails, mapPetDetailsToSchema } from "../../utils";
import { PET_PROFILE_TABS } from "../../constants";
import axios from "axios";

// Define a functional component for editing pet profile
const EditPetProfileScreen = ({ route, navigation }) => {
  // Define state variables for active tab, pet basic info, pet medical info, and pet image
  const [activeTab, setActiveTab] = useState("petInfo"); // Tracks active tab (petInfo or medicalHistory)
  const [petBasicInfoInput, setPetBasicInfoInput] = useState({}); // Stores pet basic info
  const [petMedicalInfoInput, setMedicalInfoInput] = useState({}); // Stores pet medical info
  const [petImage, setPetImage] = useState(
    "https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/65761296352685.5eac4787a4720.jpg"
  ); // Initializes pet image with a default URL

  // Extract petId and petOwnerId from route parameters
  const petId = route.params.petId;
  const petOwnerId = route.params.petOwnerId;

  // useEffect to fetch and initialize pet details when component mounts
  useEffect(() => {
    if (petId) {
      // Fetch pet details if petId is provided
      axios
        .get(`http://localhost:3000/pet/${petId}`)
        .then((response) => {
          const mapedPetDetails = mapPetDetails(response.data);
          setPetBasicInfoInput(mapedPetDetails.basicInfo);
          setMedicalInfoInput(mapedPetDetails.medicalInfo);
          setPetImage(mapedPetDetails.imgSrc);
        })
        .catch((error) => {
          console.error("Error fetching pet details:", error);
        });
    } else {
      // Initialize with default values if no petId is provided
      const mapedPetDetails = mapPetDetails();
      setPetBasicInfoInput(mapedPetDetails.basicInfo);
      setMedicalInfoInput(mapedPetDetails.medicalInfo);
      setPetImage(mapedPetDetails.imgSrc);
    }
  }, [petId]);

  // Function to handle tab changes
  const handleTabPress = (tab) => {
    setActiveTab(tab);
  };

  // Function to handle changes in input fields (petInfo and medicalHistory)
  function handleChange(inputIdentifier, newValue, activeTab) {
    if (activeTab == "petInfo") {
      // Update pet basic info
      setPetBasicInfoInput((prevUserInput) => {
        return {
          ...prevUserInput,
          [inputIdentifier]: newValue,
        };
      });
    } else if (activeTab == "medicalHistory") {
      // Update pet medical info
      setMedicalInfoInput((prevUserInput) => {
        return {
          ...prevUserInput,
          [inputIdentifier]: newValue,
        };
      });
    }
  }

  // Function to save changes to pet details
  const saveChanges = () => {
    // Create an object with updated pet details
    const updatedData = {
      basicInfo: { ...petBasicInfoInput },
      medicalInfo: { ...petMedicalInfoInput },
      imgSrc: petImage,
    };

    // Map pet details to a schema (not defined in the provided code)
    const petDetailsSchema = mapPetDetailsToSchema(updatedData);
  };

  if (petId) {
    // If petId is provided, update existing pet details
    axios
      .put(`http://localhost:3000/pet/updateInfo/${petId}`, { updatedData: petDetailsSchema })
      .then((response) => {
        // After successful update, navigate back to the previous screen
        navigation.goBack();
      })
      .catch((error) => {
        console.error(`Error during updating pet ${petId} details:`, error);
      });
  } else if (petOwnerId) {
    // If petOwnerId is provided, add a new pet for the pet owner
    axios
      .post(`http://localhost:3000/pet/addPet/${petOwnerId}`, petDetailsSchema)
      .then((response) => {
        // Retrieve the newly added petId from the response
        const petId = response.data.petId;

        // Navigate to the "Pet Profile Screen" with the new petId using navigation dispatch
        navigation.dispatch(StackActions.replace("Pet Profile Screen", { petId: petId }));
      })
      .catch((error) => {
        console.log("Error during adding pet", error);
      });
  }

  // Function to handle image selection from the device's library
  const handleImagePicker = async () => {
    // Request permission to access the device's photo library
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status === "granted") {
      // Launch the image picker
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        // Set the selected image URI to the profile picture state
        if (result.assets && result.assets.length > 0) {
          const selectedAsset = result.assets[0];
          setPetImage(selectedAsset.uri);
        }
      }
    } else {
      // Display an alert if permission is denied
      Alert.alert("Permission denied", "Permission to access the photo library was denied.");
    }
  };

  return (
    <View style={styles.container}>
      <TabsContainer tabs={PET_PROFILE_TABS} activeTab={activeTab} handleTabPress={handleTabPress} />

      <ScrollView style={{ flexGrow: 1 }}>
        {activeTab === "petInfo" && (
          <View>
            <TouchableOpacity onPress={handleImagePicker}>
              <Image source={{ uri: petImage }} style={styles.petImage} />
            </TouchableOpacity>
            <InputContainer
              details={petBasicInfoInput}
              onChangeText={(key, text) => handleChange(key, text, activeTab)}
            />
          </View>
        )}

        {activeTab === "medicalHistory" && (
          <InputContainer
            details={petMedicalInfoInput}
            onChangeText={(key, text) => handleChange(key, text, activeTab)}
          />
        )}
      </ScrollView>
      <Button title="Save Changes" onPress={saveChanges} />
    </View>
  );
};

// Define styles using StyleSheet
const styles = StyleSheet.create({
  // Style for the container of the pet's image
  imageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  // Style for the main container
  container: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "flex-start",
    padding: 20,
    backgroundColor: "#FFFFFF", // White background
  },
  // Style for the tabs container
  tabsContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  // Style for individual tab buttons
  tabButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: "transparent", // Initially transparent border
  },
  // Style for the active tab button (bright orange border)
  activeTab: {
    borderBottomColor: "#FFA500", // Bright orange border
  },
  // Style for the text within tab buttons
  tabButtonText: {
    fontSize: 16,
  },
  // Style for the pet's image
  petImage: {
    width: 120,
    height: 120,
    borderRadius: 60, // Makes the image round
    marginBottom: 20,
  },
  // Style for the date picker container (overlay)
  datePickerContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)", // Semi-transparent black background
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
});

// Export the EditPetProfileScreen component
export default EditPetProfileScreen;
