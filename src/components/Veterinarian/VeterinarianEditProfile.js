import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";

const VeterinarianEditProfile = ({ route, navigation }) => {
  const { vetId } = route.params || {};
  const [vetData, setVetData] = useState({
    name: "",
    password: "",
    profilePicture: "",
    about: "",
    phoneNumber: "",
  });

  useEffect(() => {
    const fetchVetInformation = async () => {
      try {
        if (!vetId) {
          console.error("Veterinarian ID is undefined");
          return;
        }

        const response = await axios.get(
          `http://localhost:3000/veterinarian/${vetId}`
        );
        const vetData = response.data;
        setVetData(vetData);
      } catch (error) {
        console.error("Error fetching vet information", error);
        console.log("Axios response:", error.response);
      }
    };

    fetchVetInformation();
  }, [vetId]);

  const updatePhoneNumber = async (newPhoneNumber) => {
    try {
      await axios.put(
        `http://localhost:3000/veterinarian/${vetId}/phoneNumber`,
        {
          phoneNumber: newPhoneNumber,
        }
      );

      // Handle success, show an alert, etc.
      Alert.alert(
        "Phone Number Updated",
        "Your phone number has been updated successfully"
      );
    } catch (error) {
      console.error("Error updating phone number:", error);
      // Handle error, show an alert, etc.
      Alert.alert("Error", "Failed to update phone number. Please try again.");
    }
  };

  const pickProfilePicture = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status === "granted") {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
          const selectedAsset = result.assets[0];

          setVetData((prevData) => ({
            ...prevData,
            profilePicture: selectedAsset.uri,
          }));
        }
      } else {
        Alert.alert(
          "Permission denied",
          "Permission to access the photo library was denied."
        );
      }
    } catch (error) {
      console.error("Error picking profile picture", error);
      Alert.alert("Error", "Failed to pick profile picture. Please try again.");
    }
  };

  const saveChanges = async (field) => {
    try {
      const updatedData = {
        [field]: vetData[field],
      };

      await axios.put(
        `http://localhost:3000/veterinarian/${vetId}/${field.toLowerCase()}`,
        updatedData
      );

      Alert.alert(
        "Profile Updated",
        `${field.charAt(0).toUpperCase() + field.slice(1)} updated successfully`
      );
    } catch (error) {
      console.error(`Error updating ${field}`, error);
      Alert.alert(`Error`, `Failed to update ${field}. Please try again.`);
    }
  };

  const saveProfilePicture = async () => {
    try {
      const updatedData = {
        profilePicture: vetData.profilePicture,
      };

      await axios.put(
        `http://localhost:3000/veterinarian/${vetId}/profilePicture`,
        updatedData
      );

      Alert.alert(
        "Profile Picture Updated",
        "Profile picture updated successfully"
      );
    } catch (error) {
      console.error("Error updating profile picture", error);
      Alert.alert(
        "Error",
        "Failed to update profile picture. Please try again."
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Profile</Text>

      <TouchableOpacity onPress={() => pickProfilePicture()}>
        <View style={styles.profilePictureContainer}>
          {vetData.profilePicture ? (
            <Image
              style={styles.profilePicture}
              source={{ uri: vetData.profilePicture }}
            />
          ) : (
            <Text style={styles.profilePictureText}>
              Pick a Profile Picture
            </Text>
          )}
        </View>
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="Name"
        value={vetData.name}
        onChangeText={(text) => setVetData({ ...vetData, name: text })}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry={true}
        value={vetData.password}
        onChangeText={(text) => setVetData({ ...vetData, password: text })}
      />

      <TextInput
        style={styles.input}
        placeholder="About"
        value={vetData.about}
        onChangeText={(text) => setVetData({ ...vetData, about: text })}
      />

      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        value={vetData.phoneNumber}
        onChangeText={(text) => setVetData({ ...vetData, phoneNumber: text })}
      />

      <Button title="Save Name" onPress={() => saveChanges("name")} />
      <Button title="Save Password" onPress={() => saveChanges("password")} />
      <Button title="Save About" onPress={() => saveChanges("about")} />
      <Button
        title="Save Phone Number"
        onPress={() => updatePhoneNumber(vetData.phoneNumber)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  profilePictureContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  profilePictureText: {
    fontSize: 16,
    color: "blue",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 8,
    padding: 8,
  },
});

export default VeterinarianEditProfile;
