import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import DetailsContainer from "../../components/DetailsContainer/DetailsContainer";
import { mapPetDetails } from "../../utils";
import { TITELS } from "../../constants";
import axios from "axios";
import tw from "twrnc";

// Define a functional component named PetProfileScreen for displaying and managing a pet's profile.
// This component receives 'route' and 'navigation' props for accessing route parameters and handling navigation.
export default function PetProfileScreen({ route, navigation }) {
  // useState hook to manage the pet's details within the component's state. It's initialized as an empty object.
  const [petDetails, setPetDetails] = useState({});

  // Extract the pet's ID from the route parameters passed to this screen, which is used to fetch the pet's details.
  const petId = route.params.petId;

  // useEffect hook to perform side effects. In this case, it fetches the pet's details when the screen is focused or when petId changes.
  useEffect(() => {
    // Define an asynchronous function to fetch and update the pet's details from a server.
    const updatePetDetails = async () => {
      try {
        // Use axios to make a GET request to fetch the pet's details by its ID.
        const response = await axios.get(`http://localhost:3000/pet/${petId}`);
        // Map the response data (pet details) through a custom function to format it as needed (this function is implied and should be defined elsewhere).
        const mappedPetDetails = mapPetDetails(response.data);
        // Update the component's state with the fetched and mapped pet details.
        setPetDetails(mappedPetDetails);
      } catch (error) {
        // Log an error message to the console if the fetch operation fails.
        console.error("Error updating pet details:", error);
      }
    };

    // Add a navigation event listener that triggers updatePetDetails function when the screen gains focus.
    const subscription = navigation.addListener("focus", updatePetDetails);

    // Return a cleanup function that removes the event listener when the component unmounts to prevent memory leaks.
    return () => {
      if (subscription) {
        subscription.remove(); // Corrected to use the remove method for cleanup.
      }
    };
  }, [petId, navigation]); // The effect depends on petId and navigation, so it re-runs if either changes.

  // Function to navigate to the pet edit screen, passing the current pet's ID as a parameter.
  const navigateToEditScreen = () => {
    navigation.navigate("Pet Profile Screen Edit", { petId: petId });
  };

  // Define an asynchronous function to delete the pet using its ID.
  const deletePet = async () => {
    try {
      // Use axios to send a DELETE request to the server to remove the pet's details by its ID.
      await axios.delete(`http://localhost:3000/pet/${petId}`);
      // After successful deletion, navigate back to the previous screen in the navigation stack.
      navigation.goBack();
    } catch (error) {
      // Log an error message to the console if the deletion fails.
      console.error("Error deleting pet:", error);
    }
  };

  return (
    <View>
      <TouchableOpacity onPress={navigateToEditScreen} style={styles.editButton}>
        <Text style={tw`text-2xl font-semibold pr-2 tracking-wide`}>Edit Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={deletePet} style={styles.deleteButton}>
      <Text style={tw`text-2xl font-semibold pr-2 tracking-wide text-red-500`}>Delete Pet</Text>
    </TouchableOpacity>

      <ScrollView style={{ flexGrow: 1 }}>
        <Image source={{ uri: petDetails.imgSrc }} style={styles.petImage} />

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

// Creating a stylesheet for the components using React Native's StyleSheet API.
const styles = StyleSheet.create({
  // Styles for the main container of the screen or component.
  container: {
    flex: 1, // Makes the container flexible and allows it to expand to fill the available space in its parent container.
    padding: 20, // Adds padding inside the container on all sides, creating space between the container's border and its content.
  },

  // Styles for an 'Edit' button, applying layout and spacing.
  editButton: {
    flexDirection: "row-reverse", // Arranges child elements in a row, but starts from the end (right side), making the first child appear on the right.
    alignItems: "center", // Vertically aligns child elements in the center of the button.
    marginTop: 10, // Adds space above the button, separating it from other elements.
  },

  // Styles for a 'Delete' button, similar to the 'Edit' button for consistent design.
  deleteButton: {
    flexDirection: "row-reverse", // Also arranges children from the end to start within the button.
    alignItems: "center", // Ensures content is centered vertically within the button.
    marginTop: 10, // Adds vertical space above the button.
  },

  // Styles for the container that holds the pet image, ensuring it is properly positioned and spaced.
  petImageContainer: {
    alignItems: "center", // Centers the pet image horizontally within the container.
    marginTop: 20, // Adds space above the container, separating it from previous elements.
  },

  // Styles for the pet image itself, controlling its size and shape.
  petImage: {
    width: 120, // Sets the width of the image to 120 units.
    height: 120, // Sets the height of the image to 120 units, making it square.
    borderRadius: 60, // Rounds the corners of the image to make it a circle (radius is half the width/height).
  },

  // Styles for titles of sections, adding an underline effect.
  sectionTitle: {
    borderBottomWidth: 1, // Adds a bottom border with 1 unit thickness to simulate an underline.
    borderBottomColor: "#ccc", // Sets the color of the bottom border to a light grey.
    marginBottom: 10, // Adds space below the title.
    paddingBottom: 5, // Adds padding at the bottom of the title, raising the underline effect slightly.
  },

  // Styles for a 'Find Vet' button, arranging its contents and styling its appearance.
  findVetButton: {
    flexDirection: "row", // Arranges child elements in a row, from start to end.
    alignItems: "center", // Centers children vertically within the button.
    marginTop: 20, // Adds space above the button.
    justifyContent: "center", // Centers children horizontally within the button.
    backgroundColor: "#FFA500", // Sets the background color of the button to a shade of orange.
    padding: 10, // Adds padding inside the button, increasing its size and providing space around its content.
    borderRadius: 8, // Rounds the corners of the button slightly for a softer look.
  },
});
