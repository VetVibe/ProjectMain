import express from "express";
const router = express.Router();
import {
  registerPetOwner,
  loginPetOwner,
  updatePetOwnerInfo,
  getPetOwnerPets,
  getPetOwnerDetails,
  registerVeterinarian,
  loginVeterinarian,
  rateVeterinarian,
  getVeterinarians,
  getVeterinarianInfo,
  updateVeterinarianInfo,
  getVeterinarianTips,
  getAllTips,
  addTip,
  getTip,
  updateTipInfo,
  deleteTip,
  addPet,
  getPetInfo,
  updatePetInfo,
  deletePet,
  makeAppointment,
  cancelAppointment,
} from "./functions.js";
import { PET_OWNER_ENDPOINTS, VETERINARIAN_ENDPOINTS, TIP_ENDPOINTS, PET_ENDPOINTS } from "./endpoints.js";

// Pet Owner routes
router.post(PET_OWNER_ENDPOINTS.REGISTER, registerPetOwner);
router.post(PET_OWNER_ENDPOINTS.LOGIN, loginPetOwner);
router.put(PET_OWNER_ENDPOINTS.UPDATE_INFO, updatePetOwnerInfo);
router.get(PET_OWNER_ENDPOINTS.PETS, getPetOwnerPets);
router.get(PET_OWNER_ENDPOINTS.DETAILS, getPetOwnerDetails);
router.get(PET_OWNER_ENDPOINTS.MAKE_APPOINTMENT, makeAppointment);
router.get(PET_OWNER_ENDPOINTS.CANCEL_APPOINTMENT, cancelAppointment);


// Veterinarian routes
router.post(VETERINARIAN_ENDPOINTS.REGISTER, registerVeterinarian);
router.post(VETERINARIAN_ENDPOINTS.LOGIN, loginVeterinarian);
router.post(VETERINARIAN_ENDPOINTS.RATE, rateVeterinarian);
router.get(VETERINARIAN_ENDPOINTS.ALL, getVeterinarians);
router.get(VETERINARIAN_ENDPOINTS.DETAILS, getVeterinarianInfo);
router.put(VETERINARIAN_ENDPOINTS.UPDATE_INFO, updateVeterinarianInfo);
router.get(VETERINARIAN_ENDPOINTS.TIPS, getVeterinarianTips);
router.get(VETERINARIAN_ENDPOINTS.CANCEL_APPOINTMENT, cancelAppointment);

// Tip routes
router.get(TIP_ENDPOINTS.ALL, getAllTips);
router.post(TIP_ENDPOINTS.ADD, addTip);
router.get(TIP_ENDPOINTS.DETAILS, getTip);
router.put(TIP_ENDPOINTS.UPDATE_INFO, updateTipInfo);
router.delete(TIP_ENDPOINTS.DETAILS, deleteTip);

// Pet routes
router.post(PET_ENDPOINTS.REGISTER, addPet);
router.get(PET_ENDPOINTS.DETAILS, getPetInfo);
router.put(PET_ENDPOINTS.UPDATE_INFO, updatePetInfo);
router.delete(PET_ENDPOINTS.DETAILS, deletePet);

export default router;
