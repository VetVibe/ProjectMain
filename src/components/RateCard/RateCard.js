import { StyleSheet, Text, View } from "react-native";
import { Rating } from "react-native-ratings";
import { colors, sizes } from "../../constants";

const CARD_WIDTH = sizes.width / 1.2;
const CARD_HEIGHT = sizes.height / 6;

export default function RateCard({ rate }) {
  return (
    <View style={styles.container}>
      <View style={styles.item_container}>
        <View style={styles.header_container}>
          <View style={styles.rate_header}>
            {rate.title?.length > 0 && <Text style={styles.rate_title}>{rate.title}</Text>}
            <Rating
              type="custom"
              readonly
              startingValue={rate.rate}
              onFinishRating={() => console.log(rate)}
              imageSize={15}
              jumpValue={0.5}
            />
          </View>
          <View style={styles.user_details}>
            <Text style={styles.text}>{rate.when}</Text>
            <Text style={styles.text}>{rate.userName}</Text>
          </View>
        </View>
        <View style={styles.content_container}>
          {rate?.content?.length > 0 && <Text style={styles.content}>{rate.content}</Text>}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 12,
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 20,
    backgroundColor: colors.white,
    shadowColor: colors.gray,
    shadowOpacity: 0.2,
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
    fontSize: sizes.body1,
    fontWeight: "bold",
  },
  user_details: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  text: {
    fontSize: sizes.body2,
    color: colors.gray,
  },
  content_container: {
    flex: 1,
  },
  content: {
    fontSize: sizes.body2,
  },
});
