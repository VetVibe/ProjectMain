// PetModal.js
import React from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import PetContainer from '../../screens/PetOwnerHomeScreen/PetContainer';

const PetModal = ({ isPetModalVisible, togglePetModal, userPets, navigation }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isPetModalVisible}
      onRequestClose={togglePetModal}
    >
      <View style={styles.modalView}>
        <ScrollView style={{ flexGrow: 1 }}>
          {userPets.length > 0 ? (
            <PetContainer userPets={userPets} navi={navigation} />
          ) : (
            <Text>No pets in your collection</Text>
          )}
        </ScrollView>
        <TouchableOpacity onPress={togglePetModal} style={styles.closeModalButton}>
          <Text>Close</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
    modalView: {
        marginTop: 50,
        marginHorizontal: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 20,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
      },
      modalBackdrop: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      },
    
});

export default PetModal;
