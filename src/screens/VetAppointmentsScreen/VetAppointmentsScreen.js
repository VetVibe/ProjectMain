import React, { useState, useEffect } from "react";
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

export default function VetAppointmentsScreen({ route }) {
  const [vetId, setVetId] = useState(null);
  const [userType, setUserType] = useState(null);
  const [VetAppointments, setVetAppointments] = useState([]);
  const [PetOwnerAppointments, setPetOwnerAppointments] = useState([]);


  const fetchAllPetOwnerAppointments = async (petOwnerId) => {
    try {
      const appointments = await clientServer.getPetOwnerAppointments(petOwnerId);
      setPetOwnerAppointments(appointments);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchAllVetAppointments = async (vetId) => {
    try {
      const appointments = await clientServer.getVetAppointments(vetId);
      setVetAppointments(appointments);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const type =
          (await AsyncStorage.getItem("userType")) || route.params?.userType;
        setUserType(type);

        const id = (await AsyncStorage.getItem("vetId")) || route.params?.vetId;
        setVetId(id || null);

        if (userType === "petOwner") {
            fetchAllPetOwnerAppointments();
        } else if (userType === "vet") {
            fetchAllVetAppointments();
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [vetId]);

//   const handleDeletePress = async (tipId) => {
//     try {
//       await clientServer.deleteAp(tipId);
//       await fetchTipsById(vetId);
//     } catch (error) {
//       console.error("Error deleting tip:", error);
//     }
//   };

  const renderItem = ({ item }) => {
    if (!item) return null;
    return (
      <View style={styles.tipContainer}>
            <Text style={styles.tipContent}>{item.data}</Text>
            {/* <TouchableOpacity onPress={() => handleDeletePress(item._id)}>
                <MaterialIcons name="delete" size={24} color="black" />
            </TouchableOpacity> */}
      </View>
    );
  };

  const renderItems = () => {
    if (userType === "petOwner") {
        return (
          <>
            <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>
              {" "}
              My Appointments:
            </Text>
            <FlatList
              data={PetOwnerAppointments}
              renderItem={renderItem}
              keyExtractor={(item) => item?._id}
            />
          </>
        );
    } else if (userType === "vet") {
        return (
            <>
            <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>
              {" "}
              My Appointments:
            </Text>
              <FlatList
                data={VetAppointments}
                renderItem={renderItem}
                keyExtractor={(item) => item?._id}
              />
            </>
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

