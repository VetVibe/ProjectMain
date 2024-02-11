export const BASE_URL = "http://10.0.2.2:3000";

export const PET_OWNER_ENDPOINTS = {
  REGISTER: `/pet-owner/register`,
  LOGIN: `/pet-owner/login`,
  PET_OWNER_INFO: (petOwnerId) => `/pet-owner/${petOwnerId}`,
  UPDATE_PET_OWNER_INFO: (petOwnerId) => `/pet-owner/update-info/${petOwnerId}`,
  PETS: (petOwnerId) => `/pet-owner/${petOwnerId}/pets`,
};

export const PET_ENDPOINTS = {
  REGISTER: (petOwnerId) => `/pet/register/${petOwnerId}`,
  PET_INFO: (petId) => `/pet/${petId}`,
  UPDATE_PET_INFO: (petId) => `/pet/update-info/${petId}`,
};

export const VET_ENDPOINTS = {
  REGISTER: `/veterinarian/register`,
  LOGIN: `/veterinarian/login`,
  VET_INFO: (vetId) => `/veterinarian/${vetId}`,
  UPDATE_VET_INFO: (vetId) => `/veterinarian/update-info/${vetId}`,
  RATE: `/veterinarian/rate`,
  VETERINARIANS: (query) => `/veterinarian?${query}`,
  TIPS: (vetId) => `/veterinarian/${vetId}/tips`,
};

export const TIP_ENDPOINTS = {
  ADD_TIP: (vetId) => `/tip/addTip/${vetId}`,
  GET_TIP: (tipId) => `/tip/${tipId}`,
  GET_TIPS: `/tip`,
  UPDATE_TIP: (tipId) => `/tip/update-info/${tipId}`,
};
