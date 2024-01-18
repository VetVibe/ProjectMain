const mongoose = require("mongoose");

const PetOwnerSchema = new mongoose.Schema({
  // User's name
  name: {
    type: String,
    required: true, // Field is required
  },
  // User's email
  email: {
    type: String,
    required: true, // Field is required
    unique: true, // Ensure uniqueness in the database
  },
  // User's password
  password: {
    type: String,
    required: true, // Field is required
  },
  // User's profile picture URL
  profilePicture: {
    type: String,
  },
  // Date when the user joined (default to the current date and time)
  joinedDate: {
    type: Date,
    default: Date.now,
  },
  pets: {
    type: [mongoose.Types.ObjectId]
  }
});

// Create a mongoose model named "User" based on the user schema
const PetOwner = mongoose.model("Pet Owner", PetOwnerSchema);

// Export the User model for use in other files
module.exports = PetOwner;
