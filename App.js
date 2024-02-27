import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  SignInScreen,
  SignUpScreen,
  PetOwnerHomeScreen,
  PetProfileScreen,
  EditPetScreen,
  AddPetScreen,
  VetHomeScreen,
  EditVetProfileScreen,
  PetOwnerProfileScreen,
  TipsScreen,
  VetSearchScreen,
  AppointmentsScreen,
  MakeAppointmentScreen,
  VetAppointmentsScreen,
  VetReviewsScreen,
} from "./src/screens";
import { AuthContext } from "./src/auth";
import { Entypo, MaterialIcons, Ionicons, AntDesign } from "@expo/vector-icons";
import { BackButton } from "./src/components";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function PetOwnerStack() {
  return (
    <Stack.Navigator initialRouteName="Pet Owner Tabs">
      <Stack.Screen name="Pet Owner Tabs" component={PetOwnerTabs} options={{ headerShown: false }} />
      <Stack.Screen
        name="Pet Profile"
        component={PetProfileScreen}
        options={({ route, navigation }) => ({
          title: "Pet Profile",
          headerLeft: () => <BackButton navigation={navigation} />,
        })}
      />
      <Stack.Screen
        name="Edit Pet"
        component={EditPetScreen}
        options={({ route, navigation }) => ({
          title: "Edit Pet Profile",
          headerLeft: () => <BackButton navigation={navigation} />,
        })}
      />
      <Stack.Screen
        name="Add Pet"
        component={AddPetScreen}
        options={({ route, navigation }) => ({
          title: "Add Pet",
          headerLeft: () => <BackButton navigation={navigation} />,
        })}
      />
      <Stack.Screen
        name="Find Vets"
        component={VetSearchScreen}
        options={({ route, navigation }) => ({
          title: "Find Vets",
          headerLeft: () => <BackButton navigation={navigation} />,
        })}
      />
      <Stack.Screen
        name="Vet Home Screen"
        component={VetHomeScreen}
        options={({ route, navigation }) => ({
          title: "Vet Profile",
          headerLeft: () => <BackButton navigation={navigation} />,
        })}
      />
      <Stack.Screen
        name="Make Appointment"
        component={MakeAppointmentScreen}
        options={({ route, navigation }) => ({
          title: "Schedule Appointment",
          headerLeft: () => <BackButton navigation={navigation} />,
        })}
      />
      <Stack.Screen
        name="Vet Reviews"
        component={VetReviewsScreen}
        options={({ route, navigation }) => ({
          title: "Vet Reviews",
          headerLeft: () => <BackButton navigation={navigation} />,
        })}
      />
    </Stack.Navigator>
  );
}

function PetOwnerTabs() {
  return (
    <Tab.Navigator initialRouteName="Pet Owner Home">
      <Tab.Screen
        name="Pet Owner Home"
        component={PetOwnerHomeScreen}
        options={{
          headerShown: false,
          tabBarLabel: "Home",
          tabBarIcon: () => <Entypo name="home" size={24} />,
        }}
      />
      <Tab.Screen
        name="Pet Owner Appointments"
        component={AppointmentsScreen}
        options={{
          headerShown: false,
          tabBarLabel: "Appointments",
          tabBarIcon: () => <AntDesign name="calendar" size={24} />,
        }}
      />
      <Tab.Screen
        name="Pet Owner Profile"
        component={PetOwnerProfileScreen}
        options={{
          headerShown: false,
          tabBarLabel: "Profile",
          tabBarIcon: () => <Ionicons name="person" size={24} />,
        }}
      />
    </Tab.Navigator>
  );
}

function VetStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Vet Tabs" component={VetTabs} options={{ headerShown: false }} />
      <Stack.Screen
        name="Edit Vet Profile"
        component={EditVetProfileScreen}
        options={({ route, navigation }) => ({
          title: "Edit Vet Profile",
          headerLeft: () => <BackButton navigation={navigation} />,
        })}
      />
      <Stack.Screen
        name="Vet Reviews"
        component={VetReviewsScreen}
        options={({ route, navigation }) => ({
          title: "Vet Reviews",
          headerLeft: () => <BackButton navigation={navigation} />,
        })}
      />
    </Stack.Navigator>
  );
}

function VetTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Vet Home Screen"
        component={VetHomeScreen}
        options={{
          title: "Home",
          tabBarLabel: "Home",
          tabBarIcon: () => <Entypo name="home" size={24} />,
        }}
      />
      <Tab.Screen
        name="Tips Screen"
        component={TipsScreen}
        options={{
          headerShown: false,
          tabBarLabel: "Tips",
          tabBarIcon: () => <MaterialIcons name="my-library-books" size={24} />,
        }}
      />
      <Tab.Screen
        name="Vet Appointments"
        component={VetAppointmentsScreen}
        options={{
          tabBarLabel: "Appointments",
          tabBarIcon: () => <AntDesign name="calendar" size={24} />,
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const [authState, setAuthState] = useState({ id: "", isOwner: false, signedIn: false });

  return (
    <AuthContext.Provider value={{ authState, setAuthState }}>
      <NavigationContainer>
        {authState.signedIn ? (
          authState.isOwner ? (
            <PetOwnerStack />
          ) : (
            <VetStack />
          )
        ) : (
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Sign In" component={SignInScreen} />
            <Stack.Screen name="Sign up" component={SignUpScreen} />
          </Stack.Navigator>
        )}
      </NavigationContainer>
    </AuthContext.Provider>
  );
}
