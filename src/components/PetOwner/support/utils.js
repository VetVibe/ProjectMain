export const titleMappings = {
  petName: "Pet Name",
  animalType: "Animal Type",
  age: "Age",
  gender: "Gender",
  lastVaccinationDate: "Last Vaccination Date",
  lastVetVisit: "Last Vet Visit",
  medications: "Medications",
  allergies: "Allergies",
};

export const mapPetDetails = (petData) => {
  return {
    basicInfo: {
      petName: petData?.name || "",
      animalType: petData?.animalType || "",
      age: petData?.age || 0,
      gender: petData?.gender || "",
    },
    medicalInfo: {
      lastVaccinationDate: petData?.lastVaccinationDate || "",
      lastVetVisit: petData?.lastVetVisit || "",
      medications: petData?.medications ? petData.medications.join(", ") : "",
      allergies: petData?.allergies ? petData.allergies.join(", ") : "",
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
    medications: petDetails.medicalInfo.medications ? petDetails.medicalInfo.medications.split(",") : [],
    allergies: petDetails.medicalInfo.allergies ? petDetails.medicalInfo.allergies.split(",") : [],
    imgSrc: petDetails.imgSrc,
  };
};
