import React, { useState, useCallback, useContext } from "react";
import { AuthContext } from "../../auth";
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { EvilIcons, Feather, Fontisto } from "@expo/vector-icons";
import { formatDateForRating, mapVetDetailsToSchema } from "../../utils";
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
  const id = authState.userType === "vet" ? authState.id : route.params?.vetId;
  const [isLoading, setIsLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      clientServer
        .getVetInfo(id)
        .then((vetDetails) => {
          setVetDetails(vetDetails);
        })
        .then(() => {
          clientServer
            .getRateByVetId(id)
            .then((vetRatings) => {
              const ratingsLenght = vetRatings.length;
              const totalRate = vetRatings.map((rate) => rate.rate).reduce((a, b) => a + b, 0) / ratingsLenght;

              setRatingCount(ratingsLenght);
              setRate(totalRate || 0);

              const promiseArray = vetRatings.map(async (rating) => {
                return clientServer
                  .getPetOwnerInfo(rating.petOwnerId)
                  .then((petOwnerInfo) => {
                    rating.userName = petOwnerInfo.name;
                    rating.when = formatDateForRating(rating.when);
                    return rating;
                  })
                  .catch((error) => {
                    console.log("Error fetching pet owner info:", error);
                  });
              });
              return Promise.all(promiseArray);
            })
            .then((modified) => {
              if (authState.userType === "petOwner") {
                clientServer
                  .getRateByVetOwner(authState.id, id)
                  .then(
                    (petOwnerRate) => {
                      const filteredRating = modified.filter((rate) => rate.petOwnerId !== authState.id);
                      setVetRatings(filteredRating);
                      setPetOwnerRate(petOwnerRate);
                    },
                    () => {
                      setVetRatings(modified);
                    }
                  )
                  .catch((error) => {
                    console.log("Error fetching pet owner rate:", error);
                  });

                clientServer
                  .getTipsByVetId(id)
                  .then((vetTipsRaw) => {
                    setVetTips(vetTipsRaw);
                  })
                  .catch((error) => {
                    console.log("Error fetching vet tips:", error);
                  });
              } else {
                setVetRatings(modified);
              }
            })
            .catch((error) => {
              console.log("Error fetching vet ratings:", error);
            });
        })
        .catch((error) => {
          console.log("Error fetching vet info:", error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }, [id])
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
        const responce = await clientServer.addRate(authState.id, id, newRating);
        setPetOwnerRate(responce);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onBooking = () => {
    navigation.navigate("Make Appointment", { vetId: id });
  };

  const navigateToEditScreen = () => {
    navigation.navigate("Edit Vet Profile");
  };

  return (
    <View style={styles.screen_container}>
      {isLoading ? (
        <ActivityIndicator style={styles.loadingIndicator} size="large" />
      ) : (
        <ScrollView style={styles.container}>
          <View style={styles.header_container}>
            <View style={styles.image_container}>
              <Image source={{ uri: vetDetails.profilePicture }} style={styles.image} />
            </View>
          </View>
          <View style={styles.info_header_container}>
            <Text style={styles.header_text}>{vetDetails.name}</Text>
            {authState.userType === "vet" && (
              <Button text="Edit" onPress={navigateToEditScreen} style={styles.edit_button} />
            )}
          </View>
          <View style={styles.header_container}>
            <View style={styles.info_container}>
              <View style={styles.icon_container}>
                <Fontisto name="doctor" size={16} color={colors.gray} />
                <Text style={styles.icon_text}>{vetDetails.vetId}</Text>
              </View>
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
          </View>

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

          {(vetDetails.about || authState.userType == "vet") && (
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
              <View style={styles.segment_header}>
                <Text style={styles.rating_text}>{rate ? rate.toFixed(1) : 0}</Text>
                <Text style={styles.out_of_count}>out of 5</Text>
              </View>
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
      )}
      {authState.userType == "petOwner" && !isLoading && (
        <Button text={"Book"} style={styles.book_button} onPress={onBooking} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen_container: { flex: 1, backgroundColor: colors.white },
  container: {
    marginTop: 40,
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    color: colors.primary,
  },
  header_container: {
    flexDirection: "row",
    paddingHorizontal: 16,
  },
  image_container: {
    flex: 1,
    marginTop: 24,
  },
  image: {
    height: 150,
    resizeMode: "cover",
    borderRadius: 10,
  },
  info_header_container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
    paddingHorizontal: 16,
  },
  info_container: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "space-evenly",
    padding: 8,
  },
  icon_container: {
    flexDirection: "row",
    paddingLeft: 6,
    marginVertical: 10,
  },
  icon_text: {
    fontSize: sizes.h4,
    marginLeft: 12,
  },
  edit_button: {
    container: {
      alignItems: "flex-end",
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
    borderTopWidth: 4,
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
  sub_header_text: {
    paddingTop: 16,
    paddingBottom: 8,
    fontSize: sizes.h4,
  },
  segment_content: {
    flex: 1,
    marginTop: 16,
    justifyContent: "space-evenly",
  },
  spetialization_container: {
    flex: 1,
    paddingHorizontal: 8,
    paddingTop: 8,
  },
  chips: {
    alignSelf: "flex-start",
    color: colors.primary,
  },
  chip_container: {
    borderRadius: 20,
    borderColor: colors.primary,
    borderWidth: 1,
    padding: 12,
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
  out_of_count: {
    fontSize: sizes.body1,
    color: colors.gray,
    paddingLeft: 8,
    paddingTop: 8,
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
