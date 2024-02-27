import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Rating } from "react-native-ratings";
import { colors, sizes } from "../../constants";
import Input from "../Input/Input";
import Button from "../Button/Button";

export default function RateVet({ petOwnerRate, onNewRating }) {
  const [rating, setRating] = useState(petOwnerRate || { rate: 0 });
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState(petOwnerRate?.title || null);
  const [content, setContent] = useState(petOwnerRate?.content || null);
  const [isSubmitedEmpy, setIsSubmitedEmpy] = useState(false);

  const saveRating = async (newRating) => {
    const rate = { ...rating, rate: newRating };
    setRating(rate);
    onNewRating(rate);
  };

  const saveReview = async () => {
    if (!title) {
      setIsSubmitedEmpy(true);
      return;
    }
    const newReview = {
      ...rating,
      title: title,
      content: content || "",
    };
    onNewRating(newReview);
    setIsAdding(false);
  };

  const onChangeTitle = (text) => {
    setTitle(text);
    setIsSubmitedEmpy(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header_container}>
        <Text style={styles.text}>Click to Rate:</Text>
        <Rating startingValue={rating?.rate} onFinishRating={saveRating} imageSize={25} fractions={1} minValue={0} />
      </View>
      <View style={styles.add_review_container}>
        {isAdding ? (
          <View>
            <Input
              placeholder="Title"
              style={styles.add_title_input}
              autoCorrect={true}
              value={title}
              onChangeText={onChangeTitle}
              maxLength={40}
              error={isSubmitedEmpy}
              errorMessage={"Title is required"}
            />
            <Text style={styles.content_length}>{title?.length || 0}/40</Text>

            <Input
              placeholder="Review (optional)"
              style={styles.add_content_input}
              autoCorrect={true}
              value={content}
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
  },
  header_container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 24,
    marginVertical: 8,
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
      justifyContent: "flex-start",
      marginHorizontal: 24,
    },
    text: {
      fontSize: sizes.body1,
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
