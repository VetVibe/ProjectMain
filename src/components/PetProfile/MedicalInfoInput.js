import React, { useState } from "react";
import { View, Text, ScrollView, StyleSheet, TextInput, FlatList } from "react-native";
import moment from "moment";
import { colors, sizes } from "../../constants";
import Button from "../Button/Button";
import { Calendar } from "react-native-calendars";

export default function MedicalInfoInput({ item, onSave }) {
  const [pet, setPet] = useState(item);
  const [selectedMedication, setSelectedMedication] = useState();
  const [selectedAllergie, setSelectedAllergie] = useState();
  const [vaccinDate, setVaccinDate] = useState(
    pet.lastVaccinationDate && new Date(pet.lastVaccinationDate).toISOString().split("T")[0]
  );
  const [vetVisitiDate, setVetVisitiDate] = useState(
    pet.lastVetVisit && new Date(pet.lastVetVisit).toISOString().split("T")[0]
  );
  const [openCalendar, setOpenCalendar] = useState("");
  const today = moment().format("YYYY-MM-DD");

  const handleAddMedication = () => {
    setPet((prevPet) => ({ ...prevPet, medications: [...prevPet.medications, selectedMedication] }));
    setSelectedMedication("");
  };

  const handleAddAllergie = () => {
    setPet((prevPet) => ({ ...prevPet, allergies: [...prevPet.allergies, selectedAllergie] }));
    setSelectedAllergie("");
  };

  const renderMedChip = (item) => {
    return (
      <View style={styles.chip_container} key={item}>
        <Text style={styles.chip_text}>{item}</Text>
        <Button
          text="x"
          onPress={() =>
            setPet((prevPet) => ({
              ...prevPet,
              medications: prevPet.medications.filter((med) => med !== item),
            }))
          }
          style={styles.delete_button}
        />
      </View>
    );
  };

  const renderAlergChip = (item) => {
    return (
      <View style={styles.chip_container} key={item}>
        <Text style={styles.chip_text}>{item}</Text>
        <Button
          text="x"
          onPress={() =>
            setPet((prevPet) => ({ ...prevPet, allergies: prevPet.allergies.filter((allerg) => allerg !== item) }))
          }
          style={styles.delete_button}
        />
      </View>
    );
  };

  return (
    <View style={styles.screen_container}>
      <ScrollView style={styles.container}>
        <View style={styles.header_container}>
          <Text style={styles.header_text}>Medical Records</Text>
        </View>

        <View style={styles.item}>
          <Text style={styles.item_header}>Last Vaccination</Text>
          <View style={styles.item_content}>
            <Button
              style={styles.date_item}
              text={vaccinDate || "Choose date..."}
              onPress={() => setOpenCalendar(openCalendar === "" ? "lastVaccinationDate" : "")}
            />
          </View>
        </View>
        {openCalendar == "lastVaccinationDate" && (
          <Calendar
            onDayPress={(day) => {
              setVaccinDate(day.dateString);
              setPet((prevPet) => ({ ...prevPet, lastVaccinationDate: new Date(day.dateString) }));
              setOpenCalendar("");
            }}
            markedDates={{
              [vaccinDate || today]: {
                selected: true,
                disableTouchEvent: true,
                selectedColor: colors.secondary,
                selectedTextColor: colors.white,
              },
            }}
            minDate="2000-01-01"
            initialDate={vaccinDate || today}
            maxDate={today}
            enableSwipeMonths={true}
            disableAllTouchEventsForDisabledDays
          />
        )}

        <View style={styles.item}>
          <Text style={styles.item_header}>Last Vet Visit</Text>
          <View style={styles.item_content}>
            <Button
              style={styles.date_item}
              text={vetVisitiDate || "Choose date..."}
              onPress={() => setOpenCalendar(openCalendar === "" ? "lastVetVisit" : "")}
            />
          </View>
        </View>
        {openCalendar === "lastVetVisit" && (
          <Calendar
            onDayPress={(day) => {
              setVetVisitiDate(day.dateString);
              setPet((prevPet) => ({ ...prevPet, lastVetVisit: new Date(day.dateString) }));
              setOpenCalendar("");
            }}
            markedDates={{
              [vetVisitiDate || today]: {
                selected: true,
                disableTouchEvent: true,
                selectedColor: colors.secondary,
                selectedTextColor: colors.white,
              },
            }}
            minDate="2000-01-01"
            initialDate={vetVisitiDate || today}
            maxDate={today}
            enableSwipeMonths={true}
            disableAllTouchEventsForDisabledDays
          />
        )}

        <View style={styles.item}>
          <Text style={styles.item_header}>Medications</Text>
          <View style={styles.search_container}>
            <TextInput
              style={styles.item_value}
              value={selectedMedication}
              onChangeText={setSelectedMedication}
              placeholder={"Medications..."}
              onSubmitEditing={handleAddMedication}
            />
          </View>
          {pet.medications && pet.medications.length > 0 && (
            <View style={styles.chips_container}>
              <FlatList
                horizontal
                decelerationRate={"fast"}
                showsHorizontalScrollIndicator={false}
                data={pet.medications}
                renderItem={({ item }) => renderMedChip(item)}
              />
            </View>
          )}
        </View>

        <View style={styles.item}>
          <Text style={styles.item_header}>Allergies</Text>
          <View style={styles.search_container}>
            <TextInput
              style={styles.item_value}
              value={selectedAllergie}
              onChangeText={setSelectedAllergie}
              placeholder={"Allergies..."}
              onSubmitEditing={handleAddAllergie}
            />
          </View>

          {pet.allergies && pet.allergies.length > 0 && (
            <View style={styles.chips_container}>
              <FlatList
                horizontal
                decelerationRate={"fast"}
                showsHorizontalScrollIndicator={false}
                data={pet.allergies}
                renderItem={({ item }) => renderAlergChip(item)}
              />
            </View>
          )}
        </View>
      </ScrollView>
      <Button text={"Save"} onPress={() => onSave(pet)} style={styles.save_button} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen_container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  container: {
    margin: 8,
  },
  header_container: {
    padding: 16,
    marginBottom: 12,
    alignItems: "center",
  },
  header_text: {
    fontSize: sizes.h2,
    color: colors.primary,
    fontWeight: "bold",
  },
  item: {
    marginVertical: 24,
    paddingHorizontal: 24,
  },
  item_content: {
    marginVertical: 12,
    borderColor: colors.light_gray,
    borderWidth: 1,
    borderRadius: 20,
    padding: 12,
  },
  item_header: {
    fontSize: sizes.h3,
    fontWeight: "bold",
  },
  search_container: {
    marginVertical: 12,
    borderColor: colors.light_gray,
    borderBottomWidth: 1,
    borderRadius: 20,
    shadowColor: colors.gray,
    shadowOpacity: 0.3,
    padding: 12,
  },
  date_item: {
    container: {
      flex: 1,
    },
    text: {
      fontSize: sizes.body1,
    },
  },
  save_button: {
    container: {
      margin: 12,
      marginHorizontal: 30,
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
  item_value: {
    flex: 1,
    fontSize: sizes.h4,
    marginLeft: 20,
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
  chips_container: {
    flex: 1,
    marginBottom: 4,
  },
  chip_container: {
    flexDirection: "row",
    borderRadius: 20,
    borderColor: colors.primary,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 6,
  },
  chip_text: {
    flex: 1,
    fontSize: sizes.body1,
    color: colors.primary,
    alignSelf: "flex-start",
  },
  delete_button: {
    container: {
      flex: 1,
      marginLeft: 6,
    },
    text: {
      fontSize: sizes.body1,
      color: colors.gray,
    },
  },
  text: {
    fontSize: sizes.h4,
    color: colors.gray,
    alignSelf: "center",
    padding: 12,
    margin: 4,
  },
});
