import axios from "axios";
import {
  BASE_URL,
  PET_OWNER_ENDPOINTS,
  VET_ENDPOINTS,
  PET_ENDPOINTS,
  TIP_ENDPOINTS,
  APPOINTMENT_ENDPOINTS,
  RATE_ENDPOINTS,
} from "./endpoints";
import { Alert } from "react-native";

export const clientServer = {
  server: axios.create({ baseURL: BASE_URL }),

  // -------------------- Pet Owner --------------------
  registerPetOwner: async (userData) => {
    try {
      const responce = await clientServer.server.post(PET_OWNER_ENDPOINTS.REGISTER, userData);
      console.log("Client | Register Pet Owner: Success");
      return responce.data?.id;
    } catch (error) {
      if (error && error.response && error.response.status === 409) {
        console.log("Client | Register Pet Owner | Error: User already exists.");
      } else {
        console.error("Client | Register Pet Owner | Error:", error);
      }
      throw error;
    }
  },

  loginPetOwner: async (credentials) => {
    try {
      const response = await clientServer.server.post(PET_OWNER_ENDPOINTS.LOGIN, credentials);
      console.log("Client | Login Pet Owner: Success");
      return response.data?.id;
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

  // -------------------- Pet --------------------
  getPetDetails: async (petId) => {
    try {
      const response = await clientServer.server.get(PET_ENDPOINTS.PET_INFO(petId));
      return response.data;
    } catch (error) {
      console.error("Error fetching pet details:", error.response);
    }
  },

  getPetsByOwnerId: async (petOwnerId) => {
    try {
      const response = await clientServer.server.get(PET_ENDPOINTS.BY_OWNER_ID(petOwnerId));
      return response.data;
    } catch (error) {
      console.log("Error fetching pet owner pets:", error);
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
      return response.data?.id;
    } catch (error) {
      console.error("Error registering new user", error);
      throw error;
    }
  },

  loginVet: async (credentials) => {
    try {
      const response = await clientServer.server.post(VET_ENDPOINTS.LOGIN, credentials);
      console.log("Client | Login Vet: Success");
      return response.data?.id;
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

  getTipsByVetId: async (vetId) => {
    try {
      const response = await clientServer.server.get(TIP_ENDPOINTS.BY_VET_ID(vetId));
      return response.data;
    } catch (error) {
      console.error("Error fetching vet tips:", error.response);
    }
  },

  getAllTips: async () => {
    try {
      const response = await clientServer.server.get(TIP_ENDPOINTS.ALL);
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

  //  -------------------- Appointments --------------------
  getAllAppointments: async () => {
    try {
      const response = await clientServer.server.get(APPOINTMENT_ENDPOINTS.ALL);
      return response.data;
    } catch (error) {
      console.error("Error fetching all appointments:", error.response);
    }
  },

  deleteAppointment: async (appointmentId) => {
    try {
      await clientServer.server.delete(APPOINTMENT_ENDPOINTS.DELETE(appointmentId));
    } catch (error) {
      console.error(`Error during deleting appointment ${appointmentId} details:`, error.response);
    }
  },

  getAppointmentsByOwner: async (petOwnerId) => {
    try {
      const response = await clientServer.server.get(APPOINTMENT_ENDPOINTS.BY_OWNER(petOwnerId));
      return response.data;
    } catch (error) {
      console.error("Error fetching appointments by owner:", error.response);
    }
  },

  addAppointmentsByOwner: async (petOwnerId, appointmentData) => {
    try {
      await clientServer.server.post(APPOINTMENT_ENDPOINTS.BY_OWNER(petOwnerId), appointmentData);
    } catch (error) {
      console.error("Error adding appointments by owner:", error);
    }
  },

  getAppointmentsByVet: async (vetId) => {
    try {
      const response = await clientServer.server.get(APPOINTMENT_ENDPOINTS.BY_VET(vetId));
      return response.data;
    } catch (error) {
      console.error("Client | Error fetching appointments by vet:", error.response);
    }
  },

  //  -------------------- Rates --------------------
  addRate: async (petOwnerId, vetId, rate) => {
    try {
      const responce = await clientServer.server.post(RATE_ENDPOINTS.ADD(petOwnerId, vetId), { rating: rate });
      return responce.data;
    } catch (error) {
      console.error("Error adding rate:", error.response);
    }
  },

  getRateByVetOwner: async (petOwnerId, vetId) => {
    try {
      const response = await clientServer.server.get(RATE_ENDPOINTS.GET_BY_VET_OWNER(petOwnerId, vetId));
      return response.data;
    } catch (error) {
      if (error && error.response && error.response.status === 404) {
        return null;
      }
      console.error("Error fetching rate by vet and owner:", error.response);
    }
  },

  getRateByVetId: async (vetId) => {
    try {
      const response = await clientServer.server.get(RATE_ENDPOINTS.GET_BY_VET(vetId));
      return response.data;
    } catch (error) {
      if (error && error.response && error.response.status === 404) {
        return null;
      }
      console.error("Error fetching rate by vet:", error.response);
    }
  },

  getRateDetails: async (rateId) => {
    try {
      const response = await clientServer.server.get(RATE_ENDPOINTS.DETAILS(rateId));
      return response.data;
    } catch (error) {
      console.error("Error fetching rate details:", error.response);
    }
  },

  updateRate: async (rateId, updatedData) => {
    try {
      const response = await clientServer.server.put(RATE_ENDPOINTS.UPDATE_INFO(rateId), updatedData);
      return response.data;
    } catch (error) {
      console.error(`Error during updating rate ${rateId} details:`, error.response);
    }
  },

  deleteRate: async (rateId) => {
    try {
      const response = await clientServer.server.delete(RATE_ENDPOINTS.DELETE(rateId));
      return response.data;
    } catch (error) {
      console.error(`Error during deleting rate ${rateId} details:`, error.response);
    }
  },
};
