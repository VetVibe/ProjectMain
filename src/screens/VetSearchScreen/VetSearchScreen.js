import React, { useState, useEffect, useCallback } from "react";
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import { VetSearchForm, VetCard } from "../../components";
import { createRating } from "../../utils";
import { colors, sizes } from "../../constants";
import { clientServer } from "../../server";

export default function VetSearchScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [fetched, setFetched] = useState(false);
  const [vetsList, setVetsList] = useState([]);
  const [query, setQuery] = useState({});
  const [selectedLocation, setSelectedLocation] = useState();
  const [selectedSpecialization, setSelectedSpecialization] = useState();

  const fetchRating = useCallback(async (vets) => {
    const list = await vets.map(async (vet) => {
      const vetRating = await clientServer.getRateByVetId(vet._id);
      return createRating(vet, vetRating);
    });
    return Promise.all(list);
  }, []);

  const fetchData = useCallback(async () => {
    const vets = await clientServer.getVets(query);
    const availableVets = vets.filter((vet) => vet.start && vet.end && vet.location);

    if (vets.length) {
      const vetRatings = await fetchRating(availableVets);
      setVetsList(vetRatings);
    }

    setLoading(false);
  }, [query]);

  useEffect(() => {
    if (!fetched) {
      setLoading(true);
      setFetched(true);
      fetchData().catch(() => {
        setFetched(false);
      });
    }
  }, [fetchData, fetched]);

  const handleFilterChange = useCallback(() => {
    const queryParams = new URLSearchParams();
    selectedLocation && queryParams.append("location", selectedLocation);
    selectedSpecialization && queryParams.append("specialization", selectedSpecialization);
    setQuery(queryParams.toString());
    setFetched(false);
  }, [selectedLocation, selectedSpecialization]);

  const handleVetPress = (vet) => {
    navigation.navigate("Vet Home Screen", {
      vetId: vet._id,
    });
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator style={styles.loadingIndicator} size="large" />
      ) : (
        <View style={styles.results_container}>
          <FlatList
            data={vetsList}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => <VetCard vet={item} onPress={handleVetPress} />}
            ListHeaderComponent={
              <>
                <View style={styles.header_container}>
                  <Text style={styles.header_text}>Find a Vet</Text>
                </View>
                <VetSearchForm
                  location={selectedLocation}
                  specialization={selectedSpecialization}
                  onSelectedLocation={setSelectedLocation}
                  onSelectedSpecialization={setSelectedSpecialization}
                  onChange={handleFilterChange}
                />
              </>
            }
            ListEmptyComponent={
              (selectedLocation || selectedSpecialization) && <Text style={styles.text}>No veterinarians found</Text>
            }
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    color: colors.primary,
  },
  header_container: {
    marginHorizontal: 16,
    alignItems: "center",
  },
  header_text: {
    fontSize: sizes.h1,
    color: colors.primary,
    fontWeight: "bold",
    marginVertical: 16,
    paddingHorizontal: 24,
  },
  results_container: {
    marginHorizontal: 16,
  },
});
