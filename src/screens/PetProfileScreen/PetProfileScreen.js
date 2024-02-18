import React, { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, TextInput } from "react-native";
import { FontAwesome, MaterialIcons, MaterialCommunityIcons, Fontisto, FontAwesome5 } from "@expo/vector-icons";
import moment from "moment";
import { mapPetDetails } from "../../utils";
import { colors, sizes } from "../../constants";
import { clientServer } from "../../server";
import { Button } from "../../components";
import { Calendar, CalendarUtils } from "react-native-calendars";

export default function PetProfileScreen({ route, navigation }) {
  const [petDetails, setPetDetails] = useState({});
  const [basicInfo, setBasicInfo] = useState({});
  const [medicalInfo, setMedicalInfo] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isEditingBasicInfo, setIsEditingBasicInfo] = useState(false);
  const [isEditingMedicalRecords, setIsEditingMedicalRecords] = useState(false);
  const petId = route.params.petId;

  const today = moment().format("YYYY-MM-DD");

  useFocusEffect(
    useCallback(() => {
      const fetchPetDetails = async () => {
        const mappedPetDetails = mapPetDetails(await clientServer.getPetDetails(petId));
        setBasicInfo(mappedPetDetails.basicInfo);
        setMedicalInfo(mappedPetDetails.medicalInfo);
        setPetDetails(mappedPetDetails);
      };

      fetchPetDetails();
      setIsLoading(false);
    }, [petId])
  );

  const handleSaveBasicInfo = async () => {
    setPetDetails({ ...petDetails, basicInfo });
    await clientServer.updatePetInfo(petId, petDetails);
    setIsEditingBasicInfo(false);
  };

  const handleSaveMedicalRecords = async () => {
    setPetDetails({ ...petDetails, medicalInfo });
    await clientServer.updatePetInfo(petId, petDetails);
    setIsEditingMedicalRecords(false);
  };

  const deletePet = async () => {
    await clientServer.deletePet(petId);
    navigation.goBack();
  };

  const handleImagePicker = async () => {};

  return (
    <ScrollView style={styles.container}>
      {isLoading ? (
        <Text>Loading...</Text>
      ) : (
        <>
          <View style={styles.petImage}>
            <Image source={{ uri: petDetails.imgSrc }} style={styles.image} />
            <TouchableOpacity style={styles.cameraIconContainer} onPress={handleImagePicker}>
              <FontAwesome name="camera" size={24} color="black" />
            </TouchableOpacity>
          </View>

          <View style={styles.basicInfo}>
            <View style={styles.header_container}>
              <Text style={styles.header_text}>Basic Info</Text>
              {isEditingBasicInfo ? (
                <Button style={styles.edit_button} text={"Save"} onPress={handleSaveBasicInfo} />
              ) : (
                <Button style={styles.edit_button} text={"Edit"} onPress={() => setIsEditingBasicInfo(true)} />
              )}
            </View>

            <View style={styles.detail_container}>
              <View style={styles.item}>
                <MaterialIcons name="pets" size={24} color="black" />
                <View style={styles.item_content}>
                  <Text style={styles.item_header}>Name</Text>
                  {isEditingBasicInfo ? (
                    <TextInput
                      style={styles.item_value}
                      value={basicInfo?.petName}
                      onChangeText={(text) => setBasicInfo({ ...basicInfo, petName: text })}
                    />
                  ) : (
                    <Text style={styles.item_value}>{basicInfo?.petName}</Text>
                  )}
                </View>
              </View>

              <View style={styles.item}>
                <MaterialCommunityIcons name="unicorn" size={24} color="black" />
                <View style={styles.item_content}>
                  <Text style={styles.item_header}>Species</Text>
                  {isEditingBasicInfo ? (
                    <TextInput
                      style={styles.item_value}
                      value={basicInfo?.animalType}
                      onChangeText={(text) => setBasicInfo({ ...basicInfo, animalType: text })}
                    />
                  ) : (
                    <Text style={styles.item_value}>{basicInfo?.animalType}</Text>
                  )}
                </View>
              </View>

              <View style={styles.item}>
                <Fontisto name="intersex" size={24} color="black" />
                <View style={styles.item_content}>
                  <Text style={styles.item_header}>Gender</Text>
                  {isEditingBasicInfo ? (
                    <TextInput
                      style={styles.item_value}
                      value={basicInfo?.gender}
                      onChangeText={(text) => setBasicInfo({ ...basicInfo, gender: text })}
                    />
                  ) : (
                    <Text style={styles.item_value}>{basicInfo?.gender}</Text>
                  )}
                </View>
              </View>

              <View style={styles.item}>
                <MaterialCommunityIcons name="scale-bathroom" size={24} color="black" />
                <View style={styles.item_content}>
                  <Text style={styles.item_header}>Weight</Text>
                  {isEditingBasicInfo ? (
                    <TextInput
                      style={styles.item_value}
                      value={basicInfo?.weight}
                      onChangeText={(text) => setBasicInfo({ ...basicInfo, weight: text })}
                    />
                  ) : (
                    <Text style={styles.item_value}>{basicInfo?.weight}</Text>
                  )}
                </View>
              </View>

              <View style={styles.item}>
                <FontAwesome name="birthday-cake" size={24} color="black" />
                <View style={styles.item_content}>
                  <Text style={styles.item_header}>Birthdate</Text>
                  <Text style={styles.item_value}>{new Date(basicInfo?.age).toLocaleDateString()}</Text>
                </View>
              </View>
            </View>
            {isEditingBasicInfo && (
              <Calendar
                current={new Date(basicInfo?.age).toLocaleDateString()}
                onDayPress={(day) => setBasicInfo({ ...basicInfo, age: day })}
                markedDates={{
                  [CalendarUtils.getCalendarDateString(new Date(basicInfo?.age).getDate())]: {
                    selected: true,
                    dotColor: colors.primary,
                  },
                }}
                maxDate={today}
                disableAllTouchEventsForDisabledDays
              />
            )}
          </View>

          <View style={styles.basicInfo}>
            <View style={styles.header_container}>
              <Text style={styles.header_text}>Medical Records</Text>
              <Button style={styles.edit_button} text={"Edit"} onPress={() => setIsEditingMedicalRecords(true)} />
            </View>

            <View style={styles.detail_container}>
              <View style={styles.item}>
                <Fontisto name="injection-syringe" size={24} color="black" />
                <View style={styles.item_content}>
                  <Text style={styles.item_header}>Last Vaccination</Text>
                  <Text style={styles.item_value}>{new Date(medicalInfo?.lastVaccinationDate).toDateString()}</Text>
                </View>
              </View>

              <View style={styles.item}>
                <Fontisto name="doctor" size={24} color="black" />
                <View style={styles.item_content}>
                  <Text style={styles.item_header}>Last Vet Visit</Text>
                  <Text style={styles.item_value}>{new Date(medicalInfo?.lastVetVisit).toDateString()}</Text>
                </View>
              </View>

              <View style={styles.item}>
                <MaterialCommunityIcons name="pill" size={24} color="black" />
                <View style={styles.item_content}>
                  <Text style={styles.item_header}>Medications</Text>
                </View>
              </View>
              <View style={styles.list_container}>
                {petDetails.medicalInfo?.medications.map((skill, index) => (
                  <View key={index} style={styles.chip_container}>
                    <Text style={styles.chips}>{skill}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.item}>
                <FontAwesome5 name="allergies" size={24} color="black" />
                <View style={styles.item_content}>
                  <Text style={styles.item_header}>Allergies</Text>
                </View>
              </View>
              <View style={styles.list_container}>
                {petDetails.medicalInfo?.allergies.map((skill, index) => (
                  <View key={index} style={styles.chip_container}>
                    <Text style={styles.chips}>{skill}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </>
      )}
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
    shadowOpacity: 0.2,
    elevation: 4,
    borderRadius: 20,
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
  edit_button: {
    container: {
      alignSelf: "flex-end",
    },
    text: {
      color: colors.primary,
      fontSize: sizes.body1,
    },
  },
  basicInfo: {
    marginTop: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.light_gray,
    paddingHorizontal: 16,
  },
  header_container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  header_text: {
    fontSize: sizes.h3,
    fontWeight: "bold",
  },
  detail_container: {
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 8,
  },
  item: {
    flex: 1,
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
  },
  item_value: {
    flex: 1,
    fontSize: sizes.h4,
    color: colors.secondary,
  },
  list_container: {
    flex: 1,
    flexDirection: "row",
  },
  chip_container: {
    borderRadius: 20,
    backgroundColor: colors.secondary,
    padding: 12,
    margin: 4,
  },
  chips: {
    color: colors.white,
    alignSelf: "flex-start",
  },
});
