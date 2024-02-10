import React, { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import RNPickerSelect from "react-native-picker-select";
import DatePickerContainer from "../../components/DatePickerContainer/DatePickerContainer";
import { TITELS, GENDERS, PET_TYPES } from "../../constants";

export default function BasicInfoView({ details, onChangeText }) {
  return (
    <View>
      <View>
        <Text style={styles.label}>{TITELS["petName"]}:</Text>
        <TextInput
          style={styles.input}
          placeholder={TITELS["petName"]}
          value={details.petName !== undefined ? details.petName.toString() : ""}
          onChangeText={(text) => onChangeText("petName", text)}
          editable={true}
        />
      </View>

      <View>
        <Text style={styles.label}>Select Animal Type:</Text>
        <RNPickerSelect
          items={PET_TYPES}
          onValueChange={(value) => onChangeText("animalType", value)}
          value={details.animalType}
          placeholder={{ label: "Select an animal type", value: null }}
          style={styles.input}
        />
      </View>

      <View>
        <Text style={styles.label}>Date of birth:</Text>
        <DatePickerContainer title={"age"} value={details.age} onDateChanged={(key, text) => onChangeText(key, text)} />
      </View>

      <View>
        <Text style={styles.label}>Select Gender Type:</Text>
        <RNPickerSelect
          items={GENDERS}
          onValueChange={(value) => onChangeText("gender", value)}
          value={details.gender}
          placeholder={{ label: "Select an animal type", value: null }}
          style={styles.input}
        />
      </View>
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
    width: "100%",
    borderColor: "#FFA500",
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 10,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
  },
});
