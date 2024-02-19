export const BASE_URL = "http://localhost:3000";

export const PET_OWNER_ENDPOINTS = {
  REGISTER: `/pet-owner/register`,
  LOGIN: `/pet-owner/login`,
  PET_OWNER_INFO: (petOwnerId) => `/pet-owner/${petOwnerId}`,
  UPDATE_PET_OWNER_INFO: (petOwnerId) => `/pet-owner/update-info/${petOwnerId}`,
  PET_OWNER: (query) => `/pet-owner?${query}`,
};

export const PET_ENDPOINTS = {
  REGISTER: (petOwnerId) => `/pet/register/${petOwnerId}`,
  PET_INFO: (petId) => `/pet/pet-details/${petId}`,
  BY_OWNER_ID: (petOwnerId) => `/pet/${petOwnerId}`,
  UPDATE_PET_INFO: (petId) => `/pet/update-info/${petId}`,
};

export const VET_ENDPOINTS = {
  REGISTER: `/veterinarian/register`,
  LOGIN: `/veterinarian/login`,
  VET_INFO: (vetId) => `/veterinarian/${vetId}`,
  UPDATE_VET_INFO: (vetId) => `/veterinarian/update-info/${vetId}`,
  VETERINARIANS: (query) => `/veterinarian?${query}`,
  TIPS: (vetId) => `/veterinarian/${vetId}/tips`,
};

export const TIP_ENDPOINTS = {
  ADD_TIP: (vetId) => `/tip/addTip/${vetId}`,
  GET_TIP: (tipId) => `/tip/tip-details/${tipId}`,
  BY_VET_ID: (vetId) => `/tip/${vetId}`,
  ALL: `/tip`,
  UPDATE_TIP: (tipId) => `/tip/update-info/${tipId}`,
};

export const APPOINTMENT_ENDPOINTS = {
  ALL: "/appointment",
  DELETE: (appointmentId) => `/appointment/delete/${appointmentId}`,
  BY_OWNER: (petOwnerId) => `/appointment/owner/${petOwnerId}`,
  BY_VET: (vetId) => `/appointment/vet/${vetId}`,
};

export const RATE_ENDPOINTS = {
  ADD: (petOwnerId, vetId) => `/rate/addRate/${petOwnerId}/${vetId}`,
  GET_BY_VET_OWNER: (petOwnerId, vetId) => `/rate/vet-owner/${petOwnerId}/${vetId}`,
  GET_BY_VET: (vetId) => `/rate/vet/${vetId}`,
  DETAILS: (rateId) => `/rate/rate-details/${rateId}`,
  UPDATE_INFO: (rateId) => `/rate/update-info/${rateId}`,
  DELETE: (rateId) => `/rate/delete/${rateId}`,
};
