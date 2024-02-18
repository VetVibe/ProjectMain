import { StyleSheet, Text, View } from "react-native";
import { Rating } from "react-native-ratings";
import { colors, sizes } from "../../constants";

const CARD_WIDTH = sizes.width - 100;
const CARD_HEIGHT = 110;

export default function RateCard({ rate }) {
  return (
    <View style={styles.container}>
      <View style={styles.item_container}>
        <View style={styles.header_container}>
          <View style={styles.rate_header}>
            {rate.title && <Test style={styles.rate_title}>{rate.title}</Test>}
            <Rating readonly startingValue={rate.rate} onFinishRating={() => console.log(rate)} imageSize={10} />
          </View>
          <View style={styles.user_details}>
            <Text style={styles.text}>{rate.when}</Text>
            <Text style={styles.text}>{rate.userName}</Text>
          </View>
        </View>
        <View style={styles.content_container}>
          {rate.content && <Text style={styles.content}>{rate.content}</Text>}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 20,
    backgroundColor: colors.lighter_gray,
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
    justifyContent: "space-between",
    alignItems: "center",
  },
  rate_header: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  rate_title: {
    fontSize: sizes.h3,
    fontWeight: "bold",
  },
  user_details: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  text: {
    fontSize: sizes.h4,
    color: colors.light_gray,
  },
  content_container: {
    flex: 1,
  },
  content: {
    fontSize: sizes.h4,
  },
});
