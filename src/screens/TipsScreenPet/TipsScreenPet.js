import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, Text, FlatList, StyleSheet, Alert } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import axios from "axios";
import { COLORS } from "../../constants";


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
        <Text style={styles.tipContent}>{item.content}</Text>
        <Text style={styles.vetName}>By: {item.vetName}</Text>
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
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
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
  }
});
