import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { COLORS, FONTS } from "../../constants";
import { MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import { TextInput } from "react-native";

export default function EditPetOwnerProfileScreen({ route, navigation }) {
  const [petOwnerDetails, setPetOwnerDetails] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);

  const petOwnerId = route.params.petOwnerId;

  useEffect(() => {
    const fetchPetOwnerDetails = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:3000/petOwner/${petOwnerId}`
        );
        setPetOwnerDetails(data);
        setSelectedImage(data.profilePicture);
      } catch (e) {
        Alert.alert(e.message);
      }
    };
    fetchPetOwnerDetails();
  }, [petOwnerId]);

  const handleChange = (inputIdentifier, newValue) => {
    // Allow changing only email, name, password, and profilePicture
    if (
      ["email", "name", "password", "profilePicture"].includes(inputIdentifier)
    ) {
      setPetOwnerDetails((prevUserInput) => {
        return {
          ...prevUserInput,
          [inputIdentifier]: newValue,
        };
      });
    }
  };

  const saveChanges = async () => {
    try {
      // Send only the necessary data to the server
      const updatedData = {
        email: petOwnerDetails.email,
        name: petOwnerDetails.name,
        password: petOwnerDetails.password,
        profilePicture: selectedImage,
      };

      await axios.put(
        `http://localhost:3000/petOwner/updateInfo/${petOwnerId}`,
        {
          updatedData,
        }
      );

      navigation.goBack();
    } catch (error) {
      console.error(
        `Error during updating pet owner ${petOwnerId} details:`,
        error
      );
    }
  };

  const handleImagePicker = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status === "granted") {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 4],
        quality: 1,
      });

      if (!result.canceled) {
        setSelectedImage(result.assets[0].uri);
      }
    } else {
      Alert.alert(
        "Permission denied",
        "Permission to access the photo library was denied."
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView>
          <View style={styles.imageContainer}>
            <TouchableOpacity onPress={handleImagePicker}>
              {selectedImage !== null && selectedImage !== "" ? (
                <Image
                  source={{ uri: selectedImage }}
                  style={styles.profileImage}
                />
              ) : (
                <View style={styles.profileImagePlaceholder}>
                  <Text style={styles.placeholderText}>Select an Image</Text>
                </View>
              )}
              <View style={styles.cameraIcon}>
                <MaterialIcons
                  name="photo-camera"
                  size={32}
                  color={COLORS.primary}
                />
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{petOwnerDetails.email}</Text>
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Name:</Text>
            <TextInput
              style={styles.textInput}
              value={petOwnerDetails.name}
              onChangeText={(text) => handleChange("name", text)}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password:</Text>
            <TextInput
              style={styles.textInput}
              value={petOwnerDetails.password}
              onChangeText={(text) => handleChange("password", text)}
            />
          </View>
          <TouchableOpacity style={styles.saveButton} onPress={saveChanges}>
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingHorizontal: 18,
  },
  imageContainer: {
    alignItems: "center",
    marginVertical: 10,
  },
  profileImage: {
    height: 170,
    width: 170,
    borderRadius: 5,
    borderWidth: 3,
    borderColor: COLORS.primary,
  },
  cameraIcon: {
    position: "absolute",
    bottom: 0,
    right: 10,
    zIndex: 9999,
  },
  inputContainer: {
    flexDirection: "column",
    marginBottom: 6,
  },
  label: {
    ...FONTS.body4,
    color: COLORS.gray,
    marginBottom: 4,
  },
  value: {
    ...FONTS.body3,
    marginBottom: 8,
  },
  textInput: {
    height: 44,
    width: "100%",
    borderColor: COLORS.secondaryGray,
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 6,
    justifyContent: "center",
    paddingLeft: 8,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    height: 44,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  saveButtonText: {
    ...FONTS.body3,
    color: COLORS.white,
  },
  container: {
    flex: 1,
  },
});
