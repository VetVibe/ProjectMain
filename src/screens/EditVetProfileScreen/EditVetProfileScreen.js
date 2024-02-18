import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../auth";
import { View, Text, TouchableOpacity, ScrollView, Image, TextInput, StyleSheet, Alert } from "react-native";
import { Button, Input } from "../../components";
import { FontAwesome } from "@expo/vector-icons";
import RNPickerSelect from "react-native-picker-select";
import * as ImagePicker from "expo-image-picker";
import { encodeImageAsBase64 } from "../../../imageUtils";
import { mapVetDetailsToSchema, mapVetDetails } from "../../utils";
import { locations, specializations } from "../../constants";
import { colors, sizes } from "../../constants";
import { clientServer } from "../../server";

export default function EditVetProfileScreen({ navigation }) {
  const { authState, setAuthState } = useContext(AuthContext);
  const [vetDetails, setVetDetails] = useState({});
  const [selectedImage, setSelectedImage] = useState();
  const [vetSpetializations, setVetSpetializations] = useState([]);
  const [availableSpecializations, setAvailableSpecializations] = useState([]);
  const [selectedSpecialization, setSelectedSpecialization] = useState();
  const [selectedLocation, setSelectedLocation] = useState();
  const [invalidName, setInvalidName] = useState(false);

  useEffect(() => {
    const fetchVetDetails = async () => {
      try {
        const data = await clientServer.getVetInfo(authState.id);
        const mapedVetDetails = mapVetDetails(data);
        setVetDetails(mapedVetDetails);
        setSelectedImage(mapedVetDetails.profilePicture);
        setSelectedLocation(mapedVetDetails?.location);

        const vetSpec = mapedVetDetails.specialization;
        setVetSpetializations(vetSpec);

        const availableSpecializations = specializations.filter((spetialization) => !vetSpec?.includes(spetialization));

        setAvailableSpecializations(availableSpecializations);
      } catch (error) {
        console.log(error);
      }
    };
    fetchVetDetails();
  }, []);

  const handleImagePicker = async () => {
    // Request permission to access the device's photo library
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status === "granted") {
      // Launch the image picker
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 4],
        quality: 1,
      });

      if (!result.canceled && result.assets.length > 0) {
        const selectedAsset = result.assets[0];
        try {
          const base64Image = await encodeImageAsBase64(selectedAsset.uri);
          setSelectedImage(`data:image/jpeg;base64,${base64Image}`);
        } catch (error) {
          Alert.alert("Error", "Failed to encode image as Base64");
        }
      }
    } else {
      Alert.alert("Permission denied", "Permission to access the photo library was denied.");
    }
  };

  const handleSpetializationAdd = async () => {
    console.log(vetSpetializations);
    if (selectedSpecialization) {
      if (vetSpetializations) {
        setVetSpetializations((prev) => [...prev, selectedSpecialization]);
      } else {
        setVetSpetializations([selectedSpecialization]);
      }
      setAvailableSpecializations((prev) =>
        prev?.filter((spetialization) => spetialization !== selectedSpecialization)
      );

      setSelectedSpecialization(null);
    }
  };

  const handleSpetializationRemove = async (spetialization) => {
    setVetSpetializations((prev) => prev.filter((item) => item !== spetialization));
    setAvailableSpecializations((prev) => [...prev, spetialization]);
  };

  const handleLogout = async () => {
    setAuthState({ signedIn: false, userType: "", id: "" });
    console.log("Vet logged out: cleared storage.");
  };

  const LogoutClick = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      { text: "OK", onPress: () => handleLogout() },
    ]);
  };

  const onSave = async () => {
    if (!vetDetails.name) {
      setInvalidName(true);
      return;
    }
    const updatedData = {
      ...vetDetails,
      specialization: vetSpetializations,
      profilePicture: selectedImage,
    };
    const vetDetailsSchema = mapVetDetailsToSchema(updatedData);
    try {
      await clientServer.updateVetInfo(authState.id, vetDetailsSchema);
    } catch (error) {
      console.log(error);
    }
    navigation.goBack();
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.vetImage}>
          <Image source={{ uri: selectedImage }} style={styles.image} />
          <TouchableOpacity style={styles.cameraIconContainer} onPress={handleImagePicker}>
            <FontAwesome name="camera" size={24} color="black" />
          </TouchableOpacity>
        </View>

        <View style={styles.basicInfo}>
          <View style={styles.header_container}>
            <Text style={styles.header_text}>Clinic Info</Text>
          </View>

          <View style={styles.item}>
            <View style={styles.item_content}>
              <Input
                autoCapitalize="words"
                placeholder="Name"
                onChangeText={(text) => setVetDetails({ ...vetDetails, name: text })}
                value={vetDetails.name}
                error={invalidName}
                errorMessage={"Required field"}
              />
            </View>
          </View>

          <View style={styles.item}>
            <View style={styles.search_container}>
              <RNPickerSelect
                style={styles.item_value}
                value={selectedLocation}
                onDonePress={() => setVetDetails({ ...vetDetails, location: selectedLocation })}
                onValueChange={setSelectedLocation}
                items={locations}
                placeholder={{ label: "City", value: null }}
              />
            </View>
          </View>

          <View style={styles.item}>
            <View style={styles.search_container}>
              <RNPickerSelect
                style={styles.item_value}
                onDonePress={handleSpetializationAdd}
                onValueChange={setSelectedSpecialization}
                items={availableSpecializations}
                placeholder={{ label: "Specializations", value: null }}
              />
            </View>
          </View>

          <View style={{ flex: 1 }}>
            <ScrollView horizontal={true}>
              {vetSpetializations?.map((spetialization) => {
                return (
                  <View style={styles.chip_container} key={spetialization}>
                    <Text style={styles.chips}>{spetialization}</Text>
                    <Button
                      text="x"
                      onPress={() => handleSpetializationRemove(spetialization)}
                      style={styles.delete_button}
                    />
                  </View>
                );
              })}
            </ScrollView>
          </View>

          <View style={styles.opening_hours_container}>
            <View style={styles.item}>
              <Text style={styles.item_header}>Opening Hours</Text>
              <View style={styles.times_container}>
                <View style={styles.time_content}>
                  <TextInput
                    placeholder="From"
                    value={`${vetDetails.start}`}
                    onChangeText={(text) => setVetDetails({ ...vetDetails, start: text })}
                    maxLength={2}
                    keyboardType="numeric"
                  />
                  <Text> : 00</Text>
                </View>
                <View style={styles.time_content}>
                  <TextInput
                    placeholder="To"
                    value={`${vetDetails.end}`}
                    onChangeText={(text) => setVetDetails({ ...vetDetails, end: text })}
                    maxLength={2}
                    keyboardType="numeric"
                  />
                  <Text> : 00</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
      <Button text={"Save"} style={styles.save_button} onPress={onSave} />
      <Button text={"Logout"} style={styles.logout_button} onPress={LogoutClick} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 16,
    backgroundColor: colors.white,
    shadowColor: colors.gray,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    elevation: 4,
    borderRadius: 20,
  },
  vetImage: {
    position: "relative",
  },
  image: {
    height: 200,
    resizeMode: "cover",
  },
  cameraIconContainer: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "transparent",
    padding: 5,
  },
  basicInfo: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  header_container: {
    flexDirection: "row",
    alignItems: "center",
  },
  header_text: {
    fontSize: sizes.h3,
    fontWeight: "bold",
  },
  item: {
    flex: 1,
    flexDirection: "row",
  },
  item_content: {
    flex: 1,
  },
  item_header: {
    flex: 1,
    fontSize: sizes.h4,
  },
  item_value: {
    flex: 1,
    fontSize: sizes.h4,
  },
  search_container: {
    backgroundColor: colors.white,
    padding: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.light_gray,
    marginVertical: 8,
    height: 50,
    width: "100%",
    flexDirection: "row",
  },
  list_container: {
    flex: 1,
    flexDirection: "row",
  },
  chip_container: {
    flexDirection: "row",
    borderRadius: 20,
    backgroundColor: colors.secondary,
    padding: 12,
    margin: 4,
  },
  chips: {
    color: colors.white,
    fontSize: sizes.body2,
    alignSelf: "flex-start",
  },
  delete_button: {
    container: {
      marginLeft: 4,
    },
    text: {
      fontSize: sizes.body2,
      color: colors.lighter_gray,
    },
  },
  opening_hours_container: {
    flex: 1,
    margin: 4,
    marginBottom: 16,
    borderWidth: 1,
    borderRadius: 20,
    borderColor: colors.light_gray,
    padding: 16,
  },
  times_container: {
    flex: 1,
    flexDirection: "row",
  },
  time_content: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  save_button: {
    container: {
      marginHorizontal: 24,
      marginBottom: 4,
      borderRadius: 20,
      padding: 8,
      shadowColor: colors.gray,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      width: "90%",
      backgroundColor: colors.primary,
    },
    text: {
      textAlign: "center",
      fontSize: sizes.h3,
      padding: 10,
      color: colors.white,
      fontWeight: "bold",
    },
  },
  logout_button: {
    container: {
      marginHorizontal: 24,
      marginVertical: 12,
      borderRadius: 20,
      padding: 8,
      shadowColor: colors.gray,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      width: "90%",
      backgroundColor: colors.white,
    },
    text: {
      textAlign: "center",
      fontSize: sizes.h3,
      padding: 10,
      color: colors.error,
      fontWeight: "bold",
    },
  },
});
