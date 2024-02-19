import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Image, TouchableWithoutFeedback } from "react-native";
import { Feather, EvilIcons } from "@expo/vector-icons";
import VetSearchForm from "../../components/VetSearchForm/VetSearchForm";
import { colors, sizes } from "../../constants";
import { clientServer } from "../../server";

export default function VetSearchScreen({ navigation }) {
  const [veterinarians, setVeterinarians] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState();
  const [selectedSpecialization, setSelectedSpecialization] = useState();

  const handleFilterChange = async () => {
    const queryParams = new URLSearchParams();
    const filter_location = selectedLocation || "";
    const filter_specialization = selectedSpecialization || "";
    queryParams.append("location", filter_location);
    queryParams.append("specialization", filter_specialization);
    const vets = await clientServer.getVets(queryParams.toString());

    const mappedVets = await Promise.all(
      vets.map(async (vet) => {
        const vetRating = await clientServer.getRateByVetId(vet._id);
        const rate = vetRating.map((rate) => rate.rate).reduce((a, b) => a + b, 0) / vetRating.length;
        return {
          ...vet,
          rating: rate || null,
        };
      })
    );
    setVeterinarians(mappedVets);
  };

  const handleVetPress = (vet) => {
    navigation.navigate("Vet Home Screen", {
      vetId: vet._id,
    });
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.header_container}>
          <Text style={styles.header_text}>Find a Vet</Text>
        </View>
        <VetSearchForm
          onSelectedLocation={setSelectedLocation}
          onSelectedSpecialization={setSelectedSpecialization}
          handleFilterChange={handleFilterChange}
        />
        {veterinarians && veterinarians.length > 0 ? (
          <View style={styles.results_container}>
            {veterinarians.map((vet, index) => (
              <View key={index} style={styles.detailes_container}>
                <TouchableWithoutFeedback onPress={() => handleVetPress(vet)}>
                  <View style={styles.info_container}>
                    {vet?.imgSrc && <Image source={{ uri: vet.imgSrc }} style={styles.image} />}
                    <View style={styles.title_container}>
                      <Text style={styles.title}>{vet.name}</Text>
                      <View style={styles.icon_container}>
                        <Feather name="phone" size={16} color={colors.gray} />
                        <Text style={styles.text}>{vet.phoneNumber}</Text>
                      </View>
                      <View style={styles.icon_container}>
                        <EvilIcons name="location" size={16} color={colors.gray} />
                        <Text style={styles.text}>{vet?.location}</Text>
                      </View>
                    </View>
                    {vet.rating && (
                      <View style={styles.rating_container}>
                        <Text style={styles.rate}>{vet.rating.toFixed(1)}</Text>
                        <Text style={{ color: colors.white }}>Rating</Text>
                      </View>
                    )}
                  </View>
                </TouchableWithoutFeedback>
              </View>
            ))}
          </View>
        ) : (
          (selectedLocation || selectedSpecialization) && <Text style={styles.text}>No veterinarians found</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 60,
  },
  header_container: {
    marginHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  header_text: {
    fontSize: sizes.h1,
    color: colors.primary,
    fontWeight: "bold",
    marginVertical: 16,
    paddingHorizontal: 24,
  },
  results_container: {
    flex: 1,
    flexDirection: "row",
    borderRadius: 20,
    marginHorizontal: 36,
    marginVertical: 16,
    paddingVertical: 8,
    backgroundColor: colors.white,
    shadowColor: colors.gray,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    elevation: 6,
  },
  rating_container: {
    backgroundColor: colors.secondary,
    marginHorizontal: 8,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.gray,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  detailes_container: {
    flex: 1,
    justifyContent: "center",
    padding: 8,
  },
  info_container: {
    flex: 1,
    flexDirection: "row",
    marginLeft: 16,
  },
  image: {
    marginRight: 16,
    alignItems: "center",
    borderRadius: 50,
    overflow: "hidden",
    width: 72,
    height: 72,
  },
  title_container: {
    flex: 1,
  },
  title: {
    fontSize: sizes.h3,
    marginBottom: 6,
  },
  icon_container: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 6,
  },
  text: {
    fontSize: sizes.body1,
    paddingHorizontal: 8,
    color: colors.gray,
  },
  rate: {
    fontSize: sizes.h1,
    color: colors.white,
    fontWeight: "bold",
  },
});
