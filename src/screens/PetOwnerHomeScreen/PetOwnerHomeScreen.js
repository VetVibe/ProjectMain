import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  FlatList,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import PetContainer from "./PetContainer";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import VetSearchForm from "../../components/VetSearchForm/VetSearchForm";
import { MaterialIcons } from "@expo/vector-icons";
import { COLORS, FONTS, SIZES, images } from "../../constants";

// Defining the main function component for the pet owner's home screen.
// It receives 'route' and 'navigation' props for routing and navigation purposes.
export default function PetOwnerHomeScreen({ route, navigation }) {
  // State hooks to manage the state of user pets, veterinarians, selected location, and specialization.
  // userPets and veterinarians are initialized as empty arrays, selectedLocation and selectedSpecialization as empty strings.
  const [userPets, setUserPets] = useState([]);
  const [veterinarians, setVeterinarians] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState("");

  // Extracting the pet owner's ID from the navigation route parameters.
  const petOwnerId = route.params.userId;

  // useEffect hook to perform side effects. In this case, to fetch user pets when the component mounts or updates.
  useEffect(() => {
    // Async function to update the user's pet details.
    const updateUserPetDetails = async () => {
      try {
        // Making a GET request to fetch pet IDs associated with the pet owner.
        const response = await axios.get(
          `http://localhost:3000/petOwner/${petOwnerId}/pets`
        );
        const petIds = response.data.pets;

        // Mapping over petIds to fetch details for each pet concurrently using axios GET requests.
        const fetchPetDetails = petIds.map((petId) =>
          axios
            .get(`http://localhost:3000/pet/${petId}`)
            .then((response) => response.data)
        );

        // Waiting for all pet details fetches to complete and then setting the userPets state with the fetched data.
        Promise.all(fetchPetDetails).then((petDetailsArray) => {
          setUserPets(petDetailsArray);
        });
      } catch (error) {
        // Logging an error message if there's an issue fetching user pets.
        console.error("Error fetching user pets:", error);
      }
    };

    // Adding a focus listener to the navigation to update pet details whenever the screen comes into focus.
    const focusListener = navigation.addListener("focus", () => {
      updateUserPetDetails();
    });

    // Returning a cleanup function to remove the focus listener when the component unmounts.
    return () => {
      if (focusListener) {
        focusListener.remove();
      }
    };
  }, [petOwnerId, navigation]); // Dependencies array, ensuring the effect runs when these values change.

  // Function to handle logout click, which clears the authentication token and navigates to the home screen.
  const LogoutClick = () => {
    clearAuthToken();
  };
  const clearAuthToken = async () => {
    // Removing the authToken from AsyncStorage and logging out the user.
    await AsyncStorage.removeItem("authToken");
    console.log("Cleared auth token");
    // Replacing the current screen in the navigation stack with the home screen.
    navigation.replace("Home");
  };

  // Function to handle search for veterinarians based on selected location and specialization.
  const handleSearch = () => {
    // Creating URL search parameters for the GET request.
    const queryParams = new URLSearchParams();
    if (selectedLocation) queryParams.append("location", selectedLocation);
    if (selectedSpecialization)
      queryParams.append("specialization", selectedSpecialization);

    // Making a GET request to fetch veterinarians based on the search parameters.
    axios
      .get(`http://localhost:3000/veterinarians?${queryParams.toString()}`)
      .then((response) => {
        // Setting the veterinarians state with the response data.
        setVeterinarians(response.data);
      })
      .catch((error) => {
        // Logging an error message if there's an issue fetching veterinarians.
        console.error("Error fetching veterinarians:", error);
      });
  };

  // Navigation handler functions to navigate to different screens within the application.
  const handleNavigateToEditProfile = () => {
    navigation.navigate("Pet Profile Screen Edit", { petOwnerId: petOwnerId });
  };

  const handleNavigateToEditPetOwnerProfile = () => {
    navigation.navigate("Edit Pet Owner Profile Screen", {
      petOwnerId: petOwnerId,
    });
  };

  const handleNavigateToTipsScreen = () => {
    navigation.navigate("Tips Screen Pet");
  };

  const handleVetPress = (vet) => {
    // Navigating to the Vet Home Screen with vet ID and user type as parameters.
    navigation.navigate("Vet Home Screen", {
      userId: vet._id,
      userType: "petOwner",
    });
  };

  const handlePetSelect = (pet) => {
    // Navigating to the Pet Profile Screen with the selected pet's ID as a parameter.
    navigation.navigate("Pet Profile Screen", { petId: pet._id });
  };

  return (
    <ScrollView>
      <View style={styles.addButton}>
        <TouchableOpacity onPress={handleNavigateToEditProfile}>
          <Icon name="plus" size={20} color="black" />
        </TouchableOpacity>
      </View>

      {/* Horizontal FlatList for Pets */}
      <View style={styles.petsContainer}>
        {userPets.length > 0 ? (
          <FlatList
            data={userPets}
            horizontal={true}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => handlePetSelect(item)}
                style={styles.petItem}
              >
                <Image source={{ uri: item.imgSrc }} style={styles.petImage} />
                <Text style={styles.petName}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
        ) : (
          <Text>No pets in your collection</Text>
        )}
      </View>

      <View style={styles.searchSection}>
        <Text style={styles.title}>Find a Vet</Text>
        <VetSearchForm
          setSelectedLocation={setSelectedLocation}
          setSelectedSpecialization={setSelectedSpecialization}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.buttonText}>Search</Text>
        </TouchableOpacity>

        {veterinarians.map((vet, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleVetPress(vet)}
            style={styles.vetItem}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Image
                source={{
                  uri: vet.profilePicture
                    ? vet.profilePicture
                    : "https://www.behance.net/gallery/189614555/VetProfile.jpg",
                }}
                resizeMode="cover"
                style={styles.profileImage}
              />
              <View
                style={[
                  styles.availabilityIndicator,
                  vet.isAvailable ? styles.available : styles.notAvailable,
                ]}
              />
              <Text style={{ marginLeft: 5 }}>
                {vet.name} - {vet.location}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity
        style={styles.editProfileButton}
        onPress={handleNavigateToEditPetOwnerProfile}
      >
        <MaterialIcons name="edit" size={24} color={COLORS.white} />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.tipsButton}
        onPress={handleNavigateToTipsScreen}
      >
        <MaterialIcons name="my-library-books" size={24} color={COLORS.white} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.logoutButton} onPress={LogoutClick}>
        <MaterialIcons name="logout" size={24} color={COLORS.white} />
      </TouchableOpacity>
    </ScrollView>
  );
}

// Define a collection of styles to be used in a React Native component.
const styles = StyleSheet.create({
  // Styles for an add button, currently empty but can be customized as needed.
  addButton: {},

  // General container style for aligning and spacing content centrally.
  container: {
    flex: 1, // Makes the container use all available space in its parent container.
    padding: 20, // Adds padding around the inside edges of the container.
    alignItems: "center", // Centers children horizontally in the container.
    justifyContent: "center", // Centers children vertically in the container.
  },

  // Style for titles, making them large, bold, and spaced from elements below them.
  title: {
    fontSize: 24, // Sets the size of the text.
    fontWeight: "bold", // Makes the text bold.
    marginBottom: 20, // Adds space below the title.
  },

  // Styles for a text input used for searching, with defined size, border, and inner padding.
  searchInput: {
    height: 40, // Sets the height of the input field.
    width: "80%", // Sets the width of the input field to 80% of its parent container's width.
    borderColor: "gray", // Sets the color of the border.
    borderWidth: 1, // Sets the width of the border.
    marginBottom: 20, // Adds space below the input field.
    paddingLeft: 10, // Adds padding inside the input field on the left, making space for the text.
  },

  // Style for a button used to initiate searches, with a background color, padding, and rounded corners.
  searchButton: {
    backgroundColor: "#FFA500", // Sets the background color of the button.
    padding: 10, // Adds padding inside the button, making it larger and easier to tap.
    borderRadius: 5, // Rounds the corners of the button.
  },

  // Text style for buttons, setting the color, size, and weight of the text.
  buttonText: {
    color: "white", // Sets the text color to white.
    fontSize: 16, // Sets the size of the text.
    fontWeight: "bold", // Makes the text bold.
  },

  // Style for a button used to view profiles, similar to searchButton but with a top margin.
  profileButton: {
    backgroundColor: "#FFA500", // Sets the background color of the button.
    padding: 10, // Adds padding inside the button.
    borderRadius: 5, // Rounds the corners of the button.
    marginTop: 20, // Adds space above the button.
  },

  // Styles a section with a top padding, pushing content down for visual spacing.
  searchSection: {
    paddingTop: 90, // Adds padding at the top, pushing the content down.
  },

  // Style for items representing veterinarians, aligning items in a row with space between.
  vetItem: {
    flexDirection: "row", // Layout children in a horizontal row.
    alignItems: "center", // Align children vertically in the center.
    justifyContent: "space-between", // Distribute extra space evenly between children.
  },

  // Style for indicators showing availability, small rounded circles with a left margin.
  availabilityIndicator: {
    width: 10, // Sets the width of the indicator.
    height: 10, // Sets the height of the indicator.
    borderRadius: 5, // Makes the indicator perfectly round.
    marginLeft: 5, // Adds space to the left of the indicator.
  },

  // Styles for availability indicators, green for available and red for not available.
  available: {
    backgroundColor: "#00FF00", // Sets the indicator color to green.
  },
  notAvailable: {
    backgroundColor: "red", // Sets the indicator color to red.
  },

  // Style for a logout button with an absolute position, specific size, and background color.
  logoutButton: {
    position: "absolute", // Positions the button independently of its siblings.
    right: 20, // Positions the button 20 pixels from the right edge of its parent.
    top: 100, // Positions the button 100 pixels from the top edge of its parent.
    zIndex: 3, // Ensures the button layers above other elements.
    width: 36, // Sets the width of the button.
    height: 36, // Sets the height of the button.
    alignItems: "center", // Centers the button's content horizontally.
    justifyContent: "center", // Centers the button's content vertically.
    backgroundColor: COLORS.primary, // Sets the background color using a variable (assumed to be defined elsewhere).
    borderRadius: 10, // Rounds the corners of the button.
  },

  // Additional button styles for viewing tips, editing profiles, etc., similar to logoutButton but positioned differently.
  viewTipsButton: {
    backgroundColor: "#FFA500",
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    marginBottom: 20,
  },
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
  tipsButton: {
    position: "absolute",
    right: 20,
    top: 60,
    zIndex: 2,
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
    borderRadius: 10,
  },

  // Style for profile images, defining size, shape, and spacing.
  profileImage: {
    height: 60, // Sets the height of the image.
    width: 60, // Sets the width of the image.
    borderRadius: 20, // Rounds the corners of the image.
    marginRight: 15, // Adds space to the right of the image.
  },

  // Container style for pets, defining height, alignment, and padding.
  petsContainer: {
    height: 150, // Sets the height of the container.
    alignItems: "center", // Centers the container's children horizontally.
    padding: 10, // Adds padding inside the container.
  },

  // Style for individual pet items, including spacing and alignment.
  petItem: {
    marginHorizontal: 10, // Adds horizontal spacing around each pet item.
    alignItems: "center", // Centers the pet item's content horizontally.
  },

  // Style for pet images, defining size and shape.
  petImage: {
    width: 100, // Sets the width of the image.
    height: 100, // Sets the height of the image.
    borderRadius: 50, // Makes the image round.
  },

  // Style for pet names, defining text alignment and spacing.
  petName: {
    textAlign: "center", // Aligns the text to the center.
    marginTop: 5, // Adds space above the pet name.
  },
});
