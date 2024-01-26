// Import the mongoose library
const mongoose = require("mongoose");

const veterinarianSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  vetId: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  profilePicture: {
    type: String,
  },
  rate: {
    type: Number,
    default: 0,
  },
  clientsCount: {
    type: Number,
    default: 0,
  },
  about: {
    type: String,
  },
  tips: {
    type: [mongoose.Types.ObjectId],
  },
  isAvailable: {
    type: Boolean,
    default: false,
  },
  location: {
    type: String,
    required: true,
  },

  specialization: {
    type: String,
    required: true,
  },
});

const Veterinarian = mongoose.model("Veterinarian", veterinarianSchema);
module.exports = Veterinarian;
