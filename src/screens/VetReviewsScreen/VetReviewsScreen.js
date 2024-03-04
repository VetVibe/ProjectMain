import React, { useContext, useEffect, useState, useCallback } from "react";
import { AuthContext } from "../../auth";
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from "react-native";
import { RateCard, RateVet } from "../../components";
import { clientServer } from "../../server";
import { colors, sizes } from "../../constants";
import { formatDateForRating } from "../../utils";

export default function VetReviewsScreen({ route }) {
  const { authState } = useContext(AuthContext);
  const id = !authState.isOwner ? authState.id : route.params.vetId;
  const petOwners = route.params.owners;
  const vetRatings = route.params.ratings;
  const [ratingList, setRatingList] = useState([]);
  const [petOwnerRate, setPetOwnerRate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetched, setFetched] = useState(false);
  const [rating, setRating] = useState(0);
  const [ratingCount, setRatingCount] = useState(0);

  const calcRating = useCallback(
    (ratings, ownerRate = undefined) => {
      let count = 0;
      let totalRate = 0;

      count = ownerRate ? ratings.length + 1 : ratings.length;
      totalRate = ratings.reduce((acc, rating) => acc + rating.rate, 0) + (ownerRate ? ownerRate.rate : 0);
      setRating(totalRate / count);
      setRatingCount(count);
    },
    [petOwnerRate, vetRatings]
  );

  const getRatings = useCallback(
    (vetRating) => {
      const list = vetRating.map((rating) => ({
        ...rating,
        userName: petOwners[rating.petOwnerId].name,
        when: formatDateForRating(rating.when),
      }));
      return list;
    },
    [petOwners]
  );

  const fetchPetOwnerRate = useCallback(async () => {
    const ownerRate = await clientServer.getRateByVetOwner(authState.id, id);
    return ownerRate;
  }, [authState.id, id]);

  const fetchRating = useCallback(async () => {
    let filteredRatings = vetRatings;
    let ownerRate = null;
    if (authState.isOwner) {
      ownerRate = await fetchPetOwnerRate();
      if (ownerRate) {
        setPetOwnerRate(ownerRate);
        filteredRatings = vetRatings.filter((rating) => rating.petOwnerId !== authState.id);
      }
    }
    calcRating(filteredRatings, ownerRate);

    const ratingList = await getRatings(filteredRatings, petOwners);
    setRatingList(ratingList);
    setLoading(false);
  }, [authState.isOwner, fetchPetOwnerRate, vetRatings, petOwners, petOwnerRate]);

  useEffect(() => {
    if (!fetched) {
      setLoading(true);
      setFetched(true);
      fetchRating().catch(() => {
        setFetched(false);
      });
    }
  }, [fetched, fetchRating]);

  const onNewRating = useCallback(
    async (rate) => {
      let responce;
      if (petOwnerRate) {
        responce = await clientServer.updateRate(petOwnerRate._id, rate);
      } else {
        const newRate = { rate: rate.rate, vetId: id, petOwnerId: authState.id };
        responce = await clientServer.addRate(newRate);
      }

      setFetched(false);
    },
    [petOwnerRate, fetchPetOwnerRate]
  );

  const renderHeader = useCallback(() => {
    return (
      <>
        <View style={styles.header}>
          <Text style={styles.header_text}>Ratings & Reviews</Text>
        </View>
        <View style={styles.rating_header}>
          <View style={styles.rating_header}>
            <Text style={styles.rating_text}>{rating ? rating.toFixed(1) : 0}</Text>
            <Text style={styles.out_of_count}>out of 5</Text>
          </View>
          <Text style={styles.rating_count}>{ratingCount} Ratings</Text>
        </View>

        {authState.isOwner && <RateVet petOwnerRate={petOwnerRate} onNewRating={onNewRating} />}
      </>
    );
  }, [authState.isOwner, petOwnerRate, onNewRating, rating, ratingCount]);

  return (
    <View style={styles.screen_container}>
      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} />
      ) : (
        <View style={styles.container}>
          <FlatList
            data={ratingList}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => <RateCard rate={item} />}
            ListHeaderComponent={renderHeader}
          />
        </View>
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
    padding: 16,
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    color: colors.primary,
  },
  text: {
    fontSize: sizes.h4,
    color: colors.gray,
  },
  header: {
    alignItems: "center",
    paddingHorizontal: 16,
  },
  header_text: {
    fontSize: sizes.h2,
    fontWeight: "bold",
  },
  rating_header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 16,
    marginHorizontal: 24,
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
  list_container: {
    alignItems: "center",
  },
});
