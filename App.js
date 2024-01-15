import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./src/components/HomeScreen/LoginScreen";
import RegistrationScreen from "./src/components/HomeScreen/RegistrationScreen";
import HomeScreen from "./src/components/HomeScreen/HomeScreen";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Sign up" component={RegistrationScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};