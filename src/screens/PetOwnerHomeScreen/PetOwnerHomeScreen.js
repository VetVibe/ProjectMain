import React, { useState, useCallback, useContext } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { AuthContext } from "../../auth";
import { colors, sizes } from "../../constants";
import { PetCard, TipCard } from "../../components";
import { calculateAge } from "../../utils";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { MaterialIcons, AntDesign } from "@expo/vector-icons";
import Icon from "react-native-vector-icons/FontAwesome";
import { clientServer } from "../../server";

const CARD_WIDTH = sizes.width - 100;

export default function PetOwnerHomeScreen() {
  const navigation = useNavigation();
  const { authState } = useContext(AuthContext);
  const [userPets, setUserPets] = useState([]);
  const [allTips, setAllTips] = useState([]);

  const fetchAllTips = async () => {
    try {
      const allTips = await clientServer.getAllTips();
      let filteredTips = allTips;

      const tipsWithVetInfo = await Promise.all(
        filteredTips.map(async (tip) => {
          const vetDetails = await clientServer.getVetInfo(tip.vetId);
          return {
            ...tip,
            vetName: vetDetails.name,
            vetImage: vetDetails.profilePicture,
          };
        })
      );

      setAllTips(tipsWithVetInfo);
    } catch (error) {
      console.log(error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      const fetchUserPetDetails = async () => {
        try {
          const petsInfo = await clientServer.getPetsByOwnerId(authState.id);
          const mappedPets = petsInfo?.pets.map((pet) => ({
            ...pet,
            age: calculateAge(pet.age),
          }));
          setUserPets(mappedPets || []);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      fetchUserPetDetails();
      fetchAllTips();
    }, [authState.id])
  );

  const handleNavigateToEditProfile = () => {
    navigation.navigate("Edit Pet Profile");
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
        {userPets?.length > 0 ? (
          <View>
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
          </View>
        ) : (
          <Text>No pets in your collection, add now!</Text>
        )}
      </View>

      <View>
        {allTips?.length > 0 && (
          <View style={styles.segment_container}>
            <View style={styles.segment_header_container}>
              <Text style={styles.text}>Vet Tips</Text>
            </View>
            <View>
              <FlatList
                horizontal
                snapToInterval={CARD_WIDTH + 24}
                decelerationRate={"fast"}
                showsHorizontalScrollIndicator={false}
                initialNumToRender={2}
                data={allTips}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => <TipCard tip={item} onSelect={() => handleTipSelect(item)} />}
              />
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 120,
  },
  header_container: {
    marginVertical: 16,
    paddingHorizontal: 24,
    flexDirection: "row",
    alignItems: "center",
  },
  header_text: {
    fontSize: sizes.h1,
    color: colors.primary,
    fontWeight: "bold",
    flex: 1,
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
  icon: {
    color: colors.primary,
  },
});
