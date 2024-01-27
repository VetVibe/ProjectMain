const mongoose = require("mongoose");

const PetOwnerSchema = new mongoose.Schema({
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
  profilePicture: {
    type: String,
  },
  location: {
    type: String,
    required: true,
  },
  pets: {
    type: [mongoose.Types.ObjectId],
  },
  ratings:     { type: [String] ,default: []} ,
});

const PetOwner = mongoose.model("Pet Owner", PetOwnerSchema);
module.exports = PetOwner;
