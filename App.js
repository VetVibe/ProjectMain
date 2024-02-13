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
  AppointmentsScreen,
  MakeAppointmentScreen,
} from "./src/screens";
import CustomPetOwnerTabBar from "./src/components/CustomTabBar/CustomPetOwnerTabBar";
import CustomVetTabBar from "./src/components/CustomTabBar/CustomVetTabBar";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function PetOwnerHomeTab() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Pet Owner Home" component={PetOwnerHomeScreen} />
      <Stack.Screen name="Pet Profile" component={PetProfileScreen} />
      <Stack.Screen name="Edit Pet Profile" component={EditPetProfileScreen} />
    </Stack.Navigator>
  );
}

function PetOwnerAppointments() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Appointments" component={AppointmentsScreen} />
      <Stack.Screen name="Find Vets" component={VetSearchScreen} />
      <Stack.Screen name="Vet Home Screen" component={VetHomeScreen} />
      <Stack.Screen name="Make Appointment" component={MakeAppointmentScreen} />
    </Stack.Navigator>
  );
}

function PetOwnerTabs() {
  return (
    <Tab.Navigator tabBar={(props) => <CustomPetOwnerTabBar {...props} />} screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Pet Owner Home Tab" component={PetOwnerHomeTab} />
      <Tab.Screen name="Tips" component={TipsScreen} />
      <Tab.Screen name="Appointments" component={PetOwnerAppointments} />
      <Tab.Screen name="Pet Owner Profile" component={PetOwnerProfileScreen} />
    </Tab.Navigator>
  );
}

function VetHome() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Vet Home Screen" component={VetHomeScreen} />
      <Stack.Screen name="Edit Vet Profile Screen" component={EditVetProfileScreen} />
    </Stack.Navigator>
  );
}

function VetAppointments() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Make Appointment" component={MakeAppointmentScreen} />
      <Tab.Screen name="Appointments" component={AppointmentsScreen} />
    </Stack.Navigator>
  );
}

function VetTabs() {
  return (
    <Tab.Navigator tabBar={(props) => <CustomVetTabBar {...props} />} screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Vet Home Screen" component={VetHome} />
      <Tab.Screen name="Tips Screen" component={TipsScreen} />
      <Tab.Screen name="Make Appointment" component={VetAppointments} />
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
