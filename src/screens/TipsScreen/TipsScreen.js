import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../auth";
import { View, TouchableOpacity, Text, TextInput, Button, FlatList, StyleSheet, Image } from "react-native";
import { COLORS } from "../../constants";
import { MaterialIcons, AntDesign } from "@expo/vector-icons";
import { clientServer } from "../../server";

export default function TipsScreen() {
  const { authState } = useContext(AuthContext);
  const [vetTips, setVetTips] = useState([]);
  const [allTips, setAllTips] = useState([]);
  const [editingTipId, setEditingTipId] = useState(null);
  const [editedTipContent, setEditedTipContent] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [tip, setTip] = useState("");

  const fetchAllTips = async () => {
    try {
      const allTips = await clientServer.getAllTips();
      let filteredTips = allTips;
      if (authState.userType === "vet") {
        filteredTips = allTips.filter((tip) => tip.vetId !== authState.id);
      }

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

  const fetchTipsById = async (id) => {
    try {
      const vetTipsRaw = await clientServer.getTipsByVetId(id);
      const vetDetails = await clientServer.getVetInfo(id);

      const tipsWithVetInfo = await Promise.all(
        vetTipsRaw.map(async (tip) => {
          return {
            ...tip,
            vetImage: vetDetails.profilePicture,
          };
        })
      );
      setVetTips(tipsWithVetInfo);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (authState.userType === "petOwner") {
          await fetchAllTips();
        } else {
          await fetchTipsById(authState.id);
          await fetchAllTips();
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [authState.id]);

  const handleEditPress = (tipId, currentContent) => {
    setEditingTipId(tipId);
    setEditedTipContent(currentContent);
  };
  const handleDeletePress = async (tipId) => {
    try {
      await clientServer.deleteTip(tipId);
      await fetchTipsById(authState.id);
    } catch (error) {
      console.error("Error deleting tip:", error);
    }
  };

  const handleSavePress = async (tipId) => {
    setVetTips((prevTips) => prevTips.map((tip) => (tip._id === tipId ? { ...tip, content: editedTipContent } : tip)));
    await clientServer.updateTip(tipId, {
      vetId: authState.id,
      content: editedTipContent,
    });

    setEditingTipId(null);
    setEditedTipContent("");
  };

  const handleCancelPress = () => {
    setEditingTipId(null);
    setEditedTipContent("");
  };

  const handleSave = async () => {
    await clientServer.addTip(authState.id, tip);
    await fetchTipsById(authState.id);
    setIsAdding(false);
    setTip("");
  };
  const handleCancel = () => {
    setIsAdding(false);
    setTip("");
  };

  const renderAllItems = ({ item }) => {
    if (!item) return null;
    return (
      <View style={styles.tipContainer}>
        <Image source={{ uri: item.vetImage }} resizeMode="cover" style={styles.profileImage} />
        <View style={styles.tipTextContainer}>
          <Text style={styles.tipContent}>{item.content}</Text>
          <Text style={styles.vetName}>By: {item.vetName}</Text>
        </View>
      </View>
    );
  };

  const renderItem = ({ item }) => {
    if (!item) return null;
    const isEditing = item?._id === editingTipId;

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
            <TouchableOpacity onPress={() => handleEditPress(item._id, item.content)}>
              <MaterialIcons name="edit" size={24} color={COLORS.black} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDeletePress(item._id)}>
              <MaterialIcons name="delete" size={24} color="black" />
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <View>
      {authState.userType === "vet" && (
        <View>
          <Text>My Tips</Text>
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
          <FlatList data={vetTips} renderItem={renderItem} keyExtractor={(item) => item?._id} />
        </View>
      )}
      <View>
        <Text>Vet Tips</Text>
        <FlatList data={allTips} renderItem={renderAllItems} keyExtractor={(item) => item?._id} />
      </View>
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
