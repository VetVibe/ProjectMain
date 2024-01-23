import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import PetContainer from "./PetContainer";
import axios from "axios";

export default function PetOwnerHomeScreen({ route, navigation }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [userPets, setUserPets] = useState([]);

  const petOwnerId = route.params.userId;

  useEffect(() => {
    const updateUserPetDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/petOwner/${petOwnerId}/pets`);
        const petIds = response.data.pets;

        // Fetch details of each pet concurrently
        const fetchPetDetails = petIds.map((petId) =>
          axios.get(`http://localhost:3000/pet/${petId}`).then((response) => response.data)
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

  const handleSearch = () => {
    // Implement your search functionality here
    console.log("Searching for:", searchQuery);
  };
  const handleNavigateToEditProfile = () => {
    navigation.navigate("Pet Profile Screen Edit", { petOwnerId: petOwnerId });
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

      <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
        <Text style={styles.buttonText}>Search</Text>
      </TouchableOpacity>
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
});