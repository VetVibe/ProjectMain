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

// Connect to MongoDB
mongoose
  .connect(
    "mongodb+srv://vivianu2014:vivi123m@cluster1.6ieglfk.mongodb.net/",
    {}
  )
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

// Import the User model
const User = require("./models/pet_owner");

// Endpoint to register a user
app.post("/register", async (req, res) => {
  try {
    const { name, email, password, profilePicture } = req.body;
    const existingOwner = await PetOwner.findOne({ email });

    if (existingOwner) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Create a new user
    const newOwner = new PetOwner({ name, email, password, profilePicture });

    // Generate and store the verification token
    newOwner.verificationToken = crypto.randomBytes(20).toString("hex");

    // Save the new user to the database
    await newOwner.save();

    res.status(201).json({ message: "Registration successful" });
  } catch (error) {
    console.log("Error registering user", error);
    res.status(500).json({ message: "Error registering user" });
  }
});

// Function to generate a secret key
const generateSecretKey = () => {
  const secretKey = crypto.randomBytes(32).toString("hex");
  return secretKey;
};

// Generate a secret key
const secretKey = generateSecretKey();

// Endpoint to handle user login
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const owner = await PetOwner.findOne({ email });

    if (!owner) {
      return res.status(404).json({ message: "Invalid email" });
    }

    if (owner.password !== password) {
      return res.status(404).json({ message: "Invalid password" });
    }

    // Sign a JWT token with the user's ID and the secret key
    const token = jwt.sign({ userId: owner._id }, secretKey);

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: "Login failed" });
  }
});

// Import the Veterinarian model
const Veterinarian = require("./models/veterinarian");
const PetOwner = require("./models/pet_owner");
// Endpoint to handle veterinarian login
app.post("/loginv", async (req, res) => {
  try {
    const { vetId, password } = req.body;
    const veterinarian = await Veterinarian.findOne({ vetId });

    if (!veterinarian) {
      return res.status(404).json({ message: "Invalid id" });
    }

    if (veterinarian.password !== password) {
      return res.status(404).json({ message: "Invalid password" });
    }

    // Sign a JWT token with the user's ID and the secret key
    const token = jwt.sign({ userId: veterinarian._id }, secretKey);

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: "Login failed" });
  }
});

// Endpoint to check if a vet ID is valid
// Get the collection
app.get("/checkVetId/:id", async (req, res) => {
  try {
    const enteredVetId = req.params.id;

    // Check if the vet ID exists in the VetId collection
    const vetIdCollection =
      mongoose.connection.db.collection("VeterinarianIDs");

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
// Endpoint to register a veterinarian

app.post("/registerVeterinarian", async (req, res) => {
  try {
    const { name, vetId, password, phoneNumber } = req.body;
    const existingV = await Veterinarian.findOne({ vetId });

    if (existingV) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Create a new veterinarian user
    const newVeterinarian = new Veterinarian({
      name,
      vetId,
      password,
      phoneNumber,
    });

    // Generate and store the verification token (if needed)
    newVeterinarian.verificationToken = crypto.randomBytes(20).toString("hex");

    // Save the new veterinarian to the database
    await newVeterinarian.save();

    // Send a response indicating successful registration
    res
      .status(201)
      .json({ message: "Registration successful for veterinarian" });
  } catch (error) {
    console.log("Error registering veterinarian", error);
    res.status(500).json({ message: "Error registering veterinarian" });
  }
});
// Update vet tips
app.post("/veterinarian/tips/:vetId", async (req, res) => {
  try {
    const vetId = req.params.vetId;
    const { title, content } = req.body;

    const veterinarian = await Veterinarian.findOne({ vetId });
    if (!veterinarian) {
      return res.status(404).json({ message: "Veterinarian not found" });
    }
    // Add the new tip at the beginning of the tips array
    veterinarian.tips.unshift({ title, content });

    //veterinarian.tips.push({ title, content });
    await veterinarian.save();
    res.status(200).json({ message: "Tips added successfully" });
  } catch (error) {
    console.error("Error adding tips", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Update vet availability
app.post("/veterinarian/availability/:vetId", async (req, res) => {
  try {
    const vetId = req.params.vetId;
    const { canHelpNow, location } = req.body;

    const veterinarian = await Veterinarian.findOne({ vetId });
    if (!veterinarian) {
      return res.status(404).json({ message: "Veterinarian not found" });
    }

    veterinarian.availability = { canHelpNow, location };
    await veterinarian.save();
    res.status(200).json({ message: "Availability updated successfully" });
  } catch (error) {
    console.error("Error updating availability", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
// Update veterinarian name
app.put("/veterinarian/:vetId/name", async (req, res) => {
  try {
    const vetId = req.params.vetId;
    const { name } = req.body;

    const veterinarian = await Veterinarian.findOne({ vetId });
    if (!veterinarian) {
      return res.status(404).json({ message: "Veterinarian not found" });
    }

    if (name) veterinarian.name = name;
    await veterinarian.save();

    res.status(200).json({ message: "Name updated successfully" });
  } catch (error) {
    console.error("Error updating name", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
// Update veterinarian password
app.put("/veterinarian/:vetId/password", async (req, res) => {
  try {
    const vetId = req.params.vetId;
    const { password } = req.body;

    const veterinarian = await Veterinarian.findOne({ vetId });
    if (!veterinarian) {
      return res.status(404).json({ message: "Veterinarian not found" });
    }

    if (password) veterinarian.password = password;
    await veterinarian.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error updating password", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
// Update veterinarian profile picture
app.put("/veterinarian/:vetId/profilePicture", async (req, res) => {
  try {
    const vetId = req.params.vetId;
    const { profilePicture } = req.body;

    const veterinarian = await Veterinarian.findOne({ vetId });
    if (!veterinarian) {
      return res.status(404).json({ message: "Veterinarian not found" });
    }

    if (profilePicture) veterinarian.profilePicture = profilePicture;
    await veterinarian.save();

    res.status(200).json({ message: "Profile picture updated successfully" });
  } catch (error) {
    console.error("Error updating profile picture", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
// Update veterinarian about
app.put("/veterinarian/:vetId/about", async (req, res) => {
  try {
    const vetId = req.params.vetId;
    const { about } = req.body;

    const veterinarian = await Veterinarian.findOne({ vetId });
    if (!veterinarian) {
      return res.status(404).json({ message: "Veterinarian not found" });
    }

    if (about) veterinarian.about = about;
    await veterinarian.save();

    res.status(200).json({ message: "About updated successfully" });
  } catch (error) {
    console.error("Error updating about", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Fetch vet information
app.get("/veterinarian/:vetId", async (req, res) => {
  try {
    const vetId = req.params.vetId;
    const veterinarian = await Veterinarian.findOne({ vetId });
    if (!veterinarian) {
      return res.status(404).json({ message: "Veterinarian not found" });
    }
    res.status(200).json(veterinarian);
  } catch (error) {
    console.error("Error fetching vet information", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
// Add an endpoint for updating a specific tip
app.put("/veterinarian/tips/:vetId/:tipId", async (req, res) => {
  try {
    const vetId = req.params.vetId;
    const tipId = req.params.tipId;
    const { title, content } = req.body;

    const veterinarian = await Veterinarian.findOne({ vetId });
    if (!veterinarian) {
      return res.status(404).json({ message: "Veterinarian not found" });
    }

    const tipIndex = veterinarian.tips.findIndex(
      (tip) => tip._id.toString() === tipId
    );
    if (tipIndex === -1) {
      return res.status(404).json({ message: "Tip not found" });
    }

    // Update the title and content of the specified tip
    veterinarian.tips[tipIndex].title = title;
    veterinarian.tips[tipIndex].content = content;

    await veterinarian.save();
    res.status(200).json({ message: "Tip updated successfully" });
  } catch (error) {
    console.error("Error updating tip", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
// Update veterinarian phone number
app.put("/veterinarian/:vetId/phoneNumber", async (req, res) => {
  try {
    const vetId = req.params.vetId;
    const { phoneNumber } = req.body;

    const veterinarian = await Veterinarian.findOne({ vetId });
    if (!veterinarian) {
      return res.status(404).json({ message: "Veterinarian not found" });
    }

    if (phoneNumber) veterinarian.phoneNumber = phoneNumber;
    await veterinarian.save();

    res.status(200).json({ message: "Phone number updated successfully" });
  } catch (error) {
    console.error("Error updating phone number", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
