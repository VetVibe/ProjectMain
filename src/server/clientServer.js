import axios from "axios";
import { BASE_URL, PET_OWNER_ENDPOINTS, VET_ENDPOINTS, PET_ENDPOINTS, TIP_ENDPOINTS } from "../constants";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const clientServer = {
  server: axios.create({ baseURL: BASE_URL }),

  // -------------------- Pet Owner --------------------
  registerPetOwner: async (userData) => {
    try {
      await clientServer.server.post(PET_OWNER_ENDPOINTS.REGISTER, userData);
      console.log("Client | Register Pet Owner: Success");
    } catch (error) {
      if (error.response.status === 409) {
        console.log("Client | Register Pet Owner | Error: User already exists.");
      } else {
        console.error("Client | Register Pet Owner | Error:", error.response);
      }
      throw error;
    }
  },

  loginPetOwner: async (credentials) => {
    try {
      const response = await clientServer.server.post(PET_OWNER_ENDPOINTS.LOGIN, credentials);
      await AsyncStorage.setItem("userId", response.data.userId);
      await AsyncStorage.setItem("userType", "petOwner");
      console.log("Client | Login Pet Owner: Success");
    } catch (error) {
      if (error.response.status === 404) {
        console.log("Client | Login Pet Owner: User not found.");
      } else if (error.response.status === 401) {
        console.log("Client | Login Pet Owner: Password is incorrect.");
      } else {
        console.error("Client | Login Pet Owner | Error:", error.response);
      }
      throw error;
    }
  },

  getPetOwnerInfo: async (petOwnerId) => {
    try {
      const response = await clientServer.server.get(PET_OWNER_ENDPOINTS.PET_OWNER_INFO(petOwnerId));
      return response.data;
    } catch (error) {
      console.error("Error fetching pet owner info:", error.response);
    }
  },

  updatePetOwnerInfo: async (petOwnerId, updatedData) => {
    try {
      const response = await clientServer.server.put(
        PET_OWNER_ENDPOINTS.UPDATE_PET_OWNER_INFO(petOwnerId),
        updatedData
      );
      return response.data;
    } catch (error) {
      console.error("Error updating pet owner info:", error.response);
    }
  },

  getPetOwnerPets: async (petOwnerId) => {
    try {
      const response = await clientServer.server.get(PET_OWNER_ENDPOINTS.PETS(petOwnerId));
      return response.data;
    } catch (error) {
      console.error("Error fetching pet owner pets:", error);
    }
  },

  // -------------------- Pet --------------------
  getPetDetails: async (petId) => {
    try {
      const response = await clientServer.server.get(PET_ENDPOINTS.PET_INFO(petId));
      return response.data;
    } catch (error) {
      console.error("Error fetching pet details:", error.response);
    }
  },

  getPetsDetails: async (petIds) => {
    try {
      const fetchPetDetails = petIds.map((petId) => clientServer.getPetDetails(petId));

      const petDetailsArray = await Promise.all(fetchPetDetails);
      return petDetailsArray;
    } catch (error) {
      console.error("Error fetching pets details:", error);
    }
  },

  deletePet: async (petId) => {
    try {
      await clientServer.server.delete(PET_ENDPOINTS.PET_INFO(petId));
    } catch (error) {
      console.error("Error deleting pet:", error);
    }
  },

  updatePetInfo: async (petId, updatedData) => {
    try {
      const response = await clientServer.server.put(PET_ENDPOINTS.UPDATE_PET_INFO(petId), updatedData);
      return response.data;
    } catch (error) {
      console.error("Error updating pet info:", error);
    }
  },

  registerPet: async (petOwnerId, petData) => {
    try {
      const response = await clientServer.server.post(PET_ENDPOINTS.REGISTER(petOwnerId), petData);
      return response.data.petId;
    } catch (error) {
      console.error("Error registering pet:", error);
    }
  },

  // -------------------- Vet --------------------
  registerVet: async (userData) => {
    try {
      const response = await clientServer.server.post(VET_ENDPOINTS.REGISTER, userData);
      return response.data;
    } catch (error) {
      console.error("Error registering new user", error);
      throw error;
    }
  },

  loginVet: async (credentials) => {
    try {
      const response = await clientServer.server.post(VET_ENDPOINTS.LOGIN, credentials);
      await AsyncStorage.setItem("vetId", response.data.userId);
      await AsyncStorage.setItem("userType", "vet");
      console.log("Client | Login Vet: Success");
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        const status = error.response.status;

        if (status === 404) {
          Alert.alert("User not found");
        } else if (status === 401) {
          Alert.alert("Invalid password", "The password is incorrect.");
        } else {
          Alert.alert("Login error", "An error occurred during login.");
        }
      } else {
        // The request was made but no response was received
        Alert.alert("Network error", "Unable to connect to the server.");
      }
      console.error("Error logging in vet:", error.response);
    }
  },

  getVetInfo: async (vetId) => {
    try {
      const response = await clientServer.server.get(VET_ENDPOINTS.VET_INFO(vetId));
      return response.data;
    } catch (error) {
      console.error("Error fetching vet info:", error.response.data);
    }
  },

  updateVetInfo: async (vetId, updatedData) => {
    try {
      const response = await clientServer.server.put(VET_ENDPOINTS.UPDATE_VET_INFO(vetId), updatedData);
      return response.data;
    } catch (error) {
      console.error(`Error during updating vet ${vetId} details:`, error.response);
    }
  },

  getVets: async (queryParams) => {
    try {
      const response = await clientServer.server.get(VET_ENDPOINTS.VETERINARIANS(queryParams));
      return response.data;
    } catch (error) {
      console.error("Error fetching vets:", error.response);
    }
  },

  getVetTips: async (vetId) => {
    try {
      const response = await clientServer.server.get(VET_ENDPOINTS.TIPS(vetId));
      return response.data;
    } catch (error) {
      console.error("Error fetching vet tips:", error.response);
    }
  },

  //  -------------------- Tips --------------------
  addTip: async (vetId, content) => {
    try {
      const response = await clientServer.server.post(TIP_ENDPOINTS.ADD_TIP(vetId), { content: content });
      console.log(`Added tip for vet ${vetId}.`);
      return response.data;
    } catch (error) {
      console.error(`Error during updating vet ${vetId} tips:`, error.response);
    }
  },

  getTip: async (tipId) => {
    try {
      if (!tipId) return;
      const response = await clientServer.server.get(TIP_ENDPOINTS.GET_TIP(tipId));
      return response.data;
    } catch (error) {
      console.error("Error fetching tip:", error.response);
    }
  },

  getTipsByIds: async (tipIds) => {
    try {
      if (!tipIds) return;
      const fetchTipsDetails = tipIds.map((tipId) => clientServer.getTip(tipId));
      const tipsDetailsArray = await Promise.all(fetchTipsDetails);
      return tipsDetailsArray;
    } catch (error) {
      console.error(`Error fetching tip ${tipIds} details:`, error.response);
    }
  },

  getTips: async (tipIds) => {
    try {
      const response = await clientServer.server.get(TIP_ENDPOINTS.GET_TIPS);
      return response.data;
    } catch (error) {
      console.error("Error fetching tips details:", error.response);
    }
  },

  updateTip: async (tipId, updatedData) => {
    try {
      const response = await clientServer.server.put(TIP_ENDPOINTS.UPDATE_TIP(tipId), updatedData);
      return response.data;
    } catch (error) {
      console.error(`Error during updating tip ${tipId} details:`, error.response);
    }
  },

  deleteTip: async (tipId) => {
    try {
      const response = await clientServer.server.delete(TIP_ENDPOINTS.GET_TIP(tipId));
      return response.data;
    } catch (error) {
      console.error(`Error during deleting tip ${tipId} details:`, error.response);
    }
  },
};



