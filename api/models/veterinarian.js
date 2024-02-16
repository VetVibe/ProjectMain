// Import the mongoose library
import { Schema, Types, model } from "mongoose";

const veterinarianSchema = new Schema({
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
  about: {
    type: String,
  },
  location: {
    type: String,
    required: true,
  },
  specialization: {
    type: String,
    required: true,
  },
  start: {
    type: Number,
    min: 0,
    max: 23,
    default: 8,
    required: true,
  },
  end: {
    type: Number,
    min: 0,
    max: 23,
    default: 20,
    required: true,
  },
});

const Veterinarian = model("Veterinarian", veterinarianSchema);
export default Veterinarian;
