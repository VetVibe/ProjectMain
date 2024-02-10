import React from "react";
import RNPickerSelect from "react-native-picker-select";
import { OPTIONS } from "../../constants";

const VetSearchForm = ({ setSelectedLocation, setSelectedSpecialization }) => {
  return (
    <>
      <RNPickerSelect
        onValueChange={(value) => setSelectedLocation(value)}
        items={OPTIONS.location}
        placeholder={{ label: "Select Location", value: null }}
      />
      <RNPickerSelect
        onValueChange={(value) => setSelectedSpecialization(value)}
        items={OPTIONS.specialization}
        placeholder={{ label: "Select Specialization", value: null }}
      />
    </>
  );
};

export default VetSearchForm;
