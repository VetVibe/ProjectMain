import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./src/components/HomeScreen/LoginScreen";
import RegistrationScreen from "./src/components/HomeScreen/RegistrationScreen";
import HomeScreen from "./src/components/HomeScreen/HomeScreen";
import PetOwnerHomeScreen from "./src/components/PetOwner/PetOwnerHomeScreen";
import PetProfileScreen from "./src/components/PetOwner/PetProfileScreen";
import EditPetProfileScreen from "./src/components/PetOwner/EditPetProfileScreen";
import EditVetProfile from "./src/components/Veterinarian/EditVetProfile";
import NumberOfClients from "./src/components/Veterinarian/NumberOfClients";
import Rating from "./src/components/Veterinarian/Rating";
import ShareTip from "./src/components/Veterinarian/ShareTip";
import UpdateAvailability from "./src/components/Veterinarian/UpdateAvailability";
import VetProfile from "./src/components/Veterinarian/VetProfile";
import ViewTips from "./src/components/Veterinarian/ViewTips";
import ViewVetProfile from "./src/components/Veterinarian/ViewVetProfile";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="HomeScreen">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Sign up" component={RegistrationScreen} />
        <Stack.Screen name="Pet Owner Home Screen" component={PetOwnerHomeScreen} />
        <Stack.Screen name="Pet Profile Screen" component={PetProfileScreen} />
        <Stack.Screen name="Pet Profile Screen Edit" component={EditPetProfileScreen} />
        <Stack.Screen name="Edit Vet Profile" component={EditVetProfile} />
        <Stack.Screen name="Number Of Clients" component={NumberOfClients} />
        <Stack.Screen name="Rating" component={Rating} />
        <Stack.Screen name="Share Tip" component={ShareTip} />
        <Stack.Screen name="Update Availability" component={UpdateAvailability} />
        <Stack.Screen name="Vet Profile" component={VetProfile} />
        <Stack.Screen name="View Tips" component={ViewTips} />
        <Stack.Screen name="View Vet Profile" component={ViewVetProfile} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};