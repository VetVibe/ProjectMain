import React, { useState, useCallback, useContext } from "react";
import { AuthContext } from "../../auth";
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, FlatList } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { EvilIcons, Feather } from "@expo/vector-icons";
import { mapVetDetails, formatDateForRating, mapVetDetailsToSchema } from "../../utils";
import { RateCard, RateVet, Button, Input } from "../../components";
import { colors, sizes } from "../../constants";
import { clientServer } from "../../server";

const CARD_WIDTH = sizes.width - 100;

export default function VetHomeScreen({ route, navigation }) {
  const { authState } = useContext(AuthContext);
  const [vetDetails, setVetDetails] = useState({});
  const [vetTips, setVetTips] = useState([]);
  const [vetRatings, setVetRatings] = useState();
  const [petOwnerRate, setPetOwnerRate] = useState();
  const [ratingCount, setRatingCount] = useState();
  const [editAbout, setEditAbout] = useState(false);
  const [rate, setRate] = useState();
  const vetId = authState.userType === "vet" ? authState.id : route.params?.vetId;

  const fetchVetRating = async () => {
    try {
      const allVetRating = await clientServer.getRateByVetId(vetId);
      if (allVetRating) {
        const modifiedVetRating = await Promise.all(
          allVetRating.map(async (rating) => {
            const { name } = await clientServer.getPetOwnerInfo(rating.petOwnerId);
            return {
              ...rating,
              when: formatDateForRating(rating.when),
              userName: name,
            };
          })
        );
        const ratingsLenght = allVetRating.length;
        const totalRate = allVetRating.map((rate) => rate.rate).reduce((a, b) => a + b, 0) / ratingsLenght;

        setRatingCount(ratingsLenght);
        setRate(totalRate || 0);

        if (authState.userType === "petOwner") {
          const petOwnerRate = await clientServer.getRateByVetOwner(authState.id, vetId);
          if (petOwnerRate) {
            const filteredRating = modifiedVetRating.filter((rate) => rate.petOwnerId !== authState.id);
            setVetRatings(filteredRating);
            setPetOwnerRate(petOwnerRate);
          } else {
            setVetRatings(modifiedVetRating);
          }
        } else {
          setVetRatings(modifiedVetRating);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      const fetchVetDetails = async () => {
        try {
          const vetDetails = await clientServer.getVetInfo(vetId);
          const mapedVetDetails = mapVetDetails(vetDetails);
          setVetDetails(mapedVetDetails);

          await fetchVetRating();

          if (authState.userType === "petOwner") {
            const vetTipsRaw = await clientServer.getTipsByVetId(vetId);
            setVetTips(vetTipsRaw);
          }
        } catch (error) {
          console.log(error);
        }
      };
      fetchVetDetails();
    }, [vetId])
  );

  const onSave = async () => {
    const vetDetailsSchema = mapVetDetailsToSchema(vetDetails);
    setEditAbout(false);
    try {
      await clientServer.updateVetInfo(authState.id, vetDetailsSchema);
    } catch (error) {
      console.log(error);
    }
  };

  const randerTip = (item) => {
    return (
      <View style={styles.tip_container}>
        <Text>{item.content}</Text>
      </View>
    );
  };

  const onNewRating = async (newRating) => {
    try {
      if (petOwnerRate) {
        await clientServer.updateRate(petOwnerRate._id, newRating);
      } else {
        const responce = await clientServer.addRate(authState.id, vetId, newRating);
        setPetOwnerRate(responce);
      }
      fetchVetRating();
    } catch (error) {
      console.log(error);
    }
  };

  const onBooking = () => {
    navigation.navigate("Make Appointment", { vetId: vetId });
  };

  const navigateToEditScreen = () => {
    navigation.navigate("Edit Vet Profile");
  };

  return (
    <View style={styles.screen_container}>
      <ScrollView style={styles.container}>
        <View style={styles.header_container}>
          <View style={styles.image_container}>
            <Image source={{ uri: vetDetails.profilePicture }} style={styles.image} />
          </View>

          <View style={styles.info_container}>
            <Text style={styles.info_text}>{vetDetails.name}</Text>
            <Text style={styles.info_text}>{vetDetails.vetId}</Text>
            <View style={styles.icon_container}>
              <Feather name="phone" size={16} color={colors.gray} />
              <Text style={styles.icon_text}>{vetDetails.phoneNumber}</Text>
            </View>
            {vetDetails.location && (
              <View style={styles.icon_container}>
                <EvilIcons name="location" size={16} color={colors.gray} />
                <Text style={styles.icon_text}>{vetDetails.location}</Text>
              </View>
            )}
          </View>
          {authState.userType === "vet" && (
            <Button text="Edit" onPress={navigateToEditScreen} style={styles.edit_button} />
          )}
        </View>

        {(vetDetails.about || vetDetails.spetialization || authState.userType == "vet") && (
          <View style={styles.segment_container}>
            <View style={styles.segment_header}>
              <Text style={styles.header_text}>About</Text>
              {authState.userType === "vet" && (
                <>
                  {!editAbout ? (
                    <Button text="Edit" onPress={() => setEditAbout(true)} style={styles.edit_button} />
                  ) : (
                    <Button text="Save" onPress={onSave} style={styles.edit_button} />
                  )}
                </>
              )}
            </View>
            {editAbout && (
              <View style={styles.segment_content}>
                <Input
                  value={vetDetails.about}
                  onChangeText={(text) => setVetDetails({ ...vetDetails, about: text })}
                  multiline={true}
                  maxLength={120}
                />
              </View>
            )}
            {vetDetails.about && !editAbout && (
              <View style={styles.segment_content}>
                <Text style={styles.text}>{vetDetails.about}</Text>
              </View>
            )}
            {vetDetails.specialization && (
              <View style={styles.spetialization_container}>
                <ScrollView horizontal={true}>
                  {vetDetails.specialization.map((spetialization) => {
                    return (
                      <View style={styles.chip_container} key={spetialization}>
                        <Text style={styles.chips}>{spetialization}</Text>
                      </View>
                    );
                  })}
                </ScrollView>
              </View>
            )}
          </View>
        )}

        {vetTips?.length > 0 && (
          <View style={styles.segment_container}>
            <View style={styles.segment_header}>
              <Text style={styles.header_text}>Vet Tips</Text>
              {authState.userType === "vet" && (
                <TouchableOpacity onPress={navigateToEditScreen}>
                  <Text>Edit</Text>
                </TouchableOpacity>
              )}
            </View>
            <View>
              <FlatList
                horizontal
                snapToInterval={CARD_WIDTH + 24}
                decelerationRate={"fast"}
                showsHorizontalScrollIndicator={false}
                initialNumToRender={2}
                data={vetTips}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => randerTip(item)}
              />
            </View>
          </View>
        )}

        <View style={styles.segment_container}>
          <View style={styles.segment_header}>
            <Text style={styles.header_text}>Ratings & Reviews</Text>
          </View>
          <View style={styles.segment_header}>
            <Text style={styles.rating_text}>{rate?.toFixed(1)}</Text>
            <Text style={styles.rating_count}>{ratingCount} Ratings</Text>
          </View>
          {vetRatings?.length > 0 && (
            <View>
              <FlatList
                horizontal
                snapToInterval={CARD_WIDTH + 24}
                decelerationRate={"fast"}
                showsHorizontalScrollIndicator={false}
                initialNumToRender={2}
                data={vetRatings}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => <RateCard rate={item} />}
              />
            </View>
          )}
          {authState.userType === "petOwner" && <RateVet petOwnerRate={petOwnerRate} onNewRating={onNewRating} />}
        </View>
      </ScrollView>
      {authState.userType == "petOwner" && <Button text={"Book"} style={styles.book_button} onPress={onBooking} />}
    </View>
  );
}

const styles = StyleSheet.create({
  screen_container: { flex: 1, backgroundColor: colors.white },
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  header_container: {
    flexDirection: "row",
    marginTop: 24,
  },
  image_container: {
    flex: 1,
    marginRight: 8,
  },
  image: {
    height: 90,
    resizeMode: "cover",
  },
  info_container: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "space-evenly",
  },
  info_text: {
    fontSize: sizes.body1,
    marginBottom: 6,
  },
  icon_container: {
    flexDirection: "row",
  },
  icon_text: {
    fontSize: sizes.body1,
    marginLeft: 6,
    marginBottom: 6,
  },
  edit_button: {
    container: {
      position: "absolute",
      top: 6,
      right: 6,
    },
    text: {
      color: colors.primary,
    },
  },
  text: {
    fontSize: sizes.h4,
    color: colors.gray,
  },
  segment_container: {
    borderTopColor: colors.light_gray,
    borderTopWidth: 1,
    marginTop: 12,
    padding: 16,
  },
  segment_header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  header_text: {
    fontSize: sizes.h2,
    fontWeight: "bold",
  },
  segment_content: {
    flex: 1,
    marginTop: 16,
    justifyContent: "space-evenly",
  },
  spetialization_container: {
    flex: 1,
    marginTop: 24,
  },
  chips: {
    alignSelf: "flex-start",
    color: colors.white,
  },
  chip_container: {
    borderRadius: 20,
    backgroundColor: colors.primary,
    padding: 12,
    margin: 4,
  },
  tip_container: {
    flex: 1,
    width: CARD_WIDTH,
    height: 100,
    borderRadius: 20,
    marginTop: 16,
    padding: 16,
    backgroundColor: colors.lighter_gray,
  },
  rating_text: {
    fontSize: sizes.h1,
    fontWeight: "bold",
  },
  rating_count: {
    fontSize: sizes.body1,
    color: colors.gray,
  },
  book_button: {
    container: {
      marginHorizontal: 24,
      marginBottom: 12,
      borderRadius: 20,
      padding: 8,
      shadowColor: colors.gray,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      width: "90%",
      backgroundColor: colors.primary,
    },
    text: {
      textAlign: "center",
      fontSize: sizes.h3,
      padding: 10,
      color: colors.white,
      fontWeight: "bold",
    },
  },
});
