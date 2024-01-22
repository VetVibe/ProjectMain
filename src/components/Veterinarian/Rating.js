import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Rating as StarRating } from 'react-native-ratings';

const Rating = ({ navigation }) => {
    const [rating, setRating] = useState(0);

    const handleRatingCompleted = (rating) => {
        console.log("Rating is: " + rating);
        setRating(rating);
        // Add logic to handle the rating value
    };

    const saveRating = () => {
        console.log("Saved Rating: " + rating);
        // Add logic to save the rating, e.g., send to a backend server
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                Are you a customer of this vet?
            </Text>
            <Text style={styles.subtitle}>
                If so, how satisfied are you with his services?
            </Text>
            <StarRating
                rating={rating}
                onFinishRating={handleRatingCompleted}
                style={styles.rating}
                imageSize={40}
            />
            <TouchableOpacity style={styles.button} onPress={saveRating}>
                <Text style={styles.buttonText}>Save My Rating</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: 'white', // Changed background color to white
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    subtitle: {
        fontSize: 18,
        textAlign: 'center',
        marginVertical: 20
    },
    rating: {
        paddingVertical: 10,
    },
    button: {
        marginTop: 20,
        backgroundColor: 'orange',
        padding: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold'
    }
});

export default Rating;