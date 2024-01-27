export const mapPetDetails = (petData) => {
  return {
    basicInfo: {
      petName: petData?.name || "",
      animalType: petData?.animalType || "",
      age: petData?.age || 0,
      gender: petData?.gender || "",
    },
    medicalInfo: {
      lastVaccinationDate: new Date(petData?.lastVaccinationDate) || new Date(),
      lastVetVisit: new Date(petData?.lastVetVisit) || new Date(),
      medications: petData?.medications || "",
      allergies: petData?.allergies || "",
    },
    imgSrc:
      petData?.imgSrc || "https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/65761296352685.5eac4787a4720.jpg",
  };
};

export const mapPetDetailsToSchema = (petDetails) => {
  return {
    name: petDetails.basicInfo.petName,
    animalType: petDetails.basicInfo.animalType,
    age: Number(petDetails.basicInfo.age),
    gender: petDetails.basicInfo.gender,
    lastVaccinationDate: petDetails.medicalInfo.lastVaccinationDate,
    lastVetVisit: petDetails.medicalInfo.lastVetVisit,
    medications: petDetails.medicalInfo.medications,
    allergies: petDetails.medicalInfo.allergies,
    imgSrc: petDetails.imgSrc,
  };
};

export const mapVetDetails = (vetData) => {
  return {
    name: vetData.name || "",
    email: vetData.email || "",
    vetId: vetData.vetId,
    password: vetData.password || "",
    phoneNumber: vetData?.phoneNumber || "",
    profilePicture: vetData?.profilePicture || "https://www.behance.net/gallery/189614555/VetProfile.jpg",
    rate: vetData?.rate || 0,
    rateCount: vetData.rateCount || 0,
    clientsCount: vetData?.clientsCount || 0,
    about: vetData?.about || "",
    tips: vetData?.tips || [],
    isAvailable: vetData?.isAvailable || false,
    location: vetData?.location || "",
    specialization: vetData?.specialization || "",
  };
};

export const mapVetDetailsToSchema = (vetDetails) => {
  return {
    name: vetDetails.name,
    email: vetDetails.email,
    vetId: vetDetails.vetId,
    password: vetDetails.password,
    phoneNumber: vetDetails.phoneNumber,
    profilePicture: vetDetails.profilePicture,
    rate: vetDetails.rate,
    clientsCount: vetDetails.clientsCount,
    about: vetDetails.about,
    tips: vetDetails.tips,
    isAvailable: vetDetails.isAvailable,
    location: vetDetails.location,
    specialization: vetDetails.specialization,
  };
};
