// Import necessary components and functionality from the 'react-native' library.
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";

// Define a functional component named 'PetContainer' that takes props 'userPets' and 'navi'.
export default function PetContainer({ userPets, navi }) {
  // Define a function 'navigateToEditScreen' that navigates to a different screen using a pet's ID.
  const navigateToEditScreen = (petId) => {
    // Use the 'navi' prop (assumed to be a navigation object) to change screens, passing 'petId' as a parameter.
    navi.navigate("Pet Profile Screen", { petId: petId });
  };

  // The component returns a view component.
  return (
    <View>
      {/* Iterate over 'userPets', an array of pet objects, using 'map' to generate a list of components for each pet. */}
      {userPets.map((pet) => (
        // For each pet, create a touchable opacity component that triggers 'navigateToEditScreen' when pressed.
        <TouchableOpacity key={pet._id} onPress={() => navigateToEditScreen(pet._id)}>
          {/* Display an image for the pet using the 'Image' component with a source URL taken from the pet's 'imgSrc' property. */}
          <Image source={{ uri: pet.imgSrc }} style={styles.pawImage} resizeMode="contain" />
          {/* Display the pet's name using the 'Text' component. */}
          <Text style={styles.title}>{pet.name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

// Use 'StyleSheet.create' to define styles for the components in a more organized and efficient way.
const styles = StyleSheet.create({
  header: {
    // Style for header text.
    alignItems: "center", // Center-align text horizontally.
    fontSize: 40, // Set font size to 40.
    color: "#333333", // Set text color.
    marginTop: 10, // Add a top margin.
  },
  pawImage: {
    // Style for the pet images.
    width: 100, // Set image width.
    height: 100, // Set image height.
  },
  title: {
    // Style for the pet name text.
    fontSize: 20, // Set font size to 20.
    color: "#333333", // Set text color.
    marginTop: 10, // Add a top margin to separate it from the image.
  },
});