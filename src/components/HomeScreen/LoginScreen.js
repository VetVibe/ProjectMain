import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StackActions, useNavigation } from "@react-navigation/native";

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
    const owner = {
      email: email,
      password: password,
    };

    // Send a login request to the server
    axios
      .post(selectors.postUrl, owner)
      .then((response) => {
        const data = response.data;
        const token = data.token;
        const userId = data.ownerId;
        AsyncStorage.setItem("authToken", token);
        navigation.navigate(selectors.navigationScreen, { userId: userId });
      })
      .catch((error) => {
        Alert.alert("Login error");
        console.log("Error during login", error);
      });
  };

  return (
    <View style={styles.container}>
      <Text>Welcome back</Text>
      <TextInput placeholder={selectors.emailPlaceholder} value={email} onChangeText={setEmail} style={styles.input} />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <Button title="Login" onPress={handleLogin} color="#FFA500" />
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
