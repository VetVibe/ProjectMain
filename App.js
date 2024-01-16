import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./src/components/HomeScreen/LoginScreen";
import RegistrationScreen from "./src/components/HomeScreen/RegistrationScreen";
import HomeScreen from "./src/components/HomeScreen/HomeScreen";
import PetOwnerHomeScreen from "./src/components/PetOwner/PetOwnerHomeScreen";
import VeterinarianHomeScreen from "./src/components/Veterinarian/VeterinarianHomeScreen";
import PetProfileScreen from "./src/components/PetOwner/PetProfileScreen";
import EditPetProfileScreen from "./src/components/PetOwner/EditPetProfileScreen";
import VeterinarianEditProfile from "./src/components/Veterinarian/VeterinarianEditProfile";
import AddTipScreen from "./src/components/Veterinarian/AddTipScreen";
import EditTipScreen from "./src/components/Veterinarian/EditTipScreen";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Sign up" component={RegistrationScreen} />
        <Stack.Screen name="Pet Owner Home Screen" component={PetOwnerHomeScreen} />
        <Stack.Screen name="Pet Profile Screen" component={PetProfileScreen} />
        <Stack.Screen name="Pet Profile Screen Edit" component={EditPetProfileScreen} />
        <Stack.Screen name="Veterinarian Home Screen" component={VeterinarianHomeScreen} />
        <Stack.Screen name="Edit Tip Screen" component={EditTipScreen} />
        <Stack.Screen name="Veterinarian Edit Profile Screen" component={VeterinarianEditProfile} />
        <Stack.Screen name="Add Tip Screen" component={AddTipScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};