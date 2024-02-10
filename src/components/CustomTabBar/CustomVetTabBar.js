import { View, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import styles from "./CustomTabBar.style";
import { Entypo, FontAwesome, AntDesign, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const CustomTabBar = () => {
  const navigation = useNavigation();
  const [focused, setFocused] = useState(1);

  return (
    <View>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => navigation.navigate("Vet Home Screen") & setFocused(1)}>
          <Entypo name="home" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Tips Screen") & setFocused(2)}>
          <FontAwesome name="search" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Appointments") & setFocused(3)}>
          <AntDesign name="calendar" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Edit Vet Profile Screen") & setFocused(3)}>
          <Ionicons name="person" size={24} color="black" />{" "}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CustomTabBar;
