import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, Text, FlatList, StyleSheet, Alert, Image } from "react-native";
import { COLORS , images } from "../../constants";
import { AntDesign } from "@expo/vector-icons";
import axios from "axios";
import { UIImagePickerPresentationStyle } from "expo-image-picker";


export const useAllTips = () => {
  const  [vetTips,setVetTips] = useState([])
  const fetchAllTips = async () => {
    try {
      const response = await axios.get('http://localhost:3000/tips/all');
      if (response.data) {
        setVetTips(response.data);
      }
    } catch (error) {
      console.error("Error fetching tips:", error);
    }
  };

  return {
    fetchAllTips,
    vetTips,
    setVetTips
  }
}

export default function TipsScreenPet({ route, navigation }) {
  const   {fetchAllTips,vetTips }= useAllTips()
  useEffect(() => {
    fetchAllTips();
    const subscription = navigation?.addListener("focus", fetchAllTips);
    return () => {
      if (subscription) {
        subscription();
      }
    };
  }, [navigation]);


  const renderItem = ({ item }) => {
    return (
      <View style={styles.tipContainer}>
        <Image
          source={images.Vetprofile} // Make sure to update this to use item-specific images if available
          resizeMode="cover"
          style={styles.profileImage}
        />
        <View style={styles.tipTextContainer}>
          <Text style={styles.tipContent}>{item.content}</Text>
          <Text style={styles.vetName}>By: {item.vetName}</Text>
        </View>
      </View>
    );
  };  

  return (
    <View style={styles.container}>
      
      <Text style={styles.title}>Vet Tips</Text>
      <FlatList
        data={vetTips}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
      />
    </View>
  );
}


  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
    },
    title: {
      fontSize: 20,
      fontWeight: "bold",
      marginBottom: 10,
    },
    tipContainer: {
      flexDirection: 'row', // Set flexDirection to row to align items horizontally
      backgroundColor: "#f0f0f0",
      borderRadius: 2,
      padding: 5,
      marginBottom: 10,
      alignItems: 'center', // Align items vertically in the center
    },
    profileImage: {
      height: 60, // Adjust the size as needed
      width: 60, // Adjust the size as needed
      borderRadius: 20, // Make it round
      marginRight: 15, // Add some spacing between the image and the text
    },
    tipTextContainer: {
      flex: 1, // Take up the remaining space
    },
    tipContent: {
      fontSize: 16,
    },
    vetName: {
      fontStyle: 'italic',
      marginTop: 5,
    },
    addButton: {
      alignSelf: 'flex-end',
      marginBottom: 10,
    },
});