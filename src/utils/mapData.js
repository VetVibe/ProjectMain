export const getTimesNum = (start, end) => {
  const timesList = [];
  for (let i = start; i < end; i++) {
    timesList.push(i);
  }
  return timesList;
};

export const availableSlotsByDate = (appointments, currentDate, timeSlots) => {
  const bookedSlots = appointments[currentDate.toISOString().split("T")[0]];
  return bookedSlots ? timeSlots.filter((time) => !bookedSlots.includes(time)) : timeSlots;
};

export const fullyBookedDates = (appointments, timeSlots) => {
  const bookedDates = [];
  const today = new Date();
  const oneMonthLater = new Date(today.setMonth(today.getMonth() + 1));

  for (let i = today; i < oneMonthLater; i.setDate(i.getDate() + 1)) {
    const date = i.getDate();
    const availableSlots = availableSlotsByDate(appointments, date, timeSlots);
    if (availableSlots.length === 0) {
      bookedDates.push(i.toISOString().split("T")[0]);
    }
  }
  return bookedDates;
};

export const mapAppointmentsByDate = (appointments) => {
  const appointmentsByDate = {};
  if (appointments && appointments.length > 0) {
    appointments.forEach((appointment) => {
      const date = new Date(appointment.date).toISOString().split("T")[0];
      if (!appointmentsByDate[date]) {
        appointmentsByDate[date] = [];
      }
      appointmentsByDate[date].push(appointment.time);
    });
  }
  return appointmentsByDate;
};

export const createRating = (vet, vetRating) => {
  const ratingSet = vetRating && vetRating.length > 0;
  const ratingCount = ratingSet ? vetRating.length : 0;
  const rate = ratingSet ? vetRating.map((rate) => rate.rate).reduce((a, b) => a + b, 0) / ratingCount : 0;

  return {
    ...vet,
    _id: vet._id,
    rating: rate,
  };
};
