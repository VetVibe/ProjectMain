import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const ShareTip = ({ navigation }) => {
    const [tip, setTip] = useState('');

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <MaterialIcons name="edit" size={24} color="black" />
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

            <TouchableOpacity style={styles.shareButton} onPress={() => {/* Handle the share logic here */}}>
                <Text style={styles.shareButtonText}>SHARE</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    headerTitle: {
        marginLeft: 10,
        fontSize: 24,
        fontWeight: 'bold',
    },
    inputField: {
        borderWidth: 1,
        borderColor: 'grey',
        padding: 15,
        textAlignVertical: 'top', // for multiline text input
        borderRadius: 5,
        marginBottom: 20,
    },
    shareButton: {
        backgroundColor: 'orange',
        padding: 15,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
    },
    shareButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default ShareTip;