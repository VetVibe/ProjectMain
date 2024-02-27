import React from "react";
import { Alert } from "react-native";
import { BasicInfoInput, MedicalInfoInput } from "../../components";
import { clientServer } from "../../server";

export default function EditPetScreen({ route, navigation }) {
  const { pet, isBasic } = route.params;

  const onSaveBasicInfo = async (newPet) => {
    try {
      if (!newPet.name || !newPet.species || !newPet.gender || !newPet.weight || !newPet.birthdate) {
        Alert.alert("Error", "Please fill in all the fields.");
        return;
      }
      const updated = { ...pet, ...newPet };
      await clientServer.updatePetInfo(pet._id, updated);
      navigation.goBack();
    } catch (error) {
      console.error(error);
    }
  };

  const onSaveMedicalRecords = async (newPet) => {
    try {
      const updated = { ...pet, ...newPet };
      await clientServer.updatePetInfo(pet._id, updated);
      navigation.goBack();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {isBasic ? (
        <BasicInfoInput item={pet} onSave={onSaveBasicInfo} />
      ) : (
        <MedicalInfoInput item={pet} onSave={onSaveMedicalRecords} />
      )}
    </>
  );
}
