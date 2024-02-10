import React, { useState } from "react";
import TabsContainer from "../../components/TabsContainer/TabsContainer";
import { StyleSheet, View, TextInput, Text, Button } from "react-native";
import { ROLES_TABS, TITELS } from "../../constants";
import Header from "../../components/Header/Header";
import PawImage from "../../assets/paw.jpg";
import { clientServer } from "../../server";
import { StackActions } from "@react-navigation/native";

const HomeScreen = ({ navigation, onLogin }) => {
  const [form, setValues] = useState({
    email: "",
    password: "",
  });
  const [incorrectInput, setIncorrectInput] = useState({
    incorrectEmail: false,
    incorrectPassword: false,
  });
  const [activeTab, setActiveTab] = useState("petOwner");

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
      if (activeTab === "vet") {
        const userId = await clientServer.loginVet(form);
        onLogin({ tyep: "vet", id: userId });
        // navigation.dispatch(
        //   StackActions.replace("Vet Home Screen", {
        //     userId: userId,
        //     userType: "vet",
        //   })
        // );
      } else {
        const userId = await clientServer.loginPetOwner(form);
        //navigation.dispatch(StackActions.replace("Pet Owner Home Screen", { userId: userId }));
        onLogin({ type: "petOwner", userId: userId });
      }
    } catch (error) {
      if (error.response.status === 404) {
        setIncorrectInput((prevState) => ({ ...prevState, incorrectEmail: true }));
        return;
      } else if (error.response.status === 401) {
        setIncorrectInput((prevState) => ({ ...prevState, incorrectPassword: true }));
        return;
      } else {
        console.error("Error logging in:", error);
      }
    }
  };

  return (
    <View scrollable style={styles.container}>
      <View style={styles.imageContainer}>
        <Header headerText={"Vet Vibe"} imgSrc={PawImage} />
      </View>

      <TabsContainer tabs={ROLES_TABS} activeTab={activeTab} handleTabPress={handleTabPress} />
      <>
        <Text style={styles.label}>{TITELS["email"]}</Text>
        <TextInput
          placeholder={"Email"}
          keyboardType="email-address"
          autoCorrect={false}
          autoCapitalize="none"
          onChangeText={(value) => handleChangeText("email", value)}
        />
        {incorrectInput.incorrectEmail && (
          <Text style={styles.error}>{`User with email: ${form.email} wasn't found.`}</Text>
        )}
      </>
      <>
        <Text style={styles.label}>{TITELS["password"]}</Text>
        <TextInput
          autoCapitalize="none"
          textContentType="password"
          placeholder={"Password"}
          autoCorrect={false}
          containerStyle={styles.defaultMargin}
          onChangeText={(value) => handleChangeText("password", value)}
          secureTextEntry
        />
        {incorrectInput.incorrectPassword && <Text style={styles.error}>{"The password is incorrect."}</Text>}
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
