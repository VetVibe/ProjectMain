// Load the mongoose library to interact with MongoDB.
const mongoose = require("mongoose");

// Define a schema for pets, which is like a blueprint for how pet data should be stored in MongoDB.
const PetSchema = new mongoose.Schema({
  // Define an ownerId field that stores a unique identifier for the pet owner. This field is required.
  ownerId: {
    type: mongoose.Types.ObjectId, // Specifies that the type of the ownerId is an ObjectId, a special type used by MongoDB for unique identifiers.
    required: true, // This field must be provided; it cannot be left empty.
  },
  // Define a name field to store the pet's name. This field is required.
  name: {
    type: String, // Specifies the type of the name as a String.
    required: true, // This field must be provided; it cannot be left empty.
  },
  // Define an animalType field to store the type of animal the pet is (e.g., dog, cat).
  animalType: {
    type: String, // Specifies the type as a String.
    // This field is not marked as required, so it's optional.
  },
  // Define an age field to store the pet's age.
  age: {
    type: Number, // Specifies the type as a Number.
    // This field is also optional.
  },
  // Define a gender field to store the pet's gender.
  gender: {
    type: String, // Specifies the type as a String.
    // This field is optional.
  },
  // Define a lastVaccinationDate field to store the date of the pet's last vaccination.
  lastVaccinationDate: {
    type: Date, // Specifies the type as a Date.
    // This field is optional.
  },
  // Define a lastVetVisit field to store the date of the pet's last visit to the veterinarian.
  lastVetVisit: {
    type: Date, // Specifies the type as a Date.
    // This field is optional.
  },
  // Define a medications field to store any medications the pet is taking.
  medications: {
    type: String, // Specifies the type as a String.
    // This field is optional.
  },
  // Define an allergies field to store any allergies the pet has.
  allergies: {
    type: String, // Specifies the type as a String.
    // This field is optional.
  },
  // Define an imgSrc field to store the source location of the pet's image.
  imgSrc: {
    type: String, // Specifies the type as a String.
    // This field is optional.
  },
});

// Create a model from the schema. A model is a constructor compiled from the Schema definition.
// "Pet" is the name of the model, which corresponds to the collection name in MongoDB that will be lowercased and pluralized to "pets".
const Pet = mongoose.model("Pet", PetSchema);

// Export the Pet model so it can be used in other parts of the application to interact with the Pet data in the MongoDB database.
module.exports = Pet;