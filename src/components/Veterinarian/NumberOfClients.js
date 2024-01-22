import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const NumberOfClients = ({ navigation }) => {
    const [isSelected, setIsSelected] = useState(null);

    const handleSelection = (selection) => {
        setIsSelected(selection);
        // Here you can add the logic to immediately handle the selection
        console.log("Selected: " + selection);
        // For example, updating the status in a backend server
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                Are you a customer of this vet?{"\n"}
            </Text>
            
            <View style={styles.choiceContainer}>
                <TouchableOpacity 
                    style={[styles.choice, isSelected === 'yes' && styles.selectedChoice]}
                    onPress={() => handleSelection('yes')}
                >
                    <Text style={[styles.choiceText, isSelected === 'yes' && styles.selectedText]}>Yes</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={[styles.choice, isSelected === 'no' && styles.selectedChoice]}
                    onPress={() => handleSelection('no')}
                >
                    <Text style={[styles.choiceText, isSelected === 'no' && styles.selectedText]}>No</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: 'white',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 30,
    },
    choiceContainer: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    choice: {
        borderWidth: 1,
        borderColor: 'orange',
        backgroundColor: 'white',
        padding: 15,
        margin: 10,
        borderRadius: 5,
    },
    selectedChoice: {
        backgroundColor: 'orange',
    },
    choiceText: {
        color: 'black',
        fontWeight: 'bold',
    },
    selectedText: {
        color: 'white',
    },
});

export default NumberOfClients;