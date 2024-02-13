import React, { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import DetailsContainer from "../../components/DetailsContainer/DetailsContainer";
import { MaterialIcons } from "@expo/vector-icons";
import { mapPetDetails } from "../../utils";
import { TITELS } from "../../constants";
import { clientServer } from "../../server";
import LoadingIndicator from "../../components/LoadingIndicator";

export default function PetProfileScreen({ route, navigation }) {
  const [petDetails, setPetDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const petId = route.params.petId;

  useFocusEffect(
    useCallback(() => {
      const fetchPetDetails = async () => {
        try {
          const mappedPetDetails = mapPetDetails(
            await clientServer.getPetDetails(petId)
          );
          setPetDetails(mappedPetDetails);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching data:", error);
          setLoading(false);
        }
      };

      fetchPetDetails();
    }, [petId])
  );

  const navigateToEditScreen = useCallback(() => {
    navigation.navigate("Edit Pet Profile", { petId: petId });
  }, [navigation, petId]);

  const deletePet = useCallback(async () => {
    try {
      await clientServer.deletePet(petId);
      navigation.goBack();
    } catch (error) {
      console.error("Error deleting pet:", error);
    }
  }, [navigation, petId]);

  if (loading) {
    return <LoadingIndicator />;
  }

  return (
    <View>
      <TouchableOpacity
        onPress={navigateToEditScreen}
        style={styles.editButton}
      >
        <MaterialIcons name="edit" size={24} color="black" />
      </TouchableOpacity>

      <TouchableOpacity onPress={deletePet} style={styles.deleteButton}>
        <MaterialIcons name="delete" size={24} color="black" />
      </TouchableOpacity>

      <Image source={{ uri: petDetails.imgSrc }} style={styles.petImage} />
      <ScrollView>
        <View style={styles.detailsContainer}>
          {Object.entries(petDetails).map(([section, sectionDetails]) => {
            if (section === "imgSrc") {
              return null;
            }

            return (
              <View key={section} style={styles.sectionTitle}>
                <Text style={styles.sectionTitleText}>{section}</Text>
                {Object.entries(sectionDetails).map(([key, value]) => (
                  <DetailsContainer
                    key={key}
                    title={TITELS[key]}
                    value={value}
                  />
                ))}
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  editButton: {
    alignSelf: "flex-end",
    marginTop: 10,
  },
  deleteButton: {
    alignSelf: "flex-end",
    marginTop: 10,
  },
  petImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: "center",
    marginTop: 20,
  },
  detailsContainer: {
    backgroundColor: "white",
    borderRadius: 8,
    marginTop: 10,
    padding: 10,
  },
  sectionTitle: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginBottom: 10,
    paddingBottom: 5,
  },
  sectionTitleText: {
    fontSize: 20,
    fontWeight: "bold",
    paddingVertical: 10,
  },
});
