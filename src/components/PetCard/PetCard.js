import { Image, StyleSheet, Text, View, TouchableWithoutFeedback } from "react-native";
import { colors, sizes } from "../../constants";

const CARD_WIDTH = sizes.width - 100;
const CARD_HEIGHT = 110;

export default function PetCard({ pet, onSelect }) {
  return (
    <TouchableWithoutFeedback onPress={onSelect}>
      <View style={styles.container}>
        <View style={styles.info_container}>
          {pet?.imgSrc && <Image source={{ uri: pet.imgSrc }} style={styles.image} />}
          <View style={styles.title_container}>
            <Text style={styles.title}>{pet.name}</Text>
            <Text style={styles.type}>{pet.species}</Text>
            <Text style={styles.age}>{pet.age}</Text>
          </View>
        </View>
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
    marginRight: 12,
    backgroundColor: colors.white,
    shadowColor: colors.gray,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    elevation: 4,
  },
  info_container: {
    flex: 1,
    margin: 16,
    flexDirection: "row",
  },
  image: {
    marginRight: 16,
    alignItems: "center",
    borderRadius: 50,
    overflow: "hidden",
    width: 72,
    height: 72,
  },
  title_container: {
    flex: 1,
  },
  title: {
    fontSize: sizes.h3,
  },
  type: {
    fontSize: sizes.h4,
    color: colors.secondary,
  },
  age: {
    fontSize: sizes.body1,
    color: colors.gray,
  },
});
