// Import the mongoose library, which is a tool that allows us to interact with MongoDB databases in an easier way.
const mongoose = require("mongoose");

// Define a new schema for veterinarians. A schema is a structure that defines the shape of documents within a collection in MongoDB.
const veterinarianSchema = new mongoose.Schema({
  // Define a 'name' field that stores the veterinarian's name. It's a string and must be provided (required).
  name: {
    type: String, // Specifies the data type as String.
    required: true, // Indicates that this field is mandatory.
  },
  // Define an 'email' field that stores the veterinarian's email address. It's unique and required.
  email: {
    type: String, // Data type is String.
    required: true, // This field is mandatory.
    unique: true, // Each email must be unique in the database.
  },
  // Define a 'vetId' field that stores a unique identifier for the veterinarian. It's required and unique.
  vetId: {
    type: String, // Data type is String.
    required: true, // This field is mandatory.
    unique: true, // Each vetId must be unique.
  },
  // Define a 'password' field for account security. It's required.
  password: {
    type: String, // Data type is String.
    required: true, // This field is mandatory.
  },
  // Define a 'phoneNumber' field that stores the veterinarian's contact number. It's required.
  phoneNumber: {
    type: String, // Data type is String.
    required: true, // This field is mandatory.
  },
  // Define a 'profilePicture' field that stores the URL to the veterinarian's profile picture. It's optional.
  profilePicture: {
    type: String, // Data type is String.
    // Not marked as required, so it's optional.
  },
  // Define a 'rate' field to store the veterinarian's rating. It has a default value of 0.
  rate: {
    type: Number, // Data type is Number.
    default: 0, // If not provided, defaults to 0.
  },
  // Define a 'rateCount' field to store the number of ratings. It starts at 0.
  rateCount: {
    type: Number, // Data type is Number.
    default: 0, // Defaults to 0 if not provided.
  },
  // Define a 'clientsCount' field to store the number of clients. It also starts at 0.
  clientsCount: {
    type: Number, // Data type is Number.
    default: 0, // Defaults to 0 if not provided.
  },
  // Define an 'about' field to store information about the veterinarian. It's optional.
  about: {
    type: String, // Data type is String.
    // This field is optional.
  },
  // Define a 'tips' field to store an array of ObjectIds, referencing tips provided by the veterinarian.
  tips: {
    type: [mongoose.Types.ObjectId], // An array of ObjectIds. ObjectId is a special type used by MongoDB for unique identifiers.
    // This field is optional and can store multiple values.
  },
  // Define an 'isAvailable' field to indicate if the veterinarian is currently available. Defaults to false.
  isAvailable: {
    type: Boolean, // Data type is Boolean.
    default: false, // Defaults to false if not provided.
  },
  // Define a 'location' field to store the veterinarian's location. It's required.
  location: {
    type: String, // Data type is String.
    required: true, // This field is mandatory.
  },
  // Define a 'specialization' field to store the veterinarian's area of expertise. It's required.
  specialization: {
    type: String, // Data type is String.
    required: true, // This field is mandatory.
  },
});

// Compile the schema into a model. A model is a constructor that allows us to create instances of the documents that will be stored in the database.
// "Veterinarian" is the name of the model, which corresponds to the collection name that will be used in MongoDB.
const Veterinarian = mongoose.model("Veterinarian", veterinarianSchema);

// Export the Veterinarian model so it can be used elsewhere in our application. This allows other parts of the application to interact with the Veterinarian data in the MongoDB database.
module.exports = Veterinarian;