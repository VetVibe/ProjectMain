import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Button } from "react-native";
import PetContainer from "./PetContainer";
import initialPetDetails from "./data";

export default function PetOwnerHomeScreen({ navigation }) {
  const [ searchQuery, setSearchQuery ] = useState("");
  const [ userPets, setUserPets ] = useState();

  const handleSearch = () => {
    // Implement your search functionality here
    console.log("Searching for:", searchQuery);
  };
  const handleNavigateToEditProfile = () => {
    navigation.navigate("Pet Profile Screen Edit", {petDetails: initialPetDetails});
  };

  return (
    <View style={styles.container}>
      {userPets && <PetContainer userPets={userPets} navi={navigation} />}
      {!userPets && <Button onPress={handleNavigateToEditProfile} title={"Add pet"} />} 
      
      <Text style={styles.title}>Find a Vet</Text>
      <TextInput style={styles.searchInput} placeholder="Search for vets" value={searchQuery} onChangeText={(text) => setSearchQuery(text)}/>

      <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
        <Text style={styles.buttonText}>Search</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
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