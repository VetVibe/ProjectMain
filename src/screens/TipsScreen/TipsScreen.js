import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../auth";
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import { Input, Button, TipCard } from "../../components";
import { MaterialIcons, AntDesign } from "@expo/vector-icons";
import { clientServer } from "../../server";
import { colors, sizes } from "../../constants";
const CARD_WIDTH = sizes.width - 100;

export default function TipsScreen() {
  const { authState } = useContext(AuthContext);
  const [isLoading, setLoading] = useState(true);
  const [vetTips, setVetTips] = useState([]);
  const [allTips, setAllTips] = useState([]);
  const [editingTipId, setEditingTipId] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [tip, setTip] = useState("");

  useEffect(() => {
    clientServer
      .getAllTips()
      .then((allTips) => {
        const promiseArray = allTips.map(async (tip) => {
          return clientServer
            .getVetInfo(tip.vetId)
            .then((vetInfo) => {
              tip.vetName = vetInfo.name;
              tip.vetImage = vetInfo.profilePicture;
              return tip;
            })
            .catch((error) => {
              console.log("Error fetching vet info:", error);
            });
        });
        return Promise.all(promiseArray);
      })
      .then((allTips) => {
        const [vetTips, othersTips] = allTips.reduce(
          (acc, tip) => {
            if (tip.vetId === authState.id) {
              acc[0].push(tip);
            } else {
              acc[1].push(tip);
            }
            return acc;
          },
          [[], []]
        );
        setAllTips(othersTips);
        setVetTips(vetTips);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [authState.id]);

  const handleInput = (tipId, currentContent) => {
    setEditingTipId(tipId);
    setTip(currentContent);
    setIsAdding(tipId === null);
  };

  const handleDeletePress = async (tipId) => {
    try {
      await clientServer.deleteTip(tipId);
      setVetTips((prevTips) => prevTips.filter((tip) => tip._id !== tipId));
    } catch (error) {
      console.error("Error deleting tip:", error);
    }
  };

  const handleSavePress = async () => {
    setLoading(true);
    if (isAdding) {
      await clientServer
        .addTip(authState.id, tip)
        .then((newTip) => {
          setVetTips((prevTips) => [...prevTips, newTip]);
        })
        .catch((error) => {
          console.error("Error adding tip:", error);
        })
        .finally(() => {
          setIsAdding(false);
          setTip("");
          setLoading(false);
        });
    }
    if (editingTipId) {
      await clientServer
        .updateTip(editingTipId, {
          vetId: authState.id,
          content: tip,
        })
        .then(() => {
          setVetTips((prevTips) =>
            prevTips.map((prev_tip) => (prev_tip._id === editingTipId ? { ...prev_tip, content: tip } : prev_tip))
          );
          setEditingTipId(null);
          setIsAdding(false);
          setTip("");
        })
        .catch((error) => {
          console.error("Error updating tip:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const handleCancelPress = () => {
    setIsAdding(false);
    setEditingTipId(null);
    setTip("");
  };

  const renderInput = () => {
    return (
      <View style={styles.new_tip_container}>
        <Input value={tip || ""} onChangeText={(text) => setTip(text)} multiline={true} maxLength={120} />

        <View style={styles.buttoms_container}>
          <Button text="Save" onPress={handleSavePress} style={styles.save_button} />
          <Button text="Cancel" onPress={handleCancelPress} style={styles.cancel_button} />
          <Text style={styles.length_text}>{tip?.length || 0}/120</Text>
        </View>
      </View>
    );
  };

  const renderItem = ({ item }) => {
    if (!item) return null;
    const isEditing = item?._id === editingTipId;
    return (
      <View>
        {isEditing ? (
          renderInput()
        ) : (
          <View style={styles.item_container}>
            <View style={styles.tip_container}>
              <Text style={styles.text_content}>{item.content}</Text>
            </View>
            <View style={styles.header_buttons}>
              <MaterialIcons name="edit" size={20} color="black" onPress={() => handleInput(item._id, item.content)} />
              <MaterialIcons name="delete" size={20} color="black" onPress={() => handleDeletePress(item._id)} />
            </View>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator style={styles.loadingIndicator} size="large" />
      ) : (
        <View>
          <View style={styles.segment_container}>
            <View style={styles.header_container}>
              <Text style={styles.header_text}>Vet Tips</Text>
            </View>
            <FlatList
              horizontal
              snapToInterval={CARD_WIDTH + 24}
              decelerationRate={"fast"}
              showsHorizontalScrollIndicator={false}
              initialNumToRender={2}
              data={allTips}
              renderItem={({ item }) => <TipCard tip={item} />}
              keyExtractor={(item) => item?._id}
            />
          </View>

          <View style={styles.segment_container}>
            <View style={styles.header_container}>
              <Text style={styles.header_text}>My Tips</Text>
              <AntDesign name="pluscircleo" size={24} color="black" onPress={() => setIsAdding(true)} />
            </View>
            {isAdding && renderInput()}
            {vetTips.length === 0 && !isAdding && <Text>You haven't added any tips.</Text>}
            <FlatList data={vetTips} renderItem={renderItem} keyExtractor={(item) => item?._id} />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 40,
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    color: colors.primary,
  },
  segment_container: {
    padding: 16,
  },
  item_container: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    borderRadius: 20,
    padding: 16,
    backgroundColor: colors.white,
  },
  header_container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
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
    alignItems: "flex-end",
  },
  tip_container: {
    flex: 1,
  },
  text_content: {
    fontSize: sizes.h4,
  },
  new_tip_container: {
    marginHorizontal: 12,
    marginBottom: 12,
  },
  length_text: {
    fontSize: sizes.body2,
    color: colors.gray,
  },
  addButton: {
    alignSelf: "flex-end",
  },
  buttoms_container: {
    flexDirection: "row",
  },
  save_button: {
    container: {
      flex: 1,
      marginHorizontal: 6,
      borderRadius: 20,
      shadowColor: colors.gray,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      width: "40%",
      backgroundColor: colors.primary,
    },
    text: {
      textAlign: "center",
      fontSize: sizes.body1,
      padding: 5,
      color: colors.white,
      fontWeight: "bold",
    },
  },
  cancel_button: {
    container: {
      flex: 1,
      marginHorizontal: 6,
      borderRadius: 20,
      shadowColor: colors.gray,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      width: "40%",
      backgroundColor: colors.white,
    },
    text: {
      textAlign: "center",
      fontSize: sizes.body1,
      padding: 5,
      color: colors.gray,
      fontWeight: "bold",
    },
  },
});
