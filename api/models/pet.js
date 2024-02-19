import { Schema, Types, model } from "mongoose";

const PetSchema = new Schema({
  ownerId: {
    type: Types.ObjectId,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  species: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  weight: {
    type: Number,
  },
  birthdate: {
    type: Date,
    required: true,
  },
  lastVaccinationDate: {
    type: Date,
  },
  lastVetVisit: {
    type: Date,
  },
  medications: {
    type: [String],
  },
  allergies: {
    type: [String],
  },
  imgSrc: {
    type: String,
  },
});

const Pet = model("Pet", PetSchema);

export default Pet;
