import React, { useState, useRef } from "react";
import TabsContainer from "../../components/TabsContainer/TabsContainer";
import { StyleSheet, View, TextInput, Text, Button, Keyboard, Alert } from "react-native";
import { ROLES_TABS } from "../../constants";
import Header from "../../components/Header/Header";
import { isEmailValid, isPasswordValid } from "../../utils";
import PawImage from "../../assets/paw.jpg";
import axios from "axios";
import { StackActions } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Define an object to map roles to their specific properties like API endpoint, navigation screen, and placeholder text for email.
const roleSelectors = {
  petOwner: { // Properties for the pet owner role
    postUrl: "http://localhost:3000/petOwner/login", // API endpoint for pet owner login
    navigationScreen: "Pet Owner Home Screen", // Name of the screen to navigate to after login
    emailPlaceholder: "email", // Placeholder text for the email input
  },
  vet: { // Properties for the veterinarian role
    postUrl: "http://localhost:3000/veterinarian/login", // API endpoint for veterinarian login
    navigationScreen: "Vet Home Screen", // Name of the screen to navigate to after login
    emailPlaceholder: "Veterinarian ID", // Placeholder text for the veterinarian ID input
  },
};

// Define a functional component for the Home Screen.
const HomeScreen = ({ navigation }) => {
  // State hook for managing form input (email and password).
  const [form, setValues] = useState({
    email: "", // Initial email value is an empty string
    password: "", // Initial password value is an empty string
  });

  // State hook for managing incorrect input flags for email and password.
  const [incorrectInput, setIncorrectInput] = useState({
    incorrectEmail: false, // Initially, the email is not marked as incorrect
    incorrectPassword: false, // Initially, the password is not marked as incorrect
  });

  // State hook to keep track of the active tab (role selector).
  const [activeTab, setActiveTab] = useState("petOwner"); // Default active tab is "petOwner"

  // Ref hooks to keep reference to email and password input elements.
  const emailInputRef = useRef(); // Reference for the email input field
  const passwordInputRef = useRef(); // Reference for the password input field

  // Determine the role selector based on the active tab.
  const selectors = roleSelectors[activeTab]; // Select properties based on the active role

  // Function to handle tab press and switch between roles.
  const handleTabPress = (tab) => {
    setActiveTab(tab); // Update the active tab state with the new tab
  };

  // Function to check the validity of a field.
  const checkField = (fieldKey, fieldErrorKey, fieldValidator) => {
    if (!fieldValidator(fieldKey)) { // If the field does not pass validation
      setIncorrectInput((prevState) => ({
        ...prevState, // Spread operator to copy the existing state
        [fieldErrorKey]: true, // Set the corresponding field error key to true
      }));
      return false; // Return false indicating the field is invalid
    }
    return true; // Return true if the field passes validation
  };

  // Function to handle sign-in button press.
  const onSignInPress = () => {
    Keyboard.dismiss(); // Dismiss the keyboard

    // Make an HTTP POST request to the login endpoint with form data.
    axios
      .post(selectors.postUrl, form)
      .then((response) => { // Handle the successful response
        const data = response.data; // Extract data from the response
        const token = data.token; // Extract token from data
        const userId = data.userId; // Extract user ID from data
        AsyncStorage.setItem("authToken", token); // Save the token in AsyncStorage
        if (activeTab == "vet") { // If the active tab is "vet"
          // Navigate to the vet home screen and pass the user ID and user type as parameters
          navigation.dispatch(StackActions.replace(selectors.navigationScreen, { userId: userId, userType: "vet" }));
        } else { // If the active tab is not "vet" (i.e., "petOwner")
          // Navigate to the pet owner home screen and pass only the user ID as a parameter
          navigation.dispatch(StackActions.replace(selectors.navigationScreen, { userId: userId }));
        }
      })
      .catch((error) => { // Handle any errors that occur during the request
        if (error.response) { // If the error has a response property, meaning the server responded with an error
          // Extract the status code from the error response
          const status = error.response.status;

          if (status === 404) { // If the status code is 404 (Not Found)
            Alert.alert("User not found"); // Show an alert saying "User not found"
          } else if (status === 401) { // If the status code is 401 (Unauthorized)
            Alert.alert("Invalid password", "The password is incorrect."); // Show an alert saying "Invalid password"
          } else { // For any other status code
            Alert.alert("Login error", "An error occurred during login."); // Show a generic login error alert
          }
        } else { // If there's no response (e.g., network error)
          Alert.alert("Network error", "Unable to connect to the server."); // Show a network error alert
        }

        // Log the error to the console for debugging purposes
        console.log("Error during login", error);
      });
  };

  return (
    <View scrollable style={styles.container}>
      <View style={styles.imageContainer}>
        <Header headerText={"Vet Vibe"} imgSrc={PawImage} />
      </View>

      <TabsContainer tabs={ROLES_TABS} activeTab={activeTab} handleTabPress={handleTabPress} />

      <>
        <Text style={styles.label}>Email</Text>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder={"Email"}
            keyboardType="email-address"
            autoCorrect={false}
            autoCapitalize="none"
            onChangeText={(value) =>
              setValues((prevState) => ({
                ...prevState,
                email: value.trim(),
                incorrectEmail: false,
              }))
            }
            onSubmitEditing={() => passwordInputRef.current.focus()}
            assignRef={(component) => {
              emailInputRef.current = component;
            }}
            onBlur={() => checkField(form.email, incorrectInput.incorrectEmail, isEmailValid)}
          />
          {incorrectInput.incorrectEmail && <Text style={styles.error}>{"Please enter a valid email address"}</Text>}
        </View>
      </>
      <>
        <Text style={styles.label}>Password</Text>
        <View style={styles.inputContainer}>
          <TextInput
            autoCapitalize="none"
            textContentType="password"
            placeholder={"Password"}
            autoCorrect={false}
            containerStyle={styles.defaultMargin}
            onChangeText={(value) =>
              setValues((prevState) => ({
                ...prevState,
                password: value.trim(),
                incorrectPassword: false,
              }))
            }
            assignRef={(component) => {
              passwordInputRef.current = component;
            }}
            onSubmitEditing={onSignInPress}
          />
          {incorrectInput.incorrectPassword && (
            <Text style={styles.error}>
              {
                "Please enter a valid password, miniumum 8 characters & with atleast one small, one capital, one digit & one special character"
              }
            </Text>
          )}
        </View>
      </>
      <Button
        title={"Login"}
        titleStyle={styles.loginButtonText}
        style={styles.defaultMargin}
        onPress={onSignInPress}
      />
      <Button
        type="clear"
        title={"Need an account? Sign up now"}
        onPress={() => {
          navigation.navigate("Sign up");
        }}
      />
    </View>
  );
};

// Define a StyleSheet object to hold all the style rules for our screen.
const styles = StyleSheet.create({
  // Style for the main container view.
  container: {
    padding: 16, // Apply padding of 16 pixels to all sides of the container.
  },
  // Style for the container that holds tabs.
  tabsContainer: {
    flexDirection: "row", // Arrange tabs in a horizontal row.
    marginBottom: 20, // Add 20 pixels of margin to the bottom of the tabs container.
  },
  // Style for the container that will hold an image.
  imageContainer: {
    alignItems: "center", // Center-align items horizontally within the container.
    justifyContent: "center", // Center-align items vertically within the container.
  },
  // Generic style for adding top margin to elements.
  defaultMargin: {
    marginTop: 16, // Apply a top margin of 16 pixels.
  },
  // Style for text on the login button.
  loginButtonText: {
    textTransform: "uppercase", // Transform all text to uppercase.
  },
  // Style for adding padding around icons.
  iconPadding: {
    padding: 8, // Apply padding of 8 pixels to all sides of the icon.
  },
  // Style for labels above input fields.
  label: {
    marginBottom: 4, // Add 4 pixels of margin to the bottom of the label.
    color: "#ced2d9", // Set the text color to a light grey.
    fontSize: 12, // Set the font size to 12 pixels.
    fontStyle: "normal", // Use normal font style.
    fontWeight: "normal", // Use normal font weight.
  },
  // Style for the container of an input field.
  inputContainer: {
    flexDirection: "row", // Arrange items in a row within the input container.
    backgroundColor: "white", // Set the background color to white.
    borderWidth: StyleSheet.hairlineWidth, // Set the border width to the thinnest possible line.
    borderRadius: 2, // Round the corners with a radius of 2 pixels.
    alignItems: "center", // Center-align items horizontally.
    borderColor: "#ced2d9", // Set the border color to a light grey.
    minHeight: 40, // Set a minimum height of 40 pixels for the input container.
  },
  // Style for the input field itself.
  input: {
    fontSize: 16, // Set font size to 16 pixels.
    color: "#e0e0e0", // Set the text color to a light grey.
    backgroundColor: "transparent", // Make the background transparent.
    paddingVertical: 8, // Apply vertical padding of 8 pixels.
    paddingHorizontal: 12, // Apply horizontal padding of 12 pixels.
    flex: 1, // Allow the input to expand to fill available space.
  },
  // Style for error messages.
  error: {
    fontSize: 13, // Set the font size to 13 pixels.
    color: "#CC0000", // Set the text color to a bright red to indicate error.
    margin: 4, // Apply a margin of 4 pixels to all sides.
  },
});

// Export the HomeScreen component as the default export of this module.
export default HomeScreen;
