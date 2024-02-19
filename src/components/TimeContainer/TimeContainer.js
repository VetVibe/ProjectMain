import React, { useRef } from "react";
import { TouchableOpacity, StyleSheet, Animated } from "react-native";
import { colors, sizes } from "../../constants";

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
      style={[styles.container, isSelected && styles.selected_time, { transform: [{ scale: scaleValue }] }]}
      onPress={() => onPress(time)}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.Text style={[styles.content_time, isSelected && styles.selected_content_time]}>{`${String(
        time
      ).padStart(2, "0")}:00 - ${String(time + 1).padStart(2, "0")}:00`}</Animated.Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    margin: 8,
    borderRadius: 50,
    borderColor: colors.primary,
    borderWidth: 1,
  },
  content_time: {
    color: colors.primary,
    fontSize: sizes.h3,
  },

  selected_content_time: {
    color: colors.white,
  },
  selected_time: {
    backgroundColor: colors.primary,
  },
});
