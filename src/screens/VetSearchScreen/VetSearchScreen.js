import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from "react-native";
import VetSearchForm from "../../components/VetSearchForm/VetSearchForm";
import { COLORS } from "../../constants";
import { clientServer } from "../../server";

export default function VetSearchScreen({ navigation }) {
  const [petOwnerId, setPetOwnerId] = useState(null);
  const [veterinarians, setVeterinarians] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState("");

  useEffect(() => {
    const fetchPetOwnerId = async () => {
      const id = await AsyncStorage.getItem("userId");
      setPetOwnerId(id);
    };
    fetchPetOwnerId();
  }, [petOwnerId]);

  const handleSearch = async () => {
    const queryParams = new URLSearchParams();
    if (selectedLocation) queryParams.append("location", selectedLocation);
    if (selectedSpecialization) queryParams.append("specialization", selectedSpecialization);
    const vets = await clientServer.getVets(queryParams.toString());
    setVeterinarians(vets);
  };

  const handleVetPress = (vet) => {
    // Navigate to VetHomeScreen with the selected vet's ID and pet owner's ID
    navigation.navigate("Vet Home Screen", {
      vetId: vet._id,
      userType: "petOwner", // ID of the pet owner
      petOwnerId: petOwnerId,
    });
  };

  return (
    <ScrollView>
      <View style={styles.searchSection}>
        <Text style={styles.title}>Find a Vet</Text>
        <VetSearchForm
          setSelectedLocation={setSelectedLocation}
          setSelectedSpecialization={setSelectedSpecialization}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.buttonText}>Search</Text>
        </TouchableOpacity>

        {veterinarians && veterinarians.length > 0 ? (
          veterinarians.map((vet, index) => (
            <TouchableOpacity key={index} onPress={() => handleVetPress(vet)} style={styles.vetItem}>
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
                <Text style={{ marginLeft: 5 }}>
                  {vet.name} - {vet.location}
                </Text>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <Text>No veterinarians found</Text>
        )}
      </View>
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
  searchSection: {
    paddingTop: 90, // Added top padding to push the entire section down
  },
  vetItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  viewTipsButton: {
    backgroundColor: "#FFA500",
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    marginBottom: 20,
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
  profileImage: {
    height: 60, // Adjust the size as needed
    width: 60, // Adjust the size as needed
    borderRadius: 20, // Make it round
    marginRight: 15, // Add some spacing between the image and the text
  },
  petsContainer: {
    height: 150, // Adjust as needed
    alignItems: "center",
    padding: 10,
  },
  petItem: {
    marginHorizontal: 10,
    alignItems: "center",
  },
  petImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  petName: {
    textAlign: "center",
    marginTop: 5,
  },
});
