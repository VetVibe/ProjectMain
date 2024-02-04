// Import the mongoose library to use MongoDB more easily with JavaScript.
// Mongoose provides a straight-forward, schema-based solution to model application data.
const mongoose = require("mongoose");

// Define a new schema for 'tips' using the mongoose Schema.
// A schema is like a blueprint for data, defining the shape of the documents within a collection.
const tipSchema = new mongoose.Schema({
  // 'content' field of the tip, which stores the actual advice or information.
  // This is defined as a string and is required, meaning every tip must have content.
  content: {
    type: String, // Specifies that the content is a string.
    required: true, // This field is necessary. A tip cannot be saved without content.
  },
  // 'vetId' field to associate this tip with a veterinarian.
  // This uses a special type provided by MongoDB to reference unique IDs.
  vetId: {
    type: mongoose.Types.ObjectId, // Specifies that the vetId is an ObjectId, a unique identifier for documents.
    ref: 'Veterinarian', // This creates a reference to the 'Veterinarian' collection, indicating that this ID relates to a document in that collection.
    required: true, // This field is necessary. A tip must be associated with a veterinarian.
  },
});

// Create a model from the schema.
// A model is a compiled version of the schema which creates a constructor for creating and querying documents in the specified collection.
const Tip = mongoose.model("Tip", tipSchema);
// 'Tip' is the name of the model, and 'tipSchema' is the schema the model uses.
// In the MongoDB database, this will correspond to a collection named 'tips'.

// Export the Tip model to make it accessible in other parts of the application.
// This allows other files in your application to use the Tip model to create, query, update, or delete tips in the database.
module.exports = Tip;