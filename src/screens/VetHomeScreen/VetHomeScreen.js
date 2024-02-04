// Import necessary React and React Native components, hooks, and other utilities
import React, { useState, useEffect } from "react"; // Import React, useState, useEffect hooks from React
import { // Import various UI components from react-native library
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Switch,
  StyleSheet,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native"; // Hook to handle the focus state of screens
import { COLORS, FONTS, SIZES } from "../../constants"; // Importing predefined styles and constants
import { StatusBar } from "expo-status-bar"; // Component to control the app's status bar
import { MaterialIcons } from "@expo/vector-icons"; // Importing icons from MaterialIcons
import { mapVetDetails } from "../../utils"; // Utility function to map vet details
import axios from "axios"; // HTTP client for making requests to APIs
import { style } from "twrnc"; // Tailwind CSS utility for React Native
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage for local storage management
import Rating from "../../components/Rating/Rating"; // Custom Rating component

// Define the VetHomeScreen functional component
export default function VetHomeScreen({ route, navigation }) {
  const [vetDetails, setVetDetails] = useState({}); // State hook for storing vet details

  const vetId = route.params.userId; // Extract vetId from navigation route parameters
  const userType = route.params.userType; // Extract userType from navigation route parameters

  // Function to fetch vet details from the server
  const fetchVetDetails = () => {
    axios // Use axios to make a GET request
      .get(`http://localhost:3000/veterinarian/${vetId}`) // URL to fetch vet details
      .then((response) => { // Handle the response
        const mapedVetDetails = mapVetDetails(response.data); // Process data with mapVetDetails utility
        setVetDetails(mapedVetDetails); // Update state with fetched vet details
      })
      .catch((error) => { // Handle errors
        console.error("Error fetching vet details:", error); // Log error to console
      });
  };

  // useEffect hook to fetch vet details on component mount and when vetId changes
  useEffect(() => {
    fetchVetDetails();
  }, [vetId]);

  // useFocusEffect hook to fetch vet details when the screen comes into focus
  useFocusEffect(
    React.useCallback(() => { // useCallback to memoize the function for performance
      fetchVetDetails();
    }, []) // Dependency array is empty, so effect runs only on mount and unmount
  );

  // Function to toggle vet's availability status
  const toggleSwitch = () => {
    setVetDetails((prevUserInput) => ({ // Update local state to reflect new availability
      ...prevUserInput,
      isAvailable: !vetDetails.isAvailable,
    }));

    axios // Make a PUT request to update availability on the server
      .put(`http://localhost:3000/veterinarian/updateInfo/${vetId}`, {
        updatedData: { isAvailable: !vetDetails.isAvailable },
      })
      .then((response) => { // Handle success response
        console.log("Availability updated successfully");
      })
      .catch((error) => { // Handle error response
        console.error("Error updating availability:", error);
      });
  };

  // Function to navigate to the Edit Vet Profile screen
  const EditVetProfileClick = () => {
    navigation.navigate("Edit Vet Profile Screen", { vetId: vetId });
  };

  // Function to handle logout
  const LogoutClick = () => {
    clearAuthToken(); // Call function to clear the auth token
  };

  // Async function to clear the auth token from AsyncStorage
  const clearAuthToken = async () => {
    await AsyncStorage.removeItem("authToken"); // Remove the token
    console.log("Cleared auth token");
    navigation.replace("Home"); // Navigate to Home screen
  };

  // Function to navigate to the Tips Screen
  const ShowTips = () => {
    navigation.navigate("Tips Screen", { vetId: vetId, userType: userType });
  };

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <StatusBar backgroundColor={COLORS.gray} />
      <ScrollView style={{ flex: 1 }}>
        <View style={{ alignItems: "center" }}>
          {userType === "vet" ? (
            <>
              <TouchableOpacity
                style={styles.editProfileButton}
                onPress={EditVetProfileClick}
              >
                <MaterialIcons name="edit" size={24} color={COLORS.white} />
              </TouchableOpacity>

              <TouchableOpacity style={styles.tipsButton} onPress={ShowTips}>
                <MaterialIcons
                  name="my-library-books"
                  size={24}
                  color={COLORS.white}
                />
              </TouchableOpacity>
            </>
          ) : (
            <>
              <View style={styles.nonVetAvailabilityContainer}>
                <MaterialIcons
                  name={
                    vetDetails.isAvailable ? "fiber-manual-record" : "cancel"
                  }
                  size={12}
                  color={vetDetails.isAvailable ? "green" : "red"}
                />
                <Text
                  style={{ ...FONTS.h3, color: COLORS.black, marginRight: 10 }}
                >
                  {vetDetails.isAvailable ? " Available" : " Unavailable"}
                </Text>
              </View>
            </>
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
                {+vetDetails.rateCount > 0
                  ? (+vetDetails.rate / +vetDetails.rateCount).toFixed(1)
                  : 0}
              </Text>
              <Text style={{ ...FONTS.body4, color: "black" }}>Rating</Text>
            </View>
          </View>

          {vetDetails.about !== "" && (
            <View style={styles.aboutContainer}>
              <Text style={styles.aboutTitle}>About</Text>
              <Text style={styles.description}>{vetDetails.about}</Text>
            </View>
          )}

          {userType === "vet" ? (
            <>
              <TouchableOpacity
                style={styles.logoutButton}
                onPress={LogoutClick}
              >
                <MaterialIcons name="logout" size={24} color={COLORS.white} />
              </TouchableOpacity>
              <View style={styles.availabilityContainer}>
                <Text
                  style={{ ...FONTS.h4, color: COLORS.black, marginRight: 10 }}
                >
                  {vetDetails.isAvailable ? "Available" : "Unavailable"}
                </Text>
                <Switch
                  trackColor={{ false: "#767577", true: "#FFA500" }}
                  thumbColor={vetDetails.isAvailable ? "#FFFFFF" : "#FFFFFF"}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={toggleSwitch}
                  value={vetDetails.isAvailable}
                />
              </View>
            </>
          ) : (
            <>
              <View>
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
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Define a collection of styles to be used throughout the application.
const styles = StyleSheet.create({
  // Define styles for a container that should use all available space and have a white background.
  safeAreaContainer: { flex: 1, backgroundColor: COLORS.white },
  
  // Styles for a container that aligns its children (elements inside it) in a row, 
  // applies vertical margins, and centers the children vertically.
  detailsContainer: {
    flexDirection: "row",
    marginVertical: 6,
    alignItems: "center",
  },
  
  // Define styles for a container that should take the full width of its parent and
  // apply horizontal padding.
  aboutContainer: { width: "100%", paddingHorizontal: SIZES.padding },
  
  // Styles for a button that takes 90% of its parent's width, has a fixed height,
  // is centered both vertically and horizontally, has a specific background color,
  // rounded corners, and a bottom margin.
  button: {
    width: "90%",
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    marginBottom: 20,
  },
  
  // Styles for a container that is positioned absolutely within its parent at a 
  // specific location, aligns its children in a row, and centers them vertically.
  nonVetAvailabilityContainer: {
    position: "absolute",
    left: 20, // Position from the left edge of its parent.
    top: 20, // Position from the top edge of its parent.
    flexDirection: "row",
    alignItems: "center",
  },
  
  // Define styles for text elements to apply a specific font, color, text alignment,
  // and top margin.
  availabilityContainer: {
    ...FONTS.h2, // Spread operator to include styles defined elsewhere (FONTS.h2).
    color: COLORS.black,
    textAlign: "left",
    marginTop: 15,
  },
  
  // Styles for a container that organizes its children in a column, centers them
  // vertically, applies horizontal margins, background color, rounded corners, and padding.
  infoBox: {
    flexDirection: "column",
    alignItems: "center",
    marginHorizontal: SIZES.padding,
    backgroundColor: COLORS.gray,
    borderRadius: 10,
    padding: 10,
  },
  
  // Define styles for a button that is absolutely positioned, specifying its size,
  // alignment, background color, rounded corners, and layering order (zIndex).
  viewProfileButton: {
    position: "absolute",
    left: 20,
    top: 20,
    zIndex: 1, // Determines the stacking order of the element.
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
    borderRadius: 10,
  },
  
  // Similar to the viewProfileButton but positioned at the top right.
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
  
  // Defines styles for another button, positioned slightly below the editProfileButton
  // to avoid overlap, with similar styling and layering properties.
  tipsButton: {
    position: "absolute",
    right: 20,
    top: 60, // Positioned lower than the editProfileButton.
    zIndex: 2, // Higher zIndex to ensure it's on top if overlapping.
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
    borderRadius: 10,
  },
  
  // Styles for an image representing a vet profile, with specific dimensions, rounded corners,
  // a border with a specific color and thickness, and a top margin.
  vetProfileImage: {
    height: 155,
    width: 155,
    borderRadius: 20,
    borderColor: COLORS.primary,
    borderWidth: 3,
    marginTop: 50,
  },
  name: {
    ...FONTS.h2, // Apply predefined font styles for heading 2, ensuring consistency across the app.
    color: COLORS.primary, // Set the text color using the primary color from the predefined color palette.
    marginVertical: 8, // Add vertical spacing above and below the text to separate it from other elements.
  },
  // Styles for a text element displaying a professional specialization.
  specialization: {
    color: COLORS.black, // Set the text color to black for high contrast and readability.
    ...FONTS.body4, // Apply body font styles to keep the text appearance consistent with other body elements.
  },
  // Styles for a text element showing a location.
  location: {
    ...FONTS.body4, // Use the same body font styles for consistency with other descriptive text.
    marginLeft: 4, // Add a small left margin to create a visual separation from elements on its left.
  },
  // Styles for a heading that introduces a section about the user or subject.
  aboutTitle: {
    ...FONTS.h2, // Apply heading 2 font styles for visual hierarchy.
    color: COLORS.black, // Use black for the text color for clear visibility.
    textAlign: "left", // Align the text to the left for a standard reading flow.
    marginTop: 15, // Add top margin to distance it from preceding content.
  },
  // Styles for a paragraph or block of text that describes details.
  description: {
    ...FONTS.body4, // Use body font styles for consistent text appearance.
    color: COLORS.darkgray, // Set the text color to dark gray for a softer contrast.
    textAlign: "left", // Align the text to the left to match the flow of other text elements.
    marginTop: 10, // Add some space above to separate it from previous elements.
  },
  // Styles for a button designed to encourage sharing a tip or information.
  shareTipButton: { // It appears there's a typo in your original code ("shreTipButton" should likely be "shareTipButton").
    width: "90%", // Set the button width to occupy 90% of its parent container's width for prominence.
    height: 40, // Specify a fixed height for uniformity across buttons.
    alignItems: "center", // Center the button's content horizontally for a polished look.
    justifyContent: "center", // Center the button's content vertically for visual balance.
    backgroundColor: COLORS.primary, // Use the primary color for the button background to draw attention.
    borderRadius: 10, // Round the corners for a modern, touch-friendly design.
    marginBottom: 20, // Add bottom margin to separate it from elements below.
    marginTop: 20, // Add top margin to distance it from content above.
  },
  // Styles for a button designed for logging out of the application.
  logoutButton: {
    position: "absolute", // Position the button independently of the document flow, allowing it to overlap other elements.
    right: 20, // Place the button 20 pixels from the right edge of its nearest positioned ancestor.
    top: 100, // Position the button 100 pixels from the top of its container for visibility.
    zIndex: 3, // Set the stacking order to ensure it appears above other overlapping elements.
    width: 36, // Specify a fixed width for consistency.
    height: 36, // Specify a fixed height to match the width, creating a square shape.
    alignItems: "center", // Center content horizontally within the button.
    justifyContent: "center", // Center content vertically within the button for a neat appearance.
    backgroundColor: COLORS.primary, // Apply the primary color to the button background to make it stand out.
    borderRadius: 10, // Apply rounded corners for a friendly, accessible design.
  },
});
