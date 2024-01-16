import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet } from "react-native";
import axios from "axios";

const EditTipScreen = ({ route, navigation }) => {
  const { vetId, tip, onTipUpdated } = route.params || {};
  const [editedTip, setEditedTip] = useState({
    title: tip.title,
    content: tip.content,
  });

  const updateTip = async () => {
    try {
      await axios.put(
        `http://localhost:3000/veterinarian/tips/${vetId}/${tip._id}`,
        editedTip
      );

      // Notify the parent screen about the tip update
      onTipUpdated();

      Alert.alert("Tip Updated", "Your tip has been updated successfully.");
      navigation.goBack();
    } catch (error) {
      console.error("Error updating tip:", error);
      Alert.alert("Error", "Failed to update tip. Please try again.");
    }
  };
  useEffect(() => {
    // Execute the onTipUpdated callback when the component mounts
    if (onTipUpdated && typeof onTipUpdated === "function") {
      onTipUpdated();
    }
  }, [onTipUpdated]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Tip</Text>
      <TextInput
        style={styles.input}
        placeholder="Tip Title"
        value={editedTip.title}
        onChangeText={(text) => setEditedTip({ ...editedTip, title: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Tip Content"
        value={editedTip.content}
        onChangeText={(text) => setEditedTip({ ...editedTip, content: text })}
        multiline
      />
      <Button title="Save Changes" onPress={updateTip} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  input: {
    height: 150,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 8,
    padding: 8,
    textAlignVertical:"top",
  },
});

export default EditTipScreen;
