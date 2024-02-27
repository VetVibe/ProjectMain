import React from "react";
import { View, StyleSheet } from "react-native";
import RNPickerSelect from "react-native-picker-select";
import { colors } from "../../constants";
import { locations, specializations } from "../../constants";

const VetSearchForm = ({ location, specialization, onSelectedLocation, onSelectedSpecialization, onChange }) => {
  return (
    <>
      <View style={styles.search_container}>
        <RNPickerSelect
          value={location || null}
          onDonePress={onChange}
          onValueChange={(value) => onSelectedLocation(value)}
          items={locations}
          placeholder={{ label: "Select Location", value: null }}
        />
      </View>
      <View style={styles.search_container}>
        <RNPickerSelect
          value={specialization || null}
          onDonePress={onChange}
          onValueChange={(value) => onSelectedSpecialization(value)}
          items={specializations}
          placeholder={{ label: "Select Specialization", value: null }}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  search_container: {
    backgroundColor: colors.white,
    padding: 12,
    borderRadius: 20,
    marginHorizontal: 40,
    marginVertical: 8,
    flexDirection: "row",
    shadowColor: colors.gray,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    elevation: 6,
  },
});

export default VetSearchForm;
