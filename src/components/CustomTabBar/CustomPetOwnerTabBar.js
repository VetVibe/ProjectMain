import { View, TouchableOpacity, StyleSheet } from "react-native";
import React, { useState } from "react";
import { Entypo, FontAwesome, MaterialIcons, Ionicons, AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function CustomPetOwnerTabBar() {
  const navigation = useNavigation();
  const [focused, setFocused] = useState(1);

  return (
    <View>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => navigation.navigate("Pet Owner Home") & setFocused(1)}>
          <Entypo name="home" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Tips") & setFocused(2)}>
          <MaterialIcons name="my-library-books" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Appointments") & setFocused(3)}>
          <AntDesign name="calendar" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Pet Owner Profile") & setFocused(4)}>
          <Ionicons name="person" size={24} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#4B5D67",
    flexDirection: "row",
    justifyContent: "space-around",
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
  },
  icon: {
    fontSize: 40,
    padding: 8,
    color: "#222",
  },
  iconFocused: {
    fontSize: 40,
    padding: 8,
    color: "#000",
  },
});
