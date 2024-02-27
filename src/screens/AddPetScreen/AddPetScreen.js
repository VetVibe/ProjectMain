import React, { useState, useContext } from "react";
import { AuthContext } from "../../auth";
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import RNPickerSelect from "react-native-picker-select";
import { clientServer } from "../../server";
import { encodeImageAsBase64 } from "../../../imageUtils";
import { Calendar } from "react-native-calendars";
import { colors, sizes, genders, species } from "../../constants";
import { Button, Input } from "../../components";
import { ScrollView } from "react-native-gesture-handler";

export default function EditPetProfileScreen({ navigation }) {
  const { authState } = useContext(AuthContext);
  const today = new Date().toISOString().split("T")[0];
  const [pet, setPet] = useState({});
  const [petImage, setPetImage] = useState(
    "https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/65761296352685.5eac4787a4720.jpg"
  );
  const [selectedSpecies, setSelectedSpecies] = useState();
  const [selectedGender, setSelectedGender] = useState();
  const [selectedDate, setSelectedDate] = useState();
  const [openCalendar, setOpenCalendar] = useState(false);

  const onSave = async () => {
    if (!pet.name || !pet.species || !pet.gender || !pet.weight || !selectedDate) {
      Alert.alert("Error", "Please fill in all the fields.");
      return;
    }
    const newPet = {
      ...pet,
      birthdate: new Date(selectedDate),
      imgSrc: petImage,
    };
    try {
      await clientServer.registerPet(authState.id, newPet);
      navigation.goBack();
    } catch (error) {
      console.error("Error adding a pet:", error);
    }
  };

  const handleImagePicker = async () => {
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
          const base64Image = await encodeImageAsBase64(selectedAsset.uri);

          setPetImage(`data:image/jpeg;base64,${base64Image}`);
        }
      }
    } else {
      Alert.alert("Permission denied", "Permission to access the photo library was denied.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.petImage}>
        <Image source={{ uri: petImage }} style={styles.image} />
        <TouchableOpacity style={styles.cameraIconContainer} onPress={handleImagePicker}>
          <FontAwesome name="camera" size={24} style="black" />
        </TouchableOpacity>
      </View>

      <View style={styles.detail_container}>
        <View style={styles.item}>
          <Text style={styles.item_header}>Name</Text>
          <View style={styles.item_content}>
            <Input value={pet.name} onChangeText={(text) => setPet({ ...pet, name: text })} placeholder="Name" />
          </View>
        </View>

        <View style={styles.item}>
          <Text style={styles.item_header}>Species</Text>
          <View style={styles.select_content}>
            <RNPickerSelect
              style={styles.select_item}
              value={selectedSpecies}
              onDonePress={() => setPet({ ...pet, species: selectedSpecies })}
              onValueChange={setSelectedSpecies}
              items={species}
              placeholder={{ label: "Species", value: null }}
            />
          </View>
        </View>

        <View style={styles.item}>
          <Text style={styles.item_header}>Gender</Text>
          <View style={styles.select_content}>
            <RNPickerSelect
              style={styles.select_item}
              value={selectedGender}
              onDonePress={() => setPet({ ...pet, gender: selectedGender })}
              onValueChange={setSelectedGender}
              items={genders}
              placeholder={{ label: "Gender", value: null }}
            />
          </View>
        </View>

        <View style={styles.item}>
          <Text style={styles.item_header}>Weight</Text>
          <View style={styles.item_content}>
            <Input
              value={pet?.weight && `${pet?.weight}`}
              onChangeText={(text) => setPet({ ...pet, weight: text })}
              placeholder="Weight (kg)"
            />
          </View>
        </View>

        <View style={styles.item}>
          <Text style={styles.item_header}>Birthdate</Text>
          <View style={styles.select_content}>
            <Button style={styles.date_item} text={selectedDate || ""} onPress={() => setOpenCalendar(!openCalendar)} />
          </View>
        </View>

        {openCalendar && (
          <Calendar
            onDayPress={(day) => {
              setSelectedDate(day.dateString);
              setPet({ ...pet, birthdate: day.dateString });
              setOpenCalendar(false);
            }}
            markedDates={{
              [selectedDate || today]: {
                selected: true,
                disableTouchEvent: true,
                selectedColor: colors.secondary,
                selectedTextColor: colors.white,
              },
            }}
            minDate="2000-01-01"
            initialDate={today}
            maxDate={today}
            enableSwipeMonths={true}
            disableAllTouchEventsForDisabledDays
          />
        )}
      </View>
      <Button text={"Save"} onPress={onSave} style={styles.save_button} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
  },
  petImage: {
    overflow: "hidden",
    alignItems: "center",
    padding: 8,
  },
  image: {
    resizeMode: "cover",
    borderRadius: 10,
    width: sizes.width / 1.1,
    height: sizes.height / 5,
  },
  cameraIconContainer: {
    position: "absolute",
    top: 10,
    right: 20,
    backgroundColor: "transparent",
    padding: 5,
  },
  header_container: {
    flex: 1,
    padding: 16,
    marginBottom: 12,
    alignItems: "center",
  },
  header_text: {
    fontSize: sizes.h2,
    color: colors.primary,
    fontWeight: "bold",
  },
  detail_container: {
    justifyContent: "space-between",
    marginTop: 12,
    paddingHorizontal: 24,
  },
  item: {
    flex: 1,
    marginVertical: 6,
  },
  item_content: {
    marginVertical: 12,
  },
  item_header: {
    fontSize: sizes.h3,
    fontWeight: "bold",
  },
  item_value: {
    flex: 1,
    fontSize: sizes.h4,
    marginLeft: 20,
  },
  select_content: {
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.light_gray,
    marginVertical: 12,
    height: 50,
    width: "100%",
  },
  select_item: {
    inputIOS: {
      fontSize: sizes.body1,
    },
    inputAndroid: {
      fontSize: sizes.body1,
    },
  },
  date_item: {
    container: {
      flex: 1,
      marginLeft: 20,
    },
    text: {
      fontSize: sizes.body1,
    },
  },
  save_button: {
    container: {
      margin: 30,
      padding: 8,
      borderRadius: 20,
      backgroundColor: colors.primary,
    },
    text: {
      textAlign: "center",
      fontSize: sizes.h3,
      color: colors.white,
      fontWeight: "bold",
    },
  },
});
