export const PET_OWNER_ENDPOINTS = {
  REGISTER: "/pet-owner/register",
  LOGIN: "/pet-owner/login",
  UPDATE_INFO: `/pet-owner/update-info/:petOwnerId`,
  PETS: `/pet-owner/:petOwnerId/pets`,
  DETAILS: `/pet-owner/:petOwnerId`,
};

export const VETERINARIAN_ENDPOINTS = {
  REGISTER: "/veterinarian/register",
  LOGIN: "/veterinarian/login",
  RATE: "/veterinarian/rate",
  ALL: "/veterinarian",
  DETAILS: `/veterinarian/:vetId`,
  UPDATE_INFO: `/veterinarian/update-info/:vetId`,
  TIPS: `/veterinarian/:vetId/tips`,
  APPOINTMENTS: `/veterinarian/:vetId/appointments`,
  ADD_APPOINTMENT: `/veterinarian/:vetId/add-appointment`,
};

export const TIP_ENDPOINTS = {
  ALL: "/tip",
  ADD: `/tip/addTip/:vetId`,
  DETAILS: `/tip/:tipId`,
  UPDATE_INFO: `/tip/update-info/:tipId`,
};

export const PET_ENDPOINTS = {
  REGISTER: `/pet/register/:petOwnerId`,
  DETAILS: `/pet/:petId`,
  UPDATE_INFO: `/pet/update-info/:petId`,
};
