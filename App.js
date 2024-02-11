import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
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
  VetSearchScreen,
  VetAppointmentsScreen,
} from "./src/screens";
import CustomPetOwnerTabBar from "./src/components/CustomTabBar/CustomPetOwnerTabBar";
import CustomVetTabBar from "./src/components/CustomTabBar/CustomVetTabBar";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function PetOwnerTabs() {
  return (
    <Tab.Navigator tabBar={(props) => <CustomPetOwnerTabBar {...props} />} screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Pet Owner Home" component={PetOwnerHomeScreen} />
      <Tab.Screen name="Find Vets" component={VetSearchScreen} />
      <Tab.Screen name="Tips" component={TipsScreen} />
      <Tab.Screen name="Pet Owner Profile" component={PetOwnerProfileScreen} />
      <Tab.Screen name="Pet Profile" component={PetProfileScreen} />
      <Tab.Screen name="Edit Pet Profile" component={EditPetProfileScreen} />
      <Tab.Screen name="Vet Home Screen" component={VetHomeScreen} />
      <Tab.Screen name="Appointments" component={VetAppointmentsScreen} />
    </Tab.Navigator>
  );
}

function VetTabs() {
  return (
    <Tab.Navigator tabBar={(props) => <CustomVetTabBar {...props} />} screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Vet Home Screen" component={VetHomeScreen} />
      <Tab.Screen name="Tips Screen" component={TipsScreen} />
      <Tab.Screen name="Appointments" component={VetAppointmentsScreen} />
      <Tab.Screen name="Edit Vet Profile Screen" component={EditVetProfileScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Sign up" component={SignUpScreen} />
        <Stack.Screen name="Pet Owner Tabs" component={PetOwnerTabs} />
        <Stack.Screen name="Vet Tabs" component={VetTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
