import React, { useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import RNPickerSelect from "react-native-picker-select";
import { Calendar } from "react-native-calendars";
import { colors, sizes, genders, species } from "../../constants";
import Button from "../Button/Button";
import Input from "../Input/Input";

export default function BasicInfoInput({ item, onSave }) {
  const today = new Date().toISOString().split("T")[0];
  const [pet, setPet] = useState(item);
  const [selectedSpecies, setSelectedSpecies] = useState(pet.species);
  const [selectedGender, setSelectedGender] = useState(pet.gender);
  const [selectedDate, setSelectedDate] = useState(new Date(pet.birthdate).toISOString().split("T")[0]);
  const [openCalendar, setOpenCalendar] = useState(false);

  return (
    <View style={styles.screen_container}>
      <ScrollView style={styles.container}>
        <View style={styles.header_container}>
          <Text style={styles.header_text}>Pet Info</Text>
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
                value={`${pet?.weight}`}
                onChangeText={(text) => setPet({ ...pet, weight: text })}
                placeholder="Weight (kg)"
              />
            </View>
          </View>

          <View style={styles.item}>
            <Text style={styles.item_header}>Birthdate</Text>
            <View style={styles.select_content}>
              <Button style={styles.date_item} text={selectedDate} onPress={() => setOpenCalendar(!openCalendar)} />
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
      </ScrollView>
      <Button text={"Save"} onPress={() => onSave(pet)} style={styles.save_button} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen_container: { flex: 1, backgroundColor: colors.white },
  container: {
    margin: 8,
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
