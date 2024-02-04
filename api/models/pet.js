const mongoose = require("mongoose");

const PetSchema = new mongoose.Schema({
  ownerId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  animalType: {
    type: String,
  },
  age: {
    type: Number,
  },
  gender: {
    type: String,
  },
  lastVaccinationDate: {
    type: Date,
  },
  lastVetVisit: {
    type: Date,
  },
  medications: {
    type: String,
  },
  allergies: {
    type: String,
  },
  imgSrc: {
    type: String,
  },
});

const Pet = mongoose.model("Pet", PetSchema);

module.exports = Pet;
