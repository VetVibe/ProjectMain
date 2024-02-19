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
  },
  specialization: {
    type: [String],
  },
  start: {
    type: Number,
  },
  end: {
    type: Number,
  },
});

const Veterinarian = model("Veterinarian", veterinarianSchema);
export default Veterinarian;
