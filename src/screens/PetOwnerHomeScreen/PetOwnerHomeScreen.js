import React, { useState, useCallback, useContext } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { AuthContext } from "../../auth";
import { View, Text, TouchableOpacity, StyleSheet, Image, FlatList } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { COLORS } from "../../constants";
import { clientServer } from "../../server";

export default function PetOwnerHomeScreen() {
  const navigation = useNavigation();
  const { authState } = useContext(AuthContext);
  const [userPets, setUserPets] = useState([]);

  useFocusEffect(
    useCallback(() => {
      const fetchUserPetDetails = async () => {
        try {
          const petsInfo = await clientServer.getPetsByOwnerId(authState.id);
          setUserPets(petsInfo?.pets || []);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      fetchUserPetDetails();
    }, [authState.id])
  );

  const handleNavigateToEditProfile = () => {
    navigation.navigate("Edit Pet Profile");
  };

  const handlePetSelect = (pet) => {
    navigation.navigate("Pet Profile", { petId: pet._id });
  };

  return (
    <>
      <View style={styles.addButton}>
        <TouchableOpacity onPress={handleNavigateToEditProfile}>
          <Icon name="plus" size={20} color="black" />
        </TouchableOpacity>
      </View>

      <View style={styles.petsContainer}>
        {userPets?.length > 0 ? (
          <FlatList
            data={userPets}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handlePetSelect(item)} style={styles.petItem}>
                <Image source={{ uri: item.imgSrc }} style={styles.petImage} />
                <Text style={styles.petName}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
        ) : (
          <Text>No pets in your collection</Text>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  addButton: {
    marginTop: 20, // Add margin top to move the button down
  },
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
    paddingTop: 10, // Added top padding to push the entire section down
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
