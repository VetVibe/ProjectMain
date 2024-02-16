import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { COLORS } from "../../constants";
import { Rating } from "react-native-ratings";

export default function RateVet({ petOwnerRate, onNewRating }) {
  const [rating, setRating] = useState(petOwnerRate || 0);
  const [isEditing, setIsEditing] = useState(false);

  const saveRating = async () => {
    setIsEditing(false);
    console.log("Rating saved:", rating);
    onNewRating(rating);
  };

  return (
    <View style={styles.container}>
      {petOwnerRate ? <Text style={styles.subtitle}>Your rate</Text> : <Text style={styles.subtitle}>Rate</Text>}
      <Rating
        startingValue={rating}
        onSwipeRating={() => setIsEditing(true)}
        onFinishRating={setRating}
        style={styles.rating}
        imageSize={40}
        isDisabled={!isEditing}
        fractions={1}
        minValue={0}
        showRating
      />
      {isEditing && (
        <>
          <TouchableOpacity style={styles.button} onPress={saveRating}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => setIsEditing(false)}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </>
      )}
      {petOwnerRate && !isEditing && (
        <TouchableOpacity onPress={() => setIsEditing(true)}>
          <MaterialIcons name="edit" size={24} color={COLORS.black} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "white",
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
  },
  rating: {
    paddingVertical: 10,
  },
  button: {
    marginTop: 20,
    backgroundColor: "orange",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
