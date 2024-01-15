import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import Header from "./Header";
import LoginButton from "./LoginButton";
import PawImage from "../../assets/paw.jpg"

export default function HomeScreen({navigation}) {
  return (
    <View style={styles.container}>
      <Header headerText={"Vet Vibe"} imgSrc={PawImage}/>
      <LoginButton buttonText={"Login as Pet Owner"} navigationScreen={"Login"} userRole={"PetOwner"} navi={navigation}/>
      <LoginButton buttonText={"Login as Veterinarian"} navigationScreen={"Login"} userRole={"Vet"} navi={navigation}/>
      <LoginButton buttonText={"Need an account? Sign up now"} navigationScreen={"Sign up"} navi={navigation}/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#ffffff",
  }
});
