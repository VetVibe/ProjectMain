// Import the mongoose library
import { Schema, Types, model } from "mongoose";

const appointmentSchema = new Schema({
  vetId: {
    type: Types.ObjectId,
    ref: "Veterinarian", // Reference to the Veterinarian model
    required: true,
  },
  petOwnerId: {
    type: Types.ObjectId,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
});

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
    type: [Types.ObjectId],
  },
  location: {
    type: String,
    required: true,
  },

  specialization: {
    type: String,
    required: true,
  },
  appointmens: [appointmentSchema],
});

const Veterinarian = model("Veterinarian", veterinarianSchema);
export default Veterinarian;
