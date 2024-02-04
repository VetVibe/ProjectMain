// Importing necessary React components and hooks for the component
import React, { useState, useEffect } from "react";
// Importing components from react-native for UI building
import { View, TouchableOpacity, Text, FlatList, StyleSheet, Alert, Image } from "react-native";
// Importing COLORS from a constants file to maintain consistency in design
import { COLORS  } from "../../constants";
// Importing AntDesign icons from @expo/vector-icons for use in the UI
import { AntDesign } from "@expo/vector-icons";
// Importing axios for making HTTP requests
import axios from "axios";
// Importing UIImagePickerPresentationStyle from expo-image-picker for configuring image picker behavior
import { UIImagePickerPresentationStyle } from "expo-image-picker";

// Custom hook for fetching and managing veterinary tips
export const useAllTips = () => {
  // State hook for storing the list of veterinary tips
  const  [vetTips, setVetTips] = useState([])
  // Async function to fetch all tips from the backend
  const fetchAllTips = async () => {
    try {
      // Making a GET request to fetch all tips
      const response = await axios.get('http://localhost:3000/tips/all');
      // If data is received, update the vetTips state with the fetched data
      if (response.data) {
        setVetTips(response.data);
      }
    } catch (error) {
      // Logging any errors to the console
      console.error("Error fetching tips:", error);
    }
  };

  // Returning an object containing the fetchAllTips function and vetTips state for external use
  return {
    fetchAllTips,
    vetTips,
    setVetTips
  }
}

// Component for displaying veterinary tips
export default function TipsScreenPet({ route, navigation }) {
  // Destructuring the custom hook to use its returned properties
  const   {fetchAllTips, vetTips }= useAllTips()
  // useEffect hook to fetch all tips when the component is focused/loaded
  useEffect(() => {
    fetchAllTips(); // Initial fetch of tips
    // Adding a listener to refetch tips whenever the TipsScreenPet is focused
    const subscription = navigation?.addListener("focus", fetchAllTips);
    // Cleanup function to remove the listener when the component is unmounted
    return () => {
      if (subscription) {
        subscription.remove(); // Corrected for cleanup
      }
    };
  }, [navigation]); // Dependency array to re-run the effect if navigation object changes

  // Function to render each item in the FlatList
  const renderItem = ({ item }) => {
    return (
      // Container for each tip
      <View style={styles.tipContainer}>
        // Image component for displaying the veterinarian's image
        <Image
          source={{ uri : item.VetImage}} // Using the vetImage URL from each item
          resizeMode="cover" // Cover style for the image
          style={styles.profileImage}
        />
        // Container for the text content of the tip
        <View style={styles.tipTextContainer}>
          // Text component for displaying the content of the tip
          <Text style={styles.tipContent}>{item.content}</Text>
          // Text component for displaying the name of the veterinarian
          <Text style={styles.vetName}>By: {item.vetName}</Text>
        </View>
      </View>
    );
  };  

  // Main return statement of the TipsScreenPet component
  return (
    // Main container for the screen
    <View style={styles.container}>
      // Title for the tips screen
      <Text style={styles.title}>Vet Tips</Text>
      // FlatList for efficiently rendering the list of tips
      <FlatList
        data={vetTips} // Data source for the FlatList
        renderItem={renderItem} // Function to render each item
        keyExtractor={(item) => item._id} // Key extractor for list items
      />
    </View>
  );
}

// Define a set of styles to be used throughout the TipsScreenPet component
const styles = StyleSheet.create({
  // Style for the main container view
  container: {
    flex: 1, // Makes sure the container takes up the whole screen by growing to fill the available space
    padding: 20, // Adds spacing inside the container, away from its edges, by 20 units on all sides
  },
  // Style for the title text at the top of the screen
  title: {
    fontSize: 20, // Sets the font size to 20 to make the title text larger and more readable
    fontWeight: "bold", // Makes the title text bold to stand out
    marginBottom: 10, // Adds space below the title, separating it from whatever comes next by 10 units
  },
  // Style for each tip container, which holds an individual tip and its associated information
  tipContainer: {
    flexDirection: 'row', // Sets the direction of items in the container to be in a row (horizontal alignment)
    backgroundColor: "#f0f0f0", // Sets the background color of the tip container to a light grey for visual distinction
    borderRadius: 2, // Rounds the corners of the container slightly for a more polished look
    padding: 5, // Adds spacing inside the tip container, away from its edges, by 5 units on all sides
    marginBottom: 10, // Adds space below the container, separating it from the next item by 10 units
    alignItems: 'center', // Centers the items vertically within the container for a balanced look
  },
  // Style for the profile image within each tip container
  profileImage: {
    height: 60, // Sets the height of the image to 60 units for consistency
    width: 60, // Sets the width of the image to 60 units to maintain a square shape
    borderRadius: 20, // Rounds the corners of the image to create a circular appearance
    marginRight: 15, // Adds space to the right of the image, separating it from the text by 15 units
  },
  // Style for the container that holds the text of the tip and the vet's name
  tipTextContainer: {
    flex: 1, // Allows this container to expand and fill the available space not taken by the profile image
  },
  // Style for the main content text of the tip
  tipContent: {
    fontSize: 16, // Sets the font size to 16 for readability
  },
  // Style for the vet's name text, giving credit to the source of the tip
  vetName: {
    fontStyle: 'italic', // Italicizes the text to differentiate it from the tip content
    marginTop: 5, // Adds space above the vet's name, separating it from the tip content by 5 units
  },
  // Style for an add button, assumed to be part of the component for adding new tips (though not shown in the code provided)
  addButton: {
    alignSelf: 'flex-end', // Aligns the button to the end of its container (right side for a row direction)
    marginBottom: 10, // Adds space below the button, separating it from whatever is below by 10 units
  },
});