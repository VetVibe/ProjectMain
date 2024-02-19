import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Rating } from "react-native-ratings";
import { colors, sizes } from "../../constants";
import Input from "../Input/Input";
import Button from "../Button/Button";

const CARD_WIDTH = sizes.width - 100;
const CARD_HEIGHT = 110;

export default function RateVet({ petOwnerRate, onNewRating }) {
  const [rating, setRating] = useState(petOwnerRate?.rate);
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState();
  const [content, setContent] = useState();
  const [isSubmitedEmpy, setIsSubmitedEmpy] = useState(false);

  const saveRating = async (newRating) => {
    setRating(newRating);
    onNewRating({ rate: rating });
  };

  const saveReview = async () => {
    if (!title) {
      setIsSubmitedEmpy(true);
      return;
    }
    const newReview = {
      rate: rating,
      title,
      content,
    };
    onNewRating(newReview);
  };

  const onChangeTitle = (text) => {
    setTitle(text);
    setIsSubmitedEmpy(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header_container}>
        <Text style={styles.text}>Click to Rate:</Text>
        <Rating startingValue={rating} onFinishRating={saveRating} imageSize={25} fractions={1} minValue={0} />
      </View>
      <View style={styles.add_review_container}>
        {isAdding ? (
          <View>
            <Input
              placeholder="Title"
              style={styles.add_title_input}
              autoCorrect={true}
              value={petOwnerRate?.title || title}
              onChangeText={onChangeTitle}
              maxLength={60}
              error={isSubmitedEmpy}
              errorMessage={"Title is required"}
            />
            <Text style={styles.content_length}>{title?.length || 0}/60</Text>

            <Input
              placeholder="Review (optional)"
              style={styles.add_content_input}
              autoCorrect={true}
              value={petOwnerRate?.content || content}
              onChangeText={setContent}
              maxLength={200}
              multiline={true}
            />
            <Text style={styles.content_length}>{content?.length || 0}/200</Text>
            <View style={styles.buttons_container}>
              <Button text={"Cancel"} style={styles.cancel_button} onPress={() => setIsAdding(false)} />
              <Button text={"Submit"} style={styles.submit_button} onPress={saveReview} />
            </View>
          </View>
        ) : (
          <Button
            text={petOwnerRate?.title ? "Edit Review" : "Add Review"}
            style={styles.add_review_text}
            onPress={() => setIsAdding(true)}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: CARD_WIDTH,
  },
  header_container: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 12,
  },
  text: {
    fontSize: sizes.h3,
    color: colors.grey,
  },
  add_review_container: {
    flex: 1,
  },
  add_title_input: {
    marginHorizontal: 30,
  },
  add_content_input: {
    marginHorizontal: 30,
    height: CARD_HEIGHT,
  },
  content_length: {
    fontSize: sizes.body2,
    color: colors.grey,
  },
  buttons_container: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  add_review_text: {
    container: {
      padding: 8,
      justifyContent: "flex-start",
    },
    text: {
      textAlign: "center",
      fontSize: sizes.body1,
      padding: 10,
      color: colors.primary,
      fontWeight: "bold",
    },
  },
  cancel_button: {
    container: {
      marginRight: 8,
      borderRadius: 20,
      padding: 4,
      shadowColor: colors.gray,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      width: "50%",
      backgroundColor: colors.white,
    },
    text: {
      textAlign: "center",
      fontSize: sizes.body1,
      padding: 10,
      fontWeight: "bold",
    },
  },
  submit_button: {
    container: {
      borderRadius: 20,
      padding: 4,
      shadowColor: colors.gray,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      width: "50%",
      backgroundColor: colors.primary,
    },
    text: {
      textAlign: "center",
      fontSize: sizes.body1,
      padding: 10,
      color: colors.white,
      fontWeight: "bold",
    },
  },
});
