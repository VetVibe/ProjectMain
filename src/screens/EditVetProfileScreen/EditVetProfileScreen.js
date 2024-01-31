import React, { useState } from "react";
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
import { imagesDataURL } from "../../constants/data";
import InputContainer from "../../components/InputContainer/InputContainer";
import { mapVetDetailsToSchema, mapVetDetails } from "../../utils";
import { useEffect } from "react";
import axios from "axios";
import { VetEditUrls } from "../../context/vetApi";
import { useVetPage } from "../../context/VetDetailsContext";

// export const VetEditUrls = {
//   info: (id) => `http://10.0.2.2:3000/veterinarian/${id}`,
// };

export default function EditVetProfileScreen({ route, navigation }) {
  const [selectedImage, setSelectedImage] = useState(imagesDataURL[0]);
  const {vetDetails, updateVetDetails,fetchVetDetails} = useVetPage()

  const vetId = route.params.vetId;

  useEffect(() => {
    if(vetId !== vetDetails?._id) {
      fetchVetDetails(vetId);
    }
  }, [vetId]);

  const handleImageSelection = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const handleChange = (inputIdentifier, newValue) => {
    updateVetDetails((prevUserInput) => {
      return {
        ...prevUserInput,
        [inputIdentifier]: newValue,
      };
    });
  };

  const saveChanges = () => {
    const updatedData = {
      ...vetDetails,
      profilePicture: selectedImage,
    };
    const vetDetailsSchema = mapVetDetailsToSchema(updatedData);

    axios
      .put(`http://10.0.2.2:3000/veterinarian/updateInfo/${vetId}`, { updatedData: vetDetailsSchema })
      .then((response) => {
        updateVetDetails(vetDetailsSchema)
        navigation.goBack();
      })
      .catch((error) => {
        console.error(`Error during updating vet ${vetId} details:`, error);
      });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
        <ScrollView>
          <View style={styles.imageContainer}>
            <TouchableOpacity onPress={handleImageSelection}>
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