import React from "react";
import { View, Text, StyleSheet, Image, TouchableWithoutFeedback } from "react-native";
import { Feather, EvilIcons } from "@expo/vector-icons";
import { colors, sizes } from "../../constants";

export default function VetCard({ vet, onPress }) {
  return (
    <TouchableWithoutFeedback onPress={() => onPress(vet)}>
      <View style={styles.container}>
        {vet?.profilePicture && <Image source={{ uri: vet.profilePicture }} style={styles.image} />}
        <View style={styles.title_container}>
          <Text style={styles.title}>{vet.name}</Text>
          <View style={styles.icon_container}>
            <Feather name="phone" size={16} color={colors.gray} />
            <Text style={styles.text}>{vet.phoneNumber}</Text>
          </View>
          <View style={styles.icon_container}>
            <EvilIcons name="location" size={16} color={colors.gray} />
            <Text style={styles.text}>{vet?.location}</Text>
          </View>
        </View>
        {vet.rating ? (
          <View style={styles.rating_container}>
            <Text style={styles.rate}>{vet.rating.toFixed(1)}</Text>
            <Text style={{ color: colors.white }}>Rating</Text>
          </View>
        ) : null}
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    padding: 16,
    borderRadius: 20,
    marginVertical: 8,
    backgroundColor: colors.white,
  },
  image: {
    marginRight: 16,
    alignItems: "center",
    borderRadius: 50,
    overflow: "hidden",
    width: 72,
    height: 72,
  },
  rating_container: {
    backgroundColor: colors.secondary,
    marginHorizontal: 8,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.gray,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },

  title_container: {
    flex: 1,
  },
  title: {
    fontSize: sizes.h3,
    marginBottom: 6,
  },
  icon_container: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 6,
  },
  text: {
    fontSize: sizes.body1,
    paddingHorizontal: 8,
    color: colors.gray,
  },
  rate: {
    fontSize: sizes.h1,
    color: colors.white,
    fontWeight: "bold",
  },
});
