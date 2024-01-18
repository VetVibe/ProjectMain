import React from "react";
import { View, Text, TextInput, StyleSheet, DatePicker } from "react-native";
import { titleMappings } from "./support/utils";

export default function InputDetailsContainer({ petDetails, onChangeText }) {
  return (
    <View>
      {Object.entries(petDetails).map(([key, value]) => (
        <View key={key}>
          <Text style={styles.label}>{titleMappings[key]}:</Text>
          <TextInput
            style={styles.input}
            placeholder={titleMappings[key]}
            value={value !== undefined ? value.toString() : ""}
            onChangeText={(text) => onChangeText(key, text)}
          />
        </View>
      ))}
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
