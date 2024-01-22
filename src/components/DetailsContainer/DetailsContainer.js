import React from "react";
import { View, Text, StyleSheet } from "react-native";

const formattedDate = (date) => {
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
};

export default function DetailsContainer({ title, value }) {
  return (
    <View style={styles.detailsContainer}>
      <Text style={styles.label}>{title}</Text>
      {title == "Last Vaccination Date" || title === "Last Vet Visit" ? (
        <Text style={styles.value}>{formattedDate(new Date(value))}</Text>
      ) : (
        <Text style={styles.value}>{value}</Text>
      )}
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
});
