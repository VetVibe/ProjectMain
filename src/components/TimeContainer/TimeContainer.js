import React, { useRef } from "react";
import { TouchableOpacity, Text, StyleSheet, Animated } from "react-native";

export default function TimeContainer({ time, onPress, isSelected }) {
  const scaleValue = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 1.2,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <TouchableOpacity
      style={[isSelected && { backgroundColor: "#f0f0f0" }, { transform: [{ scale: scaleValue }] }]}
      onPress={() => onPress(time)}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.Text style={[isSelected && { backgroundColor: "#f0f0f0" }]}>{`${String(time).padStart(
        2,
        "0"
      )}:00 - ${String(time + 1).padStart(2, "0")}:00`}</Animated.Text>
    </TouchableOpacity>
  );
}
