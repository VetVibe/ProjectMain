import React, { useState, useEffect, useContext } from "react";
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
import { AuthContext } from "../../auth";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons } from "@expo/vector-icons";
import { TextInput } from "react-native";
import { encodeImageAsBase64 } from "../../../imageUtils";
import { isPasswordValid } from "../../utils";
import { TITELS } from "../../constants";
import { clientServer } from "../../server";

export default function PetOwnerProfileScreen() {
  const { authState, setAuthState } = useContext(AuthContext);
  const [petOwnerDetails, setPetOwnerDetails] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchPetOwnerDetails = async () => {
      const data = await clientServer.getPetOwnerInfo(authState.id);
      setPetOwnerDetails(data);
      setSelectedImage(data.profilePicture);
    };
    fetchPetOwnerDetails();
  }, []);

  const handleChange = (inputIdentifier, newValue) => {
    setPetOwnerDetails((prevUserInput) => {
      return {
        ...prevUserInput,
        [inputIdentifier]: newValue,
      };
    });
  };

  const handleLogout = async () => {
    setAuthState({ id: "", signedIn: false, userType: "" });
    console.log("Pet owner logged out: cleared auth.");
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
    await clientServer.updatePetOwnerInfo(authState.id, updatedData);
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
    <SafeAreaView>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
        {!isEditing ? (
          <TouchableOpacity onPress={() => setIsEditing(true)}>
            <MaterialIcons name="edit" size={24} />
          </TouchableOpacity>
        ) : null}
        <View>
          <TouchableOpacity onPress={handleImagePicker}>
            {selectedImage !== null && selectedImage !== "" ? (
              <Image source={{ uri: selectedImage }} />
            ) : (
              <View>
                <Text>Select an Image</Text>
              </View>
            )}
            <View>
              <MaterialIcons name="photo-camera" size={32} />
            </View>
          </TouchableOpacity>
        </View>

        <ScrollView>
          <View>
            <View>
              <Text>{TITELS["name"]}</Text>
              <TextInput
                value={petOwnerDetails.name}
                editable={isEditing}
                selectTextOnFocus={isEditing}
                onChangeText={(text) => handleChange("name", text)}
              />
            </View>
            <View>
              <Text>{TITELS["email"]}</Text>
              <TextInput value={petOwnerDetails.email} editable={false} selectTextOnFocus={false} />
            </View>
            <Text>{TITELS["password"]}</Text>
            <TextInput
              autoCorrect={false}
              autoCapitalize="none"
              placeholder={TITELS["password"]}
              value={petOwnerDetails.password}
              editable={isEditing}
              selectTextOnFocus={isEditing}
              onChangeText={(text) => handleChange("password", text)}
            />
            <Text>{TITELS["phoneNumber"]}</Text>
            <TextInput
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
              <TouchableOpacity onPress={saveChanges}>
                <Text>Save Changes</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setIsEditing(false)}>
                <Text>Cancel</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity onPress={LogoutClick}>
              <Text>Log out</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
