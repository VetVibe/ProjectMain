import React, { useState, useContext, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { AuthContext } from "../../auth";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Input, Button } from "../../components";
import { FontAwesome } from "@expo/vector-icons";
import { colors, sizes } from "../../constants";
import * as ImagePicker from "expo-image-picker";
import { encodeImageAsBase64 } from "../../../imageUtils";
import { isEmailValid, isPasswordValid } from "../../utils";
import { clientServer } from "../../server";

export default function PetOwnerProfileScreen() {
  const { authState, setAuthState } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true);
  const [petOwnerDetails, setPetOwnerDetails] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [invalidInput, setInvalidInput] = useState({
    name: false,
    email: false,
    password: false,
    phoneNumber: false,
  });

  useFocusEffect(
    useCallback(() => {
      clientServer
        .getPetOwnerInfo(authState.id)
        .then((data) => {
          setPetOwnerDetails(data);
          setSelectedImage(data.profilePicture);
        })
        .catch((error) => {
          console.error("Error fetching pet owner info:", error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }, [authState.id])
  );

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
      { text: "Logout", onPress: () => handleLogout() },
    ]);
  };

  const onSave = async () => {
    if (isEmailValid(petOwnerDetails.email)) {
      try {
        const data = await clientServer.getPetOwner({ email: petOwnerDetails.email });
        if (data && data.length > 0 && data._id !== authState.id) {
          setInvalidInput((prevState) => ({ ...prevState, email: true }));
          return;
        }
      } catch (error) {
        console.error("Error checking email:", error);
      }
    } else {
      setInvalidInput((prevState) => ({ ...prevState, email: true }));
      return;
    }

    if (!isPasswordValid(petOwnerDetails.password)) {
      setInvalidInput((prevState) => ({ ...prevState, password: true }));
      return;
    }

    if (!petOwnerDetails.name || petOwnerDetails.name === "") {
      setInvalidInput((prevState) => ({ ...prevState, name: true }));
      return;
    }

    if (!petOwnerDetails.phoneNumber || petOwnerDetails.phoneNumber === "") {
      setInvalidInput((prevState) => ({ ...prevState, phoneNumber: true }));
      return;
    }

    const updatedData = {
      ...petOwnerDetails,
      profilePicture: selectedImage,
    };

    setIsLoading(true);
    await clientServer
      .updatePetOwnerInfo(authState.id, updatedData)
      .then(() => {
        setIsLoading(false);
        setIsEditing(false);
      })
      .catch((error) => {
        console.error("Error updating pet owner info:", error);
      });
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
    <KeyboardAvoidingView style={styles.screen_container} behavior="padding">
      {isLoading ? (
        <ActivityIndicator style={styles.loadingIndicator} size="large" />
      ) : (
        <View styles={styles.container}>
          <View style={styles.ownerImage}>
            <Image source={{ uri: selectedImage }} style={styles.image} />
            <TouchableOpacity style={styles.cameraIconContainer} onPress={handleImagePicker}>
              <FontAwesome name="camera" size={24} style="black" />
            </TouchableOpacity>
          </View>

          <View style={styles.basicInfo}>
            <View style={styles.header_container}>
              <Text style={styles.header_text}>Account Info</Text>
              {isEditing ? (
                <Button style={styles.edit_button} text={"Save"} onPress={onSave} />
              ) : (
                <Button style={styles.edit_button} text={"Edit"} onPress={() => setIsEditing(true)} />
              )}
            </View>

            <View style={styles.input_container}>
              <Input
                autoCapitalize="words"
                autoComplete="name"
                placeholder="Name"
                value={petOwnerDetails.name}
                onChangeText={(text) => setPetOwnerDetails({ ...petOwnerDetails, name: text })}
                error={invalidInput.name}
                errorMessage={"Required field"}
                editable={isEditing}
              />
              <Input
                autoComplete="email"
                autoCorrect={false}
                autoCapitalize={"none"}
                placeholder="Email"
                value={petOwnerDetails.email}
                onChangeText={(text) => setPetOwnerDetails({ ...petOwnerDetails, email: text })}
                keyboardType="email-address"
                error={invalidInput.email}
                errorMessage={
                  petOwnerDetails.email ? "Invalid email, may belong to an existing user." : "Required field"
                }
                editable={isEditing}
              />
              <Input
                autoCorrect={false}
                autoCapitalize={"none"}
                value={petOwnerDetails.password}
                placeholder="Password"
                onChangeText={(text) => setPetOwnerDetails({ ...petOwnerDetails, password: text })}
                error={invalidInput.password}
                errorMessage={
                  petOwnerDetails.password
                    ? "Atlest 8 characters, 1 uppercase and 1 lowercase 1 digit, 1 special chacater"
                    : "Required field"
                }
                secure
                editable={isEditing}
              />
              <Input
                placeholder="Phone Number"
                value={petOwnerDetails.phoneNumber}
                onChangeText={(text) => setPetOwnerDetails({ ...petOwnerDetails, phoneNumber: text })}
                keyboardType="phone-pad"
                error={invalidInput.phoneNumber}
                errorMessage={"Required field"}
                editable={isEditing}
              />
            </View>
          </View>

          <Button text={"Logout"} style={styles.logout_button} onPress={LogoutClick} />
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen_container: { flex: 1, backgroundColor: colors.white },
  container: {
    paddingHorizontal: 24,
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    color: colors.primary,
  },
  header_container: {
    alignItems: "center",
    marginVertical: 12,
    padding: 16,
    borderRadius: 20,
  },
  header_text: {
    fontSize: sizes.h3,
    fontWeight: "bold",
  },
  ownerImage: {
    position: "relative",
    marginTop: 60,
  },
  image: {
    height: 200,
    resizeMode: "cover",
  },
  cameraIconContainer: {
    position: "absolute",
    alignSelf: "flex-end",
    backgroundColor: "transparent",
    padding: 20,
  },
  edit_button: {
    container: {
      alignSelf: "flex-end",
    },
    text: {
      color: colors.secondary,
      fontSize: sizes.body1,
    },
  },
  basicInfo: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  input_container: {
    marginHorizontal: 30,
  },
  logout_button: {
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
