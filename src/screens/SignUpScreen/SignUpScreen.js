import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import axios from "axios";
import TabsContainer from "../../components/TabsContainer/TabsContainer";
import { ROLES_TABS } from "../../constants";
import * as ImagePicker from "expo-image-picker";
import { Picker } from "@react-native-picker/picker";
import { Modal } from "react-native";

export default function SignUpScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState("petOwner");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [id, setId] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [cityList, setCityList] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [specializationList, setSpecializationList] = useState([]);
  const [selectedSpecialization, setSelectedSpecialization] = useState("");
  const [isCityPickerVisible, setCityPickerVisible] = useState(false);
  const [isSpecializationPickerVisible, setSpecializationPickerVisible] =
    useState(false);

  useEffect(() => {
    // Fetch the list of cities from your MongoDB database
    axios
      .get("http://localhost:3000/cities")
      .then((response) => {
        // Extract only the "city" field from each object in the response data
        const cities = response.data.map((cityObject) => cityObject.city);

        console.log("Cities response:", cities);
        setCityList(cities);
      })
      .catch((error) => {
        console.error("Error fetching cities:", error);
      });
  }, []);

  useEffect(() => {
    // Fetch the list of spec from your MongoDB database
    axios
      .get("http://localhost:3000/specialization")
      .then((response) => {
        // Extract only the "city" field from each object in the response data
        const specializations = response.data.map(
          (specObject) => specObject.specialisation
        );

        console.log("specializations response:", specializations);
        setSpecializationList(specializations);
      })
      .catch((error) => {
        console.error("Error fetching specializations:", error);
      });
  }, []);

  const handleTabPress = (tab) => {
    setActiveTab(tab);
  };
  const toggleCityPicker = () => {
    setCityPickerVisible(!isCityPickerVisible);
  };
  const toggleSpecializationPicker = () => {
    setSpecializationPickerVisible(!isSpecializationPickerVisible);
  };

  const handleCitySelect = (itemValue) => {
    setSelectedCity(itemValue);
    toggleCityPicker();
  };
  const handleSpecializationSelect = (itemValue) => {
    setSelectedSpecialization(itemValue);
    toggleSpecializationPicker();
  };

  const handleRegistration = () => {
    const newUser = {
      name,
      email,
      password,
      location: selectedCity,
      profilePicture: profilePicture,
      ...(activeTab === "vet" && {
        vetId: id,
        phoneNumber,
        specialization: selectedSpecialization,
      }),
    };

    const postUrl =
      activeTab === "petOwner"
        ? "http://localhost:3000/petOwner/register"
        : "http://localhost:3000/veterinarian/register";

    // If registering as a veterinarian, check if the vet ID is valid first
    if (activeTab === "vet") {
      axios
        .get(`http://localhost:3000/veterinarianId/checkId/${id}`)
        .then((response) => {
          if (response.data.isValid) {
            // Vet ID is valid, proceed with registration
            performRegistration(newUser, postUrl);
          } else {
            // Vet ID is not valid, show an error message
            Alert.alert(
              "Invalid Veterinarian ID",
              "Please enter a valid Veterinarian ID: VET-XXX"
            );
          }
        })
        .catch((error) => {
          if (error.response && error.response.status === 404) {
            // Vet ID already exists, show an error message
            Alert.alert(
              "Veterinarian ID already registered",
              "This Veterinarian ID is already associated with an account."
            );
          } else {
            // Other error occurred while checking vet ID, show a general error message
            console.error("Error checking vet ID:", error);
            Alert.alert(
              "Error",
              "An error occurred while checking Veterinarian ID"
            );
          }
        });
    } else {
      // For pet owners, directly proceed with registration
      performRegistration(newUser, postUrl);
    }
  };

  const performRegistration = (newUser, postUrl) => {
    // Make an Axios request to register the new user
    axios
      .post(postUrl, newUser)
      .then((response) => {
        Alert.alert("Registration completed successfully");

        // Clear input fields
        setName("");
        setEmail("");
        setPassword("");
        setId("");
        setPhoneNumber("");
        setSelectedCity("");
        setProfilePicture(null);

        navigation.goBack();
      })
      .catch((error) => {
        console.error("Error registering new user", error);

        // Check if the error is a 404 error indicating that the user (veterinarian) is already registered
        if (error.response && error.response.status === 404) {
          Alert.alert(
            "Registration failed",
            "This user is already registered."
          );
        } else {
          // Show a generic error message for other registration failures
          Alert.alert("Registration failed.");
        }
      });
  };

  const handleImagePick = async () => {
    // Request permission to access the device's photo library
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status === "granted") {
      // Launch the image picker
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        // Set the selected image URI to the profile picture state
        if (result.assets && result.assets.length > 0) {
          const selectedAsset = result.assets[0];
          setProfilePicture(selectedAsset.uri);
        }
      }
    } else {
      Alert.alert(
        "Permission denied",
        "Permission to access the photo library was denied."
      );
    }
  };

  return (
    <View style={styles.container}>
      <TabsContainer
        tabs={ROLES_TABS}
        activeTab={activeTab}
        handleTabPress={handleTabPress}
      />

      <TextInput
        autoCorrect={false}
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        autoCorrect={false}
        autoCapitalize="none"
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <TextInput
        autoCorrect={false}
        autoCapitalize="none"
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {activeTab === "petOwner" || activeTab === "vet" ? (
        <View style={styles.pickerContainer}>
          <TouchableOpacity
            onPress={toggleCityPicker}
            style={styles.pickerButton}
          >
            <Text>{selectedCity || "Select City"}</Text>
          </TouchableOpacity>
          <Modal visible={isCityPickerVisible} animationType="slide">
            <View style={styles.modalContainer}>
              <Picker
                style={styles.picker}
                selectedValue={selectedCity}
                onValueChange={handleCitySelect}
              >
                <Picker.Item label="Select City" value="" />
                {cityList.map((city) => (
                  <Picker.Item key={city} label={city} value={city} />
                ))}
              </Picker>
              <Button title="Close" onPress={toggleCityPicker} />
            </View>
          </Modal>
        </View>
      ) : null}

      {activeTab === "vet" && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Veterinarian ID"
            value={id}
            onChangeText={setId}
          />

          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
          />

          {/* Specialization picker for veterinarians */}
          <View style={styles.pickerContainer}>
            <TouchableOpacity
              onPress={toggleSpecializationPicker}
              style={styles.pickerButton}
            >
              <Text>{selectedSpecialization || "Select Specialization"}</Text>
            </TouchableOpacity>

            <Modal
              visible={isSpecializationPickerVisible}
              animationType="slide"
            >
              <View style={styles.modalContainer}>
                <Picker
                  style={styles.picker}
                  selectedValue={selectedSpecialization}
                  onValueChange={handleSpecializationSelect}
                >
                  <Picker.Item label="Select Specialization" value="" />
                  {specializationList.map((spec) => (
                    <Picker.Item key={spec} label={spec} value={spec} />
                  ))}
                </Picker>
                <Button
                  title="Close"
                  onPress={() => setSpecializationPickerVisible(false)}
                />
              </View>
            </Modal>
          </View>
        </>
      )}

      <TouchableOpacity style={styles.button} onPress={handleImagePick}>
        <Text style={styles.buttonText}>Choose Profile Picture</Text>
      </TouchableOpacity>
      {profilePicture && (
        <Image source={{ uri: profilePicture }} style={styles.profileImage} />
      )}

      <Button title="Register" onPress={handleRegistration} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    borderRadius: 5,
    width: "100%",
  },
  pickerButton: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    justifyContent: "center",
    paddingLeft: 0,
    marginBottom: 10,
    width: "100%",
  },
  modalContainer: {
    flex: 5,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  picker: {
    height: 200, // Adjust the height as needed
    width: "100%",
  },

  button: {
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    width: "80%",
  },
  buttonText: {
    color: "white",
  },
  profileImage: {
    width: 100,
    height: 100,
    marginTop: 10,
    borderRadius: 5, // Adjusted border radius
  },
});
