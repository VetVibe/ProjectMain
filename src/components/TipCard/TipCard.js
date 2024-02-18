import { Image, StyleSheet, Text, View, TouchableWithoutFeedback } from "react-native";
import { colors, sizes } from "../../constants";

const CARD_WIDTH = sizes.width - 100;
const CARD_HEIGHT = 150;

export default function TipCard({ tip, onSelect }) {
  return (
    <TouchableWithoutFeedback onPress={onSelect}>
      <View style={styles.container}>
        <View style={styles.item_container}>
          <View style={styles.header_container}>
            {tip?.vetImage && <Image source={{ uri: tip.vetImage }} style={styles.image} />}
            <Text style={styles.title}>{tip.vetName}</Text>
          </View>
          <View style={styles.content_container}>
            <Text style={styles.content}>{tip.content}</Text>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginRight: 12,
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 20,
    backgroundColor: colors.white,
    shadowColor: colors.gray,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    elevation: 4,
  },
  item_container: {
    flex: 1,
    margin: 16,
  },
  header_container: {
    flexDirection: "row",
    marginBottom: 12,
  },
  image: {
    alignItems: "center",
    borderRadius: 50,
    overflow: "hidden",
    width: 36,
    height: 36,
  },
  title: {
    fontSize: sizes.h3,
    color: colors.primary,
  },
  content_container: {
    flex: 1,
  },
  content: {
    fontSize: sizes.h4,
    color: colors.grey,
  },
});
