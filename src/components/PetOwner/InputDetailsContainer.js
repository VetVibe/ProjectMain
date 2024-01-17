import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";

export default function InputDetailsContainer({ title, placeholder, value, onChangeText }) {
  return (
    <View>
      <Text style={styles.label}>{title}</Text>
      <TextInput style={styles.input} placeholder={placeholder} value={value || ""} onChangeText={onChangeText}/>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  input: {
    height: 40,
    width: "100%", // Updated to span the entire width
    borderColor: "#FFA500",
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 10,
    borderRadius: 20, // Added to make it round
    backgroundColor: "#FFFFFF", // White
  },
});
