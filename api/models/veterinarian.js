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
  workingHours: {
    type: {
      start: { type: Number, min: 0, max: 23},
      end: {  type: Number ,min: 0, max: 23}
    },
    default: {start: 8, end: 20}
  },
  appointments: [{
    type:Schema.Types.ObjectId,
    ref: "Appointment"
  }],
});

const Veterinarian = model("Veterinarian", veterinarianSchema);
export default Veterinarian;
