import React, { useState, useEffect } from "react";
import {
  View,
  Button,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { StackActions } from "@react-navigation/native";
import TabsContainer from "../../components/TabsContainer/TabsContainer";
import InputContainer from "../../components/InputContainer/InputContainer";
import { mapPetDetails, mapPetDetailsToSchema } from "../../utils";
import { PET_PROFILE_TABS } from "../../constants";
import axios from "axios";
import { encodeImageAsBase64 } from "../../../imageUtils";

const EditPetProfileScreen = ({ route, navigation }) => {
  const [activeTab, setActiveTab] = useState("petInfo"); // petInfo or medicalHistory
  const [petBasicInfoInput, setPetBasicInfoInput] = useState({});
  const [petMedicalInfoInput, setMedicalInfoInput] = useState({});
  const [petImage, setPetImage] = useState(
    "https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/65761296352685.5eac4787a4720.jpg"
  );

  const petId = route.params.petId;
  const petOwnerId = route.params.petOwnerId;

  useEffect(() => {
    if (petId) {
      axios
        .get(`http://localhost:3000/pet/${petId}`)
        .then((response) => {
          const mapedPetDetails = mapPetDetails(response.data);
          setPetBasicInfoInput(mapedPetDetails.basicInfo);
          setMedicalInfoInput(mapedPetDetails.medicalInfo);
          setPetImage(mapedPetDetails.imgSrc);
        })
        .catch((error) => {
          console.error("Error fetching pet details:", error);
        });
    } else {
      const mapedPetDetails = mapPetDetails();
      setPetBasicInfoInput(mapedPetDetails.basicInfo);
      setMedicalInfoInput(mapedPetDetails.medicalInfo);
      setPetImage(mapedPetDetails.imgSrc);
    }
  }, [petId]);

  const handleTabPress = (tab) => {
    setActiveTab(tab);
  };

  function handleChange(inputIdentifier, newValue, activeTab) {
    if (activeTab == "petInfo") {
      setPetBasicInfoInput((prevUserInput) => {
        return {
          ...prevUserInput,
          [inputIdentifier]: newValue,
        };
      });
    } else if (activeTab == "medicalHistory") {
      setMedicalInfoInput((prevUserInput) => {
        return {
          ...prevUserInput,
          [inputIdentifier]: newValue,
        };
      });
    }
  }

  const saveChanges = () => {
    const updatedData = {
      basicInfo: { ...petBasicInfoInput },
      medicalInfo: { ...petMedicalInfoInput },
      imgSrc: petImage,
    };
    const petDetailsSchema = mapPetDetailsToSchema(updatedData);

    if (petId) {
      axios
        .put(`http://localhost:3000/pet/updateInfo/${petId}`, {
          updatedData: petDetailsSchema,
        })
        .then((response) => {
          navigation.goBack();
        })
        .catch((error) => {
          console.error(`Error during updating pet ${petId} details:`, error);
        });
    } else if (petOwnerId) {
      axios
        .post(
          `http://localhost:3000/pet/addPet/${petOwnerId}`,
          petDetailsSchema
        )
        .then((response) => {
          const petId = response.data.petId;
          navigation.dispatch(
            StackActions.replace("Pet Profile Screen", { petId: petId })
          );
        })
        .catch((error) => {
          console.log("Error during adding pet", error);
        });
    }
  };

  const handleImagePicker = async () => {
    // Request permission to access the device's photo library
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status === "granted") {
      // Launch the image picker
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        // Set the selected image URI to the profile picture state
        if (result.assets && result.assets.length > 0) {
          const selectedAsset = result.assets[0];
          const base64Image = await encodeImageAsBase64(selectedAsset.uri);

          setPetImage(`data:image/jpeg;base64,${base64Image}`);
        }
      }
    } else {
      Alert.alert(
        "Permission denied",
        "Permission to access the photo library was denied."
      );
    }
  };

  return (
    <View style={styles.container}>
      <TabsContainer
        tabs={PET_PROFILE_TABS}
        activeTab={activeTab}
        handleTabPress={handleTabPress}
      />

      <ScrollView style={{ flexGrow: 1 }}>
        {activeTab === "petInfo" && (
          <View>
            <TouchableOpacity onPress={handleImagePicker}>
              <Image source={{ uri: petImage }} style={styles.petImage} />
            </TouchableOpacity>
            <InputContainer
              details={petBasicInfoInput}
              onChangeText={(key, text) => handleChange(key, text, activeTab)}
            />
          </View>
        )}

        {activeTab === "medicalHistory" && (
          <InputContainer
            details={petMedicalInfoInput}
            onChangeText={(key, text) => handleChange(key, text, activeTab)}
          />
        )}
      </ScrollView>
      <Button title="Save Changes" onPress={saveChanges} />
    </View>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  container: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "flex-start",
    padding: 20,
    backgroundColor: "#FFFFFF", // White
  },
  tabsContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomColor: "#FFA500", // Bright orange
  },
  tabButtonText: {
    fontSize: 16,
  },
  petImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
  },
  datePickerContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
});

export default EditPetProfileScreen;
