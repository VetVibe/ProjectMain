import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";

export default function PetContainer({userPets, navi}) {
    const navigateToEditScreen = (petDetails) => {
        navi.navigate("Pet Profile Screen", {petDetails: petDetails});
    };

    return (
        <View>
            <Text style={styles.header}>Your Pets</Text>
            {Object.entries(userPets).map(([petId, petData]) => 
                <TouchableOpacity key={petId} onPress={() => navigateToEditScreen(petData)}>
                    <Image source={{ uri: petData.imgSrc }} style={styles.pawImage} resizeMode="contain" />
                    <Text style={styles.title}>{petData.basicInfo.petName.value}</Text>
                </TouchableOpacity>
            )}
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
  }
});