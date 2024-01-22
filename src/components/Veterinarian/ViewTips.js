import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

const ViewTips = () => {
    // Replace this with your actual data source
    const tips = [
        { id: 1, content: "Tip 1 content goes here..." },
        { id: 2, content: "Tip 2 content goes here..." },
        // ... more tips
    ];

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>View all tips</Text>
            {tips.map((tip) => (
                <View key={tip.id} style={styles.tipContainer}>
                    <Text style={styles.tipContent}>{tip.content}</Text>
                </View>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        marginTop: 60,
        marginBottom: 40,
        marginLeft: 0
    },
    tipContainer: {
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
        padding: 15,
        marginBottom: 10,
    },
    tipContent: {
        fontSize: 16,
    },
});

export default ViewTips;