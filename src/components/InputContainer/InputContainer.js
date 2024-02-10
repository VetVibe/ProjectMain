import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import DatePickerContainer from "../DatePickerContainer/DatePickerContainer";
import RNPickerSelect from "react-native-picker-select";
import { TITELS, OPTIONS } from "../../constants";

export default function InputContainer({ details, onChangeText }) {
  const noDisplay = ["email", "vetId", "profilePicture", "tips", "rate", "clientsCount", "appointments"];

  const filteredDetails = Object.fromEntries(Object.entries(details).filter(([key]) => !noDisplay.includes(key)));

  const renderInput = (key, value) => {
    if (key === "lastVaccinationDate" || key === "lastVetVisit") {
      return <DatePickerContainer title={key} value={value} onDateChanged={(key, text) => onChangeText(key, text)} />;
    } else if (key == "location" || key == "specialization") {
      return (
        <View style={styles.input}>
          <RNPickerSelect
            onValueChange={(value) => onChangeText(key, value)}
            items={OPTIONS[key]}
            placeholder={{ label: value, value: value }}
          />
        </View>
      );
    } else if (key == "password") {
      return (
        <TextInput
          style={styles.input}
          placeholder={TITELS[key]}
          value={value !== undefined ? value.toString() : ""}
          onChangeText={(text) => onChangeText(key, text)}
          editable={true}
          secureTextEntry={key === "password"}
        />
      );
    } else {
      return (
        <TextInput
          style={styles.input}
          placeholder={TITELS[key]}
          value={value !== undefined ? value.toString() : ""}
          onChangeText={(text) => onChangeText(key, text)}
          editable={true}
        />
      );
    }
  };

  return (
    <View>
      {Object.entries(filteredDetails).map(([key, value]) => (
        <View key={key}>
          <Text style={styles.label}>{TITELS[key]}:</Text>
          {renderInput(key, value)}
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
