import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const roleSelectors = {
  PetOwner: {
    postUrl: "http://localhost:3000/login",
    navigationScreen: "Pet Owner Home Screen",
    emailPlaceholder: "email",
  },
  Vet: {
    postUrl: "http://localhost:3000/loginv",
    navigationScreen: "Veterinarian Home Screen",
    emailPlaceholder: "Veterinarian ID",
  },
};

export default function LoginScreen({ route }) {
  const userRole = route.params.role;
  const selectors = roleSelectors[userRole];

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  // Function to handle user login
  const handleLogin = () => {
    const userData =
      userRole === "PetOwner"
        ? { email, password }
        : { vetId: email, password };

    // Send a login request to the server
    axios
      .post(selectors.postUrl, userData)
      .then((response) => {
        const token = response.data.token;
        AsyncStorage.setItem("authToken", token);
        navigation.navigate(selectors.navigationScreen);
      })
      .catch((error) => {
        if (error.response) {
          // The request was made and the server responded with a status code
          const status = error.response.status;

          if (status === 404) {
            Alert.alert("User not found");
          } else if (status === 401) {
            Alert.alert("Invalid password", "The password is incorrect.");
          } else {
            Alert.alert("Login error", "An error occurred during login.");
          }
        } else {
          // The request was made but no response was received
          Alert.alert("Network error", "Unable to connect to the server.");
        }

        console.log("Error during login", error);
      });
  };
  return (
    <View style={styles.container}>
      <Text>Welcome back</Text>
      <TextInput
        placeholder={selectors.emailPlaceholder}
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <Button
        title="Login"
        onPress={handleLogin}
        color="#FFA500" // Orange color
      />
    </View>
  );
}

// Styles for the component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    width: 200,
  },
});
