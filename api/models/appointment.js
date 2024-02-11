import { Schema, Types, model } from "mongoose";

const AppointmentSchema = new Schema({
    vet: {
      type: Types.ObjectId,
      ref: "Veterinarian", // Reference to the Veterinarian model
      required: true,
    },
    petOwner: {
      type: Types.ObjectId,
      ref: "Pet Owner",
      required: true,
    },
    hour: {
      type: Number,
      required:true
    },
    date: {
      type: Date,
      required: true,
    },
});

const Appointment = model("Appointment", AppointmentSchema);
export default Appointment;
