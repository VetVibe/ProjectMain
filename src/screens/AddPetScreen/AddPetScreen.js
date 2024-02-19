import React, { useState, useContext } from "react";
import { AuthContext } from "../../auth";
import { View, Text, Image, TouchableOpacity, StyleSheet, TextInput, Alert } from "react-native";
import { FontAwesome, MaterialIcons, MaterialCommunityIcons, Fontisto } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import RNPickerSelect from "react-native-picker-select";
import { clientServer } from "../../server";
import { encodeImageAsBase64 } from "../../../imageUtils";
import { Calendar } from "react-native-calendars";
import { colors, sizes, genders, species } from "../../constants";
import { Button } from "../../components";
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
  const [selectedDate, setSelectedDate] = useState(today);
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
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.petImage}>
          <Image source={{ uri: petImage }} style={styles.image} />
          <TouchableOpacity style={styles.cameraIconContainer} onPress={handleImagePicker}>
            <FontAwesome name="camera" size={24} style="black" />
          </TouchableOpacity>
        </View>

        <View style={styles.basicInfo}>
          <View style={styles.header_container}>
            <Text style={styles.header_text}>Pet Info</Text>
          </View>

          <View style={styles.detail_container}>
            <View style={styles.item}>
              <MaterialIcons name="pets" size={24} style={styles.icon_color} />
              <View style={styles.item_content}>
                <Text style={styles.item_header}>Name</Text>
                <TextInput
                  style={styles.item_value}
                  value={pet?.name}
                  onChangeText={(text) => setPet({ ...pet, name: text })}
                  placeholder="Name"
                />
              </View>
            </View>

            <View style={styles.item}>
              <MaterialCommunityIcons name="unicorn" size={24} style={styles.icon_color} />
              <View style={styles.item_content}>
                <Text style={styles.item_header}>Species</Text>
                <RNPickerSelect
                  style={styles.select_item}
                  value={pet?.species && pet.species}
                  onDonePress={() => setPet({ ...pet, species: selectedSpecies })}
                  onValueChange={setSelectedSpecies}
                  items={species}
                  placeholder={{ label: "Species", value: null }}
                />
              </View>
            </View>

            <View style={styles.item}>
              <Fontisto name="intersex" size={24} style={styles.icon_color} />
              <View style={styles.item_content}>
                <Text style={styles.item_header}>Gender</Text>
                <RNPickerSelect
                  style={styles.select_item}
                  value={pet?.gender && pet.gender}
                  onDonePress={() => setPet({ ...pet, gender: selectedGender })}
                  onValueChange={setSelectedGender}
                  items={genders}
                  placeholder={{ label: "Gender", value: null }}
                />
              </View>
            </View>

            <View style={styles.item}>
              <MaterialCommunityIcons name="scale-bathroom" size={24} style={styles.icon_color} />
              <View style={styles.item_content}>
                <Text style={styles.item_header}>Weight</Text>
                <TextInput
                  style={styles.item_value}
                  value={pet?.weight && `${pet?.weight}`}
                  onChangeText={(text) => setPet({ ...pet, weight: text })}
                  placeholder="Weight"
                />
              </View>
            </View>

            <View style={styles.item}>
              <FontAwesome name="birthday-cake" size={24} style={styles.icon_color} />
              <View style={styles.item_content}>
                <Text style={styles.item_header}>Birthdate</Text>
                <Button style={styles.date_item} text={selectedDate} onPress={() => setOpenCalendar(!openCalendar)} />
              </View>
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
                [selectedDate]: {
                  selected: true,
                  disableTouchEvent: true,
                  selectedColor: colors.secondary,
                  selectedTextColor: colors.white,
                },
              }}
              minDate="2000-01-01"
              initialDate={selectedDate}
              maxDate={today}
              enableSwipeMonths={true}
              disableAllTouchEventsForDisabledDays
            />
          )}
        </View>
        <Button text={"Save"} onPress={onSave} style={styles.save_button} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 16,
    backgroundColor: colors.white,
    shadowColor: colors.gray,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    elevation: 4,
    borderRadius: 20,
    marginTop: 55,
  },
  petImage: {
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
  icon_color: {
    color: colors.secondary,
  },
  basicInfo: {
    paddingHorizontal: 16,
  },
  header_container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
  },
  header_text: {
    fontSize: sizes.h3,
    fontWeight: "bold",
  },
  detail_container: {
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 16,
    paddingHorizontal: 8,
  },
  item: {
    flexDirection: "row",
    marginVertical: 16,
  },
  item_content: {
    flex: 1,
    paddingLeft: 10,
    flexDirection: "row",
  },
  item_header: {
    flex: 1,
    fontSize: sizes.h4,
    fontWeight: "bold",
  },
  item_value: {
    flex: 1,
    fontSize: sizes.h4,
    marginLeft: 20,
  },
  select_item: {
    inputIOS: {
      fontSize: sizes.h4,
      marginRight: 77,
    },
    inputAndroid: {
      fontSize: sizes.h4,
      marginRight: 77,
    },
  },
  date_item: {
    container: {
      flex: 1,
      marginLeft: 20,
    },
    text: {
      fontSize: sizes.h4,
    },
  },
  save_button: {
    container: {
      marginVertical: 12,
      padding: 8,
    },
    text: {
      textAlign: "center",
      fontSize: sizes.h3,
      color: colors.gray,
      fontWeight: "bold",
    },
  },
});
