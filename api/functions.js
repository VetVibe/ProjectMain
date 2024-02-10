import { randomBytes } from "crypto";
import jwt from "jsonwebtoken";

// Import models
import Veterinarian from "./models/veterinarian.js";
import PetOwner from "./models/pet_owner.js";
import Pet from "./models/pet.js";
import Tip from "./models/tip.js";
import mongoose from "mongoose";

// Function to generate a secret key
const generateSecretKey = () => {
  const secretKey = randomBytes(32).toString("hex");
  return secretKey;
};

// Generate a secret key
const secretKey = generateSecretKey();

// Pet Owner Functions
const registerPetOwner = async (req, res) => {
  try {
    const { email } = req.body;
    const existingOwner = await PetOwner.findOne({ email });

    if (existingOwner) {
      return res.status(404).json({ message: "Email already registered" });
    }

    const newOwner = new PetOwner(req.body);

    // Generate and store the verification token
    newOwner.verificationToken = randomBytes(20).toString("hex");

    // Save the new user to the database
    await newOwner.save();

    res.status(201).json({ message: "Pet owner registration successful", userId: newOwner._id });
    console.log("Pet owner registration successful");
  } catch (error) {
    console.log("Error registering user", error);
    res.status(500).json({ message: "Error registering user" });
  }
};

const loginPetOwner = async (req, res) => {
  try {
    const { email, password } = req.body;
    const owner = await PetOwner.findOne({ email });

    if (!owner) {
      return res.status(404).json({ message: "Email doesnt register" });
    }

    if (owner.password !== password) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    // Sign a JWT token with the user's ID and the secret key
    const token = jwt.sign({ userId: owner._id }, secretKey);

    res.status(200).json({ token, userId: owner._id });
    console.log("Pet owner logged in successfully");
  } catch (error) {
    res.status(500).json({ message: "Login failed" });
  }
};

const updatePetOwnerInfo = async (req, res) => {
  const { petOwnerId } = req.params;
  const updatedData = req.body.updatedData;

  try {
    // Find the pet owner by ID
    const petOwner = await PetOwner.findById(petOwnerId);

    if (!petOwner) {
      return res.status(404).json({ success: false, message: "Pet owner not found" });
    }

    // Update the pet owner details
    Object.assign(petOwner, updatedData);

    // Save the updated pet owner
    await petOwner.save();

    res.json({
      success: true,
      message: "Pet owner details updated successfully",
    });
    console.log("Pet owner details updated successfully");
  } catch (error) {
    console.error("Error updating pet owner details:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const getPetOwnerPets = async (req, res) => {
  try {
    const petOwnerId = req.params.petOwnerId;
    const petOwner = await PetOwner.findById(petOwnerId);

    if (!petOwner) {
      return res.status(404).json({ message: "Pet Owner not found" });
    }

    res.status(201).json({ pets: petOwner.pets });
    console.log(`Pet owner ${petOwnerId} pets fetched successfully`);
  } catch (error) {
    console.error("Error fetching user's pets:", error);

    res.status(500).json({ error: "Error fetching user's pets" });
  }
};

const getPetOwnerDetails = async (req, res) => {
  try {
    const petOwnerId = req.params.petOwnerId;
    const petOwner = await PetOwner.findById(petOwnerId);

    if (!petOwner) {
      return res.status(404).json({ message: "Pet Owner not found" });
    }
    res.status(200).json(petOwner);
    console.log(`Pet owner ${petOwnerId} details fetched successfully`);
  } catch (error) {
    console.error("Error fetching pet owner details:", error);
    res.status(500).json({ error: "Error fetching pet owner details" });
  }
};

// Veterinarian Functions
const registerVeterinarian = async (req, res) => {
  try {
    const { name, email, vetId, password, phoneNumber, location, specialization, profilePicture } = req.body;
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
      profilePicture,
    });

    // Generate and store the verification token (if needed)
    newVeterinarian.verificationToken = randomBytes(20).toString("hex");

    // Save the new veterinarian to the database
    await newVeterinarian.save();

    // Send a response indicating successful registration
    res.status(201).json({
      message: "Registration successful for veterinarian",
      userId: newVeterinarian._id,
    });
    console.log("Veterinarian registration successful");
  } catch (error) {
    console.log("Error registering veterinarian", error);
    res.status(500).json({ message: "Error registering veterinarian" });
  }
};

const loginVeterinarian = async (req, res) => {
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
    console.log("Veterinarian logged in successfully");
  } catch (error) {
    res.status(500).json({ message: "Login failed" });
  }
};

const rateVeterinarian = async (req, res) => {
  try {
    let token = req.headers["authorization"] || req.headers["Authorization"];
    token = token.split("Bearer ")[1];
    const { userId } = jsonwebtoken.decode(token);
    const { email, rating } = req.body;
    const veterinarian = await Veterinarian.findOne({ email });
    const petOwner = await PetOwner.findById(userId);

    if (!petOwner || !veterinarian) {
      return res.status(404).json({ message: "Vet/Pet owner email not found" });
    }

    if (veterinarian && petOwner.ratings.includes(email)) {
      return res.status(400).json({ message: "You have already rated this vert" });
    }
    petOwner.ratings.push(email);
    veterinarian.rate += rating;
    veterinarian.clientsCount++;

    await petOwner.save();
    await veterinarian.save();

    res.status(200).json({
      newRating: veterinarian.rate,
      newClientCount: veterinarian.clientsCount,
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed" });
  }
};

const getVeterinarians = async (req, res) => {
  const { location, specialization } = req.query;

  try {
    let query = {};
    if (location) query.location = location;
    if (specialization) query.specialization = specialization;

    const veterinarians = await Veterinarian.find(query);
    res.status(200).json(veterinarians);
  } catch (error) {
    console.error("Error fetching veterinarians", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getVeterinarianInfo = async (req, res) => {
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
};

const updateVeterinarianInfo = async (req, res) => {
  try {
    const vetId = req.params.vetId;
    const updatedVetData = req.body;

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
};

const getVeterinarianTips = async (req, res) => {
  try {
    const vetId = req.params.vetId;
    const vet = await Veterinarian.findById(vetId);

    if (!vet) {
      return res.status(404).json({ message: "Vet not found" });
    }
    res.status(201).json(vet.tips);
  } catch (error) {
    console.error("Error fetching Veterinarian tips:", error);
    res.status(500).json({ error: "Error fetching Veterinarian tips" });
  }
};

// Tip Functions
const getAllTips = async (req, res) => {
  try {
    // Populate the 'vetId' field in each tip with the 'name' field from the referenced veterinarian document
    const tips = await Tip.find().populate("vetId", "name profilePicture"); // Ensure you're also populating the profilePicture
    const tipsWithVetNames = tips.map((tip) => ({
      _id: tip._id,
      content: tip.content,
      vetName: tip.vetId ? tip.vetId.name : "Unknown",
      // Use the vet's profile picture if available; otherwise, use a default image
      VetImage:
        tip.vetId && tip.vetId.profilePicture
          ? tip.vetId.profilePicture
          : "https://www.behance.net/gallery/189614555/VetProfile.jpg",
    }));
    res.status(200).json(tipsWithVetNames);
  } catch (error) {
    console.error("Error fetching all tips", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const addTip = async (req, res) => {
  try {
    const vetId = req.params.vetId;
    console.log("addTip:", req.body.content);
    const content = req.body.content;

    const newTip = new Tip({ vetId: vetId, content: content });
    newTip.verificationToken = randomBytes(20).toString("hex");
    await newTip.save();

    const vet = await Veterinarian.findById(vetId);

    if (!vet) {
      return res.status(404).json({ message: "Veterinarian not found" });
    }

    vet.tips.push(newTip._id);
    await vet.save();

    res.status(201).json({ message: "Tip added successfully" });
    console.log(`Added tip for vet ${vetId}.`);
  } catch (error) {
    console.error("Error adding tips", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getTip = async (req, res) => {
  try {
    const tipId = req.params.tipId;
    const tip = await Tip.findById(tipId);
    if (!tip) {
      return res.status(404).json({ message: "Tip not found" });
    }
    res.status(200).json(tip);
  } catch (error) {
    console.error("Error fetching tips information", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateTipInfo = async (req, res) => {
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
};

const deleteTip = async (req, res) => {
  try {
    const tipId = req.params.tipId;
    const tip = await Tip.findByIdAndDelete(tipId);
    if (!tip) {
      return res.status(404).json({ message: "Tip not found" });
    }

    // If the pet has an owner, update the PetOwner's pets array
    if (tip.vetId) {
      await Veterinarian.findByIdAndUpdate(tip.vetId, {
        $pull: { tips: tip._id },
      });
    }

    res.status(200).json({ message: "Tip deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting tip", error });
  }
};

// Pet Functions
const addPet = async (req, res) => {
  try {
    const petOwnerId = req.params.petOwnerId;
    const newPet = new Pet({ ownerId: petOwnerId, ...req.body });

    // Generate and store the verification token
    newPet.verificationToken = randomBytes(20).toString("hex");

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
};

const getPetInfo = async (req, res) => {
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
};

const updatePetInfo = async (req, res) => {
  try {
    const petId = req.params.petId;
    const updatedPetData = req.body;

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
};

const deletePet = async (req, res) => {
  try {
    const petId = req.params.petId;

    // Find and delete the pet
    const pet = await Pet.findByIdAndDelete(petId);
    if (!pet) {
      return res.status(404).json({ message: "Pet not found" });
    }

    // If the pet has an owner, update the PetOwner's pets array
    if (pet.ownerId) {
      await PetOwner.findByIdAndUpdate(pet.ownerId, {
        $pull: { pets: pet._id },
      });
    }

    res.status(200).json({ message: "Pet deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting pet", error });
  }
};

export {
  registerPetOwner,
  loginPetOwner,
  updatePetOwnerInfo,
  getPetOwnerPets,
  getPetOwnerDetails,
  registerVeterinarian,
  loginVeterinarian,
  rateVeterinarian,
  getVeterinarians,
  getVeterinarianInfo,
  updateVeterinarianInfo,
  getVeterinarianTips,
  getAllTips,
  addTip,
  getTip,
  updateTipInfo,
  deleteTip,
  addPet,
  getPetInfo,
  updatePetInfo,
  deletePet,
};
