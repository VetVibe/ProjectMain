import React from "react";
import { View, Text, StyleSheet } from "react-native";
import DatePickerContainer from "../../components/DatePickerContainer/DatePickerContainer";
import TagContainer from "../../components/TagContainer/TagContainer";
import { TITELS } from "../../constants";

export default function MedicalInfoView({ details, onChangeText }) {
  return (
    <View>
      <View>
        <Text style={styles.label}>{TITELS["lastVaccinationDate"]}:</Text>
        <DatePickerContainer
          title={"lastVaccinationDate"}
          value={details.lastVaccinationDate}
          onDateChanged={(key, text) => onChangeText(key, text)}
        />
      </View>

      <View>
        <Text style={styles.label}>{TITELS["lastVetVisit"]}:</Text>
        <DatePickerContainer
          title={"lastVetVisit"}
          value={details.lastVetVisit}
          onDateChanged={(key, text) => onChangeText(key, text)}
        />
      </View>

      <View>
        <Text style={styles.label}>{TITELS["medications"]}:</Text>
        <TagContainer
          title={"medications"}
          value={details.medications || []}
          onChangeTags={(key, text) => onChangeText(key, text)}
        />
      </View>

      <View>
        <Text style={styles.label}>{TITELS["allergies"]}:</Text>
        <TagContainer
          title={"allergies"}
          value={details.allergies || []}
          onChangeTags={(key, text) => onChangeText(key, text)}
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
    width: "100%", // Updated to span the entire width
    borderColor: "#FFA500",
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 10,
    borderRadius: 20, // Added to make it round
    backgroundColor: "#FFFFFF", // White
  },
});
