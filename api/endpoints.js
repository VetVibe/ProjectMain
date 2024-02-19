export const PET_OWNER_ENDPOINTS = {
  REGISTER: "/pet-owner/register",
  LOGIN: "/pet-owner/login",
  UPDATE_INFO: "/pet-owner/update-info/:petOwnerId",
  DETAILS: "/pet-owner/:petOwnerId",
  PET_OWNER: "/pet-owner",
};

export const VETERINARIAN_ENDPOINTS = {
  REGISTER: "/veterinarian/register",
  LOGIN: "/veterinarian/login",
  ALL: "/veterinarian",
  DETAILS: "/veterinarian/:vetId",
  UPDATE_INFO: "/veterinarian/update-info/:vetId",
  TIPS: "/veterinarian/:vetId/tips",
};

export const TIP_ENDPOINTS = {
  ALL: "/tip",
  ADD_TIP: "/tip/addTip/:vetId",
  BY_VET_ID: "/tip/:vetId",
  DETAILS: "/tip/tip-details/:tipId",
  UPDATE_INFO: "/tip/update-info/:tipId",
};

export const PET_ENDPOINTS = {
  REGISTER: "/pet/register/:petOwnerId",
  BY_OWNER_ID: "/pet/:petOwnerId",
  DETAILS: "/pet/pet-details/:petId",
  UPDATE_INFO: "/pet/update-info/:petId",
};

export const APPOINTMENT_ENDPOINTS = {
  ALL: "/appointment",
  DELETE: "/appointment/delete/:appointmentId",
  BY_OWNER: "/appointment/owner/:petOwnerId",
  BY_VET: "/appointment/vet/:vetId",
};

export const RATE_ENDPOINTS = {
  ADD: "/rate/addRate/:petOwnerId/:vetId",
  GET_BY_VET_OWNER: "/rate/vet-owner/:petOwnerId/:vetId",
  GET_BY_VET: "/rate/vet/:vetId",
  DETAILS: "/rate/rate-details/:rateId",
  UPDATE_INFO: "/rate/update-info/:rateId",
  DELETE: "/rate/delete/:rateId",
};
