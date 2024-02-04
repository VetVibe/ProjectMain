// Import the express module to create an HTTP server
const express = require("express");
// Import the body-parser middleware to parse request bodies
const bodyParser = require("body-parser");
// Import the mongoose library to interact with MongoDB
const mongoose = require("mongoose");
// Import the crypto module to generate secure random values, like secret keys
const crypto = require("crypto");
// Import the nodemailer module to send emails from Node.js
const nodemailer = require("nodemailer");

// Create an Express application
const app = express();
// Define the port number on which the server will listen
const port = 3000;
// Import the cors middleware to enable Cross-Origin Resource Sharing
const cors = require("cors");
// Use the cors middleware to allow cross-origin requests
app.use(cors());

// Use body-parser middleware to parse URL-encoded bodies (as sent by HTML forms)
app.use(bodyParser.urlencoded({ extended: false }));
// Use body-parser middleware to parse JSON bodies (as sent by API clients)
app.use(bodyParser.json());
// Import the jsonwebtoken module to create, sign, and verify tokens
const jwt = require("jsonwebtoken");

// Import Mongoose models for the application
const Veterinarian = require("./models/veterinarian"); // Model for veterinarians
const PetOwner = require("./models/pet_owner"); // Model for pet owners
const Pet = require("./models/pet"); // Model for pets
const Tip = require("./models/tip"); // Model for tips or advice

// Connect to MongoDB using a connection string (Note: sensitive information like passwords should be securely stored and not hardcoded)
mongoose
  .connect(
    "mongodb+srv://your_connection_string_here", // Connection string to MongoDB
    {} // Options object, currently empty but can be used for configuration
  )
  .then(() => { // Promise resolved handler
    console.log("Connected to MongoDB"); // Log success message if connection is successful
  })
  .catch((err) => { // Promise rejected handler
    console.log("Error connecting to MongoDB"); // Log error message if connection fails
  });

// Start the Express server and listen on the specified port
app.listen(port, () => {
  console.log("Server is running on port 3000"); // Log message indicating the server is running
});

// Define a function to generate a secret key using the crypto module
const generateSecretKey = () => {
  const secretKey = crypto.randomBytes(32).toString("hex"); // Generate a 32-byte random value and convert it to a hexadecimal string
  return secretKey; // Return the generated secret key
};

// Generate a secret key by calling the generateSecretKey function
const secretKey = generateSecretKey();

// ------------ Pet Owner ------------
// Register a pet owner
app.post("/petOwner/register", async (req, res) => {
  try {
    // Destructure and extract necessary fields from the request body
    const { name, email, password, location, profilePicture } = req.body;
    // Check if a pet owner with the provided email already exists in the database
    const existingOwner = await PetOwner.findOne({ email });

    // If an owner with the given email already exists, return an error message
    if (existingOwner) {
      return res.status(404).json({ message: "Email already registered" });
    }

    // If no existing owner is found, create a new pet owner record
    const newOwner = new PetOwner({
      name,
      email,
      password,
      location,
      profilePicture,
    });

    // Generate a random verification token for the new owner
    newOwner.verificationToken = crypto.randomBytes(20).toString("hex");

    // Save the new pet owner record to the database
    await newOwner.save();

    // Respond with a success status and the ID of the new owner
    res
      .status(201)
      .json({ message: "Registration successful", userId: newOwner._id });
  } catch (error) {
    // If an error occurs, log it and respond with an error message
    console.log("Error registering user", error);
    res.status(500).json({ message: "Error registering user" });
  }
});

// Pet owner login
app.post("/petOwner/login", async (req, res) => {
  try {
    // Extract email and password from the request body
    const { email, password } = req.body;
    // Find a pet owner by the given email
    const owner = await PetOwner.findOne({ email });

    // If no owner is found with the given email, return an error message
    if (!owner) {
      return res.status(404).json({ message: "Email doesnt register" });
    }

    // Check if the provided password matches the owner's password
    if (owner.password !== password) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // If password matches, sign a JWT token with the owner's ID and a secret key
    const token = jwt.sign({ userId: owner._id }, secretKey);

    // Respond with the token and the owner's ID
    res.status(200).json({ token, userId: owner._id });
  } catch (error) {
    // If an error occurs during login, respond with an error message
    res.status(500).json({ message: "Login failed" });
  }
});

// Update pet owner details
app.put("/petOwner/updateInfo/:petOwnerId", async (req, res) => {
  const { petOwnerId } = req.params; // Extract the pet owner's ID from the URL parameters
  const updatedData = req.body.updatedData; // Extract the data to be updated from the request body

  try {
    // Find the pet owner by ID
    const petOwner = await PetOwner.findById(petOwnerId);

    // If the pet owner is not found, return an error message
    if (!petOwner) {
      return res
        .status(404)
        .json({ success: false, message: "Pet owner not found" });
    }

    // Update the pet owner's details with the provided data
    Object.assign(petOwner, updatedData);

    // Save the updated pet owner details to the database
    await petOwner.save();

    // Respond with a success message
    res.json({
      success: true,
      message: "Pet owner details updated successfully",
    });
  } catch (error) {
    // If an error occurs during the update, log it and respond with an error message
    console.error("Error updating pet owner details:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// Fetch pet owner pet's collection
app.get("/petOwner/:petOwnerId/pets", async (req, res) => {
  try {
    // Extract the pet owner's ID from the URL parameters
    const petOwnerId = req.params.petOwnerId;
    // Find the pet owner by ID
    const petOwner = await PetOwner.findById(petOwnerId);

    // If the pet owner is not found, return an error message
    if (!petOwner) {
      return res.status(404).json({ message: "Pet Owner not found" });
    }

    // Respond with the pet owner's collection of pets
    res.status(201).json({ pets: petOwner.pets });
  } catch (error) {
    // If an error occurs while fetching the pets, log it and respond with an error message
    console.error("Error fetching user's pets:", error);

    res.status(500).json({ error: "Error fetching user's pets" });
  }
});

// Update pet owner profile picture
app.put("/petOwner/updateProfilePicture/:petOwnerId", async (req, res) => {
  const { newProfilePicture } = req.body; // Extract the new profile picture from the request body
  const { petOwnerId } = req.params; // Extract the pet owner's ID from the URL parameters

  try {
    // Update the pet owner's profile picture in the database
    await PetOwner.findByIdAndUpdate(petOwnerId, {
      profilePicture: newProfilePicture,
    });

    // Respond with a success message
    res.status(200).json({ message: "Profile picture updated successfully." });
  } catch (error) {
    // If an error occurs during the update, log it and respond with an error message
    console.error("Error updating profile picture:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Fetch pet owner details (single or all)
app.get("/petOwner/:petOwnerId?", async (req, res) => {
  try {
    // Extract the pet owner's ID from the URL parameters, if provided
    const petOwnerId = req.params.petOwnerId;

    // If an ID is provided, fetch details of a single pet owner
    if (petOwnerId) {
      const petOwner = await PetOwner.findById(petOwnerId);

      // If the pet owner is not found, return an error message
      if (!petOwner) {
        return res.status(404).json({ message: "Pet Owner not found" });
      }

      // Respond with the details of the found pet owner
      res.status(200).json(petOwner);
    } else {
      // If no ID is provided, fetch and respond with details of all pet owners
      const petOwners = await PetOwner.find();
      res.status(200).json(petOwners);
    }
  } catch (error) {
    // If an error occurs while fetching the details, log it and respond with an error message
    console.error("Error fetching pet owner details:", error);
    res.status(500).json({ error: "Error fetching pet owner details" });
  }
});

// ------------ Veterinarian ------------

// Section to handle registration of veterinarians

// Defines a route to register a veterinarian with a POST request.
app.post("/veterinarian/register", async (req, res) => {
  try {
    // Destructures and extracts data from the request body.
    const {
      name,
      email,
      vetId,
      password,
      phoneNumber,
      location,
      specialization,
      profilePicture,
    } = req.body;

    // Checks if a veterinarian with the same vetId already exists in the database.
    const existingV = await Veterinarian.findOne({ vetId });

    // If a veterinarian already exists, sends a 404 status code and message to the client.
    if (existingV) {
      return res
        .status(404)
        .json({ message: "Veterinarian already registered" });
    }

    // Creates a new veterinarian instance with the provided data.
    const newVeterinarian = new Veterinarian({
      name,
      email,
      vetId,
      password,
      phoneNumber,
      location,
      specialization,
      profilePicture,
    });

    // Generates a verification token for the new veterinarian.
    newVeterinarian.verificationToken = crypto.randomBytes(20).toString("hex");

    // Saves the new veterinarian instance to the database.
    await newVeterinarian.save();

    // Sends a 201 status code and registration success message to the client.
    res.status(201).json({
      message: "Registration successful for veterinarian",
      userId: newVeterinarian._id,
    });
  } catch (error) {
    // Logs the error and sends a 500 status code and message to the client if an error occurs.
    console.log("Error registering veterinarian", error);
    res.status(500).json({ message: "Error registering veterinarian" });
  }
});

// Defines a route for veterinarian login with a POST request.
app.post("/veterinarian/login", async (req, res) => {
  try {
    // Extracts email and password from the request body.
    const { email, password } = req.body;

    // Attempts to find a veterinarian by their email.
    const veterinarian = await Veterinarian.findOne({ email });

    // If no veterinarian is found, sends a 404 status code and message to the client.
    if (!veterinarian) {
      return res.status(404).json({ message: "Invalid id" });
    }

    // Checks if the provided password matches the veterinarian's password.
    if (veterinarian.password !== password) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Signs a JWT token with the veterinarian's ID and secret key.
    const token = jwt.sign({ userId: veterinarian._id }, secretKey);

    // Sends a 200 status code and the JWT token to the client.
    res.status(200).json({ token, userId: veterinarian._id });
  } catch (error) {
    // Sends a 500 status code and message to the client if an error occurs.
    res.status(500).json({ message: "Login failed" });
  }
});

// Defines a route to add a rating to a veterinarian with a POST request.
app.post("/veterinarian/rate", async (req, res) => {
  try {
    // Extracts the authorization token from the request headers.
    let token = req.headers["authorization"] || req.headers["Authorization"];
    token = token.split("Bearer ")[1];

    // Decodes the JWT token to extract the user ID.
    const { userId } = jwt.decode(token);

    // Extracts the email and rating from the request body.
    const { email, rating } = req.body;

    // Attempts to find the veterinarian by email and the pet owner by user ID.
    const veterinarian = await Veterinarian.findOne({ email });
    const petOwner = await PetOwner.findById(userId);

    // If either the pet owner or veterinarian is not found, sends a 404 status code and message to the client.
    if (!petOwner || !veterinarian) {
      return res.status(404).json({ message: "Vet/Pet owner email not found" });
    }

    // Prevents the pet owner from rating the same veterinarian multiple times.
    if (veterinarian && petOwner.ratings.includes(email)) {
      return res
        .status(400)
        .json({ message: "You have already rated this vet" });
    }

    // Adds the veterinarian's email to the pet owner's ratings and updates the veterinarian's rating.
    petOwner.ratings.push(email);
    veterinarian.rate += rating;
    veterinarian.rateCount++;

    // Saves the updated pet owner and veterinarian to the database.
    await petOwner.save();
    await veterinarian.save();

    // Sends the new rating and rating count to the client.
    res.status(200).json({
      newRating: veterinarian.rate,
      newRatingCount: veterinarian.rateCount,
    });
  } catch (error) {
    // Sends a 500 status code and message to the client if an error occurs.
    res.status(500).json({ message: "Rating failed" });
  }
});

// Defines a route to fetch veterinarians based on specialization and location with a GET request.
app.get("/veterinarians", async (req, res) => {
  // Extracts location and specialization from the query parameters.
  const { location, specialization } = req.query;

  try {
    // Creates a query object based on the provided location and specialization.
    let query = {};
    if (location) query.location = location;
    if (specialization) query.specialization = specialization;

    // Finds veterinarians matching the query.
    const veterinarians = await Veterinarian.find(query);

    // Sends the found veterinarians to the client.
    res.status(200).json(veterinarians);
  } catch (error) {
    // Logs the error and sends a 500 status code and message to the client if an error occurs.
    console.error("Error fetching veterinarians", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Defines a route to fetch information for a specific veterinarian using their vetId with a GET request.
app.get("/veterinarian/:vetId", async (req, res) => {
  try {
    // Extracts the vetId from the route parameters.
    const vetId = req.params.vetId;

    // Attempts to find the veterinarian by their vetId.
    const veterinarian = await Veterinarian.findById(vetId);

    // If no veterinarian is found, sends a 404 status code and message to the client.
    if (!veterinarian) {
      return res.status(404).json({ message: "Veterinarian not found" });
    }

    // Ensures the veterinarian's rateCount is defined, defaulting to 0 if undefined.
    if (veterinarian.rateCount === undefined) {
      veterinarian.rateCount = 0;
    }

    // Sends the veterinarian's information to the client.
    res.status(200).json(veterinarian);
  } catch (error) {
    // Logs the error and sends a 500 status code and message to the client if an error occurs.
    console.error("Error fetching vet information", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Defines a route for updating veterinarian details with a PUT request.
app.put("/veterinarian/updateInfo/:vetId", async (req, res) => {
  try {
    // Extracts the vetId from the route parameters.
    const vetId = req.params.vetId;

    // Extracts the updated data from the request body.
    const updatedVetData = req.body.updatedData;

    // Finds the veterinarian by their ID and updates their information.
    const updatedVet = await Veterinarian.findOneAndUpdate(
      { _id: vetId },
      { $set: updatedVetData },
      { new: true } // Option to return the updated document.
    );

    // If no veterinarian is found, logs an error and sends a 404 status code and message to the client.
    if (!updatedVet) {
      console.error(`Vet with ID ${vetId} not found.`);
      return res.status(404).json({ message: "Veterinarian not found" });
    }

    // Logs success and sends a success message to the client.
    console.log(`Vet with ID ${vetId} updated successfully.`);
    res
      .status(200)
      .json({ message: `Vet with ID ${vetId} updated successfully.` });
  } catch (error) {
    // Logs the error and sends a 500 status code and message to the client if an error occurs.
    console.error("Error updating vet:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Defines a route to fetch a veterinarian's tips collection using their vetId with a GET request.
app.get("/veterinarian/:vetId/tips", async (req, res) => {
  try {
    // Extracts the vetId from the route parameters.
    const vetId = req.params.vetId;

    // Attempts to find the veterinarian by their vetId.
    const vet = await Veterinarian.findById(vetId);

    // If no veterinarian is found, sends a 404 status code and message to the client.
    if (!vet) {
      return res.status(404).json({ message: "Vet not found" });
    }

    // Sends the veterinarian's tips collection to the client.
    res.status(201).json(vet.tips);
  } catch (error) {
    // Logs the error and sends a 500 status code and message to the client if an error occurs.
    console.error("Error fetching vet's tips:", error);
    res.status(500).json({ error: "Error fetching vet's tips" });
  }
});

// ------------ Veterinarian ID------------

// Defines a route to check if a veterinarian ID is valid.
app.get("/veterinarianId/checkId/:vetId", async (req, res) => {
  try {
    // Extracts the veterinarian ID from the URL parameter.
    const enteredVetId = req.params.vetId;

    // Accesses the VeterinarianIDs collection from the database.
    const vetIdCollection =
      mongoose.connection.db.collection("VeterinarianIDs");

    // Attempts to find an entry in the collection that matches the provided veterinarian ID.
    const existingVetId = await vetIdCollection.findOne({
      vetId: enteredVetId,
    });

    // If an entry is found, it means the ID is valid, and a positive response is sent back.
    if (existingVetId) {
      res.json({ isValid: true });
    } else {
      // If no entry is found, the ID is invalid, and a negative response is sent back.
      res.json({ isValid: false });
    }
  } catch (error) {
    // Logs any errors that occur during the process and sends an error response.
    console.error("Error checking vet ID:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ------------ Tip------------

// Defines a route to fetch all tips and their associated veterinarian names and profile pictures.
app.get("/tips/all", async (req, res) => {
  try {
    // Fetches all tips from the database and populates the 'vetId' field with the veterinarian's name and profile picture.
    const tips = await Tip.find().populate("vetId", "name profilePicture");
    // Maps through each tip to create a new structure that includes the veterinarian's name and profile picture or a default image if not available.
    const tipsWithVetNames = tips.map((tip) => ({
      _id: tip._id,
      content: tip.content,
      vetName: tip.vetId ? tip.vetId.name : "Unknown",
      VetImage:
        tip.vetId && tip.vetId.profilePicture
          ? tip.vetId.profilePicture
          : "https://www.behance.net/gallery/189614555/VetProfile.jpg",
    }));
    // Sends the modified list of tips back to the client.
    res.status(200).json(tipsWithVetNames);
  } catch (error) {
    // Logs any errors that occur during the process and sends an error response.
    console.error("Error fetching all tips", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Defines a route to add a new tip associated with a specific veterinarian.
app.post("/tip/addTip/:vetId", async (req, res) => {
  try {
    // Extracts the veterinarian ID from the URL parameter and the tip content from the request body.
    const vetId = req.params.vetId;
    const { content } = req.body;

    // Creates a new tip instance with the veterinarian ID and content.
    const newTip = new Tip({ vetId: vetId, content: content });
    // Generates a verification token for the new tip (if needed for further validation or features).
    newTip.verificationToken = crypto.randomBytes(20).toString("hex");
    // Saves the new tip to the database.
    await newTip.save();

    // Attempts to find the veterinarian by ID to associate the tip with.
    const vet = await Veterinarian.findById(vetId);

    // If the veterinarian is not found, sends a 404 response.
    if (!vet) {
      return res.status(404).json({ message: "Veterinarian not found" });
    }

    // Adds the tip ID to the veterinarian's list of tips and saves the updated veterinarian document.
    vet.tips.push(newTip._id);
    await vet.save();

    // Sends a success response indicating the tip was added.
    res.status(201).json({ message: "Tip added successfully" });
  } catch (error) {
    // Logs any errors that occur during the process and sends an error response.
    console.error("Error adding tips", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Defines a route to fetch a specific tip by its ID.
app.get("/tip/:tipId", async (req, res) => {
  try {
    // Extracts the tip ID from the URL parameter.
    const tipId = req.params.tipId;
    // Attempts to find the tip by its ID in the database.
    const tip = await Tip.findById(tipId);

    // If the tip is not found, sends a 404 response.
    if (!tip) {
      return res.status(404).json({ message: "Tip not found" });
    }

    // Sends the found tip back to the client.
    res.status(200).json(tip);
  } catch (error) {
    // Logs any errors that occur during the process and sends an error response.
    console.error("Error fetching pet information", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Defines a route for updating the details of a specific tip.
app.put("/tip/updateInfo/:tipId", async (req, res) => {
  try {
    // Extracts the tip ID from the URL parameter and the updated data from the request body.
    const tipId = req.params.tipId;
    const updatedTipData = req.body.updatedData;

    // Attempts to find the tip by ID and update it with the new data, returning the updated document.
    const updatedTip = await Tip.findOneAndUpdate(
      { _id: tipId },
      { $set: updatedTipData },
      { new: true } // Ensures the updated document is returned.
    );

    // If the tip is not found, sends a 404 response.
    if (!updatedTip) {
      console.error(`Tip with ID ${tipId} not found.`);
      return res.status(404).json({ message: "Tip not found" });
    }

    // Logs success and sends a success response to the client.
    console.log(`Tip with ID ${tipId} updated successfully.`);
    res
      .status(200)
      .json({ message: `Tip with ID ${tipId} updated successfully.` });
  } catch (error) {
    // Logs any errors that occur during the process and sends an error response.
    console.error("Error updating tip:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ------------ Pet ------------

// Define a route to add a new pet associated with a pet owner.
app.post("/pet/addPet/:petOwnerId", async (req, res) => {
  try {
    // Extract the pet owner's ID from the URL parameters.
    const petOwnerId = req.params.petOwnerId;
    // Create a new Pet instance with the pet owner's ID and other pet details from the request body.
    const newPet = new Pet({ ownerId: petOwnerId, ...req.body });

    // Generate a unique verification token for the new pet for future verification purposes.
    newPet.verificationToken = crypto.randomBytes(20).toString("hex");

    // Save the new pet document to the database.
    await newPet.save();

    // Find the pet owner in the database using their ID.
    const petOwner = await PetOwner.findById(petOwnerId);

    // If the pet owner does not exist, return a 404 Not Found response.
    if (!petOwner) {
      return res.status(404).json({ message: "Pet Owner not found" });
    }

    // Add the new pet's ID to the pet owner's list of pets.
    petOwner.pets.push(newPet._id);

    // Save the updated pet owner document to the database.
    await petOwner.save();

    // Respond with a 201 Created status and a success message including the new pet's ID.
    res
      .status(201)
      .json({ message: "Pet added successfully", petId: newPet._id });
  } catch (error) {
    // Log the error and respond with a 500 Internal Server Error status and an error message.
    console.log("Error adding a pet:", error);
    res.status(500).json({ message: "Error adding a pet" });
  }
});

// Define a route to fetch information about a specific pet.
app.get("/pet/:petId", async (req, res) => {
  try {
    // Extract the pet's ID from the URL parameters.
    const petId = req.params.petId;
    // Find the pet in the database using its ID.
    const pet = await Pet.findById(petId);

    // If the pet does not exist, return a 404 Not Found response.
    if (!pet) {
      return res.status(404).json({ message: "Pet not found" });
    }

    // Respond with a 200 OK status and the pet's information.
    res.status(200).json(pet);
  } catch (error) {
    // Log the error and respond with a 500 Internal Server Error status and an error message.
    console.error("Error fetching pet information", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Define a route to update information about a specific pet.
app.put("/pet/updateInfo/:petId", async (req, res) => {
  try {
    // Extract the pet's ID from the URL parameters.
    const petId = req.params.petId;
    // Extract the updated pet data from the request body.
    const updatedPetData = req.body.updatedData;

    // Find the pet by its ID and update it with the new data, returning the updated document.
    const updatedPet = await Pet.findOneAndUpdate(
      { _id: petId },
      { $set: updatedPetData },
      { new: true } // Ensure the updated document is returned, not the original.
    );

    // If the pet does not exist, return a 404 Not Found response.
    if (!updatedPet) {
      console.error(`Pet with ID ${petId} not found.`);
      return res.status(404).json({ message: "Pet not found" });
    }

    // Log the successful update and respond with a 200 OK status and a success message.
    console.log(`Pet with ID ${petId} updated successfully.`);
    res
      .status(200)
      .json({ message: `Pet with ID ${petId} updated successfully.` });
  } catch (error) {
    // Log the error and respond with a 500 Internal Server Error status and an error message.
    console.error("Error updating pet:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Define a route to fetch all cities from the "city" collection in the database.
app.get("/cities", async (req, res) => {
  try {
    // Fetch all documents from the "city" collection and convert them to an array.
    const cities = await mongoose.connection.db
      .collection("city")
      .find()
      .toArray();

    // Respond with a 200 OK status and the list of cities.
    res.status(200).json(cities);
  } catch (error) {
    // Log the error and respond with a 500 Internal Server Error status and an error message.
    console.error("Error fetching cities:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Define a route to fetch all specializations from the "Specialisation" collection in the database.
app.get("/specialization", async (req, res) => {
  try {
    // Fetch all documents from the "Specialisation" collection and convert them to an array.
    const specialization = await mongoose.connection.db
      .collection("Specialisation")
      .find()
      .toArray();

    // Respond with a 200 OK status and the list of specializations.
    res.status(200).json(specialization);
  } catch (error) {
    // Log the error and respond with a 500 Internal Server Error status and an error message.
    console.error("Error fetching cities:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Define a route to delete a specific pet and update the pet owner's list of pets.
app.delete("/pet/:petId", async (req, res) => {
  try {
    // Extract the pet's ID from the URL parameters.
    const petId = req.params.petId;

    // Find the pet by its ID and delete it from the database.
    const pet = await Pet.findByIdAndDelete(petId);

    // If the pet does not exist, return a 404 Not Found response.
    if (!pet) {
      return res.status(404).json({ message: "Pet not found" });
    }

    // If the pet has an associated owner, update the pet owner's document to remove the pet's ID from their list of pets.
    if (pet.ownerId) {
      await PetOwner.findByIdAndUpdate(pet.ownerId, {
        $pull: { pets: pet._id }, // Remove the pet's ID from the pets array.
      });
    }

    // Respond with a 200 OK status and a success message.
    res.status(200).json({ message: "Pet deleted successfully" });
  } catch (error) {
    // Log the error and respond with a 500 Internal Server Error status and an error message.
    res.status(500).json({ message: "Error deleting pet", error });
  }
});