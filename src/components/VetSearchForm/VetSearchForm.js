// VetSearchForm.js
import React from 'react';
import RNPickerSelect from 'react-native-picker-select';

const VetSearchForm = ({ setSelectedLocation, setSelectedSpecialization }) => {
  return (
    <>
      <RNPickerSelect
        onValueChange={(value) => setSelectedLocation(value)}
        items={[
          { label: 'Tel Aviv', value: 'Tel Aviv' },
          { label: 'Ariel', value: 'Ariel' },
          { label: 'Jerusalem', value: 'Jerusalem' },
          { label: 'Haifa', value: 'Haifa' },
        ]}
        placeholder={{ label: 'Select Location', value: null }}
      />
      <RNPickerSelect
        onValueChange={(value) => setSelectedSpecialization(value)}
        items={[
          { label: 'Cardiology', value: 'Cardiology' },
          { label: 'Large animal internal medicine', value: 'Large animal internal medicine' },
          { label: 'Neurology', value: 'Neurology' },
          { label: 'Oncology', value: 'Oncology' },
          { label: 'Nutrition', value: 'Nutrition' },
        ]}
        placeholder={{ label: 'Select Specialization', value: null }}
      />
    </>
  );
};

export default VetSearchForm;
