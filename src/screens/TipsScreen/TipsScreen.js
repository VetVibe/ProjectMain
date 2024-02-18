import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../auth";
import { View, Text, FlatList, StyleSheet, Image } from "react-native";
import { Input, Button, TipCard } from "../../components";
import { MaterialIcons, AntDesign } from "@expo/vector-icons";
import { clientServer } from "../../server";
import { colors, sizes } from "../../constants";

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

  const renderItem = ({ item }) => {
    if (!item) return null;
    const isEditing = item?._id === editingTipId;

    return (
      <>
        {isEditing ? (
          <View>
            <Input
              value={editedTipContent}
              onChangeText={(text) => setEditedTipContent(text)}
              multiline={true}
              maxLength={120}
            />
            <View style={styles.buttoms_container}>
              <Button text="Save" onPress={() => handleSavePress(item._id)} style={styles.save_button} />
              <Button text="Cancel" onPress={handleCancelPress} style={styles.cancel_button} />
            </View>
          </View>
        ) : (
          <View style={styles.item_container}>
            <View style={styles.tip_container}>
              <Text style={styles.text_content}>{item.content}</Text>
              <View style={styles.header_buttons}>
                <MaterialIcons
                  name="edit"
                  size={24}
                  color="black"
                  onPress={() => handleEditPress(item._id, item.content)}
                />
                <MaterialIcons name="delete" size={24} color="black" onPress={() => handleDeletePress(item._id)} />
              </View>
            </View>
          </View>
        )}
      </>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.segment_container}>
        <View style={styles.header_container}>
          <Text style={styles.header_text}>My Tips</Text>
          <AntDesign name="pluscircleo" size={24} color="black" onPress={() => setIsAdding(true)} />
        </View>
        {isAdding && (
          <>
            <Input multiline={true} placeholder="Write your tip here..." value={tip} onChangeText={setTip} />
            <View style={styles.buttoms_container}>
              <Button text="Save" onPress={handleSave} style={styles.save_button} />
              <Button text="Cancel" onPress={handleCancel} style={styles.cancel_button} />
            </View>
          </>
        )}
        {vetTips.length === 0 && <Text>You haven't added any tips.</Text>}
        <FlatList data={vetTips} renderItem={renderItem} keyExtractor={(item) => item?._id} />
      </View>

      <View style={styles.segment_container}>
        <View style={styles.header_container}>
          <Text style={styles.header_text}>Vet Tips</Text>
        </View>
        <FlatList data={allTips} renderItem={({ item }) => <TipCard tip={item} />} keyExtractor={(item) => item?._id} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    backgroundColor: colors.white,
  },
  segment_container: {
    marginVertical: 12,
  },
  item_container: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  header_container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  header_text: {
    fontSize: sizes.h1,
    color: colors.primary,
    fontWeight: "bold",
    shadowColor: colors.gray,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
  },
  header_buttons: {
    flex: 1,
    flexDirection: "row",
    position: "absolute",
    top: 10,
    right: 10,
  },
  title: {
    fontSize: sizes.h3,
  },
  tip_container: {
    flex: 1,
    borderRadius: 20,
    marginVertical: 16,
    padding: 16,
    backgroundColor: colors.lighter_gray,
  },
  text_container: {
    flex: 1,
  },
  text_content: {
    flex: 1,
    fontSize: sizes.h4,
  },
  addButton: {
    alignSelf: "flex-end",
    marginBottom: 10,
  },
  buttoms_container: {
    flexDirection: "row",
    alignItems: "center",
  },
  save_button: {
    container: {
      flex: 1,
      marginHorizontal: 4,
      marginVertical: 4,
      borderRadius: 20,
      padding: 4,
      shadowColor: colors.gray,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      width: "40%",
      backgroundColor: colors.primary,
    },
    text: {
      textAlign: "center",
      fontSize: sizes.h3,
      padding: 10,
      color: colors.white,
      fontWeight: "bold",
    },
  },
  cancel_button: {
    container: {
      flex: 1,
      marginHorizontal: 4,
      marginVertical: 4,
      borderRadius: 20,
      padding: 4,
      shadowColor: colors.gray,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      width: "40%",
      backgroundColor: colors.white,
    },
    text: {
      textAlign: "center",
      fontSize: sizes.h3,
      padding: 10,
      color: colors.gray,
      fontWeight: "bold",
    },
  },
});
