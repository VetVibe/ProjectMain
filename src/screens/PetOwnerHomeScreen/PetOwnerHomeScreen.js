import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import PetContainer from "./PetContainer";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialIcons } from "@expo/vector-icons";
import { COLORS, FONTS, SIZES, images } from "../../constants";

export default function PetOwnerHomeScreen({ route, navigation }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [userPets, setUserPets] = useState([]);
  const [veterinarians, setVeterinarians] = useState([]);

  const petOwnerId = route.params.userId;

  useEffect(() => {
    const updateUserPetDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/petOwner/${petOwnerId}/pets`
        );
        const petIds = response.data.pets;

        // Fetch details of each pet concurrently
        const fetchPetDetails = petIds.map((petId) =>
          axios
            .get(`http://localhost:3000/pet/${petId}`)
            .then((response) => response.data)
        );

        // Wait for all fetches to complete
        Promise.all(fetchPetDetails).then((petDetailsArray) => {
          setUserPets(petDetailsArray);
        });
      } catch (error) {
        console.error("Error fetching user pets:", error);
      }
    };

    // Listen for changes and update petDetails
    const subscription = navigation.addListener("focus", updateUserPetDetails);

    // Clean up the subscription when the component unmounts
    return () => {
      if (subscription) {
        subscription();
      }
    };
  }, [petOwnerId, navigation]);
  const LogoutClick = () => {
    clearAuthToken();
  };
  const clearAuthToken = async () => {
    await AsyncStorage.removeItem("authToken");
    console.log("Cleared auth token");
    navigation.replace("Home");
  };

  const handleSearch = () => {
    const queryParams = new URLSearchParams();
    if (searchQuery) queryParams.append("location", searchQuery);
    queryParams.append("isAvailable", true);

    axios
      .get(`http://localhost:3000/veterinarians?${queryParams.toString()}`)
      .then((response) => {
        setVeterinarians(response.data);
      })
      .catch((error) => {
        console.error("Error fetching veterinarians:", error);
      });
  };

  const handleNavigateToEditProfile = () => {
    navigation.navigate("Pet Profile Screen Edit", { petOwnerId: petOwnerId });
  };

  const handleVetPress = (vet) => {
    console.log("vetId: check", vet._id);

    // Navigate to VetHomeScreen with the selected vet's ID and pet owner's ID
    navigation.navigate("Vet Home Screen", {
      userId: vet._id,
      userType: "petOwner", // ID of the pet owner
    });
  };

  return (
    <ScrollView>
      <View style={styles.addButton}>
        <TouchableOpacity onPress={handleNavigateToEditProfile}>
          <Icon name="plus" size={20} color="black" />
        </TouchableOpacity>
      </View>

      {userPets.length > 0 ? (
        <PetContainer userPets={userPets} navi={navigation} />
      ) : (
        <Text>No pets in your collection</Text>
      )}

      <Text style={styles.title}>Find a Vet</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Search for vets"
        value={searchQuery}
        onChangeText={(text) => setSearchQuery(text)}
      />
      <TouchableOpacity style={styles.logoutButton} onPress={LogoutClick}>
        <MaterialIcons name="logout" size={24} color={COLORS.white} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
        <Text style={styles.buttonText}>Search</Text>
      </TouchableOpacity>

      {veterinarians.map((vet, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => handleVetPress(vet)}
          style={styles.vetItem}
        >
          <Text>
            {vet.name} - {vet.location}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  addButton: {},
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  searchInput: {
    height: 40,
    width: "80%",
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 10,
  },
  searchButton: {
    backgroundColor: "#FFA500",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  profileButton: {
    backgroundColor: "#FFA500",
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  logoutButton: {
    position: "absolute",
    right: 20,
    top: 100, // Adjust the position based on your layout
    zIndex: 3,
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
    borderRadius: 10,
  },
});
