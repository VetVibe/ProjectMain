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

const roleSelectors = {
  petOwner: {
    postUrl: "http://10.0.2.2:3000/petOwner/login",
    navigationScreen: "Pet Owner Home Screen",
    emailPlaceholder: "email",
  },
  vet: {
    postUrl: "http://10.0.2.2:3000/veterinarian/login",
    navigationScreen: "Vet Home Screen",
    emailPlaceholder: "Veterinarian ID",
  },
};

const HomeScreen = ({ navigation }) => {
  const [form, setValues] = useState({
    email: "",
    password: "",
  });
  const [incorrectInput, setIncorrectInput] = useState({
    incorrectEmail: false,
    incorrectPassword: false,
  });
  const [activeTab, setActiveTab] = useState("petOwner");
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const selectors = roleSelectors[activeTab];

  const handleTabPress = (tab) => {
    setActiveTab(tab);
  };

  const checkField = (fieldKey, fieldErrorKey, fieldValidator) => {
    if (!fieldValidator(fieldKey)) {
      setIncorrectInput((prevState) => ({
        ...prevState,
        [fieldErrorKey]: true,
      }));
      return false;
    }
    return true;
  };

  const onSignInPress = () => {
    Keyboard.dismiss();

    axios
      .post(selectors.postUrl, form)
      .then((response) => {
        const data = response.data;
        const token = data.token;
        const userId = data.userId;
        AsyncStorage.setItem("authToken", token);
        if (activeTab == "vet") {
          navigation.dispatch(StackActions.replace(selectors.navigationScreen, { userId: userId, userType: "vet" }));
        } else {
          navigation.dispatch(StackActions.replace(selectors.navigationScreen, { userId: userId }));
        }
      })
      .catch((error) => {
        if (error.response) {
          // The request was made and the server responded with a status code
          const status = error.response.status;

          if (status === 404) {
            Alert.alert("User not found");
          } else if (status === 401) {
            Alert.alert("Invalid password", "The password is incorrect.");
          } else {
            Alert.alert("Login error", "An error occurred during login.");
          }
        } else {
          // The request was made but no response was received
          Alert.alert("Network error", "Unable to connect to the server.");
        }

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

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  tabsContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  imageContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  defaultMargin: {
    marginTop: 16,
  },
  loginButtonText: {
    textTransform: "uppercase",
  },
  iconPadding: {
    padding: 8,
  },
  label: {
    marginBottom: 4,
    color: "#ced2d9",
    fontSize: 12,
    fontStyle: "normal",
    fontWeight: "normal",
  },
  inputContainer: {
    flexDirection: "row",
    backgroundColor: "white",
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 2,
    alignItems: "center",
    borderColor: "#ced2d9",
    minHeight: 40,
  },
  input: {
    fontSize: 16,
    color: "#e0e0e0",
    backgroundColor: "transparent",
    paddingVertical: 8,
    paddingHorizontal: 12,
    flex: 1,
  },
  error: {
    fontSize: 13,
    color: "#CC0000",
    margin: 4,
  },
});

export default HomeScreen;
