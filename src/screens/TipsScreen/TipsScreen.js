// Imports necessary libraries and components from React, React Native, and other packages.
import React, { useState, useEffect } from "react"; // React library for building user interfaces, with hooks for state and effects.
import { View, TouchableOpacity, Text, TextInput, Button, ScrollView, FlatList, StyleSheet, Image } from "react-native"; // Components from React Native for UI design.
import { COLORS, FONTS, SIZES, images } from "../../constants"; // Imports custom constants for colors, fonts, sizes, and images.
import { MaterialIcons, AntDesign } from "@expo/vector-icons"; // Icon libraries for use in the app.
import axios from "axios"; // Axios library for making HTTP requests.
import TipsScreenPet, { useAllTips } from "../TipsScreenPet/TipsScreenPet"; // Importing another screen and a custom hook from the project structure.

// Defines the main functional component for the TipsScreen.
export default function TipsScreen({ route, navigation }) {
  // State hooks to manage the tips data and editing state.
  const [vetTips, setVetTips] = useState([]); // Holds an array of veterinary tips.
  const [editingTipId, setEditingTipId] = useState(null); // Tracks the ID of the tip being edited.
  const [editedTipContent, setEditedTipContent] = useState(""); // Tracks the content of the tip being edited.

  // Extracts parameters passed through the navigation route.
  const vetId = route.params.vetId; // Veterinary ID from the navigation parameters.
  const userType = route.params.userType; // User type from the navigation parameters.
  
  // Uses a custom hook to fetch all tips and store them in state.
  const {fetchAllTips, vetTips: allVetTips} = useAllTips();

  // useEffect hook to fetch all tips when the screen is focused or navigated to.
  useEffect(() => {
    fetchAllTips();
  },[navigation]);

  // useEffect hook to fetch tips related to a specific veterinarian.
  useEffect(() => {
    const updateTips = async () => {
      try {
        // Makes an HTTP GET request to fetch tip IDs for the specified vet.
        const response = await axios.get(`http://localhost:3000/veterinarian/${vetId}/tips`);
        const tipIds = response.data; // Stores the fetched tip IDs.

        if (tipIds) {
          // Maps each tip ID to a fetch request to get its details and stores the promises.
          const fetchTipsDetails = tipIds.map((tipId) =>
            axios.get(`http://localhost:3000/tip/${tipId}`).then((response) => response.data)
          );

          // Waits for all fetch requests to complete and then updates the vetTips state.
          Promise.all(fetchTipsDetails).then((tipsDetailsArray) => {
            setVetTips(tipsDetailsArray);
          });
        }
      } catch (error) {
        console.error("Error fetching vet tips:", error); // Logs any errors to the console.
      }
    };

    // Adds an event listener that updates tips when the screen is focused.
    const subscription = navigation.addListener("focus", updateTips);

    // Cleanup function to remove the event listener when the component unmounts.
    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, [vetId, navigation]); // Dependence on vetId and navigation to trigger updates.

  // Function to handle the press event on the edit button for a tip.
  const handleEditPress = (tipId, currentContent) => {
    setEditingTipId(tipId); // Sets the currently editing tip ID.
    setEditedTipContent(currentContent); // Sets the content of the tip being edited.
  };

  // Defines a function to handle the save operation for an edited tip.
  const handleSavePress = (tipId) => {
    // Updates the state of vetTips by mapping through existing tips.
    // If the current tip's ID matches the edited tip's ID, it updates that tip's content.
    // Otherwise, it returns the tip as is.
    setVetTips((prevTips) => prevTips.map((tip) => (tip._id === tipId ? { ...tip, content: editedTipContent } : tip)));

    // Sends a PUT request to update the tip information in the backend using axios.
    // The URL includes the tipId for the tip being updated.
    // The request body includes the updated vetId and content.
    axios
      .put(`http://localhost:3000/tip/updateInfo/${tipId}`, {
        updatedData: { vetId: vetId, content: editedTipContent },
      })
      .catch((error) => {
        // Logs an error to the console if the axios request fails.
        console.error(`Error during updating tip ${tipId} details:`, error);
      });

    // Resets the editing state to null and clears the edited content,
    // indicating that editing is complete and no tip is currently being edited.
    setEditingTipId(null);
    setEditedTipContent("");
  };

  // Defines a function to handle the cancel operation when editing a tip.
  const handleCancelPress = () => {
    // Clears the editing state by resetting both the editingTipId and editedTipContent,
    // effectively cancelling the edit operation.
    setEditingTipId(null);
    setEditedTipContent("");
  };

  // Defines a function to navigate to the "Share Tip Screen" with the current vetId.
  const ShareTipClick = () => {
    navigation.navigate("Share Tip Screen", { vetId: vetId });
  };

  // Defines a function to conditionally render tips that are not associated with the current vetId.
  const renderItemOtherVet = ({ item }) => {
    // Checks if the item's vetId matches the current vetId. If it does, it returns null, skipping rendering.
    if(item.vetId == vetId) return null;
    return (
      // Renders a view for each tip item, structured with an image and text container.
      <View style={styles.tipContainer}>
        <Image
          // Uses the vet's image URL for the source of the image.
          source={{ uri : item.VetImage}} // Ensures dynamic image sourcing based on the item's data.
          resizeMode="cover" // Sets the resizeMode of the image to cover.
          style={styles.profileImage} // Applies styling to the image.
        />
        <View style={styles.tipTextContainer}>
          <Text style={styles.tipContent}>{item.content}</Text>
          <Text style={styles.vetName}>By: {item.vetName}</Text>
        </View>
      </View>
    );
  };

  // Defines a function to render items with a check to see if the item is being edited.
  const renderItem = ({ item }) => {
    // Determines if the current item is being edited by comparing its ID to the editingTipId.
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

// Defines the styles for the components in a React Native application.
const styles = StyleSheet.create({
  // Style for the main container view.
  container: {
    flex: 1, // Makes the container use all available space in its parent container.
    padding: 20, // Adds padding inside the container on all sides.
  },
  // Style for the title text.
  title: {
    fontSize: 30, // Sets the size of the font for the title.
    fontWeight: "bold", // Makes the title text bold.
    marginTop: 60, // Adds space above the title.
    marginBottom: 40, // Adds space below the title.
    marginLeft: 0, // Ensures there is no extra space to the left of the title.
  },
  // Style for the container that holds each tip.
  tipContainer: {
    flexDirection: 'row', // Arranges items in a row instead of a column.
    backgroundColor: "#f0f0f0", // Sets the background color of the tip container.
    borderRadius: 2, // Rounds the corners of the container slightly.
    padding: 5, // Adds padding inside the tip container on all sides.
    marginBottom: 10, // Adds space below the tip container.
    alignItems: 'center', // Centers items vertically within the container.
  },
  // Style for the text content of a tip.
  tipContent: {
    fontSize: 16, // Sets the size of the font for the tip content.
  },
  // Style for input fields.
  input: {
    height: 40, // Sets the height of the input field.
    width: "100%", // Makes the input field span the entire width of its parent container.
    borderColor: "#FFA500", // Sets the color of the border around the input field.
    borderWidth: 1, // Sets the thickness of the border.
    marginBottom: 20, // Adds space below the input field.
    paddingLeft: 10, // Adds padding inside the input field on the left side.
    borderRadius: 20, // Rounds the corners of the input field to make it oval.
    backgroundColor: "#FFFFFF", // Sets the background color of the input field to white.
  },
  // Style for the veterinarian's name text.
  vetName: {
    fontStyle: 'italic', // Makes the text italic.
    marginTop: 5, // Adds space above the veterinarian's name.
  },
  // Style for the button used to edit the profile.
  editProfileButton: {
    position: "absolute", // Positions the button absolutely within its parent container.
    right: 20, // Positions the button 20 units from the right.
    top: 20, // Positions the button 20 units from the top.
    zIndex: 1, // Ensures the button lays on top of other elements.
    width: 36, // Sets the width of the button.
    height: 36, // Sets the height of the button.
    alignItems: "center", // Centers items horizontally within the button.
    justifyContent: "center", // Centers items vertically within the button.
    backgroundColor: COLORS.primary, // Sets the background color of the button (COLORS.primary should be defined elsewhere).
    borderRadius: 10, // Rounds the corners of the button.
  },
  // Style for the profile image.
  profileImage: {
    height: 60, // Sets the height of the image.
    width: 60, // Sets the width of the image.
    borderRadius: 20, // Rounds the corners of the image to make it circular.
    marginRight: 15, // Adds space to the right of the image.
  },
  // Style for the container that holds the text content of a tip.
  tipTextContainer: {
    flex: 1, // Allows the container to expand and fill the available space beside the image.
  },
  // Style for the button used to add a new item.
  addButton: {
    alignSelf: 'flex-end', // Aligns the button to the end of its container (right side).
    marginBottom: 10, // Adds space below the button.
  },
});