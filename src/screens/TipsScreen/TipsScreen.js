import React, { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  TouchableOpacity,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  Image,
} from "react-native";
import { COLORS } from "../../constants";
import { MaterialIcons, AntDesign } from "@expo/vector-icons";
import { clientServer } from "../../server";
import LoadingIndicator from "../../components/LoadingIndicator";

export default function TipsScreen({ route }) {
  const [vetId, setVetId] = useState(null);
  const [userType, setUserType] = useState(null);
  const [vetTips, setVetTips] = useState([]);
  const [allTips, setAllTips] = useState([]);
  const [editingTipId, setEditingTipId] = useState(null);
  const [editedTipContent, setEditedTipContent] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [tip, setTip] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchAllTips = useCallback(async () => {
    try {
      const tips = await clientServer.getAllTips();
      setAllTips(tips);
    } catch (error) {
      console.log(error);
    }
  }, []);

  const fetchTipsById = useCallback(async (id) => {
    try {
      const tipsDetailsArray = await clientServer.getTipsByVetId(id);
      setVetTips(tipsDetailsArray);
    } catch (error) {
      console.log(error);
    }
  }, []);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const type =
        route.params?.userType || (await AsyncStorage.getItem("userType"));
      setUserType(type);
      const id = route.params?.vetId || (await AsyncStorage.getItem("vetId"));
      setVetId(id || null);

      if (userType === "petOwner") {
        if (id) {
          await fetchTipsById(id);
        } else {
          await fetchAllTips();
        }
      } else if (userType === "vet") {
        await fetchTipsById(id);
        await fetchAllTips();
      }

      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }, [route.params, userType, fetchAllTips, fetchTipsById]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleEditPress = useCallback((tipId, currentContent) => {
    setEditingTipId(tipId);
    setEditedTipContent(currentContent);
  }, []);

  const handleDeletePress = useCallback(
    async (tipId) => {
      try {
        await clientServer.deleteTip(tipId);
        await fetchTipsById(vetId);
      } catch (error) {
        console.error("Error deleting tip:", error);
      }
    },
    [fetchTipsById, vetId]
  );

  const handleSavePress = useCallback(
    async (tipId) => {
      setVetTips((prevTips) =>
        prevTips.map((tip) =>
          tip._id === tipId ? { ...tip, content: editedTipContent } : tip
        )
      );
      await clientServer.updateTip(tipId, {
        vetId: vetId,
        content: editedTipContent,
      });
      setEditingTipId(null);
      setEditedTipContent("");
    },
    [vetId, editedTipContent]
  );

  const handleCancelPress = useCallback(() => {
    setEditingTipId(null);
    setEditedTipContent("");
  }, []);

  const handleSave = useCallback(async () => {
    await clientServer.addTip(vetId, tip);
    await fetchTipsById(vetId);
    setIsAdding(false);
    setEditingTipId(null);
    setEditedTipContent("");
  }, [vetId, tip, fetchTipsById]);

  const handleCancel = useCallback(() => {
    setIsAdding(false);
    setTip("");
  }, []);

  const renderItemOtherVet = useCallback(
    ({ item }) => {
      if (!item || (vetId && item.vetId === vetId)) return null;
      return (
        <View style={styles.tipContainer}>
          <Image
            source={{ uri: item.VetImage }}
            resizeMode="cover"
            style={styles.profileImage}
          />
          <View style={styles.tipTextContainer}>
            <Text style={styles.tipContent}>{item.content}</Text>
            <Text style={styles.vetName}>By: {item.vetName}</Text>
          </View>
        </View>
      );
    },
    [vetId]
  );

  const renderItem = useCallback(
    ({ item }) => {
      if (!item) return null;
      const isEditing = item._id === editingTipId;

      return (
        <View style={styles.tipContainer}>
          {isEditing ? (
            <View>
              <TextInput
                value={editedTipContent}
                onChangeText={setEditedTipContent}
              />
              <View style={{ flexDirection: "row", marginTop: 5 }}>
                <Button
                  title="Save"
                  onPress={() => handleSavePress(item._id)}
                />
                <Button title="Cancel" onPress={handleCancelPress} />
              </View>
            </View>
          ) : (
            <View style={styles.tipTextContainer}>
              <Text style={styles.tipContent}>{item.content}</Text>
              {userType === "vet" && (
                <>
                  <TouchableOpacity
                    onPress={() => handleEditPress(item._id, item.content)}
                  >
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
    },
    [
      editingTipId,
      editedTipContent,
      handleSavePress,
      handleCancelPress,
      handleEditPress,
      handleDeletePress,
      userType,
    ]
  );

  const renderItems = useCallback(() => {
    if (userType === "petOwner") {
      return (
        <>
          <Text style={{ fontSize: 20, fontWeight: "bold", marginTop: 20 }}>
            {" "}
            Vet Tips:
          </Text>
          <FlatList
            data={vetId ? vetTips : allTips}
            renderItem={renderItemOtherVet}
            keyExtractor={(item) => item?._id}
            getItemLayout={(data, index) => ({
              length: 100, // Adjust according to your item's height
              offset: 100 * index,
              index,
            })}
          />
        </>
      );
    } else if (userType === "vet") {
      return (
        <View>
          <>
            <Text
              style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}
            >
              {" "}
              My Tips:
            </Text>
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
            <FlatList
              data={vetTips}
              renderItem={renderItem}
              keyExtractor={(item) => item?._id}
              getItemLayout={(data, index) => ({
                length: 100, // Adjust according to your item's height
                offset: 100 * index,
                index,
              })}
            />
          </>
          <Text
            style={{
              fontSize: 20,
              marginTop: 10,
              fontWeight: "bold",
              marginBottom: 10,
            }}
          >
            Vet Tips:
          </Text>
          <FlatList
            data={allTips}
            renderItem={renderItemOtherVet}
            keyExtractor={(item) => item?._id}
            getItemLayout={(data, index) => ({
              length: 100, // Adjust according to your item's height
              offset: 100 * index,
              index,
            })}
          />
        </View>
      );
    }
  }, [
    vetId,
    userType,
    vetTips,
    allTips,
    tip,
    isAdding,
    renderItemOtherVet,
    renderItem,
    handleSave,
    handleCancel,
  ]);

  return <View>{loading ? <LoadingIndicator /> : renderItems()}</View>;
}

const styles = StyleSheet.create({
  tipContainer: {
    flexDirection: "row",
    backgroundColor: "#f0f0f0",
    borderRadius: 2,
    padding: 5,
    marginBottom: 10,
    alignItems: "center",
  },
  tipContent: {
    fontSize: 16,
  },
  profileImage: {
    height: 60,
    width: 60,
    borderRadius: 20,
    marginRight: 15,
  },
  tipTextContainer: {
    flex: 1,
  },
});
