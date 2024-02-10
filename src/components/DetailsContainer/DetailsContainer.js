import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { formattedDate, calculateAge } from "../../utils";

export default function DetailsContainer({ title, value }) {
  function renderItem(title, value) {
    if (title === "Last Vaccination Date" || title === "Last Vet Visit") {
      return <Text style={styles.value}>{formattedDate(new Date(value))}</Text>;
    } else if (title === "Age") {
      return <Text style={styles.value}>{calculateAge(value)}</Text>;
    } else if (title === "Medications" || title === "Allergies") {
      return (
        <View style={styles.tagContainer}>
          {value.map((tag, index) => (
            <View key={index} style={styles.tagWrapper}>
              <View style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            </View>
          ))}
        </View>
      );
    }
    return (
      <>
        <Text style={styles.value}>{value}</Text>
      </>
    );
  }
  return (
    <View style={styles.detailsContainer}>
      <Text style={styles.label}>{title}</Text>
      {renderItem(title, value)}
    </View>
  );
}

const styles = StyleSheet.create({
  detailsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    padding: 10,
  },
  label: {
    fontSize: 16,
  },
  value: {
    fontSize: 16,
    fontWeight: "bold",
  },
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
  },
  tagWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
    marginRight: 5,
  },
  tag: {
    backgroundColor: "#ccc",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  tagText: {
    color: "black",
    fontWeight: "bold",
    fontSize: 17,
  },
});
