import React, { useState, useEffect } from 'react';
import RNPickerSelect from 'react-native-picker-select';
import axios from 'axios';

const VetSearchForm = ({ setSelectedLocation, setSelectedSpecialization }) => {
  const [cityList, setCityList] = useState([]);
  const [specializationList, setSpecializationList] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/cities")
      .then(response => {
        const cities = response.data.map(cityObject => cityObject.city);
        setCityList(cities.map(city => ({ label: city, value: city })));
      })
      .catch(error => {
        console.error("Error fetching cities:", error);
      });
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:3000/specialization")
      .then(response => {
        const specializations = response.data.map(specObject => specObject.specialisation);
        setSpecializationList(specializations.map(spec => ({ label: spec, value: spec })));
      })
      .catch(error => {
        console.error("Error fetching specializations:", error);
      });
  }, []);

  return (
    <>
      <RNPickerSelect
        onValueChange={(value) => setSelectedLocation(value)}
        items={cityList}
        placeholder={{ label: 'Select Location', value: null }}
      />
      <RNPickerSelect
        onValueChange={(value) => setSelectedSpecialization(value)}
        items={specializationList}
        placeholder={{ label: 'Select Specialization', value: null }}
      />
    </>
  );
};

export default VetSearchForm;
