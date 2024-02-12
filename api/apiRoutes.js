import express from "express";
const router = express.Router();
import {
  registerPetOwner,
  loginPetOwner,
  updatePetOwnerInfo,
  getPetOwnerDetails,
  registerVeterinarian,
  loginVeterinarian,
  rateVeterinarian,
  getVeterinarians,
  getVeterinarianInfo,
  updateVeterinarianInfo,
  getTipsByVetId,
  getAllTips,
  addTip,
  getTip,
  updateTipInfo,
  deleteTip,
  addPet,
  getPetInfo,
  getPetsByOwnerId,
  updatePetInfo,
  deletePet,
  getAllAppointments,
  deleteAppointment,
  getAppointmentsByOwner,
  addAppointmentsByOwner,
  getAppointmentsByVet,
} from "./functions.js";
import {
  PET_OWNER_ENDPOINTS,
  VETERINARIAN_ENDPOINTS,
  TIP_ENDPOINTS,
  PET_ENDPOINTS,
  APPOINTMENT_ENDPOINTS,
} from "./endpoints.js";

// Pet Owner routes
router.post(PET_OWNER_ENDPOINTS.REGISTER, registerPetOwner);
router.post(PET_OWNER_ENDPOINTS.LOGIN, loginPetOwner);
router.put(PET_OWNER_ENDPOINTS.UPDATE_INFO, updatePetOwnerInfo);
router.get(PET_OWNER_ENDPOINTS.DETAILS, getPetOwnerDetails);

// Veterinarian routes
router.post(VETERINARIAN_ENDPOINTS.REGISTER, registerVeterinarian);
router.post(VETERINARIAN_ENDPOINTS.LOGIN, loginVeterinarian);
router.post(VETERINARIAN_ENDPOINTS.RATE, rateVeterinarian);
router.get(VETERINARIAN_ENDPOINTS.ALL, getVeterinarians);
router.get(VETERINARIAN_ENDPOINTS.DETAILS, getVeterinarianInfo);
router.put(VETERINARIAN_ENDPOINTS.UPDATE_INFO, updateVeterinarianInfo);

// Tip routes
router.get(TIP_ENDPOINTS.ALL, getAllTips);
router.get(TIP_ENDPOINTS.BY_VET_ID, getTipsByVetId);
router.post(TIP_ENDPOINTS.BY_VET_ID, addTip);
router.get(TIP_ENDPOINTS.DETAILS, getTip);
router.put(TIP_ENDPOINTS.UPDATE_INFO, updateTipInfo);
router.delete(TIP_ENDPOINTS.DETAILS, deleteTip);

// Pet routes
router.post(PET_ENDPOINTS.REGISTER, addPet);
router.get(PET_ENDPOINTS.DETAILS, getPetInfo);
router.get(PET_ENDPOINTS.BY_OWNER_ID, getPetsByOwnerId);
router.put(PET_ENDPOINTS.UPDATE_INFO, updatePetInfo);
router.delete(PET_ENDPOINTS.DETAILS, deletePet);

// Appointment routes
router.get(APPOINTMENT_ENDPOINTS.ALL, getAllAppointments);
router.delete(APPOINTMENT_ENDPOINTS.DELETE, deleteAppointment);
router.get(APPOINTMENT_ENDPOINTS.BY_OWNER, getAppointmentsByOwner);
router.post(APPOINTMENT_ENDPOINTS.BY_OWNER, addAppointmentsByOwner);
router.get(APPOINTMENT_ENDPOINTS.BY_VET, getAppointmentsByVet);

export default router;
