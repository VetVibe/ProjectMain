import React, { useState } from "react";
import { View, Text, TextInput, Button, Image, TouchableOpacity, StyleSheet, Alert } from "react-native";
import TabsContainer from "../../components/TabsContainer/TabsContainer";
import { ROLES_TABS } from "../../constants";
import * as ImagePicker from "expo-image-picker";
import { encodeImageAsBase64 } from "../../../imageUtils";
import { clientServer } from "../../server";
import { isEmailValid, isPasswordValid } from "../../utils";
import VetSearchForm from "../../components/VetSearchForm/VetSearchForm";

export default function SignUpScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState("petOwner");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [id, setId] = useState("VET-");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState("");

  const handleTabPress = (tab) => {
    setActiveTab(tab);
  };

  const handleChangeID = (text) => {
    if (!text.startsWith("VET-")) {
      setId("VET-" + text);
    } else {
      setId(text);
    }
  };

  const handleRegistration = async () => {
    if (isEmailValid(email)) {
      setEmail(email);
    } else {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return;
    }
    if (isPasswordValid(password)) {
      setPassword(password);
    } else {
      Alert.alert(
        "Invalid Password",
        "Please enter a valid password: Atlest 8 characters, 1 uppercase and 1 lowercase 1 digit, 1 special chacater"
      );
      return;
    }
    if (!name || !email || !password) {
      Alert.alert("Incomplete Information", "Please fill in all required fields");
      return;
    }
    const newUser = {
      name,
      email,
      password,
      phoneNumber,
      profilePicture: profilePicture,
      ...(activeTab === "vet" && {
        location: selectedCity,
        vetId: id,
        specialization: selectedSpecialization,
      }),
    };
    try {
      if (activeTab === "vet") {
        await clientServer.registerVet(newUser);
      } else {
        await clientServer.registerPetOwner(newUser);
      }
      navigation.goBack();
    } catch (error) {
      console.error("Error registering user:", error);

      // Check if the error is a 409 error indicating that the user is already registered
      if (error.response && error.response.status === 409) {
        Alert.alert("Registration failed", "This user is already registered.");
      } else {
        Alert.alert("Registration failed.");
      }
    }
  };

  const handleImagePick = async () => {
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
        // Encode the selected image as Base64
        if (result.assets && result.assets.length > 0) {
          const selectedAsset = result.assets[0];
          try {
            const base64Image = await encodeImageAsBase64(selectedAsset.uri);

            // Set the Base64 encoded image to the profile picture state
            setProfilePicture(`data:image/jpeg;base64,${base64Image}`);
          } catch (error) {
            Alert.alert("Error", "Failed to encode image as Base64");
          }
        }
      }
    } else {
      Alert.alert("Permission denied", "Permission to access the photo library was denied.");
    }
  };

  return (
    <View style={styles.container}>
      <TabsContainer tabs={ROLES_TABS} activeTab={activeTab} handleTabPress={handleTabPress} />

      <TextInput autoCorrect={false} style={styles.input} placeholder="Name" value={name} onChangeText={setName} />

      <TextInput
        autoCorrect={false}
        autoCapitalize="none"
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <TextInput
        autoCorrect={false}
        autoCapitalize="none"
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
      />

      {activeTab === "vet" ? (
        <>
          <TextInput style={styles.input} placeholder="Veterinarian ID" value={id} onChangeText={handleChangeID} />
          <VetSearchForm setSelectedLocation={setSelectedCity} setSelectedSpecialization={setSelectedSpecialization} />
        </>
      ) : null}

      <TouchableOpacity style={styles.button} onPress={handleImagePick}>
        <Text style={styles.buttonText}>Choose Profile Picture</Text>
      </TouchableOpacity>
      {profilePicture && <Image source={{ uri: profilePicture }} style={styles.profileImage} />}

      <Button title="Register" onPress={handleRegistration} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    borderRadius: 5,
    width: "100%",
  },
  pickerButton: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    justifyContent: "center",
    paddingLeft: 0,
    marginBottom: 10,
    width: "100%",
  },
  modalContainer: {
    flex: 5,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  picker: {
    height: 200, // Adjust the height as needed
    width: "100%",
  },

  button: {
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    width: "80%",
  },
  buttonText: {
    color: "white",
  },
  profileImage: {
    width: 100,
    height: 100,
    marginTop: 10,
    borderRadius: 5, // Adjusted border radius
  },
});
