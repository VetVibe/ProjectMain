import { Schema, Types, model } from "mongoose";

const AppointmentSchema = new Schema({
  vetId: {
    type: Types.ObjectId,
    ref: "Veterinarian",
    required: true,
  },
  petOwnerId: {
    type: Types.ObjectId,
    ref: "Pet Owner",
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: Number,
    required: true,
  },
});

const Appointment = model("Appointment", AppointmentSchema);
export default Appointment;
