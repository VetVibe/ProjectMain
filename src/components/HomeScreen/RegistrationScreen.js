import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from "axios";
import * as ImagePicker from "expo-image-picker";

export default function RegistrationScreen({ navigation }){
  const [isPetOwner, setIsPetOwner] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [id, setId] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);

  const handleRegistration = () => {
    const newUser = isPetOwner ? {
      name: name,
      email: email,
      password: password,
      profilePicture: profilePicture,
    } : {
      name: name,
      email: email,
      password: password,
      vetId: id,
      phoneNumber: phoneNumber,
      profilePicture: profilePicture,
    };

    const postUrl = isPetOwner ? "http://localhost:3000/register" : "http://localhost:3000/registerVeterinarian";

    // Make an Axios request to register the new user
    axios
      .post(postUrl, newUser)
      .then((response) => {
        console.log(response.data);
        Alert.alert("Registration completed successfully");
        // Clear input fields
        setName("");
        setEmail("");
        setPassword("");
        setId("");
        setPhoneNumber("");
        setProfilePicture(null);
        
        navigation.navigate("Home");
      })
      .catch((error) => {
        console.error("Error registering new user", error);
        // Show an alert for failed registration and log the error
        Alert.alert("Registration failed.");
      });
  };

  const handleImagePick = async () =>{
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
      Alert.alert(
        "Permission denied",
        "Permission to access the photo library was denied."
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={() => setIsPetOwner(true)}>
          <Text style={[styles.userType, isPetOwner && styles.selectedUserType]}>Pet Owner</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setIsPetOwner(false)}>
          <Text style={[styles.userType, !isPetOwner && styles.selectedUserType]}>Veterinarian</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {!isPetOwner && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Veterinarian ID"
            value={id}
            onChangeText={setId}
          />

          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
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
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 20,
  },
  userType: {
    fontSize: 16,
    marginVertical: 20,
    color: 'black',
  },
  selectedUserType: {
    fontWeight: 'bold',
    color: 'black',
    backgroundColor: "#ff8c00",
    padding: 15,
    marginLeft: 10,
    marginRight: 10, 
    alignItems: "center",
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    borderRadius: 5,
    width: '100%',
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
  },
  profileImage: {
    width: 100,
    height: 100,
    marginTop: 10,
    borderRadius: 50,
  },
});