import React, { useState } from "react";
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

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function PetOwnerTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Pet Owner Home" component={PetOwnerHomeScreen} />
      <Tab.Screen name="Find Vets" component={VetSearchScreen} />
      <Tab.Screen name="Tips" component={TipsScreen} />
      <Tab.Screen name="Pet Owner Profile" component={PetOwnerProfileScreen} />
    </Tab.Navigator>
  );
}

function VetTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Vet Home Screen" component={VetHomeScreen} />
      <Tab.Screen name="Tips Screen" component={TipsScreen} />
      <Tab.Screen name="Appointments" component={VetAppointmentsScreen} />
      <Tab.Screen name="Edit Vet Profile Screen" component={EditVetProfileScreen} />
    </Tab.Navigator>
  );
}

function Content() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Use state to track login status
  const [userInfo, setUserInfo] = useState({
    type: "",
    userId: "",
  }); // Use state to track user type [vet, petOwner]

  const handleLogin = (info) => {
    setIsLoggedIn(true);
    setUserInfo(info);
  };

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isLoggedIn ? (
        <>
          {userInfo.type === "petOwner" ? (
            <>
              <Stack.Screen name="Pet Owner Tabs" component={PetOwnerTabs} />
              <Stack.Screen name="Pet Profile" component={PetProfileScreen} />
              <Stack.Screen name="Edit Pet Profile" component={EditPetProfileScreen} />
            </>
          ) : (
            <Stack.Screen name="Vet Tabs" component={VetTabs} />
          )}
        </>
      ) : (
        <>
          <Stack.Screen name="Home">{(props) => <HomeScreen {...props} onLogin={handleLogin} />}</Stack.Screen>
          <Stack.Screen name="Sign up" component={SignUpScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Content />
    </NavigationContainer>
  );
}
