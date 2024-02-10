import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";

export default function TagContainer({ title, value, onChangeTags }) {
  const [text, setText] = useState("");
  const [editIndex, setEditIndex] = useState(null);

  const addTag = () => {
    if (text.trim() !== "") {
      if (editIndex !== null) {
        // If editing an existing tag
        const newTags = [...value];
        newTags[editIndex] = text.trim();
        setEditIndex(null);
        onChangeTags(title, newTags);
      } else {
        // If adding a new tag
        onChangeTags(title, [...value, text.trim()]);
      }
      setText("");
    }
  };

  const removeTag = (index) => {
    const newTags = [...value];
    newTags.splice(index, 1);
    onChangeTags(title, newTags);
  };

  const editTag = (index) => {
    const tagToEdit = value[index];
    setText(tagToEdit);
    setEditIndex(index);
  };

  return (
    <View style={styles.container}>
      <View style={styles.tagContainer}>
        {value.map((tag, index) => (
          <View key={index} style={styles.tagWrapper}>
            <TouchableOpacity onPress={() => editTag(index)} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => removeTag(index)} style={styles.removeButton}>
              <Text style={styles.removeButtonText}>X</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Add a tag"
          value={text}
          onChangeText={setText}
          onSubmitEditing={addTag}
        />
        <TouchableOpacity onPress={addTag} style={styles.addButton}>
          <Text style={styles.buttonText}>{editIndex !== null ? "Update" : "Add"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 20,
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
  removeButton: {
    marginLeft: 5,
    padding: 5,
    borderRadius: 10,
    backgroundColor: "#E53935",
  },
  removeButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: "#CCCCCC",
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginRight: 10,
    backgroundColor: "#FFFFFF",
  },
  addButton: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
