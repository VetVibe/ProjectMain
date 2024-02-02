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
import PetModal from "../../components/PetModal/PetModal"; 

import { MaterialIcons } from "@expo/vector-icons";
import { COLORS, FONTS, SIZES, images } from "../../constants";

export default function PetOwnerHomeScreen({ route, navigation }) {
  const [userPets, setUserPets] = useState([]);
  const [veterinarians, setVeterinarians] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('');


  const petOwnerId = route.params.userId;

  useEffect(() => {
    const updateUserPetDetails = async () => {
      try {
        const response = await axios.get(
          `http://10.0.2.2:3000/petOwner/${petOwnerId}/pets`
        );
        const petIds = response.data.pets;

        // Fetch details of each pet concurrently
        const fetchPetDetails = petIds.map((petId) =>
          axios
            .get(`http://10.0.2.2:3000/pet/${petId}`)
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

  
  const focusListener = navigation.addListener("focus", () => {
      updateUserPetDetails();
    });

   // Clean up the subscription when the component unmounts
  return () => {
    if (focusListener) {
      focusListener();
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
    if (selectedLocation) queryParams.append('location', selectedLocation);
    if (selectedSpecialization) queryParams.append('specialization', selectedSpecialization);

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

  const handleNavigateToEditPetOwnerProfile = () => {
    navigation.navigate("Edit Pet Owner Profile Screen", { petOwnerId: petOwnerId });
  };


  const handleNavigateToTipsScreen = () => {
    navigation.navigate("Tips Screen Pet");
  };

  const handleVetPress = (vet) => {
    // Navigate to VetHomeScreen with the selected vet's ID and pet owner's ID
    navigation.navigate("Vet Home Screen", {
      userId: vet._id,
      userType: "petOwner", // ID of the pet owner
    });
  };
  
  const handlePetSelect = (pet) => {
    // Navigate to Pet Profile Screen with the selected pet's ID
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
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Image
          source={{ uri: vet.profilePicture ? vet.profilePicture : "https://www.behance.net/gallery/189614555/VetProfile.jpg" }}
          resizeMode="cover"
          style={styles.profileImage}
        />
         <View style={[styles.availabilityIndicator, vet.isAvailable ? styles.available : styles.notAvailable]} />
         <Text style={{ marginLeft: 5 }}>
         {vet.name} - {vet.location}
        </Text>
       </View>
      </TouchableOpacity>

      ))}
      </View>
      <TouchableOpacity
        style={styles.editProfileButton}onPress={handleNavigateToEditPetOwnerProfile}>
        <MaterialIcons name="edit" size={24} color={COLORS.white} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.tipsButton} onPress={handleNavigateToTipsScreen}>
        <MaterialIcons
          name="my-library-books"
          size={24}
          color={COLORS.white}
        />
      </TouchableOpacity>
      <TouchableOpacity style={styles.logoutButton} onPress={LogoutClick}>
        <MaterialIcons name="logout" size={24} color={COLORS.white} />
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
  searchSection: {
    paddingTop: 90, // Added top padding to push the entire section down
  },
  vetItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  availabilityIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginLeft: 5,
  },
  available: {
    backgroundColor: '#00FF00',
  },
  notAvailable: {
    backgroundColor: 'red',
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
  profileImage: {
      height: 60, // Adjust the size as needed
      width: 60, // Adjust the size as needed
      borderRadius: 20, // Make it round
      marginRight: 15, // Add some spacing between the image and the text
    },
    petsContainer: {
      height: 150, // Adjust as needed
      alignItems: 'center',
      padding: 10,
    },
    petItem: {
      marginHorizontal: 10,
      alignItems: 'center',
    },
    petImage: {
      width: 100,
      height: 100,
      borderRadius: 50,
    },
    petName: {
      textAlign: 'center',
      marginTop: 5,
    },
});