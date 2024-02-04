// Export a function named `mapPetDetails` that takes pet data and returns a structured object.
export const mapPetDetails = (petData) => {
  // Return an object with structured pet details.
  return {
    // Group basic pet information into a sub-object.
    basicInfo: {
      // Use the name from `petData` or default to an empty string if not available.
      petName: petData?.name || "",
      // Use the animal type from `petData` or default to an empty string if not available.
      animalType: petData?.animalType || "",
      // Use the age from `petData` or default to 0 if not available.
      age: petData?.age || 0,
      // Use the gender from `petData` or default to an empty string if not available.
      gender: petData?.gender || "",
    },
    // Group medical information into a sub-object.
    medicalInfo: {
      // Convert the last vaccination date from `petData` to a Date object, or use the current date as a default.
      lastVaccinationDate: new Date(petData?.lastVaccinationDate) || new Date(),
      // Convert the last vet visit date from `petData` to a Date object, or use the current date as a default.
      lastVetVisit: new Date(petData?.lastVetVisit) || new Date(),
      // Use the medications from `petData` or default to an empty string if not available.
      medications: petData?.medications || "",
      // Use the allergies from `petData` or default to an empty string if not available.
      allergies: petData?.allergies || "",
    },
    // Use the image source from `petData` or default to a specific URL if not available.
    imgSrc:
      petData?.imgSrc || "https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/65761296352685.5eac4787a4720.jpg",
  };
};

// Export a function named `mapPetDetailsToSchema` to transform mapped pet details into a schema format.
export const mapPetDetailsToSchema = (petDetails) => {
  // Return an object structured according to a predefined schema format.
  return {
    // Map each property of the pet details to a corresponding schema field.
    name: petDetails.basicInfo.petName,
    animalType: petDetails.basicInfo.animalType,
    // Convert the age to a number to ensure the correct data type.
    age: Number(petDetails.basicInfo.age),
    gender: petDetails.basicInfo.gender,
    // Directly assign medical information dates without conversion, assuming they are already in the correct format.
    lastVaccinationDate: petDetails.medicalInfo.lastVaccinationDate,
    lastVetVisit: petDetails.medicalInfo.lastVetVisit,
    medications: petDetails.medicalInfo.medications,
    allergies: petDetails.medicalInfo.allergies,
    // Use the image source from the detailed pet information.
    imgSrc: petDetails.imgSrc,
  };
};

// Export a function named `mapVetDetails` to transform veterinarian data into a structured object.
export const mapVetDetails = (vetData) => {
  // Return an object with structured veterinarian details.
  return {
    // Directly assign each veterinarian detail or provide a default value if the detail is not available.
    name: vetData.name || "",
    email: vetData.email || "",
    vetId: vetData.vetId,
    password: vetData.password || "",
    phoneNumber: vetData?.phoneNumber || "",
    profilePicture: vetData?.profilePicture || "https://mir-s3-cdn-cf.behance.net/projects/max_808_webp/3c6f95189614555.Y3JvcCwxMDI0LDgwMCwwLDExMQ.jpg",
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

// Export a function named `mapVetDetailsToSchema` to transform mapped vet details into a schema format.
export const mapVetDetailsToSchema = (vetDetails) => {
  // Return an object structured according to a predefined schema format.
  return {
    // Map each property of the vet details to a corresponding schema field.
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