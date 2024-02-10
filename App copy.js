import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import {
  HomeScreen,
  SignUpScreen,
  PetOwnerHomeScreen,
  PetProfileScreen,
  EditPetProfileScreen,
  VetHomeScreen,
  EditVetProfileScreen,
  PetOwnerProfileScreen,
  TipsScreen,
} from "./src/screens";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Sign up" component={SignUpScreen} />
        <Stack.Screen name="Pet Owner Home Screen" component={PetOwnerHomeScreen} />
        <Stack.Screen name="Pet Profile Screen" component={PetProfileScreen} />
        <Stack.Screen name="Pet Profile Screen Edit" component={EditPetProfileScreen} />
        <Stack.Screen name="Vet Home Screen" component={VetHomeScreen} />
        <Stack.Screen name="Edit Vet Profile Screen" component={EditVetProfileScreen} />
        <Stack.Screen name="Pet Owner Profile Screen" component={PetOwnerProfileScreen} />
        <Stack.Screen name="Tips Screen" component={TipsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
