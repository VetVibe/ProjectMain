import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function DetailsContainer({ title, value }){
  return (
        <View style={styles.detailsContainer}>
          <Text style={styles.label}>{title}</Text>
          <Text style={styles.value}>{value}</Text>
        </View>
  );
};

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
