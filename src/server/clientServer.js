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

export const clientServer = {
  server: axios.create({ baseURL: BASE_URL }),

  // -------------------- Pet Owner --------------------
  registerPetOwner: async (userData) => {
    try {
      const responce = await clientServer.server.post(PET_OWNER_ENDPOINTS.REGISTER, userData);
      console.log("Client | Register Pet Owner | Success");
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
      console.log("Client | Login Pet Owner | Success");
      return response.data?.id;
    } catch (error) {
      if (error.response.status === 404) {
        console.log("Client | Login Pet Owner | Error: User not found.");
      } else if (error.response.status === 401) {
        console.log("Client | Login Pet Owner | Error: Password is incorrect.");
      } else {
        console.error("Client | Login Pet Owner | Error:", error.response);
      }
      throw error;
    }
  },

  getPetOwnerInfo: async (petOwnerId) => {
    try {
      const response = await clientServer.server.get(PET_OWNER_ENDPOINTS.PET_OWNER_INFO(petOwnerId));
      console.log("Client | Get Pet Owner Info | Success");
      return response.data;
    } catch (error) {
      console.error("Client | Get Pet Owner Info | Error:", error.response);
    }
  },

  updatePetOwnerInfo: async (petOwnerId, updatedData) => {
    try {
      const response = await clientServer.server.put(
        PET_OWNER_ENDPOINTS.UPDATE_PET_OWNER_INFO(petOwnerId),
        updatedData
      );
      console.log("Client | Update Pet Owner Info | Success");
      return response.data;
    } catch (error) {
      console.error("Client | Update Pet Owner Info | Error:", error.response);
    }
  },

  getPetOwner: async (queryParams) => {
    try {
      const response = await clientServer.server.get(PET_OWNER_ENDPOINTS.PET_OWNER(queryParams));
      console.log("Client | Get Pet Owner | Success");
      return response.data;
    } catch (error) {
      console.error("Client | Get Pet Owner | Error:", error.response);
    }
  },

  // -------------------- Pet --------------------
  getPetDetails: async (petId) => {
    try {
      const response = await clientServer.server.get(PET_ENDPOINTS.PET_INFO(petId));
      console.log("Client | Get Pet Details | Success");
      return response.data;
    } catch (error) {
      console.error("Client | Get Pet Details | Error:", error.response);
    }
  },

  getPetsByOwnerId: async (petOwnerId) => {
    try {
      const response = await clientServer.server.get(PET_ENDPOINTS.BY_OWNER_ID(petOwnerId));
      console.log("Client | Get Pets By Owner Id | Success");
      return response.data;
    } catch (error) {
      console.log("Client | Get Pets By Owner Id | Error:", error);
    }
  },

  deletePet: async (petId) => {
    try {
      await clientServer.server.delete(PET_ENDPOINTS.PET_INFO(petId));
      console.log("Client | Delete Pet | Success");
    } catch (error) {
      console.error("Client | Delete Pet | Error:", error);
    }
  },

  updatePetInfo: async (petId, updatedData) => {
    try {
      const response = await clientServer.server.put(PET_ENDPOINTS.UPDATE_PET_INFO(petId), updatedData);
      console.log("Client | Update Pet Info | Success");
      return response.data;
    } catch (error) {
      console.error("Client | Update Pet Info | Error:", error);
    }
  },

  registerPet: async (petOwnerId, petData) => {
    try {
      const response = await clientServer.server.post(PET_ENDPOINTS.REGISTER(petOwnerId), petData);
      console.log("Client | Register Pet | Success");
      return response.data.petId;
    } catch (error) {
      console.error("Client | Register Pet | Error:", error);
    }
  },

  // -------------------- Vet --------------------
  registerVet: async (userData) => {
    try {
      const response = await clientServer.server.post(VET_ENDPOINTS.REGISTER, userData);
      console.log("Client | Register Vet | Success");
      return response.data?.id;
    } catch (error) {
      console.error("Client | Register Vet | Error:", error);
      throw error;
    }
  },

  loginVet: async (credentials) => {
    try {
      const response = await clientServer.server.post(VET_ENDPOINTS.LOGIN, credentials);
      console.log("Client | Login Vet | Success");
      return response.data?.id;
    } catch (error) {
      if (error.response) {
        const status = error.response.status;
        if (status === 404) {
          console.log("Client | Login Vet | Error: User not found");
        } else if (status === 401) {
          console.log("Client | Login Vet | Error: Invalid password", "The password is incorrect.");
        } else {
          console.log("Client | Login Vet | Error: Login error", "An error occurred during login.");
        }
      } else {
        console.log("Client | Login Vet | Error: Network error", "Unable to connect to the server.");
      }
      console.error("Client | Login Vet | Error:", error.response);
      throw error;
    }
  },

  getVetInfo: async (vetId) => {
    try {
      const response = await clientServer.server.get(VET_ENDPOINTS.VET_INFO(vetId));
      console.log("Client | Get Vet Info | Success");
      return response.data;
    } catch (error) {
      console.error("Client | Get Vet Info | Error:", error.response.data);
    }
  },

  updateVetInfo: async (vetId, updatedData) => {
    try {
      const response = await clientServer.server.put(VET_ENDPOINTS.UPDATE_VET_INFO(vetId), updatedData);
      console.log("Client | Update Vet Info | Success");
      return response.data;
    } catch (error) {
      console.error(`Client | Update Vet Info | Error during updating vet ${vetId} details:`, error.response);
    }
  },

  getVets: async (queryParams) => {
    try {
      const response = await clientServer.server.get(VET_ENDPOINTS.VETERINARIANS(queryParams));
      console.log("Client | Get Vets | Success");
      return response.data;
    } catch (error) {
      console.error("Client | Get Vets | Error:", error.response);
    }
  },

  //  -------------------- Tips --------------------
  addTip: async (vetId, content) => {
    try {
      const response = await clientServer.server.post(TIP_ENDPOINTS.ADD_TIP(vetId), { content: content });
      console.log("Client | Add Tip | Success");
      return response.data;
    } catch (error) {
      console.error(`Client | Add Tip | Error during adding vet ${vetId} tips:`, error.response);
    }
  },

  getTip: async (tipId) => {
    try {
      if (!tipId) return;
      const response = await clientServer.server.get(TIP_ENDPOINTS.GET_TIP(tipId));
      console.log("Client | Get Tip | Success");
      return response.data;
    } catch (error) {
      console.error("Client | Get Tip | Error:", error.response);
    }
  },

  getTipsByVetId: async (vetId) => {
    try {
      const response = await clientServer.server.get(TIP_ENDPOINTS.BY_VET_ID(vetId));
      console.log("Client | Get Tips By Vet Id | Success");
      return response.data;
    } catch (error) {
      console.error("Client | Get Tips By Vet Id | Error:", error.response);
    }
  },

  getAllTips: async () => {
    try {
      const response = await clientServer.server.get(TIP_ENDPOINTS.ALL);
      console.log("Client | Get All Tips | Success");
      return response.data;
    } catch (error) {
      console.error("Client | Get All Tips | Error:", error.response);
    }
  },

  updateTip: async (tipId, updatedData) => {
    try {
      const response = await clientServer.server.put(TIP_ENDPOINTS.UPDATE_TIP(tipId), updatedData);
      console.log("Client | Update Tip | Success");
      return response.data;
    } catch (error) {
      console.error(`Client | Update Tip | Error during updating tip ${tipId} details:`, error.response);
    }
  },

  deleteTip: async (tipId) => {
    try {
      const response = await clientServer.server.delete(TIP_ENDPOINTS.GET_TIP(tipId));
      console.log("Client | Delete Tip | Success");
      return response.data;
    } catch (error) {
      console.error(`Client | Delete Tip | Error during deleting tip ${tipId} details:`, error.response);
    }
  },

  //  -------------------- Appointments --------------------
  getAllAppointments: async () => {
    try {
      const response = await clientServer.server.get(APPOINTMENT_ENDPOINTS.ALL);
      console.log("Client | Get All Appointments | Success");
      return response.data;
    } catch (error) {
      console.error("Client | Get All Appointments | Error:", error.response);
    }
  },

  deleteAppointment: async (appointmentId) => {
    try {
      await clientServer.server.delete(APPOINTMENT_ENDPOINTS.DELETE(appointmentId));
      console.log("Client | Delete Appointment | Success");
    } catch (error) {
      console.error(
        `Client | Delete Appointment | Error during deleting appointment ${appointmentId}:`,
        error.response
      );
    }
  },

  getAppointmentsByOwner: async (petOwnerId) => {
    try {
      const response = await clientServer.server.get(APPOINTMENT_ENDPOINTS.BY_OWNER(petOwnerId));
      console.log("Client | Get Appointments By Owner | Success");
      return response.data;
    } catch (error) {
      console.error("Client | Get Appointments By Owner | Error:", error.response);
    }
  },

  addAppointmentsByOwner: async (petOwnerId, appointmentData) => {
    try {
      await clientServer.server.post(APPOINTMENT_ENDPOINTS.BY_OWNER(petOwnerId), appointmentData);
      console.log("Client | Add Appointments By Owner | Success");
    } catch (error) {
      console.error("Client | Add Appointments By Owner | Error:", error);
    }
  },

  getAppointmentsByVet: async (vetId) => {
    try {
      const response = await clientServer.server.get(APPOINTMENT_ENDPOINTS.BY_VET(vetId));
      console.log("Client | Get Appointments By Vet | Success");
      return response.data;
    } catch (error) {
      console.error("Client | Get Appointments By Vet | Error:", error.response);
    }
  },

  //  -------------------- Rates --------------------
  addRate: async (rate) => {
    try {
      const responce = await clientServer.server.post(RATE_ENDPOINTS.ADD, rate);
      console.log("Client | Add Rate | Success");
      return responce.data;
    } catch (error) {
      console.error("Client | Add Rate | Error:", error.response.body);
    }
  },

  getRateByVetOwner: async (petOwnerId, vetId) => {
    try {
      const response = await clientServer.server.get(RATE_ENDPOINTS.GET_BY_VET_OWNER(petOwnerId, vetId));
      console.log("Client | Get Rate By Vet and Owner | Success");
      return response.data;
    } catch (error) {
      if (error && error.response && error.response.status === 404) {
        console.log("Client | Get Rate By Vet and Owner | Error: Rate not found");
        return null;
      }
      console.error("Client | Get Rate By Vet and Owner | Error:", error.response);
    }
  },

  getRateByVetId: async (vetId) => {
    try {
      const response = await clientServer.server.get(RATE_ENDPOINTS.GET_BY_VET(vetId));
      console.log("Client | Get Rate By Vet | Success");
      return response.data;
    } catch (error) {
      if (error && error.response && error.response.status === 404) {
        console.log("Client | Get Rate By Vet | Error: Rate not found");
        return null;
      }
      console.error("Client | Get Rate By Vet | Error:", error.response);
    }
  },

  getRateDetails: async (rateId) => {
    try {
      const response = await clientServer.server.get(RATE_ENDPOINTS.DETAILS(rateId));
      console.log("Client | Get Rate Details | Success");
      return response.data;
    } catch (error) {
      console.error("Client | Get Rate Details | Error:", error.response);
    }
  },

  updateRate: async (rateId, updatedData) => {
    try {
      const response = await clientServer.server.put(RATE_ENDPOINTS.UPDATE_INFO(rateId), updatedData);
      console.log("Client | Update Rate | Success");
      return response.data;
    } catch (error) {
      console.error(`Client | Update Rate | Error during updating rate ${rateId} details:`, error.response);
    }
  },

  deleteRate: async (rateId) => {
    try {
      const response = await clientServer.server.delete(RATE_ENDPOINTS.DELETE(rateId));
      console.log("Client | Delete Rate | Success");
      return response.data;
    } catch (error) {
      console.error(`Client | Delete Rate | Error during deleting rate ${rateId} details:`, error.response);
    }
  },
};
