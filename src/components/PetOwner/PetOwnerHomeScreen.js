import React, { useState } from "react";
import { View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

export default function PetOwnerHomeScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    // Implement your search functionality here
    console.log("Searching for:", searchQuery);
  };
  const handleNavigateToProfile = () => {
    navigation.navigate("Pet Profile Screen");
  };

  return (
    <View style={styles.container}>
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
      {/* Button to navigate to the PetProfileScreen */}
      <TouchableOpacity
        style={styles.profileButton}
        onPress={handleNavigateToProfile}
      >
        <Text style={styles.buttonText}>View Pet Profile</Text>
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