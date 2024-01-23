import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import DatePickerContainer from "../DatePickerContainer/DatePickerContainer";
import { TITELS } from "../../constants";

export default function InputContainer({ details, onChangeText }) {
  const noDisplay = ["email", "password", "vetId", "profilePicture", "tips", "isAvailable", "rate", "clientsCount"];

  const filteredDetails = Object.fromEntries(Object.entries(details).filter(([key]) => !noDisplay.includes(key)));

  return (
    <View>
      {Object.entries(filteredDetails).map(([key, value]) => (
        <View key={key}>
          <Text style={styles.label}>{TITELS[key]}:</Text>
          {key === "lastVaccinationDate" || key === "lastVetVisit" ? (
            <DatePickerContainer title={key} value={value} onDateChanged={(key, text) => onChangeText(key, text)} />
          ) : (
            <TextInput
              style={styles.input}
              placeholder={TITELS[key]}
              value={value !== undefined ? value.toString() : ""}
              onChangeText={(text) => onChangeText(key, text)}
              editable={true}
              secureTextEntry={key === "password"}
            />
          )}
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
