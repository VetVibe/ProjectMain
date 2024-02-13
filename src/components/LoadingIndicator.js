import React from "react";
import { View, Text, ActivityIndicator } from "react-native";

const LoadingIndicator = () => (
  <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    <ActivityIndicator size="large" color="blue" />
    <Text>Loading...</Text>
  </View>
);

export default LoadingIndicator;
