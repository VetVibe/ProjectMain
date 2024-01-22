import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Switch, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const UpdateAvailability = ({ navigation }) => {
  const [isAvailable, setIsAvailable] = useState(false);

  const toggleSwitch = () => setIsAvailable(previousState => !previousState);

  return (
    <View style={styles.container}>
      <View style={styles.switchContainer}>
        <Text style={styles.availabilityText}>
          {isAvailable ? 'Available' : 'Unavailable'}
        </Text>
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={isAvailable ? "#f5dd4b" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={isAvailable}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20
  },
  headerText: {
    fontSize: 20,
    marginLeft: 10
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '50%',
    padding: 10
  },
  availabilityText: {
    fontSize: 18,
    marginRight: 10
  }
});

export default UpdateAvailability;
