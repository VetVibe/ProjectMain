import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";

export default function PetContainer({ userPets, navi }) {
  const navigateToEditScreen = (petId) => {
    navi.navigate("Pet Profile Screen", { petId: petId });
  };

  return (
    <View>
      {userPets.map((pet) => (
        <TouchableOpacity key={pet._id} onPress={() => navigateToEditScreen(pet._id)}>
          <Image source={{ uri: pet.imgSrc }} style={styles.pawImage} resizeMode="contain" />
          <Text style={styles.title}>{pet.name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    fontSize: 40,
    color: "#333333",
    marginTop: 10,
  },
  pawImage: {
    width: 100,
    height: 100,
  },
  title: {
    fontSize: 20,
    color: "#333333",
    marginTop: 10,
  },
});
