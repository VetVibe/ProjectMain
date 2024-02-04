// Importing necessary React components and hooks, and various native components and utilities from react-native
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
// Importing SafeAreaView which handles the view considering the safe area on different devices
import { SafeAreaView } from "react-native-safe-area-context";
// Importing ImagePicker to allow users to pick images from their library or camera
import * as ImagePicker from "expo-image-picker";
// Importing COLORS and FONTS for consistent styling across the app
import { COLORS, FONTS } from "../../constants";
// Importing MaterialIcons for using the icons in the UI
import { MaterialIcons } from "@expo/vector-icons";
// Importing a custom InputContainer component for input fields
import InputContainer from "../../components/InputContainer/InputContainer";
// Importing utility functions for mapping vet details to a specific schema
import { mapVetDetailsToSchema, mapVetDetails } from "../../utils";
// Importing axios for making HTTP requests
import axios from "axios";
// Importing Picker from react-native-picker for dropdowns
import { Picker } from "@react-native-picker/picker";
// Importing TextInput for user text input
import { TextInput } from "react-native";

// Defining the EditVetProfileScreen functional component with route and navigation props passed in
export default function EditVetProfileScreen({ route, navigation }) {
  // Setting up state variables for vetDetails, selectedImage, cityList, selectedCity, specializationList, selectedSpecialization, visibility of city and specialization pickers
  const [vetDetails, setVetDetails] = useState({});
  const [selectedImage, setSelectedImage] = useState();
  const [cityList, setCityList] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [specializationList, setSpecializationList] = useState([]);
  const [selectedSpecialization, setSelectedSpecialization] = useState("");
  const [isCityPickerVisible, setCityPickerVisible] = useState(false);
  const [isSpecializationPickerVisible, setSpecializationPickerVisible] = useState(false);

  // Extracting the vetId from the route parameters to use for fetching or updating vet details
  const vetId = route.params.vetId;

  // useEffect hook to fetch the list of cities from a MongoDB database when the component mounts
  useEffect(() => {
    axios
      .get("http://localhost:3000/cities") // Making a GET request to fetch cities
      .then((response) => {
        // Mapping through the response data to extract just the city names
        const cities = response.data.map((cityObject) => cityObject.city);
        console.log("Cities response:", cities); // Logging the cities response for debugging
        setCityList(cities); // Updating the cityList state with the fetched cities
      })
      .catch((error) => {
        // Logging any errors that occur during the fetch operation
        console.error("Error fetching cities:", error);
      });
  }, []); // The empty dependency array means this effect runs once after the initial render

  // useEffect hook to fetch the list of specializations from a MongoDB database when the component mounts
  useEffect(() => {
    axios
      .get("http://localhost:3000/specialization") // Making a GET request to fetch specializations
      .then((response) => {
        // Mapping through the response data to extract just the specialization names
        const specializations = response.data.map(
          (specObject) => specObject.specialisation
        );
        console.log("specializations response:", specializations); // Logging the specializations response for debugging
        setSpecializationList(specializations); // Updating the specializationList state with the fetched specializations
      })
      .catch((error) => {
        // Logging any errors that occur during the fetch operation
        console.error("Error fetching specializations:", error);
      });
  }, []); // The empty dependency array means this effect runs once after the initial render

  // Define a function to handle changing the active tab based on the tab selected by the user.
  const handleTabPress = (tab) => {
    // Set the active tab state to the selected tab.
    setActiveTab(tab);
  };

  // Define a function to toggle the visibility of the city picker dropdown.
  const toggleCityPicker = () => {
    // Update the visibility state of the city picker to its opposite value (i.e., if it is visible, hide it; if hidden, show it).
    setCityPickerVisible(!isCityPickerVisible);
  };

  // Define a function to toggle the visibility of the specialization picker dropdown.
  const toggleSpecializationPicker = () => {
    // Update the visibility state of the specialization picker to its opposite value.
    setSpecializationPickerVisible(!isSpecializationPickerVisible);
  };

  // Define a function to handle the selection of a city from the city picker.
  const handleCitySelect = (itemValue) => {
    // Set the selected city state to the value chosen by the user.
    setSelectedCity(itemValue);
    // After selecting a city, toggle the visibility of the city picker to hide it.
    toggleCityPicker();
  };

  // Define a function to handle the selection of a specialization from the specialization picker.
  const handleSpecializationSelect = (itemValue) => {
    // Set the selected specialization state to the value chosen by the user.
    setSelectedSpecialization(itemValue);
    // After selecting a specialization, toggle the visibility of the specialization picker to hide it.
    toggleSpecializationPicker();
  };

  // Use the useEffect hook to perform side effects in the component, in this case, fetching veterinarian details.
  useEffect(() => {
    // Define an asynchronous function to fetch veterinarian details from the server.
    const fetchVetDetails = async () => {
      try {
        // Use axios to make a GET request to fetch vet details by vetId and destructure the response to get the data.
        const { data } = await axios.get(
          `http://localhost:3000/veterinarian/${vetId}`
        );
        // Map the fetched vet details data to a schema suitable for the component's state.
        const mappedVetDetails = mapVetDetails(data);
        // Set the vetDetails state with the mapped data.
        setVetDetails(mappedVetDetails);
        // Also, set the selectedImage state to the profile picture from the mapped vet details.
        setSelectedImage(mappedVetDetails.profilePicture);
      } catch (e) {
        // If an error occurs during the fetch operation, show an alert with the error message.
        Alert.alert(e.message);
      }
    };
    // Call the fetchVetDetails function defined above.
    fetchVetDetails();
  }, [vetId]); // The effect depends on vetId, so it runs whenever vetId changes.

  // Define a function to handle changes to any input field in the form.
  const handleChange = (inputIdentifier, newValue) => {
    // Update the vetDetails state with the new value for the specified input field.
    setVetDetails((prevUserInput) => {
      return {
        ...prevUserInput, // Spread the previous vetDetails state.
        [inputIdentifier]: newValue, // Update the specific field with the new value.
      };
    });
  };

  // Define a function to save changes made to the veterinarian's profile.
  const saveChanges = () => {
    // Prepare the updated data by combining existing vetDetails with the selected profile picture.
    const updatedData = {
      ...vetDetails,
      profilePicture: selectedImage,
    };
    // Map the updated data to a schema suitable for the backend.
    const vetDetailsSchema = mapVetDetailsToSchema(updatedData);

    // Use axios to make a PUT request to update the veterinarian's details in the backend.
    axios
      .put(`http://localhost:3000/veterinarian/updateInfo/${vetId}`, {
        updatedData: vetDetailsSchema,
      })
      .then((response) => {
        // If the update is successful, navigate back to the previous screen.
        navigation.goBack();
      })
      .catch((error) => {
        // If an error occurs during the update, log the error message.
        console.error(`Error during updating vet ${vetId} details:`, error);
      });
  };

// Defines an asynchronous function to handle the image picker process
const handleImagePicker = async () => {
  // Requests permission to access the device's photo library
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

  // Checks if permission was granted
  if (status === "granted") {
    // Launches the image picker allowing the user to select an image, with customization options
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // Specifies that only images can be picked
      allowsEditing: true, // Allows the user to edit the image
      aspect: [4, 4], // Sets the aspect ratio for the image cropping tool
      quality: 1, // Sets the quality of the selected image to the highest
    });

    // Checks if the image picker was not canceled by the user
    if (!result.canceled) {
      // Updates the state with the URI of the selected image
      setSelectedImage(result.assets[0].uri);
    }
  } else {
    // Displays an alert if permission to access the photo library was denied
    Alert.alert(
      "Permission denied",
      "Permission to access the photo library was denied."
    );
  }
};

// Returns the JSX to render the component
return (
  // A container view that automatically adjusts its padding to avoid the device's safe area (like the notch or home indicator)
  // A view that adjusts its behavior and padding based on the keyboard's presence and the platform
  <SafeAreaView style={styles.safeArea}>
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"} // Adjusts padding on iOS and height on Android when the keyboard is visible
      style={styles.container} // Container style for the keyboard avoiding view
    >
      <ScrollView>
        <View style={styles.imageContainer}>
          <TouchableOpacity onPress={handleImagePicker}>
            <Image
              source={{ uri: selectedImage }} // Sets the image source to the selected image URI
              style={styles.profileImage} // Applies styling to the profile image
            />
            <View style={styles.cameraIcon}>
              <MaterialIcons
                name="photo-camera" // Specifies the icon to use
                size={32} // Sets the size of the icon
                color={COLORS.primary} // Sets the color of the icon
              />
            </View>
          </TouchableOpacity>
        </View>
        <InputContainer
          details={vetDetails} // Passes the vetDetails object as a prop
          onChangeText={(key, text) => handleChange(key, text)} // Handles text changes for each input
        />
        <TouchableOpacity style={styles.saveButton} onPress={saveChanges}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  </SafeAreaView>
);
}

// Initialize a stylesheet for the component using React Native's StyleSheet API
const styles = StyleSheet.create({
  // Define styles for the safe area view
  safeArea: {
    flex: 1, // Makes the SafeAreaView flexible and occupies the whole screen
    backgroundColor: COLORS.white, // Set the background color to white from the COLORS object
    paddingHorizontal: 18, // Apply horizontal padding to both sides
  },
  // Style for the container that wraps the profile image
  imageContainer: {
    alignItems: "center", // Center-align the child elements horizontally
    marginVertical: 10, // Apply vertical margin to the top and bottom
  },
  // Style for the profile image
  profileImage: {
    height: 170, // Set the height of the image
    width: 170, // Set the width of the image
    borderRadius: 5, // Round the corners of the image
    borderWidth: 3, // Set the width of the border surrounding the image
    borderColor: COLORS.primary, // Use the primary color from the COLORS object for the border
  },
  // Style for the camera icon that appears on the profile image
  cameraIcon: {
    position: "absolute", // Position the icon absolutely within its parent container
    bottom: 0, // Position the icon at the bottom of its parent container
    right: 10, // Position the icon 10 units from the right
    zIndex: 9999, // Ensure the icon is above all other elements
  },
  // Style for the container that wraps input fields
  inputContainer: {
    flexDirection: "column", // Arrange children in a column
    marginBottom: 6, // Apply a bottom margin
  },
  // Style for text input fields
  textInput: {
    height: 44, // Set the height of the input
    width: "100%", // Make the input stretch to fill its container's width
    borderColor: COLORS.secondaryGray, // Set the border color
    borderWidth: 1, // Set the border width
    borderRadius: 4, // Round the corners of the input field
    marginVertical: 6, // Apply vertical margin to the top and bottom
    justifyContent: "center", // Vertically center the text inside the input
    paddingLeft: 8, // Apply left padding inside the input
  },
  // Style for the save button
  saveButton: {
    backgroundColor: COLORS.primary, // Set the background color using the primary color from the COLORS object
    height: 44, // Set the height of the button
    borderRadius: 10, // Round the corners of the button
    alignItems: "center", // Center-align the child elements horizontally
    justifyContent: "center", // Center-align the child elements vertically
    marginBottom: 20, // Apply a bottom margin
  },
  // Style for the text inside the save button
  saveButtonText: {
    ...FONTS.body3, // Apply the font style from the FONTS object
    color: COLORS.white, // Set the text color to white
  },
  // Style for the main container
  container: {
    flex: 1, // Make the container flexible and occupy the whole screen
  },
});
