import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import axios from "axios";

// Importing necessary dependencies from React and other libraries at the beginning of your file is assumed.
// Define a functional component named `ShareTip` that takes `route` and `navigation` as props.
export default function ShareTip({ route, navigation }) {
  // Extracts the veterinarian's ID from the navigation route parameters passed to this screen.
  const vetId = route.params.vetId;

  // Uses the `useState` hook to create a state variable `tip` for storing the user's input and a setter function `setTip` to update this state.
  // Initially, the `tip` state is an empty string, indicating no tip has been entered yet.
  const [tip, setTip] = useState("");

  // Define a function `handleSave` that will be called when the user wants to save/share the tip.
  function handleSave() {
    // Uses Axios to send a POST request to the server with the tip's content.
    // The URL includes the `vetId` to associate the tip with the correct veterinarian.
    axios
      .post(`http://localhost:3000/tip/addTip/${vetId}`, { content: tip })
      .then((response) => {
        // If the request is successful, navigate back to the previous screen.
        navigation.goBack();
      })
      .catch((error) => {
        // If the request fails, log the error to the console.
        console.error(`Error during updating vet ${vetId} tips:`, error);
      });
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Share your tip</Text>
      </View>

      <TextInput
        style={styles.inputField}
        multiline={true}
        numberOfLines={10}
        placeholder="Write your tip here..."
        value={tip}
        onChangeText={setTip}
      />

      <TouchableOpacity style={styles.shareButton} onPress={handleSave}>
        <Text style={styles.shareButtonText}>SHARE</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// Use StyleSheet.create to define a set of styles that can be applied to React Native components
const styles = StyleSheet.create({
  // Style for the main container of the screen or a component
  container: {
    flex: 1, // The component should expand to fill the available space
    padding: 20, // Add padding inside the container on all sides for spacing
  },
  
  // Style for a header container that may contain text or other elements
  header: {
    flexDirection: "row", // Arrange children elements in a row horizontally
    alignItems: "center", // Vertically center the children in the container
    marginBottom: 20, // Add space below the header
  },
  
  // Style for the title text within the header
  headerTitle: {
    marginLeft: 10, // Add space to the left of the title for spacing from the container edge or other elements
    fontSize: 24, // Set the font size for the title
    fontWeight: "bold", // Make the title text bold
  },
  
  // Style for an input field, typically for entering text
  inputField: {
    borderWidth: 1, // Add a border around the input field with 1 pixel thickness
    borderColor: "grey", // Set the border color to grey
    padding: 15, // Add padding inside the input field for spacing between the border and the text
    textAlignVertical: "top", // Align multiline text to start from the top of the input field
    borderRadius: 5, // Round the corners of the input field
    marginBottom: 20, // Add space below the input field
  },
  
  // Style for a button used to share information, like submitting a form
  shareButton: {
    backgroundColor: "orange", // Set the background color of the button to orange
    padding: 15, // Add padding inside the button to increase its size and provide space around its content
    justifyContent: "center", // Horizontally center the button's content
    alignItems: "center", // Vertically center the button's content
    borderRadius: 5, // Round the corners of the button
  },
  
  // Style for the text inside the share button
  shareButtonText: {
    color: "white", // Set the text color to white for contrast against the button's background
    fontSize: 18, // Set the font size of the button text
    fontWeight: "bold", // Make the button text bold
  },
});
