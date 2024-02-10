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
import InputContainer from "../../components/InputContainer/InputContainer";
import { mapVetDetailsToSchema, mapVetDetails } from "../../utils";
import { clientServer } from "../../server";
import { encodeImageAsBase64 } from "../../../imageUtils";

export default function EditVetProfileScreen({ route, navigation }) {
  const [vetDetails, setVetDetails] = useState({});
  const [selectedImage, setSelectedImage] = useState();

  const vetId = route.params.vetId;

  useEffect(() => {
    const fetchVetDetails = async () => {
      const data = await clientServer.getVetInfo(vetId);
      const mapedVetDetails = mapVetDetails(data);
      setVetDetails(mapedVetDetails);
      setSelectedImage(mapedVetDetails.profilePicture);
    };
    fetchVetDetails();
  }, [vetId]);

  const handleChange = (inputIdentifier, newValue) => {
    setVetDetails((prevUserInput) => {
      return {
        ...prevUserInput,
        [inputIdentifier]: newValue,
      };
    });
  };

  const saveChanges = async () => {
    const updatedData = {
      ...vetDetails,
      profilePicture: selectedImage,
    };
    const vetDetailsSchema = mapVetDetailsToSchema(updatedData);

    await clientServer.updateVetInfo(vetId, vetDetailsSchema);
  };

  const handleImagePicker = async () => {
    // Request permission to access the device's photo library
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status === "granted") {
      // Launch the image picker
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 4],
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
        <ScrollView>
          <View style={styles.imageContainer}>
            <TouchableOpacity onPress={handleImagePicker}>
              <Image source={{ uri: selectedImage }} style={styles.profileImage} />
              <View style={styles.cameraIcon}>
                <MaterialIcons name="photo-camera" size={32} color={COLORS.primary} />
              </View>
            </TouchableOpacity>
          </View>

          <InputContainer details={vetDetails} onChangeText={(key, text) => handleChange(key, text)} />
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
  textInput: {
    height: 44,
    width: "100%",
    borderColor: COLORS.secondaryGray,
    borderWidth: 1,
    borderRadius: 4,
    marginVertical: 6,
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
