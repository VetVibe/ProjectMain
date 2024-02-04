// Import the React library to use in our app for building user interfaces
import React from "react";
// Import NavigationContainer from '@react-navigation/native' to manage our app's navigation tree and contain the navigation state
import { NavigationContainer } from "@react-navigation/native";
// Import createStackNavigator, a function that returns an object containing navigators, allowing us to create a stack of screens
import { createStackNavigator } from "@react-navigation/stack";
// Import various screens from the './src/screens' directory to use in navigation
import {
  HomeScreen,
  SignUpScreen,
  PetOwnerHomeScreen,
  PetProfileScreen,
  EditPetProfileScreen,
  VetHomeScreen,
  ShareTipScreen,
  EditVetProfileScreen,
  EditPetOwnerProfileScreen,
  TipsScreen,
  TipsScreenPet,
} from "./src/screens";

// Create a stack navigator by calling createStackNavigator(), which manages transitions between screens
const Stack = createStackNavigator();

// Define the main component of our app, App, which will render the user interface
export default function App() {
  // The component returns JSX (JavaScript XML), a syntax extension for React
  return (
    // NavigationContainer wraps the entire navigation structure to provide a context for navigation
    <NavigationContainer>
      {/* Stack.Navigator initializes a navigator with screens, managing how users navigate between them */}
      <Stack.Navigator initialRouteName="Home">
        {/* Stack.Screen defines a screen in the navigation stack with a name and the component to render */}
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Sign up" component={SignUpScreen} />
        <Stack.Screen name="Pet Owner Home Screen" component={PetOwnerHomeScreen} />
        <Stack.Screen name="Pet Profile Screen" component={PetProfileScreen} />
        <Stack.Screen name="Pet Profile Screen Edit" component={EditPetProfileScreen} />
        <Stack.Screen name="Vet Home Screen" component={VetHomeScreen} />
        <Stack.Screen name="Share Tip Screen" component={ShareTipScreen} />
        <Stack.Screen name="Edit Vet Profile Screen" component={EditVetProfileScreen} />
        <Stack.Screen name="Edit Pet Owner Profile Screen" component={EditPetOwnerProfileScreen} />
        <Stack.Screen name="Tips Screen" component={TipsScreen} />
        <Stack.Screen name="Tips Screen Pet" component={TipsScreenPet} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}