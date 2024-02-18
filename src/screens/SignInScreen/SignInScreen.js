import React, { useState, useContext } from "react";
import { AuthContext } from "../../auth";
import { StyleSheet, View, Text, TouchableOpacity, Image, KeyboardAvoidingView } from "react-native";
import { TabsContainer, Input, Button } from "../../components";
import { ROLES_TABS, colors, sizes } from "../../constants";
import PawImage from "../../assets/paw.jpg";
import { clientServer } from "../../server";

export default function SignInScreen({ navigation }) {
  const { authState, setAuthState } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("petOwner");

  const [form, setValues] = useState({
    email: "",
    password: "",
  });
  const [incorrectInput, setIncorrectInput] = useState({
    incorrectEmail: false,
    incorrectPassword: false,
  });

  const handleTabPress = (tab) => {
    setActiveTab(tab);
  };

  const handleChangeText = (inputIdentifier, newValue) => {
    setValues((prevUserInput) => {
      return {
        ...prevUserInput,
        [inputIdentifier]: newValue,
      };
    });
    setIncorrectInput((prevState) => ({ ...prevState, incorrectEmail: false, incorrectPassword: false }));
  };

  const onSignInPress = async () => {
    try {
      const id = activeTab === "petOwner" ? await clientServer.loginPetOwner(form) : await clientServer.loginVet(form);
      setAuthState({ id: id, signedIn: true, userType: activeTab });
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setIncorrectInput((prevState) => ({ ...prevState, incorrectEmail: true }));
        return;
      } else if (error.response && error.response.status === 401) {
        setIncorrectInput((prevState) => ({ ...prevState, incorrectPassword: true }));
        return;
      } else {
        console.error("Error logging in:", error);
      }
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <View style={styles.header_container}>
        <Image style={styles.image_container} source={PawImage} resizeMode="contain" />
        <Text style={styles.title}>Welcome to Vet Vibe</Text>
        <Text style={styles.subTitle}>Enter your credential to login</Text>
      </View>

      <View style={styles.input_container}>
        <TabsContainer tabs={ROLES_TABS} activeTab={activeTab} handleTabPress={handleTabPress} />
        <Input
          autoComplete="email"
          autoCorrect={false}
          autoCapitalize={"none"}
          placeholder="Email"
          onChangeText={(value) => handleChangeText("email", value)}
          keyboardType="email-address"
          error={incorrectInput.incorrectEmail}
          errorMessage={form.email ? `User with email: ${form.email} wasn't found.` : "Enter your email"}
        />

        <Input
          placeholder="Password"
          onChangeText={(value) => handleChangeText("password", value)}
          autoCorrect={false}
          error={incorrectInput.incorrectPassword}
          errorMessage={form.password ? "The password is incorrect." : "Enter password"}
          secure
        />
      </View>
      <View style={styles.button_container}>
        <Button text={"Login"} onPress={onSignInPress} style={styles.login} />
        <Button
          text={"Don't have an account? Sign Up"}
          onPress={() => navigation.navigate("Sign up")}
          style={styles.signIn}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    backgroundColor: colors.white,
  },
  header_container: {
    alignItems: "center",
    marginVertical: 12,
    padding: 16,
    borderRadius: 20,
  },
  image_container: {
    width: 100,
    height: 100,
  },
  title: {
    fontSize: sizes.h1,
    marginTop: 20,
    marginBottom: 10,
    color: colors.primary,
    fontWeight: "bold",
    shadowColor: colors.gray,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
  },
  subTitle: {
    fontSize: sizes.h4,
    color: colors.secondary,
    marginBottom: 20,
  },
  input_container: {
    marginHorizontal: 30,
  },
  button_container: {
    marginTop: 20,
    marginHorizontal: 30,
    paddingVertical: 8,
    alignItems: "center",
  },
  login: {
    container: {
      borderRadius: 20,
      padding: 8,
      shadowColor: colors.gray,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      width: "100%",
      backgroundColor: colors.primary,
    },
    text: {
      textAlign: "center",
      fontSize: sizes.h3,
      padding: 10,
      color: colors.white,
      fontWeight: "bold",
    },
  },
  signIn: {
    container: {
      padding: 8,
    },
    text: {
      textAlign: "center",
      fontSize: sizes.h4,
      padding: 10,
      color: colors.light_gray,
    },
  },
});
