import React, { useState, useContext } from "react";
import { AuthContext } from "../../auth";
import { View, Text, ScrollView, TextInput, StyleSheet, Alert, FlatList } from "react-native";
import { Button, Input } from "../../components";
import RNPickerSelect from "react-native-picker-select";
import { locations, specializations } from "../../constants";
import { colors, sizes } from "../../constants";
import { clientServer } from "../../server";

export default function EditVetProfileScreen({ route, navigation }) {
  const { authState, setAuthState } = useContext(AuthContext);
  const [vetDetails, setVetDetails] = useState(route.params.vet);
  const [selectedSpecialization, setSelectedSpecialization] = useState();
  const [selectedLocation, setSelectedLocation] = useState(vetDetails.location);
  const [invalidName, setInvalidName] = useState(false);

  const randeSpecialization = (item) => {
    return (
      <View style={styles.chip_container} key={item}>
        <Text style={styles.chip_text}>{item}</Text>
        <Button
          text="x"
          onPress={() =>
            setVetDetails((prev) => ({
              ...prev,
              specialization: prev.specialization.filter((spes) => spes !== item),
            }))
          }
          style={styles.delete_button}
        />
      </View>
    );
  };

  const handleSpetializationAdd = () => {
    if (
      selectedSpecialization &&
      selectedSpecialization !== "" &&
      !vetDetails.specialization.includes(selectedSpecialization)
    ) {
      setVetDetails((prev) => ({ ...prev, specialization: [...prev.specialization, selectedSpecialization] }));
      setSelectedSpecialization("");
    }
  };

  const handleLogout = async () => {
    setAuthState({ signedIn: false, isOwner: false, id: "" });
    console.log("Vet logged out: cleared storage.");
  };

  const LogoutClick = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      { text: "Logout", onPress: () => handleLogout() },
    ]);
  };

  const onSave = async () => {
    if (!vetDetails.name) {
      setInvalidName(true);
      return;
    }
    try {
      await clientServer.updateVetInfo(authState.id, vetDetails);
    } catch (error) {
      console.log(error);
    }
    navigation.goBack();
  };

  return (
    <View style={styles.screen_container}>
      <ScrollView style={styles.container}>
        <View style={styles.header_container}>
          <Text style={styles.header_text}>Clinic Info</Text>
        </View>

        <View style={styles.item}>
          <Text style={styles.item_header}>Name</Text>
          <View style={styles.item_content}>
            <Input
              autoCapitalize="words"
              placeholder="Name"
              onChangeText={(text) => setVetDetails({ ...vetDetails, name: text })}
              value={vetDetails.name}
              error={invalidName}
              errorMessage={"Required field"}
            />
          </View>
        </View>

        <View style={styles.item}>
          <Text style={styles.item_header}>Location</Text>
          <View style={styles.search_container}>
            <RNPickerSelect
              style={styles.item_value}
              value={selectedLocation}
              onDonePress={() => setVetDetails((prev) => ({ ...prev, location: selectedLocation }))}
              onValueChange={setSelectedLocation}
              items={locations}
              placeholder={{ label: "City", value: null }}
            />
          </View>
        </View>

        <View style={styles.item}>
          <Text style={styles.item_header}>Specializations</Text>
          <View style={styles.search_container}>
            <RNPickerSelect
              style={styles.item_value}
              value={selectedSpecialization}
              onDonePress={handleSpetializationAdd}
              onValueChange={setSelectedSpecialization}
              items={specializations}
              placeholder={{ label: "Specialization", value: null }}
            />
          </View>
          <View style={{ flex: 1, marginBottom: 4 }}>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={true}
              data={vetDetails.specialization}
              keyExtractor={(item) => item}
              renderItem={({ item }) => randeSpecialization(item)}
            />
          </View>
        </View>

        <View style={styles.item}>
          <Text style={styles.item_header}>Opening Hours</Text>
          <View style={styles.opening_hours_container}>
            <View style={styles.times_container}>
              <Text style={styles.text}>From</Text>
              <View style={styles.time_content}>
                <TextInput
                  placeholder="From"
                  value={vetDetails.start ? `${vetDetails.start}` : null}
                  onChangeText={(text) => setVetDetails({ ...vetDetails, start: text })}
                  maxLength={2}
                  keyboardType="numeric"
                />
                <TextInput placeholder=" : 00" editable={false} />
              </View>
            </View>
            <View style={styles.times_container}>
              <Text style={styles.text}>To</Text>
              <View style={styles.time_content}>
                <TextInput
                  placeholder="To"
                  value={vetDetails.end ? `${vetDetails.end}` : null}
                  onChangeText={(text) => setVetDetails({ ...vetDetails, end: text })}
                  maxLength={2}
                  keyboardType="numeric"
                />
                <TextInput placeholder=" : 00" editable={false} />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
      <Button text={"Save"} style={styles.save_button} onPress={onSave} />
      <Button text={"Logout"} style={styles.logout_button} onPress={LogoutClick} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen_container: { flex: 1, backgroundColor: colors.white },
  container: {
    margin: 8,
  },
  header_container: {
    padding: 16,
    marginBottom: 12,
    alignItems: "center",
  },
  header_text: {
    fontSize: sizes.h2,
    color: colors.primary,
    fontWeight: "bold",
  },
  item: {
    marginVertical: 20,
    paddingHorizontal: 24,
  },
  item_content: {
    marginVertical: 12,
  },
  item_header: {
    fontSize: sizes.h3,
    fontWeight: "bold",
  },
  item_value: {
    flex: 1,
    fontSize: sizes.h4,
    marginLeft: 20,
  },
  search_container: {
    backgroundColor: colors.white,
    padding: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.light_gray,
    marginVertical: 8,
    height: 50,
    width: "100%",
    flexDirection: "row",
  },
  input_container: {
    marginVertical: 12,
    borderColor: colors.light_gray,
    borderBottomWidth: 1,
    borderRadius: 20,
    shadowColor: colors.gray,
    shadowOpacity: 0.3,
    padding: 12,
  },
  list_container: {
    flex: 1,
    flexDirection: "row",
  },
  chip_container: {
    flexDirection: "row",
    borderRadius: 20,
    borderColor: colors.primary,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 6,
  },
  chip_text: {
    flex: 1,
    fontSize: sizes.body1,
    color: colors.primary,
    alignSelf: "flex-start",
  },
  delete_button: {
    container: {
      flex: 1,
      marginLeft: 6,
    },
    text: {
      fontSize: sizes.body1,
      color: colors.gray,
    },
  },
  opening_hours_container: {
    flex: 1,
    margin: 4,
    marginVertical: 16,
    borderWidth: 1,
    borderRadius: 20,
    borderColor: colors.light_gray,
    padding: 16,
    flexDirection: "row",
  },
  times_container: {
    flex: 1,
    alignItems: "center",
  },
  time_content: {
    flexDirection: "row",
  },
  text: {
    fontSize: sizes.h4,
    marginBottom: 8,
  },
  save_button: {
    container: {
      marginVertical: 12,
      marginHorizontal: 30,
      padding: 8,
      borderRadius: 20,
      backgroundColor: colors.primary,
    },
    text: {
      textAlign: "center",
      fontSize: sizes.h3,
      color: colors.white,
      fontWeight: "bold",
    },
  },
  logout_button: {
    container: {
      marginBottom: 30,
      marginHorizontal: 30,
      padding: 8,
      borderRadius: 20,
      borderColor: colors.error,
      borderWidth: 1,
      backgroundColor: colors.white,
    },
    text: {
      textAlign: "center",
      fontSize: sizes.h3,
      color: colors.error,
      fontWeight: "bold",
    },
  },
});
