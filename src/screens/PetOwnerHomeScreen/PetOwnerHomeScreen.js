import React, { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  FlatList,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/FontAwesome";
import { COLORS } from "../../constants";
import { clientServer } from "../../server";
import LoadingIndicator from "../../components/LoadingIndicator";

export default function PetOwnerHomeScreen({ navigation }) {
  const [userPets, setUserPets] = useState([]);
  const [petOwnerId, setPetOwnerId] = useState(null);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const fetchUserPetDetails = async () => {
        try {
          const id = petOwnerId || (await AsyncStorage.getItem("userId"));
          setPetOwnerId(id);

          if (id) {
            const petsInfo = await clientServer.getPetsByOwnerId(id);
            setUserPets(petsInfo?.pets || []);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setLoading(false); // Set loading to false when data fetching is complete
        }
      };

      fetchUserPetDetails();
    }, [petOwnerId])
  );
  // demo0@gmail.com Vetvibe123!

  const handleNavigateToEditProfile = () => {
    navigation.navigate("Edit Pet Profile", { petOwnerId: petOwnerId });
  };

  const handlePetSelect = (pet) => {
    navigation.navigate("Pet Profile", { petId: pet._id });
  };

  return (
    <View style={styles.container}>
      <View style={styles.addButton}>
        <TouchableOpacity onPress={handleNavigateToEditProfile}>
          <Icon name="plus" size={20} color="black" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <LoadingIndicator /> // Show loading indicator when data is being fetched
      ) : userPets?.length > 0 ? (
        <FlatList
          data={userPets}
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
          contentContainerStyle={styles.petsContainer}
        />
      ) : (
        <Text style={styles.noPetsText}>No pets in your collection</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  addButton: {
    marginTop: 20,
    alignItems: "center",
  },
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  petsContainer: {
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
  noPetsText: {
    textAlign: "center",
  },
});
