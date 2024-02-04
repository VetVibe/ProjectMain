// Import necessary dependencies and components from libraries
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { COLORS, FONTS } from "../../constants";
import { MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import { TextInput } from "react-native";

// Defines a functional component named EditPetOwnerProfileScreen for editing pet owner profiles, using props passed from navigation.
export default function EditPetOwnerProfileScreen({ route, navigation }) {
  // Uses the useState hook to initialize the petOwnerDetails state variable as an empty object.
  const [petOwnerDetails, setPetOwnerDetails] = useState({});
  // Uses the useState hook to initialize the selectedImage state variable as null.
  const [selectedImage, setSelectedImage] = useState(null);

  // Extracts the petOwnerId from the route parameters passed to this component.
  const petOwnerId = route.params.petOwnerId;

  // useEffect hook to perform side effects: fetching pet owner details from the server.
  useEffect(() => {
    // Defines an asynchronous function to fetch pet owner details.
    const fetchPetOwnerDetails = async () => {
      try {
        // Sends a GET request to a specified URL to retrieve pet owner details and destructures the response to get data.
        const { data } = await axios.get(
          `http://localhost:3000/petOwner/${petOwnerId}`
        );
        // Updates the petOwnerDetails state with the fetched data.
        setPetOwnerDetails(data);
        // Updates the selectedImage state with the profile picture from the fetched data.
        setSelectedImage(data.profilePicture);
      } catch (e) {
        // Catches any errors that occur during the fetch operation and displays an alert with the error message.
        Alert.alert(e.message);
      }
    };
    // Calls the fetchPetOwnerDetails function to execute it when the component mounts or petOwnerId changes.
    fetchPetOwnerDetails();
  }, [petOwnerId]); // The dependency array for useEffect, indicating the effect runs again if petOwnerId changes.

  // Function to handle changes in input fields like name, email, or profile picture.
  const handleChange = (inputIdentifier, newValue) => {
    // Checks if the changed input is one of the specified fields before proceeding.
    if (
      inputIdentifier === "name" ||
      inputIdentifier === "email" ||
      inputIdentifier === "profilePicture"
    ) {
      // Updates the petOwnerDetails state with the new value for the specified input field.
      setPetOwnerDetails((prevUserInput) => {
        return {
          ...prevUserInput, // Spreads the previous state to retain unchanged properties.
          [inputIdentifier]: newValue, // Dynamically updates the property specified by inputIdentifier with newValue.
        };
      });
    }
  };

  // Asynchronous function to save the changes made to the pet owner's profile.
  const saveChanges = async () => {
    try {
      // Prepares the data to be sent to the server, including only the fields that need to be updated.
      const updatedData = {
        email: petOwnerDetails.email,
        name: petOwnerDetails.name,
        profilePicture: selectedImage,
      };

      // Sends a PUT request to update the pet owner's details on the server with the prepared data.
      await axios.put(
        `http://localhost:3000/petOwner/updateInfo/${petOwnerId}`,
        {
          updatedData,
        }
      );
      // Upon successful update, navigates back to the previous screen.
      navigation.goBack();
    } catch (error) {
      // Logs any errors that occur during the update operation to the console.
      console.error(
        `Error during updating pet owner ${petOwnerId} details:`,
        error
      );
    }
  };

// This function is responsible for initiating the process of picking an image from the user's device library.
const handleImagePicker = async () => {
  // Requests permission to access the media library on the device asynchronously. This is necessary because
  // accessing the user's media library requires explicit permission according to both Android and iOS guidelines.
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

  // Checks if the permission was granted by the user.
  if (status === "granted") {
    // If permission is granted, opens the device's image library to allow the user to pick an image.
    // The function is configured to allow editing, set the aspect ratio to a square (4:4), and maintain the highest quality.
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // Specifies that only images (not videos) should be picked.
      allowsEditing: true, // Allows the user to edit the image (e.g., crop) before selecting.
      aspect: [4, 4], // Sets the aspect ratio for the crop tool, making it a square.
      quality: 1, // Sets the quality of the selected image to the highest possible.
    });

    // Checks if the image selection was not canceled by the user.
    if (!result.canceled) {
      // If an image is successfully selected, updates the state variable 'selectedImage' with the URI of the chosen image.
      // This URI is used to display the image or upload it to a server.
      setSelectedImage(result.assets[0].uri);
    }
  } else {
    // If permission to access the media library is not granted by the user, displays an alert notifying them of the denial.
    // This alert is important for user experience, informing the user why the image picker did not open.
    Alert.alert(
      "Permission denied", // Title of the alert
      "Permission to access the photo library was denied." // Message explaining the alert
    );
  }
};

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView>
          <View style={styles.imageContainer}>
            <TouchableOpacity onPress={handleImagePicker}>
              {selectedImage !== null && selectedImage !== "" ? (
                <Image
                  source={{ uri: selectedImage }}
                  style={styles.profileImage}
                />
              ) : (
                <View style={styles.profileImagePlaceholder}>
                  <Text style={styles.placeholderText}>Select an Image</Text>
                </View>
              )}
              <View style={styles.cameraIcon}>
                <MaterialIcons
                  name="photo-camera"
                  size={32}
                  color={COLORS.primary}
                />
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email:</Text>
            <TextInput
              style={styles.textInput}
              value={petOwnerDetails.email}
              onChangeText={(text) => handleChange("email", text)}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Name:</Text>
            <TextInput
              style={styles.textInput}
              value={petOwnerDetails.name}
              onChangeText={(text) => handleChange("name", text)}
            />
          </View>
          <TouchableOpacity style={styles.saveButton} onPress={saveChanges}>
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// Define styles using StyleSheet for a React Native application.
const styles = StyleSheet.create({
  // Style for a container that ensures content is displayed safely within the device's screen, avoiding notches, edges, etc.
  safeArea: {
    flex: 1, // Makes the container flexible to fill the available space.
    backgroundColor: COLORS.white, // Sets the background color of the container to white.
    paddingHorizontal: 18, // Applies horizontal padding to both left and right sides.
  },
  // Style for the container that will hold an image, typically a profile picture.
  imageContainer: {
    alignItems: "center", // Centers the child elements (like images) horizontally.
    marginVertical: 10, // Applies vertical margin to both top and bottom sides.
  },
  // Style for the profile image itself.
  profileImage: {
    height: 170, // Sets the height of the image.
    width: 170, // Sets the width of the image, making it a square.
    borderRadius: 5, // Rounds the corners of the image slightly.
    borderWidth: 3, // Sets the thickness of the border around the image.
    borderColor: COLORS.primary, // Uses a primary color for the border, defined elsewhere in the COLORS object.
  },
  // Style for the camera icon, usually overlaid on the profile image for editing.
  cameraIcon: {
    position: "absolute", // Positions the camera icon independently of its siblings, based on the nearest positioned ancestor.
    bottom: 0, // Aligns the icon to the bottom of its parent container.
    right: 10, // Positions the icon 10 units from the right edge of its parent container.
    zIndex: 9999, // Ensures the icon sits on top of other elements by giving it a high stack order.
  },
  // Style for the container that wraps input fields.
  inputContainer: {
    flexDirection: "column", // Arranges its child elements (inputs) in a vertical column.
    marginBottom: 6, // Adds a margin below the container.
  },
  label: {
    ...FONTS.body4, // Apply a specific font style (body4)
    color: "#CCCCCC", // Set text color to a light gray
    marginBottom: 4, // Add a small margin below the label
  },
  // Style for input values
  value: {
    ...FONTS.body3, // Apply a specific font style (body3)
    marginBottom: 8, // Add a larger margin below the value
  },
  // Style for text input fields
  textInput: {
    height: 44, // Set the height of input fields to 44 pixels
    width: "100%", // Make input fields span the entire width
    borderColor: COLORS.secondaryGray, // Set the border color to a secondary gray
    borderWidth: 1, // Set the border thickness to 1 pixel
    borderRadius: 4, // Round the corners of input fields
    marginBottom: 6, // Add a small margin below input fields
    justifyContent: "center", // Center content vertically within input fields
    paddingLeft: 8, // Add left padding to input fields
  },
  // Style for the save button
  saveButton: {
    backgroundColor: COLORS.primary, // Set the background color to a primary color
    height: 44, // Set the height of the button to 44 pixels
    borderRadius: 10, // Round the corners of the button
    alignItems: "center", // Center items horizontally within the button
    justifyContent: "center", // Center items vertically within the button
    marginBottom: 20, // Add a margin below the button
  },
  // Style for the text inside the save button
  saveButtonText: {
    ...FONTS.body3, // Apply a specific font style (body3)
    color: COLORS.white, // Set text color to white
  },
  // Style for the main container view
  container: {
    flex: 1, // Make the container use all available space
  },
});
