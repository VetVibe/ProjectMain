import React, { useState } from "react";
import { View, Text, TextInput, Button, Image, TouchableOpacity, StyleSheet, Alert } from "react-native";
import axios from "axios";
import TabsContainer from "../../components/TabsContainer/TabsContainer";
import { ROLES_TABS } from "../../constants";
import { StackActions } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";

export default function SignUpScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState("petOwner");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [id, setId] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [location, setLocation] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);

  const handleTabPress = (tab) => {
    setActiveTab(tab);
  };

  const handleRegistration = () => {
    const newUser =
      activeTab == "petOwner"
        ? {
            name: name,
            email: email,
            password: password,
            profilePicture: profilePicture,
          }
        : {
            name: name,
            email: email,
            password: password,
            vetId: id,
            phoneNumber: phoneNumber,
            location: location,
            specialization: specialization,
            profilePicture: profilePicture,
          };

    const postUrl =
      activeTab == "petOwner"
        ? "http://localhost:3000/petOwner/register"
        : "http://localhost:3000/veterinarian/register";

    // If registering as a veterinarian, check if the vet ID is valid first
    if (activeTab == "vet") {
      axios
        .get(`http://localhost:3000/veterinarianId/checkId/${id}`)
        .then((response) => {
          if (response.data.isValid) {
            // Vet ID is valid, proceed with registration
            performRegistration(newUser, postUrl);
          } else {
            // Vet ID is not valid, show an error message
            Alert.alert("Invalid Veterinarian ID", "Please enter a valid Veterinarian ID : VET-XXX");
          }
        })
        .catch((error) => {
          if (error.response && error.response.status === 404) {
            // Vet ID already exists, show an error message
            Alert.alert(
              "Veterinarian ID already registered",
              "This Veterinarian ID is already associated with an account."
            );
          } else {
            // Other error occurred while checking vet ID, show a general error message
            console.error("Error checking vet ID:", error);
            Alert.alert("Error", "An error occurred while checking Veterinarian ID");
          }
        });
    } else {
      // For pet owners, directly proceed with registration
      performRegistration(newUser, postUrl);
    }
  };

  const performRegistration = (newUser, postUrl) => {
    // Make an Axios request to register the new user
    axios
      .post(postUrl, newUser)
      .then((response) => {
        Alert.alert("Registration completed successfully");

        // Clear input fields
        setName("");
        setEmail("");
        setPassword("");
        setId("");
        setPhoneNumber("");
        setProfilePicture(null);

        navigation.goBack();
      })
      .catch((error) => {
        console.error("Error registering new user", error);

        // Check if the error is a 404 error indicating that the user (veterinarian) is already registered
        if (error.response && error.response.status === 404) {
          Alert.alert("Registration failed", "This user is already registered.");
        } else {
          // Show a generic error message for other registration failures
          Alert.alert("Registration failed.");
        }
      });
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
        // Set the selected image URI to the profile picture state
        if (result.assets && result.assets.length > 0) {
          const selectedAsset = result.assets[0];

          setProfilePicture(selectedAsset.uri);
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

      {activeTab == "vet" && (
        <>
          <TextInput style={styles.input} placeholder="Veterinarian ID" value={id} onChangeText={setId} />

          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
          />
          <TextInput style={styles.input} placeholder="Location" value={location} onChangeText={setLocation} />
          <TextInput
            style={styles.input}
            placeholder="Specialization"
            value={specialization}
            onChangeText={setSpecialization}
          />
        </>
      )}

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
  tabsContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginBottom: 20,
  },
  userType: {
    fontSize: 16,
    marginVertical: 20,
    color: "black",
  },
  selectedUserType: {
    fontWeight: "bold",
    color: "black",
    backgroundColor: "#ff8c00",
    padding: 15,
    marginLeft: 10,
    marginRight: 10,
    alignItems: "center",
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
  button: {
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: "white",
  },
  profileImage: {
    width: 100,
    height: 100,
    marginTop: 10,
    borderRadius: 50,
  },
});
