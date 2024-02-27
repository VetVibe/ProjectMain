import { Image, StyleSheet, Text, View, TouchableWithoutFeedback } from "react-native";
import { colors, sizes } from "../../constants";

const CARD_WIDTH = sizes.width / 1.8;
const CARD_HEIGHT = sizes.height / 3;

export default function PetCard({ pet, onSelect }) {
  return (
    <TouchableWithoutFeedback onPress={onSelect}>
      <View style={styles.container}>
        {pet?.imgSrc && <Image source={{ uri: pet.imgSrc }} style={styles.image} />}
        <View style={styles.title_container}>
          <Text style={styles.title}>{pet.name}</Text>
          <Text style={styles.info}>{pet.species}</Text>
          <Text style={styles.info}>{pet.age}</Text>
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
    marginLeft: 16,
    marginBottom: 6,
    backgroundColor: colors.white,
    shadowColor: colors.gray,
    shadowOffset: { width: -10, height: 2 },
    shadowOpacity: 0.1,
    padding: 8,
  },
  image: {
    overflow: "hidden",
    alignItems: "center",
    borderRadius: 10,
    width: CARD_WIDTH / 1.1,
    height: CARD_HEIGHT / 1.5,
  },
  title_container: {
    flex: 1,
    marginVertical: 12,
    marginHorizontal: 6,
  },
  title: {
    fontSize: sizes.h3,
    fontWeight: "bold",
    marginBottom: 4,
  },
  info: {
    fontSize: sizes.body1,
    color: colors.gray,
    marginBottom: 2,
  },
});
