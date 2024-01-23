const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const app = express();
const port = 3000;
const cors = require("cors");
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const jwt = require("jsonwebtoken");

// Import models
const Veterinarian = require("./models/veterinarian");
const PetOwner = require("./models/pet_owner");
const Pet = require("./models/pet");
const Tip = require("./models/tip");

// Connect to MongoDB
mongoose
  .connect("mongodb+srv://vivianu2014:vivi123m@cluster1.6ieglfk.mongodb.net/", {})
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB");
  });

// Start the server
app.listen(port, () => {
  console.log("Server is running on port 3000");
});

// Function to generate a secret key
const generateSecretKey = () => {
  const secretKey = crypto.randomBytes(32).toString("hex");
  return secretKey;
};

// Generate a secret key
const secretKey = generateSecretKey();

// ------------ Pet Owner ------------

// Register a pet owner
app.post("/petOwner/register", async (req, res) => {
  try {
    const { name, email, password, profilePicture } = req.body;
    const existingOwner = await PetOwner.findOne({ email });

    if (existingOwner) {
      return res.status(404).json({ message: "Email already registered" });
    }

    // Create a new user
    const newOwner = new PetOwner({ name, email, password, profilePicture });

    // Generate and store the verification token
    newOwner.verificationToken = crypto.randomBytes(20).toString("hex");

    // Save the new user to the database
    await newOwner.save();

    res.status(201).json({ message: "Registration successful", userId: newOwner._id });
  } catch (error) {
    console.log("Error registering user", error);
    res.status(500).json({ message: "Error registering user" });
  }
});

// Pet owner login
app.post("/petOwner/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const owner = await PetOwner.findOne({ email });

    if (!owner) {
      return res.status(404).json({ message: "Email doesnt register" });
    }

    if (owner.password !== password) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Sign a JWT token with the user's ID and the secret key
    const token = jwt.sign({ userId: owner._id }, secretKey);

    res.status(200).json({ token, userId: owner._id });
  } catch (error) {
    res.status(500).json({ message: "Login failed" });
  }
});

// Fetch pet owner pet's collection
app.get("/petOwner/:petOwnerId/pets", async (req, res) => {
  try {
    const petOwnerId = req.params.petOwnerId;
    const petOwner = await PetOwner.findById(petOwnerId);

    if (!petOwner) {
      return res.status(404).json({ message: "Pet Owner not found" });
    }

    res.status(201).json({ pets: petOwner.pets });
  } catch (error) {
    console.error("Error fetching user's pets:", error);

    res.status(500).json({ error: "Error fetching user's pets" });
  }
});

// ------------ Veterinarian ------------

// Register a veterinarian
app.post("/veterinarian/register", async (req, res) => {
  try {
    const { name, email, vetId, password, phoneNumber, location, specialization } = req.body;
    const existingV = await Veterinarian.findOne({ vetId });

    if (existingV) {
      return res.status(404).json({ message: "Veterinarian already registered" });
    }

    // Create a new veterinarian user
    const newVeterinarian = new Veterinarian({
      name,
      email,
      vetId,
      password,
      phoneNumber,
      location,
      specialization,
    });

    // Generate and store the verification token (if needed)
    newVeterinarian.verificationToken = crypto.randomBytes(20).toString("hex");

    // Save the new veterinarian to the database
    await newVeterinarian.save();

    // Send a response indicating successful registration
    res.status(201).json({ message: "Registration successful for veterinarian", userId: newVeterinarian._id });
  } catch (error) {
    console.log("Error registering veterinarian", error);
    res.status(500).json({ message: "Error registering veterinarian" });
  }
});

// Veterinarian login
app.post("/veterinarian/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const veterinarian = await Veterinarian.findOne({ email });

    if (!veterinarian) {
      return res.status(404).json({ message: "Invalid id" });
    }

    if (veterinarian.password !== password) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Sign a JWT token with the user's ID and the secret key
    const token = jwt.sign({ userId: veterinarian._id }, secretKey);

    res.status(200).json({ token, userId: veterinarian._id });
  } catch (error) {
    res.status(500).json({ message: "Login failed" });
  }
});

// Fetch vet information
app.get("/veterinarian/:vetId", async (req, res) => {
  try {
    const vetId = req.params.vetId;
    const veterinarian = await Veterinarian.findById(vetId);
    if (!veterinarian) {
      return res.status(404).json({ message: "Veterinarian not found" });
    }
    res.status(200).json(veterinarian);
  } catch (error) {
    console.error("Error fetching vet information", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Updating vet details
app.put("/veterinarian/updateInfo/:vetId", async (req, res) => {
  try {
    const vetId = req.params.vetId;
    const updatedVetData = req.body.updatedData;

    // Use findOneAndUpdate to find the vet by its _id and update the data
    const updatedVet = await Veterinarian.findOneAndUpdate(
      { _id: vetId },
      { $set: updatedVetData },
      { new: true } // Return the updated document
    );

    if (!updatedVet) {
      console.error(`Vet with ID ${vetId} not found.`);
      return res.status(404).json({ message: "Veterinarian not found" });
    }

    console.log(`Vet with ID ${vetId} updated successfully.`);
    res.status(200).json({ message: `Vet with ID ${vetId} updated successfully.` });
  } catch (error) {
    console.error("Error updating vet:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Fetch vet tips collection
app.get("/veterinarian/:vetId/tips", async (req, res) => {
  try {
    const vetId = req.params.vetId;
    const vet = await Veterinarian.findById(vetId);

    if (!vet) {
      return res.status(404).json({ message: "Vet not found" });
    }
    res.status(201).json(vet.tips);
  } catch (error) {
    console.error("Error fetching user's pets:", error);

    res.status(500).json({ error: "Error fetching user's pets" });
  }
});

// ------------ Veterinarian ID------------

// Check if a vet ID is valid
app.get("/veterinarianId/checkId/:vetId", async (req, res) => {
  try {
    const enteredVetId = req.params.vetId;

    // Check if the vet ID exists in the VetId collection
    const vetIdCollection = mongoose.connection.db.collection("VeterinarianIDs");

    // Check if the vet ID exists in the collection
    const existingVetId = await vetIdCollection.findOne({
      vetId: enteredVetId,
    });

    if (existingVetId) {
      res.json({ isValid: true });
    } else {
      res.json({ isValid: false });
    }
  } catch (error) {
    console.error("Error checking vet ID:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ------------ Tip------------

// Add tip
app.post("/tip/addTip/:vetId", async (req, res) => {
  try {
    const vetId = req.params.vetId;
    const { content } = req.body;

    const newTip = new Tip({ vetId: vetId, content: content });
    newTip.verificationToken = crypto.randomBytes(20).toString("hex");
    await newTip.save();

    const vet = await Veterinarian.findById(vetId);

    if (!vet) {
      return res.status(404).json({ message: "Veterinarian not found" });
    }

    vet.tips.push(newTip._id);
    await vet.save();

    res.status(201).json({ message: "Tip added successfully" });
  } catch (error) {
    console.error("Error adding tips", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Fetch tip
app.get("/tip/:tipId", async (req, res) => {
  try {
    const tipId = req.params.tipId;
    const tip = await Tip.findById(tipId);
    if (!tip) {
      return res.status(404).json({ message: "Tip not found" });
    }
    res.status(200).json(tip);
  } catch (error) {
    console.error("Error fetching pet information", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Updating tip details
app.put("/tip/updateInfo/:tipId", async (req, res) => {
  try {
    const tipId = req.params.tipId;
    const updatedTipData = req.body.updatedData;

    const updatedTip = await Tip.findOneAndUpdate(
      { _id: tipId },
      { $set: updatedTipData },
      { new: true } // Return the updated document
    );

    if (!updatedTip) {
      console.error(`Tip with ID ${tipId} not found.`);
      return res.status(404).json({ message: "Tip not found" });
    }

    console.log(`Tip with ID ${tipId} updated successfully.`);
    res.status(200).json({ message: `Tip with ID ${tipId} updated successfully.` });
  } catch (error) {
    console.error("Error updating tip:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ------------ Pet ------------

// Add a pet
app.post("/pet/addPet/:petOwnerId", async (req, res) => {
  try {
    const petOwnerId = req.params.petOwnerId;
    const newPet = new Pet({ ownerId: petOwnerId, ...req.body });

    // Generate and store the verification token
    newPet.verificationToken = crypto.randomBytes(20).toString("hex");

    // Save the new pet to the database
    await newPet.save();

    // Find the corresponding PetOwner document by ownerId
    const petOwner = await PetOwner.findById(petOwnerId);

    if (!petOwner) {
      return res.status(404).json({ message: "Pet Owner not found" });
    }

    // Add the new pet's ObjectId to the pets array of the PetOwner
    petOwner.pets.push(newPet._id);

    // Save the updated PetOwner document
    await petOwner.save();

    res.status(201).json({ message: "Pet added successfully", petId: newPet._id });
  } catch (error) {
    console.log("Error adding a pet:", error);
    res.status(500).json({ message: "Error adding a pet" });
  }
});

// Fetch pet information
app.get("/pet/:petId", async (req, res) => {
  try {
    const petId = req.params.petId;
    const pet = await Pet.findById(petId);
    if (!pet) {
      return res.status(404).json({ message: "Pet not found" });
    }
    res.status(200).json(pet);
  } catch (error) {
    console.error("Error fetching pet information", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Updating pet details
app.put("/pet/updateInfo/:petId", async (req, res) => {
  try {
    const petId = req.params.petId;
    const updatedPetData = req.body.updatedData;

    // Use findOneAndUpdate to find the pet by its _id and update the data
    const updatedPet = await Pet.findOneAndUpdate(
      { _id: petId },
      { $set: updatedPetData },
      { new: true } // Return the updated document
    );

    if (!updatedPet) {
      console.error(`Pet with ID ${petId} not found.`);
      return res.status(404).json({ message: "Pet not found" });
    }

    console.log(`Pet with ID ${petId} updated successfully.`);
    res.status(200).json({ message: `Pet with ID ${petId} updated successfully.` });
  } catch (error) {
    console.error("Error updating pet:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
