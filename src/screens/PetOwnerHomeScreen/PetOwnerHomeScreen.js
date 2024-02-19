import React, { useState, useCallback, useContext } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { AuthContext } from "../../auth";
import { colors, sizes } from "../../constants";
import { PetCard, TipCard } from "../../components";
import { calculateAge } from "../../utils";
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import { MaterialIcons, AntDesign } from "@expo/vector-icons";
import { clientServer } from "../../server";

const CARD_WIDTH = sizes.width - 100;

export default function PetOwnerHomeScreen() {
  const navigation = useNavigation();
  const { authState } = useContext(AuthContext);
  const [loadingPets, setLoadingPets] = useState(true);
  const [loadingTips, setLoadingTips] = useState(true);
  const [userPets, setUserPets] = useState([]);
  const [allTips, setAllTips] = useState([]);

  useFocusEffect(
    useCallback(() => {
      clientServer
        .getPetsByOwnerId(authState.id)
        .then((petsInfo) => {
          const mappedPets = petsInfo?.pets.map((pet) => ({
            ...pet,
            age: calculateAge(pet.birthdate),
          }));
          setUserPets(mappedPets || []);
        })
        .finally(() => {
          setLoadingPets(false);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });

      clientServer
        .getAllTips()
        .then((allTips) => {
          const promiseArray = allTips.map(async (tip) => {
            return clientServer
              .getVetInfo(tip.vetId)
              .then((vetInfo) => {
                tip.vetName = vetInfo.name;
                tip.vetImage = vetInfo.profilePicture;
                return tip;
              })
              .catch((error) => {
                console.log("Error fetching vet info:", error);
              });
          });
          return Promise.all(promiseArray);
        })
        .then((modified) => {
          setAllTips(modified);
        })
        .catch((error) => {
          console.log("Error fetching all tips:", error);
        })
        .finally(() => {
          setLoadingTips(false);
        });
    }, [authState.id])
  );

  const handleNavigateToEditProfile = () => {
    navigation.navigate("Add Pet");
  };

  const handlePetSelect = (pet) => {
    navigation.navigate("Pet Profile", { petId: pet._id });
  };

  const handleTipSelect = (tip) => {
    navigation.navigate("Pet Owner Appointments Tab", { screen: "Vet Home Screen", params: { vetId: tip.vetId } });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header_container}>
        <Text style={styles.header_text}>Vet Vibe</Text>
        <MaterialIcons name="pets" size={24} color={colors.primary} />
      </View>

      <View style={styles.segment_container}>
        <View style={styles.segment_header_container}>
          <Text style={styles.text}>Your Pets</Text>
          <AntDesign name="pluscircleo" size={24} style={styles.icon} onPress={handleNavigateToEditProfile} />
        </View>
        {loadingPets || loadingTips ? (
          <ActivityIndicator style={styles.loadingIndicator} size="large" />
        ) : (
          <View>
            {userPets?.length > 0 ? (
              <FlatList
                horizontal
                snapToInterval={CARD_WIDTH + 24}
                decelerationRate={"fast"}
                showsHorizontalScrollIndicator={false}
                initialNumToRender={2}
                data={userPets}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => <PetCard pet={item} onSelect={() => handlePetSelect(item)} />}
              />
            ) : (
              <Text>No pets in your collection, add now!</Text>
            )}
          </View>
        )}
      </View>

      <View style={styles.segment_container}>
        <View style={styles.segment_header_container}>
          <Text style={styles.text}>Vet Tips</Text>
        </View>
        {loadingTips || loadingPets ? (
          <ActivityIndicator style={styles.loadingIndicator} size="large" />
        ) : (
          <View>
            {allTips?.length > 0 ? (
              <FlatList
                horizontal
                snapToInterval={CARD_WIDTH + 24}
                decelerationRate={"fast"}
                showsHorizontalScrollIndicator={false}
                initialNumToRender={2}
                data={allTips}
                keyExtractor={(item) => item?._id}
                renderItem={({ item }) => <TipCard tip={item} onSelect={() => handleTipSelect(item)} />}
              />
            ) : (
              <Text>No tips available</Text>
            )}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 40,
  },
  header_container: {
    marginVertical: 16,
    paddingHorizontal: 24,
    flexDirection: "row",
    alignItems: "center",
  },
  header_text: {
    flex: 1,
    fontSize: sizes.h1,
    color: colors.primary,
    fontWeight: "bold",
  },
  segment_container: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  segment_header_container: {
    marginVertical: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  text: {
    fontSize: sizes.h2,
    fontWeight: "bold",
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    color: colors.primary,
  },
  icon: {
    color: colors.primary,
  },
});
