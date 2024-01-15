import { Text, TouchableOpacity, StyleSheet } from "react-native";

export default function LoginButton({buttonText, navigationScreen, userRole, navi}){
  const buttonStyles = navigationScreen === 'Login' ? styles.button : styles.signupLink;
  const textStyles = navigationScreen === 'Login' ? styles.buttonText : styles.signupLinkText;

    return (
        <TouchableOpacity style={buttonStyles} onPress={() => navi.navigate(navigationScreen, {role: userRole})}>
        <Text style={textStyles}>{buttonText}</Text>
      </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#ff8c00",
    padding: 15,
    borderRadius: 8,
    marginBottom: 25,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  signupLink: {
    marginTop: 20,
  },
  signupLinkText: {
    color: "#3498db",
    fontSize: 16,
  },
});