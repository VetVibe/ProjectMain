import { Image, StyleSheet, Text, View, TouchableWithoutFeedback } from "react-native";
import { colors, sizes } from "../../constants";

const CARD_WIDTH = sizes.width / 1.3;
const CARD_HEIGHT = sizes.height / 5.3;

export default function TipCard({ tip, onSelect }) {
  return (
    <TouchableWithoutFeedback onPress={onSelect}>
      <View style={styles.container}>
        <View style={styles.header_container}>
          {tip?.vetImage && <Image source={{ uri: tip.vetImage }} style={styles.image} />}
          <Text style={styles.title}>{tip.vetName}</Text>
        </View>
        <View style={styles.content_container}>
          <Text style={styles.content}>{tip.content}</Text>
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
  header_container: {
    flexDirection: "row",
    marginBottom: 12,
  },
  image: {
    borderRadius: 10,
    width: CARD_WIDTH / 4.5,
    height: CARD_HEIGHT / 3.5,
    marginRight: 8,
  },
  title: {
    alignItems: "center",
    fontSize: sizes.h3,
    color: colors.primary,
    fontWeight: "bold",
  },
  content_container: {
    flex: 1,
  },
  content: {
    fontSize: sizes.h4,
    color: colors.grey,
  },
});
