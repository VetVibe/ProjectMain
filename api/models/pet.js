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
  animalType: {
    type: String,
  },
  age: {
    type: Date,
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
