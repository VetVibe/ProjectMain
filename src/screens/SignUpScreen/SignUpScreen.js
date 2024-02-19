import React, { useState, useContext } from "react";
import { AuthContext } from "../../auth";
import { View, Text, Alert, StyleSheet, KeyboardAvoidingView } from "react-native";
import { TabsContainer, Input, Button } from "../../components";
import { ROLES_TABS, colors, sizes } from "../../constants";
import { clientServer } from "../../server";
import { isEmailValid, isPasswordValid } from "../../utils";

export default function SignUpScreen({ navigation }) {
  const { authState, setAuthState } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("petOwner");
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [passwordAgain, setPasswordAgain] = useState();
  const [id, setId] = useState("VET-");
  const [phoneNumber, setPhoneNumber] = useState();
  const [invalidInput, setInvalidInput] = useState({
    name: false,
    email: false,
    password: false,
    passwordAgain: false,
    phoneNumber: false,
  });

  const handleTabPress = (tab) => {
    setActiveTab(tab);
  };

  const handleChangeID = (text) => {
    if (!text.startsWith("VET-")) {
      setId("VET-" + text);
    } else {
      setId(text);
    }
  };

  const handleRegistration = async () => {
    if (isEmailValid(email)) {
      setEmail(email);
    } else {
      setInvalidInput((prevState) => ({ ...prevState, email: true }));
      return;
    }
    if (isPasswordValid(password)) {
      if (password !== passwordAgain) {
        setInvalidInput((prevState) => ({ ...prevState, passwordAgain: true }));
        return;
      }
      setPassword(password);
    } else {
      setInvalidInput((prevState) => ({ ...prevState, password: true }));
      return;
    }
    if (!name) {
      setInvalidInput((prevState) => ({ ...prevState, name: true }));
      return;
    }
    if (!phoneNumber) {
      setInvalidInput((prevState) => ({ ...prevState, phoneNumber: true }));
      return;
    }
    if (activeTab === "vet" && !id) {
      setInvalidInput((prevState) => ({ ...prevState, id: true }));
      return;
    }
    const newUser = {
      name,
      email,
      password,
      phoneNumber,
      ...(activeTab === "vet" && {
        vetId: id,
      }),
    };
    try {
      const id =
        activeTab === "vet" ? await clientServer.registerVet(newUser) : await clientServer.registerPetOwner(newUser);
      setAuthState({ id: id, signedIn: true, userType: activeTab });
    } catch (error) {
      console.error("Error registering user:", error);

      if (error.response && error.response.status === 409) {
        Alert.alert("Registration failed", "This user is already registered.");
      } else {
        Alert.alert("Registration failed.");
      }
    }
  };

  return (
    <KeyboardAvoidingView style={styles.screen_container} behavior="padding">
      <View style={styles.container}>
        <View style={styles.header_container}>
          <Text style={styles.title}>Sign Up</Text>
          <Text style={styles.subTitle}>Create your account</Text>
        </View>

        <View style={styles.input_container}>
          <TabsContainer tabs={ROLES_TABS} activeTab={activeTab} handleTabPress={handleTabPress} />
          <Input
            autoCapitalize="words"
            autoComplete="name"
            placeholder="Name"
            onChangeText={setName}
            error={invalidInput.name}
            errorMessage={"Required field"}
          />
          {activeTab === "vet" && (
            <Input
              placeholder="Veterinarian ID"
              value={id}
              onChangeText={(value) => handleChangeID(value)}
              keyboardType="numeric"
              error={invalidInput.id}
              errorMessage={"Required field"}
            />
          )}
          <Input
            autoComplete="email"
            autoCorrect={false}
            autoCapitalize={"none"}
            placeholder="Email"
            onChangeText={setEmail}
            keyboardType="email-address"
            error={invalidInput.email}
            errorMessage={email ? "Invalid email" : "Required field"}
          />
          <Input
            placeholder="Password"
            onChangeText={setPassword}
            autoCorrect={false}
            autoCapitalize={"none"}
            error={invalidInput.password}
            errorMessage={
              password
                ? "Atlest 8 characters, 1 uppercase and 1 lowercase 1 digit, 1 special chacater"
                : "Required field"
            }
            secure
          />
          <Input
            autoCorrect={false}
            autoCapitalize={"none"}
            placeholder="Password (Again)"
            onChangeText={setPasswordAgain}
            error={invalidInput.passwordAgain}
            errorMessage={passwordAgain ? "Must match password" : "Required field"}
            secure
          />
          <Input
            placeholder="Phone Number"
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
            error={invalidInput.phoneNumber}
            errorMessage={"Required field"}
          />
        </View>

        <View style={styles.button_container}>
          <Button text="Sign In" onPress={handleRegistration} style={styles.login} />
          <Button
            text={"Already have an account?"}
            onPress={() => navigation.navigate("Sign In")}
            style={styles.signIn}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen_container: { flex: 1, backgroundColor: colors.white },

  container: {
    flex: 1,
    paddingHorizontal: 24,
    marginTop: 50,
  },
  header_container: {
    alignItems: "center",
    marginVertical: 12,
    padding: 16,
    borderRadius: 20,
  },
  title: {
    fontSize: sizes.h1,
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
    marginBottom: 10,
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
  error: {
    color: colors.error,
    fontSize: sizes.body2,
    paddingLeft: 20,
    marginBottom: 10,
  },
});
