import React from "react";
import { View, Text, StyleSheet, Image, TouchableWithoutFeedback } from "react-native";
import { Rating } from "react-native-ratings";
import { colors, sizes } from "../../constants";

const CARD_WIDTH = sizes.width / 3;
const CARD_HEIGHT = sizes.height / 3;

export default function SmallVetCard({ vet, onPress }) {
  return (
    <TouchableWithoutFeedback onPress={() => onPress(vet)}>
      <View style={styles.container}>
        {vet?.imgSrc && <Image source={{ uri: vet.imgSrc }} style={styles.image} />}
        <View style={styles.title_container}>
          <Text style={styles.title}>{vet.name}</Text>
        </View>
        <Rating
          startingValue={vet.rating || 0}
          editable={false}
          onFinishRating={() => {}}
          imageSize={25}
          fractions={1}
        />
        <Text style={styles.rate}>({vet.ratingCount || 0})</Text>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 20,
    marginLeft: 16,
    marginBottom: 6,
    backgroundColor: colors.white,
    shadowColor: colors.gray,
    shadowOffset: { width: -10, height: 2 },
    shadowOpacity: 0.1,
    padding: 8,
  },
  image: {
    alignItems: "center",
    borderRadius: 10,
    overflow: "hidden",
  },
  title_container: {
    flex: 1,
  },
  title: {
    fontSize: sizes.h3,
    marginBottom: 6,
  },
  text: {
    fontSize: sizes.body1,
    color: colors.gray,
  },
  rate: {
    fontSize: sizes.body2,
    color: colors.light_gray,
  },
});
