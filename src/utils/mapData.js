export const mapPetDetails = (petData) => {
  return {
    basicInfo: {
      petName: petData?.name || "",
      animalType: petData?.animalType || "",
      age: new Date(petData?.age) || new Date(),
      gender: petData?.gender || "",
    },
    medicalInfo: {
      lastVaccinationDate: new Date(petData?.lastVaccinationDate) || new Date(),
      lastVetVisit: new Date(petData?.lastVetVisit) || new Date(),
      medications: petData?.medications || [],
      allergies: petData?.allergies || [],
    },
    imgSrc:
      petData?.imgSrc || "https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/65761296352685.5eac4787a4720.jpg",
  };
};

export const mapPetDetailsToSchema = (petDetails) => {
  return {
    name: petDetails.basicInfo.petName,
    animalType: petDetails.basicInfo.animalType,
    age: petDetails.basicInfo.age,
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
    profilePicture:
      vetData?.profilePicture ||
      "https://mir-s3-cdn-cf.behance.net/projects/max_808_webp/3c6f95189614555.Y3JvcCwxMDI0LDgwMCwwLDExMQ.jpg",
    rate: vetData?.rate || 0,
    clientsCount: vetData?.clientsCount || 0,
    about: vetData?.about || "",
    location: vetData?.location || "",
    specialization: vetData?.specialization || "",
    start: vetData?.start || 8,
    end: vetData?.end || 20,
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
    location: vetDetails.location,
    specialization: vetDetails.specialization,
    start: vetDetails.start,
    end: vetDetails.end,
  };
};

export const organizeAppointments = (appointments) => {
  const organizedList = {};

  appointments.forEach((appointment) => {
    const date = new Date(appointment.date);
    const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    const time = `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
    const clientId = appointment.petOwnerId;

    if (!organizedList[formattedDate]) {
      organizedList[formattedDate] = [];
    }

    organizedList[formattedDate].push({ time, clientId });
  });

  return organizedList;
};

export const getTimesNum = (start, end) => {
  const timesList = [];
  for (let i = start; i < end; i++) {
    timesList.push(i);
  }
  return timesList;
};

export const appointmentsTime = (appointments, currentDate) => {
  const timeList = [];

  appointments.forEach((appointment) => {
    const date = new Date(appointment.date);
    if (date.getDate() === currentDate.getDate()) {
      timeList.push(appointment.time);
    }
  });

  return timeList;
};
