import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, Text, TextInput, Button, ScrollView, FlatList, StyleSheet, Image } from "react-native";
import { COLORS, FONTS, SIZES, images } from "../../constants";
import { MaterialIcons, AntDesign } from "@expo/vector-icons";
import axios from "axios";
import TipsScreenPet, { useAllTips } from "../TipsScreenPet/TipsScreenPet";


export default function TipsScreen({ route, navigation }) {
  const [vetTips, setVetTips] = useState([]);
  const [editingTipId, setEditingTipId] = useState(null);
  const [editedTipContent, setEditedTipContent] = useState("");

  const vetId = route.params.vetId;
  const userType = route.params.userType;
  const   {fetchAllTips, vetTips: allVetTips} = useAllTips()
  useEffect(() => {
    fetchAllTips();
  },[navigation])
  useEffect(() => {
    const updateTips = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/veterinarian/${vetId}/tips`);
        const tipIds = response.data;

        if (tipIds) {
          const fetchTipsDetails = tipIds.map((tipId) =>
            axios.get(`http://localhost:3000/tip/${tipId}`).then((response) => response.data)
          );

          // Wait for all fetches to complete
          Promise.all(fetchTipsDetails).then((tipsDetailsArray) => {
            setVetTips(tipsDetailsArray);
          });
        }
      } catch (error) {
        console.error("Error fetching vet tips:", error);
      }
    };

    // Listen for changes and update petDetails
    const subscription = navigation.addListener("focus", updateTips);

    // Clean up the subscription when the component unmounts
    return () => {
      if (subscription) {
        subscription();
      }
    };
  }, [vetId, navigation]);

  const handleEditPress = (tipId, currentContent) => {
    setEditingTipId(tipId);
    setEditedTipContent(currentContent);
  };

  const handleSavePress = (tipId) => {
    setVetTips((prevTips) => prevTips.map((tip) => (tip._id === tipId ? { ...tip, content: editedTipContent } : tip)));

    axios
      .put(`http://localhost:3000/tip/updateInfo/${tipId}`, {
        updatedData: { vetId: vetId, content: editedTipContent },
      })
      .catch((error) => {
        console.error(`Error during updating tip ${tipId} details:`, error);
      });

    // Clear editing state
    setEditingTipId(null);
    setEditedTipContent("");
  };

  const handleCancelPress = () => {
    // Clear editing state
    setEditingTipId(null);
    setEditedTipContent("");
  };

  const ShareTipClick = () => {
    navigation.navigate("Share Tip Screen", { vetId: vetId });
  };

  const renderItemOtherVet = ({ item }) => {
    if(item.vetId == vetId) return null
    return (
      <View style={styles.tipContainer}>
        <Image
          source={images.Vetprofile} // Make sure to update this to use item-specific images if available
          resizeMode="cover"
          style={styles.profileImage}
        />
        <View style={styles.tipTextContainer}>
          <Text style={styles.tipContent}>{item.content}</Text>
          <Text style={styles.vetName}>By: {item.vetName}</Text>
        </View>
      </View>
    );
  };

  const renderItem = ({ item }) => {
    const isEditing = item._id === editingTipId;

    return (
      <View style={{ marginBottom: 10 }}>
        {isEditing ? (
          <View>
            <TextInput value={editedTipContent} onChangeText={(text) => setEditedTipContent(text)} />
            <View style={{ flexDirection: "row", marginTop: 5 }}>
              <Button title="Save" onPress={() => handleSavePress(item._id)} />
              <Button title="Cancel" onPress={handleCancelPress} />
            </View>
          </View>
        ) : (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text>{item.content}</Text>
            {userType == "vet" && (
              <TouchableOpacity onPress={() => handleEditPress(item._id, item.content)}>
                <MaterialIcons name="edit" size={24} color={COLORS.black} />
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    );
  };

  return (
    <View>
      {userType === "vet" && (
        <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}> My Tips:</Text>
      )}
      {userType === "vet" && (
        <TouchableOpacity onPress={ShareTipClick}>
          <AntDesign name="pluscircleo" size={24} color="black" />
        </TouchableOpacity>
      )}
      {/* <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>My Tips</Text> */}
      <FlatList data={vetTips} renderItem={renderItem} keyExtractor={(item) => item._id} />
      <Text style={{ fontSize: 20, marginTop: 10, fontWeight: "bold", marginBottom: 10 }}> Vet Tips:</Text>
      <FlatList data={allVetTips} renderItem={renderItemOtherVet} keyExtractor={(item) => item._id} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginTop: 60,
    marginBottom: 40,
    marginLeft: 0,
  },
  tipContainer: {
    flexDirection: 'row', // Set flexDirection to row to align items horizontally
    backgroundColor: "#f0f0f0",
    borderRadius: 2,
    padding: 5,
    marginBottom: 10,
    alignItems: 'center', // Align items vertically in the center
  },
  tipContent: {
    fontSize: 16,
  },
  input: {
    height: 40,
    width: "100%", // Updated to span the entire width
    borderColor: "#FFA500",
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 10,
    borderRadius: 20, // Added to make it round
    backgroundColor: "#FFFFFF", // White
  },
  vetName: {
    fontStyle: 'italic',
    marginTop: 5,
  },
  editProfileButton: {
    position: "absolute",
    right: 20,
    top: 20,
    zIndex: 1,
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
    borderRadius: 10,
  },
  profileImage: {
    height: 60, // Adjust the size as needed
    width: 60, // Adjust the size as needed
    borderRadius: 20, // Make it round
    marginRight: 15, // Add some spacing between the image and the text
  },
  tipTextContainer: {
    flex: 1, // Take up the remaining space
  },
  addButton: {
    alignSelf: 'flex-end',
    marginBottom: 10,
  },
});