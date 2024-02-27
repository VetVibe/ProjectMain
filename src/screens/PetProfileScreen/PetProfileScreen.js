import React, { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { FontAwesome, MaterialIcons, MaterialCommunityIcons, Fontisto } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { encodeImageAsBase64 } from "../../../imageUtils";
import { colors, sizes } from "../../constants";
import { clientServer } from "../../server";
import { Button } from "../../components";

export default function PetProfileScreen({ route, navigation }) {
  const [isLoading, setIsLoading] = useState(true);
  const [pet, setPet] = useState({});
  const petId = route.params.petId;

  useFocusEffect(
    useCallback(() => {
      clientServer
        .getPetDetails(petId)
        .then((pet) => {
          setPet(pet);
        })
        .finally(() => {
          setIsLoading(false);
        })
        .catch((error) => {
          console.error(error);
        });
    }, [petId])
  );

  const handleDeletePet = async () => {
    try {
      await clientServer.deletePet(petId);
      navigation.goBack();
    } catch (error) {
      console.error(error);
    }
  };
  const onDeletePet = async () => {
    Alert.alert("Delete Pet", "Are you sure you want to delete pet?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      { text: "Delete", onPress: () => handleDeletePet() },
    ]);
  };

  const renderChip = (item) => {
    return (
      <View style={styles.chip_container}>
        <Text style={styles.chips}>{item}</Text>
      </View>
    );
  };

  const onEditPet = (section) => {
    navigation.navigate("Edit Pet", { pet: pet, isBasic: section === "basic" });
  };

  const handleImagePicker = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status === "granted") {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets.length > 0) {
        const selectedAsset = result.assets[0];
        try {
          const base64Image = await encodeImageAsBase64(selectedAsset.uri);
          setPet({ ...pet, imgSrc: `data:image/jpeg;base64,${base64Image}` });
          await clientServer.updatePetInfo(petId, { ...pet, imgSrc: `data:image/jpeg;base64,${base64Image}` });
        } catch (error) {
          Alert.alert("Error", "Failed to encode image as Base64");
        }
      }
    } else {
      Alert.alert("Permission denied", "Permission to access the photo library was denied.");
    }
  };

  return (
    <ScrollView>
      {isLoading ? (
        <ActivityIndicator style={styles.loadingIndicator} size="large" />
      ) : (
        <View style={styles.container}>
          <View style={styles.petImage}>
            <Image source={{ uri: pet.imgSrc }} style={styles.image} />
            <TouchableOpacity style={styles.cameraIconContainer} onPress={handleImagePicker}>
              <FontAwesome name="camera" size={24} style="black" />
            </TouchableOpacity>
          </View>

          <View style={styles.basicInfo}>
            <View style={styles.header_container}>
              <Text style={styles.header_text}>Basic Info</Text>
              <Button style={styles.edit_button} text={"Edit"} onPress={() => onEditPet("basic")} />
            </View>

            <View style={styles.detail_container}>
              <View style={styles.item}>
                <MaterialIcons name="pets" size={24} style={styles.icon_color} />
                <View style={styles.item_content}>
                  <Text style={styles.item_header}>Name</Text>
                  <Text style={styles.item_value}>{pet.name}</Text>
                </View>
              </View>

              <View style={styles.item}>
                <MaterialCommunityIcons name="unicorn" size={24} style={styles.icon_color} />
                <View style={styles.item_content}>
                  <Text style={styles.item_header}>Species</Text>
                  <Text style={styles.item_value}>{pet.species}</Text>
                </View>
              </View>

              <View style={styles.item}>
                <Fontisto name="intersex" size={24} style={styles.icon_color} />
                <View style={styles.item_content}>
                  <Text style={styles.item_header}>Gender</Text>
                  <Text style={styles.item_value}>{pet.gender}</Text>
                </View>
              </View>

              <View style={styles.item}>
                <MaterialCommunityIcons name="scale-bathroom" size={24} style={styles.icon_color} />
                <View style={styles.item_content}>
                  <Text style={styles.item_header}>Weight</Text>
                  <Text style={styles.item_value}>{`${pet.weight}  kg`} </Text>
                </View>
              </View>

              <View style={styles.item}>
                <FontAwesome name="birthday-cake" size={24} style={styles.icon_color} />
                <View style={styles.item_content}>
                  <Text style={styles.item_header}>Birthdate</Text>
                  <Text style={styles.item_value}>{new Date(pet.birthdate).toLocaleDateString()}</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.basicInfo}>
            <View style={styles.header_container}>
              <Text style={styles.header_text}>Medical Records</Text>
              <Button style={styles.edit_button} text={"Edit"} onPress={() => onEditPet("medical")} />
            </View>

            <View style={styles.detail_container}>
              <View style={styles.item}>
                <Fontisto name="injection-syringe" size={24} style={styles.icon_color} />
                <View style={styles.item_content}>
                  <Text style={styles.item_header}>Last Vaccination</Text>
                  <Text style={styles.item_value}>
                    {pet.lastVaccinationDate ? new Date(pet.lastVaccinationDate).toLocaleDateString() : "---"}
                  </Text>
                </View>
              </View>

              <View style={styles.item}>
                <Fontisto name="doctor" size={24} style={styles.icon_color} />
                <View style={styles.item_content}>
                  <Text style={styles.item_header}>Last Vet Visit</Text>
                  <Text style={styles.item_value}>
                    {pet.lastVetVisit ? new Date(pet.lastVetVisit).toLocaleDateString() : "---"}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.header_container}>
              <Text style={styles.header_text}>Medications</Text>
            </View>
            <View style={styles.chips_container}>
              <FlatList
                horizontal
                decelerationRate={"fast"}
                showsHorizontalScrollIndicator={false}
                data={pet.medications}
                renderItem={({ item }) => renderChip(item)}
                ListEmptyComponent={<Text style={styles.text}>No medications</Text>}
              />
            </View>

            <View style={styles.header_container}>
              <Text style={styles.header_text}>Allergies</Text>
            </View>
            <View style={styles.chips_container}>
              <FlatList
                horizontal
                decelerationRate={"fast"}
                showsHorizontalScrollIndicator={false}
                data={pet.allergies}
                renderItem={({ item }) => renderChip(item)}
                ListEmptyComponent={<Text style={styles.text}>No allergies</Text>}
              />
            </View>
          </View>
          <Button text={"Delete Pet"} onPress={onDeletePet} style={styles.delete_pet_button} />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 16,
    backgroundColor: colors.white,
    shadowColor: colors.gray,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    elevation: 4,
    borderRadius: 20,
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    color: colors.primary,
  },
  petImage: {
    position: "relative",
  },
  image: {
    height: 200,
    resizeMode: "cover",
  },
  cameraIconContainer: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "transparent",
    padding: 5,
  },
  icon_color: {
    color: colors.primary,
  },
  edit_button: {
    container: {
      alignSelf: "flex-end",
    },
    text: {
      color: colors.primary,
      fontSize: sizes.body1,
    },
  },
  basicInfo: {
    borderBottomWidth: 1,
    borderBottomColor: colors.light_gray,
    paddingHorizontal: 16,
  },
  header_container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
  },
  header_text: {
    fontSize: sizes.h3,
    fontWeight: "bold",
  },
  detail_container: {
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 16,
    paddingHorizontal: 8,
  },
  item: {
    flex: 1,
    flexDirection: "row",
    marginVertical: 16,
  },
  item_content: {
    flex: 1,
    paddingLeft: 10,
    flexDirection: "row",
  },
  item_header: {
    flex: 1,
    fontSize: sizes.h4,
    fontWeight: "bold",
  },
  item_value: {
    flex: 1,
    fontSize: sizes.h4,
    marginLeft: 20,
  },
  chips_container: {
    marginVertical: 6,
  },
  chip_container: {
    borderRadius: 20,
    borderColor: colors.primary,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 6,
  },
  chips: {
    flex: 1,
    fontSize: sizes.body1,
    color: colors.primary,
    alignSelf: "flex-start",
  },
  text: {
    fontSize: sizes.h4,
    color: colors.gray,
    alignSelf: "center",
    padding: 12,
    margin: 4,
  },
  delete_pet_button: {
    container: {
      marginVertical: 12,
      padding: 8,
    },
    text: {
      textAlign: "center",
      fontSize: sizes.h3,
      color: colors.gray,
      fontWeight: "bold",
    },
  },
});
