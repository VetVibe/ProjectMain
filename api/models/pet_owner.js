// Load the mongoose module to interact with the MongoDB database.
const mongoose = require("mongoose");

// Define a schema for the PetOwner collection in the MongoDB database.
// A schema represents how the data is structured in the collection.
const PetOwnerSchema = new mongoose.Schema({
  // Define a 'name' field that will store a string. This field is required for every pet owner.
  name: {
    type: String,    // Indicates the data type of 'name' is a string.
    required: true,  // Indicates the 'name' field must be provided; it cannot be left blank.
  },
  // Define an 'email' field to store the pet owner's email address. This field is unique and required.
  email: {
    type: String,    // Indicates the data type of 'email' is a string.
    required: true,  // Indicates the 'email' field must be provided and cannot be left blank.
    unique: true,    // Ensures each pet owner's email is unique in the database.
  },
  // Define a 'password' field to store the pet owner's password. This field is required.
  password: {
    type: String,    // Indicates the data type of 'password' is a string.
    required: true,  // Indicates the 'password' field must be provided and cannot be left blank.
  },
  // Define a 'profilePicture' field to store the URL of the pet owner's profile picture.
  profilePicture: {
    type: String,    // Indicates the data type of 'profilePicture' is a string.
    // This field is optional as it does not have the 'required' attribute.
  },
  // Define a 'location' field to store the pet owner's location. This field is required.
  location: {
    type: String,    // Indicates the data type of 'location' is a string.
    required: true,  // Indicates the 'location' field must be provided and cannot be left blank.
  },
  // Define a 'pets' field to store an array of ObjectIds. Each ObjectId references a pet in another collection.
  pets: {
    type: [mongoose.Types.ObjectId], // Indicates the data type is an array of MongoDB ObjectIds.
    // This field is optional and can store multiple ObjectIds linking to pet documents.
  },
  // Define a 'ratings' field to store an array of strings. It has a default value of an empty array.
  ratings: {
    type: [String], // Indicates the data type of 'ratings' is an array of strings.
    default: []     // Sets the default value of 'ratings' to an empty array if no value is provided.
  },
});

// Create a model for the PetOwner schema. This model will be used to interact with the 'Pet Owner' collection in the database.
const PetOwner = mongoose.model("Pet Owner", PetOwnerSchema);

// Export the PetOwner model so it can be used in other parts of the application.
module.exports = PetOwner;
