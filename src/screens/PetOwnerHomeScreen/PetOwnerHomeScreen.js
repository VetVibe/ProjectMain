import React, { useState, useCallback, useContext, useMemo, useEffect } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { View, Text, StyleSheet, FlatList, ActivityIndicator, ScrollView, ImageBackground } from "react-native";
import { AuthContext } from "../../auth";
import { colors, sizes } from "../../constants";
import { Button, PetCard, TipCard } from "../../components";
import { calculateAge } from "../../utils";
import { MaterialIcons, AntDesign } from "@expo/vector-icons";
import { clientServer } from "../../server";

export default function PetOwnerHomeScreen() {
  const navigation = useNavigation();
  const { authState } = useContext(AuthContext);
  const [pets, setPets] = useState([]);
  const [vetTips, setVetTips] = useState([]);
  const [vetDetailsMap, setVetDetailsMap] = useState({});
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const fetchPets = async () => {
        const petsData = await clientServer.getPetsByOwnerId(authState.id);
        setPets(petsData?.pets || []);
      };
      fetchPets();

      const fetchVetTips = async () => {
        const tipsData = await clientServer.getAllTips();
        setVetTips(tipsData);
      };
      fetchVetTips();
    }, [authState.id])
  );

  useEffect(() => {
    const fetchVetDetails = async () => {
      const uniqueVetIds = Array.from(new Set(vetTips.map((tip) => tip.vetId)));
      uniqueVetIds.forEach(async (vetId) => {
        if (!vetDetailsMap[vetId]) {
          const vetDetails = await clientServer.getVetInfo(vetId);
          setVetDetailsMap((prevDetails) => ({
            ...prevDetails,
            [vetId]: {
              name: vetDetails.name,
              profilePicture: vetDetails.profilePicture,
            },
          }));
        }
      });

      setLoading(false);
    };

    fetchVetDetails();
  }, [vetTips]);

  const petList = useMemo(() => {
    return pets && pets.length > 0
      ? pets.map((pet) => ({
          ...pet,
          age: calculateAge(pet.birthdate),
        }))
      : [];
  }, [pets]);

  const vetTipsList = useMemo(() => {
    return vetTips.map((tip) => ({
      ...tip,
      vetName: vetDetailsMap[tip.vetId]?.name,
      vetImage: vetDetailsMap[tip.vetId]?.profilePicture,
    }));
  }, [vetTips, vetDetailsMap]);

  const handleVetSearch = useCallback(() => {
    navigation.navigate("Find Vets");
  }, [navigation]);

  const handleNavigateToEditProfile = useCallback(() => {
    navigation.navigate("Add Pet");
  }, [navigation]);

  const handlePetSelect = useCallback(
    (pet) => {
      navigation.navigate("Pet Profile", { petId: pet._id });
    },
    [navigation]
  );

  const handleTipSelect = useCallback(
    (tip) => {
      navigation.navigate("Vet Home Screen", { vetId: tip.vetId });
    },
    [navigation]
  );

  return (
    <View style={styles.container}>
      <View style={styles.header_container}>
        <Text style={styles.header_text}>Vet Vibe</Text>
        <MaterialIcons name="pets" size={24} color={colors.primary} />
      </View>

      {loading ? (
        <ActivityIndicator style={styles.loadingIndicator} size="large" />
      ) : (
        <ScrollView>
          <ImageBackground
            style={styles.welcome_container}
            imageStyle={styles.welcome_image}
            source={require("../../assets/images/pets.png")}
          >
            <View style={styles.welcome_content}>
              <Text style={styles.text}>Book doctor appointment 🐾</Text>
              <Text style={styles.welcome_text}>
                Find a vet near you by their availability, specialization, and location
              </Text>
              <Button text={"Find Vets"} onPress={handleVetSearch} style={styles.find_vet_button} />
            </View>
          </ImageBackground>

          <View style={styles.segment_container}>
            <View style={styles.segment_header_container}>
              <Text style={styles.text}>Your Pets</Text>
              <AntDesign name="pluscircleo" size={24} style={styles.icon} onPress={handleNavigateToEditProfile} />
            </View>

            <View>
              {petList?.length > 0 ? (
                <FlatList
                  horizontal
                  decelerationRate={"fast"}
                  showsHorizontalScrollIndicator={false}
                  initialNumToRender={2}
                  data={petList}
                  keyExtractor={(item) => item._id}
                  renderItem={({ item }) => <PetCard pet={item} onSelect={() => handlePetSelect(item)} />}
                />
              ) : (
                <Text>No pets in your collection, add now!</Text>
              )}
            </View>
          </View>

          <View style={styles.segment_container}>
            <View style={styles.segment_header_container}>
              <Text style={styles.text}>Vet Tips</Text>
            </View>
            <View>
              {vetTipsList?.length > 0 ? (
                <FlatList
                  horizontal
                  decelerationRate={"fast"}
                  showsHorizontalScrollIndicator={false}
                  initialNumToRender={2}
                  data={vetTipsList}
                  keyExtractor={(item) => item?._id}
                  renderItem={({ item }) => <TipCard tip={item} onSelect={() => handleTipSelect(item)} />}
                />
              ) : (
                <Text>No tips available</Text>
              )}
            </View>
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 40,
  },
  welcome_container: {
    height: sizes.height / 4,
    marginHorizontal: 24,
    marginVertical: 16,
    backgroundColor: colors.white,
    borderRadius: 8,
  },
  welcome_image: {
    opacity: 0.8,
    resizeMode: "cover",
    marginTop: 50,
    objectFit: "scale-down",
  },
  welcome_content: {
    marginTop: 8,
    padding: 16,
  },
  welcome_text: {
    fontSize: sizes.h4,
    color: colors.gray,
    marginVertical: 12,
  },
  find_vet_button: {
    container: {
      marginTop: 16,
    },
    text: {
      fontSize: sizes.h4,
      color: colors.primary,
      fontWeight: "bold",
    },
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
    marginBottom: 24,
    paddingHorizontal: 24,
  },
  segment_header_container: {
    marginVertical: 16,
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
