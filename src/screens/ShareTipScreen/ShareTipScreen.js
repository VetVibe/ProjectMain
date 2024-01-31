import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import axios from "axios";

export default function ShareTip({ route, navigation }) {
  const vetId = route.params.vetId;
  const [tip, setTip] = useState("");

  function handleSave() {
    axios
      .post(`http://10.0.2.2:3000/tip/addTip/${vetId}`, { content: tip })
      .then((response) => {
        navigation.goBack();
      })
      .catch((error) => {
        console.error(`Error during updating vet ${vetId} tips:`, error);
      });
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Share your tip</Text>
      </View>

      <TextInput
        style={styles.inputField}
        multiline={true}
        numberOfLines={10}
        placeholder="Write your tip here..."
        value={tip}
        onChangeText={setTip}
      />

      <TouchableOpacity style={styles.shareButton} onPress={handleSave}>
        <Text style={styles.shareButtonText}>SHARE</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    marginLeft: 10,
    fontSize: 24,
    fontWeight: "bold",
  },
  inputField: {
    borderWidth: 1,
    borderColor: "grey",
    padding: 15,
    textAlignVertical: "top", // for multiline text input
    borderRadius: 5,
    marginBottom: 20,
  },
  shareButton: {
    backgroundColor: "orange",
    padding: 15,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },
  shareButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
