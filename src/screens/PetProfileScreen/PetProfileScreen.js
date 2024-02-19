import React, { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, TextInput, Alert } from "react-native";
import { FontAwesome, MaterialIcons, MaterialCommunityIcons, Fontisto } from "@expo/vector-icons";
import moment from "moment";
import { colors, sizes, genders, species } from "../../constants";
import { clientServer } from "../../server";
import { Button } from "../../components";
import { Calendar } from "react-native-calendars";
import RNPickerSelect from "react-native-picker-select";

export default function PetProfileScreen({ route, navigation }) {
  const [isLoading, setIsLoading] = useState(true);
  const [pet, setPet] = useState({});
  const [basicInfo, setBasicInfo] = useState({});
  const [selectedSpecies, setSelectedSpecies] = useState();
  const [selectedGender, setSelectedGender] = useState();
  const [selectedVaccineDate, setSelectedVaccineDate] = useState();
  const [selectedVetVisitDate, setSelectedVetVisitDate] = useState();
  const [selectedMedication, setSelectedMedication] = useState();
  const [selectedAllergie, setSelectedAllergie] = useState();
  const [medications, setMedications] = useState("");
  const [allergies, setAllergies] = useState("");
  const [isEditingBasicInfo, setIsEditingBasicInfo] = useState(false);
  const [isEditingMedicalRecords, setIsEditingMedicalRecords] = useState(false);
  const [isEditingMedications, setIsEditingMedications] = useState(false);
  const [isEditingAllergies, setIsEditingAllergies] = useState(false);
  const [openCalendar, setOpenCalendar] = useState("");
  const petId = route.params.petId;

  const today = moment().format("YYYY-MM-DD");

  useFocusEffect(
    useCallback(() => {
      clientServer
        .getPetDetails(petId)
        .then((pet) => {
          const {
            name,
            species,
            weight,
            gender,
            birthdate,
            lastVaccinationDate,
            lastVetVisit,
            medications,
            allergies,
          } = pet;
          setPet(pet);
          setBasicInfo({ name, species, weight, gender, birthdate });
          setSelectedSpecies(species);
          setSelectedGender(gender);
          setSelectedVaccineDate(lastVaccinationDate ? new Date(lastVaccinationDate) : new Date(today));
          setSelectedVetVisitDate(lastVetVisit ? new Date(lastVetVisit) : new Date(today));
          setMedications(medications || []);
          setAllergies(allergies || []);
        })
        .finally(() => {
          setIsLoading(false);
        })
        .catch((error) => {
          console.error(error);
        });
    }, [petId])
  );

  const handleSaveBasicInfo = async () => {
    try {
      if (!basicInfo.name || !selectedSpecies || !selectedGender || !basicInfo.weight || !basicInfo.birthdate) {
        Alert.alert("Error", "Please fill in all the fields.");
        return;
      }
      const updated = {
        ...basicInfo,
        species: selectedSpecies,
        gender: selectedGender,
      };
      setBasicInfo(updated);
      setPet({ ...pet, updated });
      await clientServer.updatePetInfo(petId, updated);
      setIsEditingBasicInfo(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSaveMedicalRecords = async () => {
    try {
      const updated = { lastVaccinationDate: selectedVaccineDate, lastVetVisit: selectedVetVisitDate };
      setPet({ ...pet, updated });
      await clientServer.updatePetInfo(petId, updated);
      setIsEditingMedicalRecords(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSaveMeds = async () => {
    setPet({ ...pet, medications });
    await clientServer.updatePetInfo(petId, { ...pet, medications: medications });
    setIsEditingMedications(false);
  };

  const handleSaveAllerg = async () => {
    setPet({ ...pet, allergies });
    await clientServer.updatePetInfo(petId, { ...pet, allergies: allergies });
    setIsEditingAllergies(false);
  };

  const handleAddMedication = async () => {
    setMedications([...medications, selectedMedication]);
    setSelectedMedication("");
  };

  const handleAddAllergie = async () => {
    setAllergies([...allergies, selectedAllergie]);
    setSelectedAllergie("");
  };

  const handleDeletePet = async () => {
    try {
      await clientServer.deletePet(petId);
      navigation.goBack();
    } catch (error) {
      console.error(error);
    }
  };
  const onDeletePet = async () => {
    Alert.alert("Delete Pet", "Are you sure you want to delete pet?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      { text: "Delete", onPress: () => handleDeletePet() },
    ]);
  };

  const handleImagePicker = async () => {};

  return (
    <ScrollView>
      {isLoading ? (
        <Text>Loading...</Text>
      ) : (
        <View style={styles.container}>
          <View style={styles.petImage}>
            <Image source={{ uri: pet.imgSrc }} style={styles.image} />
            <TouchableOpacity style={styles.cameraIconContainer} onPress={handleImagePicker}>
              <FontAwesome name="camera" size={24} style="black" />
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
                <MaterialIcons name="pets" size={24} style={styles.icon_color} />
                <View style={styles.item_content}>
                  <Text style={styles.item_header}>Name</Text>
                  <TextInput
                    style={styles.item_value}
                    value={basicInfo?.name}
                    onChangeText={(text) => setBasicInfo({ ...basicInfo, name: text })}
                    editable={isEditingBasicInfo}
                  />
                </View>
              </View>

              <View style={styles.item}>
                <MaterialCommunityIcons name="unicorn" size={24} style={styles.icon_color} />
                <View style={styles.item_content}>
                  <Text style={styles.item_header}>Species</Text>
                  <RNPickerSelect
                    style={styles.select_item}
                    value={selectedSpecies}
                    onDonePress={() => setBasicInfo({ ...basicInfo, species: selectedSpecies })}
                    onValueChange={setSelectedSpecies}
                    items={species}
                    placeholder={{ label: "Species", value: null }}
                    disabled={!isEditingBasicInfo}
                  />
                </View>
              </View>

              <View style={styles.item}>
                <Fontisto name="intersex" size={24} style={styles.icon_color} />
                <View style={styles.item_content}>
                  <Text style={styles.item_header}>Gender</Text>
                  <RNPickerSelect
                    style={styles.select_item}
                    value={selectedGender}
                    onDonePress={() => setBasicInfo({ ...basicInfo, gender: selectedGender })}
                    onValueChange={setSelectedGender}
                    items={genders}
                    placeholder={{ label: "Gender", value: null }}
                    disabled={!isEditingBasicInfo}
                  />
                </View>
              </View>

              <View style={styles.item}>
                <MaterialCommunityIcons name="scale-bathroom" size={24} style={styles.icon_color} />
                <View style={styles.item_content}>
                  <Text style={styles.item_header}>Weight</Text>
                  <TextInput
                    style={styles.item_value}
                    value={`${basicInfo?.weight}  kg`}
                    onChangeText={(text) => setBasicInfo({ ...basicInfo, weight: text })}
                    editable={isEditingBasicInfo}
                  />
                </View>
              </View>

              <View style={styles.item}>
                <FontAwesome name="birthday-cake" size={24} style={styles.icon_color} />
                <View style={styles.item_content}>
                  <Text style={styles.item_header}>Birthdate</Text>
                  <Button
                    style={styles.date_item}
                    text={new Date(basicInfo?.birthdate).toLocaleDateString()}
                    disabled={!isEditingBasicInfo}
                    onPress={() => setOpenCalendar(openCalendar === "" ? "birthdate" : "")}
                  />
                </View>
              </View>
            </View>
            {isEditingBasicInfo && openCalendar === "birthdate" && (
              <Calendar
                onDayPress={(day) => {
                  setBasicInfo({ ...basicInfo, birthdate: day.dateString });
                  setOpenCalendar("");
                }}
                markedDates={{
                  [new Date(basicInfo?.birthdate).toISOString().split("T")[0]]: {
                    selected: true,
                    disableTouchEvent: true,
                    selectedColor: colors.secondary,
                    selectedTextColor: colors.white,
                  },
                }}
                minDate="2000-01-01"
                initialDate={new Date(basicInfo?.birthdate).toISOString().split("T")[0] || today}
                maxDate={today}
                enableSwipeMonths={true}
                disableAllTouchEventsForDisabledDays
              />
            )}
          </View>

          <View style={styles.basicInfo}>
            <View style={styles.header_container}>
              <Text style={styles.header_text}>Medical Records</Text>
              {isEditingMedicalRecords ? (
                <Button style={styles.edit_button} text={"Save"} onPress={handleSaveMedicalRecords} />
              ) : (
                <Button style={styles.edit_button} text={"Edit"} onPress={() => setIsEditingMedicalRecords(true)} />
              )}
            </View>

            <View style={styles.detail_container}>
              <View style={styles.item}>
                <Fontisto name="injection-syringe" size={24} style={styles.icon_color} />
                <View style={styles.item_content}>
                  <Text style={styles.item_header}>Last Vaccination</Text>
                  <Button
                    style={styles.date_item}
                    text={selectedVaccineDate?.toLocaleDateString()}
                    disabled={!isEditingMedicalRecords}
                    onPress={() => setOpenCalendar(openCalendar === "" ? "lastVaccinationDate" : "")}
                  />
                </View>
              </View>
              {isEditingMedicalRecords && openCalendar == "lastVaccinationDate" && (
                <Calendar
                  onDayPress={(day) => {
                    setSelectedVaccineDate(new Date(day.dateString));
                    setOpenCalendar("");
                  }}
                  markedDates={{
                    [selectedVaccineDate?.toISOString().split("T")[0]]: {
                      selected: true,
                      disableTouchEvent: true,
                      selectedColor: colors.secondary,
                      selectedTextColor: colors.white,
                    },
                  }}
                  minDate="2000-01-01"
                  initialDate={selectedVaccineDate?.toISOString().split("T")[0]}
                  maxDate={today}
                  enableSwipeMonths={true}
                  disableAllTouchEventsForDisabledDays
                />
              )}

              <View style={styles.item}>
                <Fontisto name="doctor" size={24} style={styles.icon_color} />
                <View style={styles.item_content}>
                  <Text style={styles.item_header}>Last Vet Visit</Text>
                  <Button
                    style={styles.date_item}
                    text={selectedVetVisitDate?.toLocaleDateString()}
                    disabled={!isEditingMedicalRecords}
                    onPress={() => setOpenCalendar(openCalendar === "" ? "lastVetVisit" : "")}
                  />
                </View>
              </View>
            </View>
            {isEditingMedicalRecords && openCalendar === "lastVetVisit" && (
              <Calendar
                onDayPress={(day) => {
                  setSelectedVetVisitDate(new Date(day.dateString));
                  setOpenCalendar("");
                }}
                markedDates={{
                  [selectedVetVisitDate?.toISOString().split("T")[0]]: {
                    selected: true,
                    disableTouchEvent: true,
                    selectedColor: colors.secondary,
                    selectedTextColor: colors.white,
                  },
                }}
                minDate="2000-01-01"
                initialDate={selectedVetVisitDate?.toISOString().split("T")[0]}
                maxDate={today}
                enableSwipeMonths={true}
                disableAllTouchEventsForDisabledDays
              />
            )}
          </View>

          <View style={styles.basicInfo}>
            <View style={styles.header_container}>
              <Text style={styles.header_text}>Medications</Text>
              {isEditingMedications ? (
                <Button style={styles.edit_button} text={"Save"} onPress={handleSaveMeds} />
              ) : (
                <Button style={styles.edit_button} text={"Edit"} onPress={() => setIsEditingMedications(true)} />
              )}
            </View>
            <View>
              {isEditingMedications && (
                <View style={styles.item}>
                  <View style={styles.search_container}>
                    <TextInput
                      style={styles.item_value}
                      value={selectedMedication}
                      onChangeText={setSelectedMedication}
                      placeholder={"Medications..."}
                      onSubmitEditing={handleAddMedication}
                    />
                  </View>
                </View>
              )}

              {medications && medications.length > 0 ? (
                <View style={styles.chips_container}>
                  <ScrollView horizontal={true}>
                    {medications.map((medication) => {
                      return (
                        <View style={styles.chip_container} key={medication}>
                          <Text style={styles.chips}>{medication}</Text>
                          {isEditingMedications && (
                            <Button
                              text="x"
                              onPress={() => setMedications(medications.filter((med) => med !== medication))}
                              style={styles.delete_button}
                            />
                          )}
                        </View>
                      );
                    })}
                  </ScrollView>
                </View>
              ) : (
                <>{!isEditingMedications && <Text style={styles.text}>No medications</Text>}</>
              )}
            </View>
          </View>

          <View style={styles.basicInfo}>
            <View style={styles.header_container}>
              <Text style={styles.header_text}>Allergies</Text>
              {isEditingAllergies ? (
                <Button style={styles.edit_button} text={"Save"} onPress={handleSaveAllerg} />
              ) : (
                <Button style={styles.edit_button} text={"Edit"} onPress={() => setIsEditingAllergies(true)} />
              )}
            </View>
            <View>
              {isEditingAllergies && (
                <View style={styles.item}>
                  <View style={styles.search_container}>
                    <TextInput
                      style={styles.item_value}
                      value={selectedAllergie}
                      onChangeText={setSelectedAllergie}
                      placeholder={"Allergies..."}
                      onSubmitEditing={handleAddAllergie}
                    />
                  </View>
                </View>
              )}
              {allergies && allergies.length > 0 ? (
                <View style={styles.chips_container}>
                  <ScrollView horizontal={true}>
                    {allergies.map((allergie) => {
                      return (
                        <View style={styles.chip_container} key={allergie}>
                          <Text style={styles.chips}>{allergie}</Text>
                          {isEditingAllergies && (
                            <Button
                              text="x"
                              onPress={() => setAllergies(allergies.filter((allerg) => allerg !== allergie))}
                              style={styles.delete_button}
                            />
                          )}
                        </View>
                      );
                    })}
                  </ScrollView>
                </View>
              ) : (
                <>{!isEditingAllergies && <Text style={styles.text}>No allergies</Text>}</>
              )}
            </View>
          </View>
          <Button text={"Delete Pet"} onPress={onDeletePet} style={styles.delete_pet_button} />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 60,
    margin: 16,
    backgroundColor: colors.white,
    shadowColor: colors.gray,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    elevation: 4,
    borderRadius: 20,
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    color: colors.primary,
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
  edit_button: {
    container: {
      alignSelf: "flex-end",
    },
    text: {
      color: colors.secondary,
      fontSize: sizes.body1,
    },
  },
  basicInfo: {
    borderBottomWidth: 1,
    borderBottomColor: colors.light_gray,
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
      marginRight: 94,
    },
    inputAndroid: {
      fontSize: sizes.h4,
      marginRight: 94,
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
  search_container: {
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.light_gray,
    height: 30,
    width: "100%",
  },
  chips_container: {
    flexDirection: "row",
    marginBottom: 4,
  },
  chip_container: {
    flexDirection: "row",
    borderRadius: 20,
    backgroundColor: colors.secondary,
    padding: 12,
    margin: 4,
  },
  chips: {
    fontSize: sizes.body1,
    color: colors.white,
    alignSelf: "flex-start",
    fontWeight: "bold",
  },
  delete_button: {
    container: {
      marginLeft: 4,
    },
    text: {
      fontSize: sizes.body1,
      color: colors.lighter_gray,
    },
  },
  text: {
    fontSize: sizes.h4,
    color: colors.gray,
    alignSelf: "center",
    padding: 12,
    margin: 4,
  },
  delete_pet_button: {
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
