import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';

const EditPetOwnerProfileScreen = ({ navigation, route }) => {
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const { petOwnerId } = route.params;
  ;

  const updateEmail = async () => {
    try {
      console.log("Updating email for pet owner ID:", petOwnerId); // Print the petOwnerId
      await axios.put(`http://localhost:3000/petOwner/updateEmail/${petOwnerId}`, { newEmail });
      Alert.alert("Success", "Email updated successfully.");
    } catch (error) {
      console.error("Error updating email", error);
      Alert.alert("Error", "Failed to update email.");
    }
  };

  const updatePassword = async () => {
    try {
      await axios.put(`http://localhost:3000/petOwner/updatePassword/${petOwnerId}`, { newPassword });
      Alert.alert("Success", "Password updated successfully.");
    } catch (error) {
      console.error("Error updating password", error);
      Alert.alert("Error", "Failed to update password.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>New Email:</Text>
      <TextInput
        style={styles.input}
        value={newEmail}
        onChangeText={setNewEmail}
        placeholder="Enter new email"
        autoCapitalize="none"
      />
      <TouchableOpacity onPress={updateEmail} style={styles.button}>
        <Text style={styles.buttonText}>Update Email</Text>
      </TouchableOpacity>

      <Text style={styles.label}>New Password:</Text>
      <TextInput
        style={styles.input}
        value={newPassword}
        onChangeText={setNewPassword}
        placeholder="Enter new password"
        secureTextEntry
      />
      <TouchableOpacity onPress={updatePassword} style={styles.button}>
        <Text style={styles.buttonText}>Update Password</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    fontSize: 14,
    borderWidth: 1,
    borderColor: 'gray',
    marginBottom: 15,
    padding: 10,
    borderRadius: 5,
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default EditPetOwnerProfileScreen;
