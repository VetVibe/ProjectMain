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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { COLORS, FONTS } from "../../constants";
import { MaterialIcons } from "@expo/vector-icons";
import { TextInput } from "react-native";
import { encodeImageAsBase64 } from "../../../imageUtils";
import { isPasswordValid } from "../../utils";
import { TITELS } from "../../constants";
import { clientServer } from "../../server";

export default function PetOwnerProfileScreen({ navigation }) {
  const [petOwnerId, setPetOwnerId] = useState(null);
  const [petOwnerDetails, setPetOwnerDetails] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchPetOwnerDetails = async () => {
      const id = await AsyncStorage.getItem("userId");
      setPetOwnerId(id || null);
      if (id) {
        const data = await clientServer.getPetOwnerInfo(id);
        setPetOwnerDetails(data);
        setSelectedImage(data.profilePicture);
      }
    };
    fetchPetOwnerDetails();
  }, [petOwnerId]);

  const handleChange = (inputIdentifier, newValue) => {
    setPetOwnerDetails((prevUserInput) => {
      return {
        ...prevUserInput,
        [inputIdentifier]: newValue,
      };
    });
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem("userId");
    await AsyncStorage.removeItem("userType");
    console.log("Pet owner logged out: cleared auth token.");
    navigation.replace("Home");
  };

  const LogoutClick = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      { text: "OK", onPress: () => handleLogout() },
    ]);
  };

  const saveChanges = async () => {
    if (isPasswordValid(password)) {
      setPassword(password);
    } else {
      Alert.alert(
        "Invalid Password",
        "Please enter a valid password: Atlest 8 characters, 1 uppercase and 1 lowercase 1 digit, 1 special chacater"
      );
      return;
    }

    if (!petOwnerDetails.name || petOwnerDetails.name === "") {
      Alert.alert("Incomplete Information", "Please fill in all required fields: Cannot leave name empty.");
      return;
    }

    const updatedData = {
      email: petOwnerDetails.email,
      name: petOwnerDetails.name,
      profilePicture: selectedImage,
    };
    await clientServer.updatePetOwnerInfo(petOwnerId, updatedData);

    navigation.goBack();
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
          setSelectedImage(`data:image/jpeg;base64,${base64Image}`);
        } catch (error) {
          Alert.alert("Error", "Failed to encode image as Base64");
        }
      }
    } else {
      Alert.alert("Permission denied", "Permission to access the photo library was denied.");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
        {!isEditing ? (
          <TouchableOpacity style={styles.editProfileButton} onPress={() => setIsEditing(true)}>
            <MaterialIcons name="edit" size={24} color={COLORS.white} />
          </TouchableOpacity>
        ) : null}
        <View style={styles.imageContainer}>
          <TouchableOpacity onPress={handleImagePicker}>
            {selectedImage !== null && selectedImage !== "" ? (
              <Image source={{ uri: selectedImage }} style={styles.profileImage} />
            ) : (
              <View style={styles.profileImagePlaceholder}>
                <Text style={styles.placeholderText}>Select an Image</Text>
              </View>
            )}
            <View style={styles.cameraIcon}>
              <MaterialIcons name="photo-camera" size={32} color={COLORS.primary} />
            </View>
          </TouchableOpacity>
        </View>

        <ScrollView>
          <View style={styles.inputContainer}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{TITELS["name"]}</Text>
              <TextInput
                style={styles.textInput}
                value={petOwnerDetails.name}
                editable={isEditing}
                selectTextOnFocus={isEditing}
                onChangeText={(text) => handleChange("name", text)}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{TITELS["email"]}</Text>
              <TextInput
                style={styles.textInput}
                value={petOwnerDetails.email}
                editable={false}
                selectTextOnFocus={false}
              />
            </View>
            <Text style={styles.label}>{TITELS["password"]}</Text>
            <TextInput
              autoCorrect={false}
              autoCapitalize="none"
              style={styles.textInput}
              placeholder={TITELS["password"]}
              value={petOwnerDetails.password}
              editable={isEditing}
              selectTextOnFocus={isEditing}
              onChangeText={(text) => handleChange("password", text)}
            />
            <Text style={styles.label}>{TITELS["phoneNumber"]}</Text>
            <TextInput
              style={styles.textInput}
              placeholder={TITELS["phoneNumber"]}
              value={petOwnerDetails.phoneNumber || ""}
              editable={isEditing}
              selectTextOnFocus={isEditing}
              onChangeText={(text) => handleChange("phoneNumber", text)}
              keyboardType="phone-pad"
            />
          </View>

          {isEditing ? (
            <>
              <TouchableOpacity style={styles.saveButton} onPress={saveChanges}>
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={() => setIsEditing(false)}>
                <Text style={styles.saveButtonText}>Cancel</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity style={styles.saveButton} onPress={LogoutClick}>
              <Text style={styles.saveButtonText}>Log out</Text>
            </TouchableOpacity>
          )}
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
    color: "#CCCCCC",
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
});
