import { View, Text, Image, StyleSheet } from "react-native";

export default function Header({headerText, imgSrc}) {
    return (
        <View style={styles.header}>
        <Image source={imgSrc} style={styles.pawImage} resizeMode="contain" />
        <Text style={styles.title}>{headerText}</Text>
      </View>
    );
}

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    marginBottom: 180,
  },
  pawImage: {
    width: 100,
    height: 100,
  },
  title: {
    fontSize: 40,
    color: "#333333",
    marginTop: 10,
  }
});