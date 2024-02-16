import { Schema, model } from "mongoose";

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
});

const PetOwner = model("Pet Owner", PetOwnerSchema);
export default PetOwner;
