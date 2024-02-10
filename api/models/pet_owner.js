import { Schema, Types, model } from "mongoose";

const PetOwnerSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
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
  },
  profilePicture: {
    type: String,
  },
  pets: {
    type: [Types.ObjectId],
  },
  ratings: { type: [String], default: [] },
});

const PetOwner = model("Pet Owner", PetOwnerSchema);
export default PetOwner;
