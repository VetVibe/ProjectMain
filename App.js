import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  SignInScreen,
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
  VetAppointmentsScreen,
} from "./src/screens";
import { AuthContext } from "./src/auth";

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
    <Stack.Navigator>
      <Stack.Screen name="Pet Owner Appointments" component={AppointmentsScreen} />
      <Stack.Screen name="Find Vets" component={VetSearchScreen} />
      <Stack.Screen name="Vet Home Screen" component={VetHomeScreen} />
      <Stack.Screen name="Make Appointment" component={MakeAppointmentScreen} />
    </Stack.Navigator>
  );
}

function PetOwnerTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Pet Owner Home Tab" component={PetOwnerHomeTab} />
      <Tab.Screen name="Tips Screen" component={TipsScreen} />
      <Tab.Screen name="Pet Owner Appointments Tab" component={PetOwnerAppointments} />
      <Tab.Screen name="Pet Owner Profile" component={PetOwnerProfileScreen} />
    </Tab.Navigator>
  );
}

function VetHome() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Vet Home Screen" component={VetHomeScreen} />
      <Stack.Screen name="Edit Vet Profile Screen" component={EditVetProfileScreen} />
    </Stack.Navigator>
  );
}

function VetTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Vet Home Screen" component={VetHome} />
      <Tab.Screen name="Tips Screen" component={TipsScreen} />
      <Tab.Screen name="Vet Appointments" component={VetAppointmentsScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [authState, setAuthState] = useState({ id: "", userType: "", signedIn: false });

  return (
    <AuthContext.Provider value={{ authState, setAuthState }}>
      <NavigationContainer>
        {authState.signedIn ? (
          authState.userType === "petOwner" ? (
            <PetOwnerTabs />
          ) : (
            <VetTabs />
          )
        ) : (
          <Stack.Navigator>
            <Stack.Screen name="Sign In" component={SignInScreen} />
            <Stack.Screen name="Sign up" component={SignUpScreen} />
          </Stack.Navigator>
        )}
      </NavigationContainer>
    </AuthContext.Provider>
  );
}
