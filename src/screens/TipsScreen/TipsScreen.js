import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, Text, TextInput, Button, FlatList, StyleSheet, Image } from "react-native";
import { COLORS } from "../../constants";
import { MaterialIcons, AntDesign } from "@expo/vector-icons";
import { clientServer } from "../../server";

export default function TipsScreen({ route }) {
  const [vetTips, setVetTips] = useState([]);
  const [allTips, setAllTips] = useState([]);
  const [editingTipId, setEditingTipId] = useState(null);
  const [editedTipContent, setEditedTipContent] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [tip, setTip] = useState("");

  const vetId = route.params.vetId;
  const userType = route.params.userType;

  const fetchAllTips = async () => {
    try {
      const tips = await clientServer.getTips();
      setAllTips(tips);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchTipsById = async () => {
    try {
      const tipIds = await clientServer.getVetTips(vetId);
      const tipsDetailsArray = await clientServer.getTipsByIds(tipIds);
      setVetTips(tipsDetailsArray);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (userType === "petOwner") {
      if (vetId) {
        fetchTipsById();
      } else {
        fetchAllTips();
      }
    } else if (userType === "vet") {
      fetchTipsById();
      fetchAllTips();
    }
  }, []);

  const handleEditPress = (tipId, currentContent) => {
    setEditingTipId(tipId);
    setEditedTipContent(currentContent);
  };
  const handleDeletePress = async (tipId) => {
    try {
      await clientServer.deleteTip(tipId);
      await fetchTipsById();
    } catch (error) {
      console.error("Error deleting tip:", error);
    }
  };

  const handleSavePress = async (tipId) => {
    setVetTips((prevTips) => prevTips.map((tip) => (tip._id === tipId ? { ...tip, content: editedTipContent } : tip)));
    await clientServer.updateTip(tipId, { vetId: vetId, content: editedTipContent });

    // Clear editing state
    setEditingTipId(null);
    setEditedTipContent("");
  };

  const handleCancelPress = () => {
    // Clear editing state
    setEditingTipId(null);
    setEditedTipContent("");
  };

  const handleSave = async () => {
    await clientServer.addTip(vetId, tip);
    await fetchTipsById();
    setIsAdding(false);
  };
  const handleCancel = () => {
    setIsAdding(false);
    setTip("");
  };

  const renderItemOtherVet = ({ item }) => {
    if (vetId && item.vetId == vetId) return null;
    return (
      <View style={styles.tipContainer}>
        <Image
          source={{ uri: item.VetImage }} // Make sure to update this to use item-specific images if available
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
      <View style={styles.tipContainer}>
        {isEditing ? (
          <View>
            <TextInput value={editedTipContent} onChangeText={(text) => setEditedTipContent(text)} />
            <View style={{ flexDirection: "row", marginTop: 5 }}>
              <Button title="Save" onPress={() => handleSavePress(item._id)} />
              <Button title="Cancel" onPress={handleCancelPress} />
            </View>
          </View>
        ) : (
          <View style={styles.tipTextContainer}>
            <Text style={styles.tipContent}>{item.content}</Text>
            {userType == "vet" && (
              <>
                <TouchableOpacity onPress={() => handleEditPress(item._id, item.content)}>
                  <MaterialIcons name="edit" size={24} color={COLORS.black} />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => handleDeletePress(item._id)}>
                  <MaterialIcons name="delete" size={24} color="black" />
                </TouchableOpacity>
              </>
            )}
          </View>
        )}
      </View>
    );
  };

  const renderItems = () => {
    if (userType === "petOwner") {
      if (vetId) {
        return (
          <>
            <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}> Vet Tips:</Text>
            <FlatList data={vetTips} renderItem={renderItem} keyExtractor={(item) => item._id} />
          </>
        );
      } else {
        return (
          <>
            <Text style={{ fontSize: 20, marginTop: 10, fontWeight: "bold", marginBottom: 10 }}> Vet Tips:</Text>
            <FlatList data={allTips} renderItem={renderItemOtherVet} keyExtractor={(item) => item._id} />
          </>
        );
      }
    } else if (userType === "vet") {
      return (
        <View>
          <>
            <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}> My Tips:</Text>
            {isAdding ? (
              <>
                <TextInput
                  multiline={true}
                  numberOfLines={10}
                  placeholder="Write your tip here..."
                  value={tip}
                  onChangeText={setTip}
                />
                <View style={{ flexDirection: "row", marginTop: 5 }}>
                  <Button title="Save" onPress={handleSave} />
                  <Button title="Cancel" onPress={handleCancel} />
                </View>
              </>
            ) : (
              <TouchableOpacity onPress={() => setIsAdding(true)}>
                <AntDesign name="pluscircleo" size={24} color="black" />
              </TouchableOpacity>
            )}
            <FlatList data={vetTips} renderItem={renderItem} keyExtractor={(item) => item._id} />
          </>
          <Text style={{ fontSize: 20, marginTop: 10, fontWeight: "bold", marginBottom: 10 }}> Vet Tips:</Text>
          <FlatList data={allTips} renderItem={renderItemOtherVet} keyExtractor={(item) => item._id} />
        </View>
      );
    }
  };

  return <View>{renderItems()}</View>;
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
    flexDirection: "row", // Set flexDirection to row to align items horizontally
    backgroundColor: "#f0f0f0",
    borderRadius: 2,
    padding: 5,
    marginBottom: 10,
    alignItems: "center", // Align items vertically in the center
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
    fontStyle: "italic",
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
    alignSelf: "flex-end",
    marginBottom: 10,
  },
});
