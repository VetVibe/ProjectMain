import React, { useState, useContext, useCallback, useMemo } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { AuthContext } from "../../auth";
import { View, Text, Image, ScrollView, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from "react-native";
import { EvilIcons, Feather, Fontisto, FontAwesome } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { encodeImageAsBase64 } from "../../../imageUtils";
import { formatDateForRating } from "../../utils";
import { RateCard, Button, Input } from "../../components";
import { colors, sizes } from "../../constants";
import { clientServer } from "../../server";

export default function VetHomeScreen({ route, navigation }) {
  const { authState } = useContext(AuthContext);
  const [fetched, setFetched] = useState(false);
  const [loading, setLoading] = useState(true);
  const [vetDetails, setVetDetails] = useState({});
  const [vetTips, setVetTips] = useState([]);
  const [vetRatings, setVetRatings] = useState([]);
  const [petOwners, setPetOwners] = useState([]);
  const [ratingCount, setRatingCount] = useState(0);
  const [editAbout, setEditAbout] = useState(false);
  const [rate, setRate] = useState(0);
  const available = vetDetails.start && vetDetails.end && vetDetails.location;
  const id = authState.isOwner ? route.params.vetId : authState.id;

  const fetchUsers = async (rating) => {
    const petOwnerIds = Array.from(new Set(rating.map((rating) => rating.petOwnerId)));
    petOwnerIds.forEach(async (petOwnerId) => {
      if (!petOwners[petOwnerId]) {
        const petOwnerInfo = await clientServer.getPetOwnerInfo(petOwnerId);
        setPetOwners((prevOwners) => ({
          ...prevOwners,
          [petOwnerId]: petOwnerInfo,
        }));
      }
    });
    return petOwners;
  };

  const fetchTips = async () => {
    const vetTips = await clientServer.getTipsByVetId(id);
    setVetTips(vetTips);
  };

  const fetchRating = async () => {
    const vetRatings = await clientServer.getRateByVetId(id);
    return vetRatings;
  };

  const fetchData = useCallback(async () => {
    const vet = await clientServer.getVetInfo(id);
    setVetDetails(vet);
    await fetchTips();

    await fetchRating().then(async (rating) => {
      const ratingsLength = rating.length;
      const totalRate = rating.reduce((acc, rating) => acc + rating.rate, 0) / ratingsLength;
      setRatingCount(ratingsLength);
      setRate(totalRate || 0);
      await fetchUsers(rating);
      setVetRatings(rating);
    });

    setLoading(false);
  }, [id, petOwners, fetchUsers, fetchTips, fetchRating]);

  useFocusEffect(
    useCallback(() => {
      if (!fetched) {
        setFetched(true);
        fetchData().catch(() => {
          setFetched(false);
        });
      }
    }, [fetchData, fetched])
  );

  useFocusEffect(
    useCallback(() => {
      setFetched(false);
    }, [id])
  );

  const ratingList = useMemo(() => {
    return vetRatings.map((rating) => ({
      ...rating,
      userName: petOwners[rating.petOwnerId]?.name,
      when: formatDateForRating(rating.when),
    }));
  }, [vetRatings, petOwners, fetched]);

  const onSave = async () => {
    setEditAbout(false);
    await clientServer.updateVetInfo(authState.id, vetDetails);
  };

  const renderTip = (item) => {
    if (!item) return null;
    return (
      <View style={styles.tip_container}>
        <Text style={styles.text}>{item.content}</Text>
      </View>
    );
  };

  const randeSpecialization = (item) => {
    if (!item) return null;
    return (
      <View style={styles.chip_container}>
        <Text style={styles.chips}>{item}</Text>
      </View>
    );
  };

  const onBooking = useCallback(() => {
    navigation.navigate("Make Appointment", { vetId: id });
  }, [navigation]);

  const navigateToEditScreen = () => {
    navigation.navigate("Edit Vet Profile", { vet: vetDetails });
  };

  const navigateToReviewsScreen = useCallback(() => {
    navigation.navigate("Vet Reviews", { vetId: id, owners: petOwners, ratings: vetRatings });
  }, [navigation]);

  const handleImagePicker = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status === "granted") {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets.length > 0) {
        const selectedAsset = result.assets[0];
        try {
          const base64Image = await encodeImageAsBase64(selectedAsset.uri);
          setVetDetails((prev) => ({ ...prev, profilePicture: `data:image/jpeg;base64,${base64Image}` }));
          await clientServer.updateVetInfo(authState.id, {
            ...vetDetails,
            profilePicture: `data:image/jpeg;base64,${base64Image}`,
          });
        } catch (error) {
          Alert.alert("Error", "Failed to encode image as Base64");
        }
      }
    } else {
      Alert.alert("Permission denied", "Permission to access the photo library was denied.");
    }
  };

  return (
    <View style={styles.screen_container}>
      {loading ? (
        <ActivityIndicator style={styles.loadingIndicator} size="large" />
      ) : (
        <ScrollView style={styles.container}>
          <View style={styles.image_container}>
            <Image source={{ uri: vetDetails.profilePicture }} style={styles.image} />
            {!authState.isOwner && (
              <TouchableOpacity style={styles.cameraIconContainer} onPress={handleImagePicker}>
                <FontAwesome name="camera" size={24} color="black" />
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.info_header_container}>
            <Text style={styles.header_text}>{vetDetails.name}</Text>
            {!authState.isOwner && <Button text="Edit" onPress={navigateToEditScreen} style={styles.edit_button} />}
          </View>
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

          {vetDetails?.specialization && (
            <View style={styles.spetialization_container}>
              <FlatList
                horizontal
                decelerationRate={"fast"}
                showsHorizontalScrollIndicator={true}
                data={vetDetails.specialization}
                renderItem={({ item }) => randeSpecialization(item)}
              />
            </View>
          )}

          {(vetDetails.about || !authState.isOwner) && (
            <View style={styles.segment_container}>
              <View style={styles.segment_header}>
                <Text style={styles.header_text}>About</Text>
                {!authState.isOwner && (
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

          {vetTips.length > 0 && (
            <View style={styles.segment_container}>
              <View style={styles.segment_header}>
                <Text style={styles.header_text}>Tips</Text>
              </View>
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={true}
                initialNumToRender={2}
                data={vetTips}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => renderTip(item)}
              />
            </View>
          )}

          <View style={styles.segment_container}>
            <View style={styles.segment_header}>
              <Text style={styles.header_text}>Ratings & Reviews</Text>
              <Button text="See all" onPress={navigateToReviewsScreen} style={styles.edit_button} />
            </View>
            <View style={styles.segment_header}>
              <View style={styles.segment_header}>
                <Text style={styles.rating_text}>{rate ? rate.toFixed(1) : 0}</Text>
                <Text style={styles.out_of_count}>out of 5</Text>
              </View>
              <Text style={styles.rating_count}>{ratingCount} Ratings</Text>
            </View>
            <FlatList
              horizontal
              data={ratingList}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => <RateCard rate={item} />}
            />
          </View>
        </ScrollView>
      )}
      {authState.isOwner && !loading && available && (
        <Button text={"Book"} style={styles.book_button} onPress={onBooking} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen_container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  container: {
    marginTop: sizes.height / 50,
    marginBottom: 10,
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    color: colors.primary,
  },
  image_container: {
    flex: 1,
    paddingHorizontal: 8,
  },
  image: {
    height: sizes.height / 5,
    resizeMode: "cover",
    borderRadius: 10,
  },
  cameraIconContainer: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "transparent",
    padding: 5,
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
    marginHorizontal: 8,
    padding: 8,
  },
  icon_container: {
    flexDirection: "row",
    paddingLeft: 6,
    marginVertical: 8,
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
    marginTop: 36,
  },
  segment_header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
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
    paddingHorizontal: 16,
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
    marginHorizontal: 6,
  },
  tip_container: {
    flex: 1,
    width: sizes.width / 1.5,
    height: 100,
    borderRadius: 20,
    margin: 16,
    padding: 16,
    backgroundColor: colors.white,
    shadowColor: colors.gray,
    shadowOpacity: 0.2,
    shadowRadius: 8,
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
      borderRadius: 20,
      shadowOpacity: 0.2,
      shadowRadius: 8,
      shadowColor: colors.gray,
      backgroundColor: colors.primary,
      margin: 20,
    },
    text: {
      textAlign: "center",
      fontSize: sizes.h3,
      padding: 8,
      color: colors.white,
      fontWeight: "bold",
    },
  },
});
