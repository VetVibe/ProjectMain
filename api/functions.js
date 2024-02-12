import Veterinarian from "./models/veterinarian.js";
import PetOwner from "./models/pet_owner.js";
import Pet from "./models/pet.js";
import Tip from "./models/tip.js";
import { randomBytes } from "crypto";
import Appointment from "./models/appointment.js";
import mongoose from "mongoose";
import { Types } from "mongoose";

// ----------- Pet Owner -----------
const registerPetOwner = async (req, res) => {
  try {
    const { email } = req.body;
    const existingOwner = await PetOwner.findOne({ email });

    if (existingOwner) {
      return res.status(409).json();
    }

    const newOwner = new PetOwner(req.body);
    await newOwner.save();

    res.status(201).json();
    console.log(
      `DB | Register Pet Owner: Pet owner registration successful. User ID: ${newOwner._id}`
    );
  } catch (error) {
    console.error("DB | Register Pet Owner | Error:", error);
    res.status(500).json();
  }
};

const loginPetOwner = async (req, res) => {
  try {
    const { email, password } = req.body;
    const owner = await PetOwner.findOne({ email });

    if (!owner) {
      return res.status(404).json();
    }

    if (owner.password !== password) {
      return res.status(401).json();
    }

    res.status(200).json({ userId: owner._id });
    console.log(
      `DB | Login Pet Owner: Pet owner logged in successfully. User ID: ${owner._id}`
    );
  } catch (error) {
    res.status(500).json({ message: "Login failed" });
    console.error("DB | Login Pet Owner | Error:", error);
  }
};

const updatePetOwnerInfo = async (req, res) => {
  const { petOwnerId } = req.params;
  const updatedData = req.body.updatedData;

  try {
    const petOwner = await PetOwner.findById(petOwnerId);

    if (!petOwner) {
      return res
        .status(404)
        .json({ success: false, message: "Pet owner not found" });
    }

    // Update the pet owner details
    Object.assign(petOwner, updatedData);

    // Save the updated pet owner
    await petOwner.save();

    res.json({
      success: true,
      message: "Pet owner details updated successfully",
    });
    console.log(
      "DB | Update Pet owner details: Pet owner details updated successfully."
    );
  } catch (error) {
    console.error("DB | Update Pet owner details | Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const getPetOwnerDetails = async (req, res) => {
  try {
    const petOwnerId = req.params.petOwnerId;
    const petOwner = await PetOwner.findById(petOwnerId);

    if (!petOwner) {
      console.error(
        `DB | Pet owner Details | Pet owner ${petOwnerId} not found.`
      );
      return res.status(404).json({ message: "Pet Owner not found" });
    }
    res.status(200).json(petOwner);
    console.log(
      `DB | Pet owner Details | Pet owner ${petOwnerId} details fetched successfully.`
    );
  } catch (error) {
    console.error("DB | Pet owner Details | Error:", error);
    res.status(500).json({ error: "Error fetching pet owner details" });
  }
};

// ----------- Veterinarian Functions -----------
const registerVeterinarian = async (req, res) => {
  try {
    const { vetId } = req.body;
    const existingV = await Veterinarian.findOne({ vetId });

    if (existingV) {
      console.error(
        "DB | Veterinarian registration | Error: Veterinarian already registered."
      );
      return res
        .status(409)
        .json({ message: "Veterinarian already registered" });
    }

    const newVeterinarian = new Veterinarian(req.body);
    await newVeterinarian.save();

    res.status(201).json();
    console.log("DB | Veterinarian registration successful.");
  } catch (error) {
    console.error("DB | Veterinarian registration | Error:", error);
    res.status(500).json({ message: "Error registering veterinarian" });
  }
};

const loginVeterinarian = async (req, res) => {
  try {
    const { email, password } = req.body;
    const veterinarian = await Veterinarian.findOne({ email });

    if (!veterinarian) {
      console.error("DB| Veterinarian login | Error: Veterinarian not found.");
      return res.status(404).json();
    }

    if (veterinarian.password !== password) {
      console.error("DB| Veterinarian login | Error: Invalid password.");
      return res.status(401).json({ message: "Invalid password" });
    }
    res.status(200).json({ userId: veterinarian._id });
    console.log(
      "DB| Veterinarian login | Veterinarian logged in successfully."
    );
  } catch (error) {
    console.error("DB| Veterinarian login | Error:", error);
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
      return res
        .status(400)
        .json({ message: "You have already rated this vert" });
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
      console.error(`DB | Vet info | Error: Vet with ID ${vetId} not found.`);
      return res.status(404).json({ message: "Veterinarian not found" });
    }
    res.status(200).json(veterinarian);
    console.log(`DB | Vet info | Vet with ID ${vetId} fetched successfully.`);
  } catch (error) {
    console.error("DB | Vet info | Error:", error);
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
      console.error(
        `DB| Update Vet Info | Error: Vet with ID ${vetId} not found.`
      );
      return res.status(404).json({ message: "Veterinarian not found" });
    }

    console.log(
      `DB| Update Vet Info | Vet with ID ${vetId} updated successfully.`
    );
    res
      .status(200)
      .json({ message: `Vet with ID ${vetId} updated successfully.` });
  } catch (error) {
    console.error("DB| Update Vet Info | Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ----------- Tips -----------
const getTipsByVetId = async (req, res) => {
  try {
    const vetId = req.params.vetId;
    const tips = await Tip.find({ vetId: vetId });

    if (!tips) {
      console.error(
        `DB| Get vet tips | Error: Tips for vet with ID ${vetId} not found.`
      );
      return res.status(404).json({ message: "Tips not found" });
    }

    res.status(201).json(tips);
    console.log(
      `DB| Get vet tips | Tips for vet with ID ${vetId} fetched successfully.`
    );
  } catch (error) {
    console.error(`DB| Get vet tips | Error:`, error);
    res.status(500).json({ error: "Error fetching Veterinarian tips" });
  }
};

const getAllTips = async (_, res) => {
  try {
    // Populate the 'vetId' field in each tip with the 'name' field from the referenced veterinarian document
    const tips = await Tip.find().populate("vetId", "name profilePicture");
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
    console.log("DB | Fetch all tips | All tips fetched successfully.");
  } catch (error) {
    console.error("DB | Fetch all tips | Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const addTip = async (req, res) => {
  try {
    const vetId = req.params.vetId;
    const content = req.body.content;

    const newTip = new Tip({ vetId: vetId, content: content });
    await newTip.save();

    res.status(201).json({ message: "Tip added successfully" });
    console.log(`DB| Add tip | Added tip for vet ${vetId}.`);
  } catch (error) {
    console.error("DB| Add tip | Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getTip = async (req, res) => {
  try {
    const tipId = req.params.tipId;
    const tip = await Tip.findById(tipId);

    if (!tip) {
      console.error(`DB | Get tip | Tip with ID ${tipId} not found.`);
      return res.status(404).json({ message: "Tip not found" });
    }

    res.status(200).json(tip);
    console.log(`DB | Get tip | Tip with ID ${tipId} fetched successfully.`);
  } catch (error) {
    console.error("DB | Get tip | Error:", error);
    res.status(500).json();
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
      console.error(`DB| Update tip | Tip with ID ${tipId} not found.`);
      return res.status(404).json({ message: "Tip not found" });
    }

    console.log(`DB| Update tip | Tip with ID ${tipId} updated successfully.`);
    res
      .status(200)
      .json({ message: `Tip with ID ${tipId} updated successfully.` });
  } catch (error) {
    console.error("DB| Update tip | Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteTip = async (req, res) => {
  try {
    const tipId = req.params.tipId;
    const tip = await Tip.findByIdAndDelete(tipId);

    if (!tip) {
      console.error(`DB| Delete tip | Tip with ID ${tipId} not found.`);
      return res.status(404).json({ message: "Tip not found" });
    }

    res.status(200).json({ message: "Tip deleted successfully" });
    console.log(`DB| Delete tip | Tip with ID ${tipId} deleted successfully.`);
  } catch (error) {
    console.error("DB| Delete tip | Error:", error);
    res.status(500).json({ message: "Error deleting tip", error });
  }
};

// ----------- Pet -----------
const addPet = async (req, res) => {
  try {
    const petOwnerId = req.params.petOwnerId;
    const newPet = new Pet({ ownerId: petOwnerId, ...req.body });
    await newPet.save();

    res
      .status(201)
      .json({ message: "Pet added successfully", petId: newPet._id });
    console.log(`DB | Add pet | Pet added successfully. Pet ID: ${newPet._id}`);
  } catch (error) {
    console.error("DB | Add pet | Error:", error);
    res.status(500).json({ message: "Error adding a pet" });
  }
};

const getPetInfo = async (req, res) => {
  try {
    const petId = req.params.petId;
    const pet = await Pet.findById(petId);

    if (!pet) {
      console.error(`DB | Get pet info | Pet with ID ${petId} not found.`);
      return res.status(404).json({ message: "Pet not found" });
    }

    res.status(200).json(pet);
    console.log(
      `DB | Get pet info | Pet with ID ${petId} fetched successfully.`
    );
  } catch (error) {
    console.error("DB | Get pet info | Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getPetsByOwnerId = async (req, res) => {
  try {
    const petOwnerId = req.params.petOwnerId;
    const pets = await Pet.find({ ownerId: petOwnerId });

    if (!pets) {
      console.error(
        `DB | Pet owner pets | Pet owner ${petOwnerId} pets not found.`
      );
      return res.status(404).json({ message: "Pet not found" });
    }

    res.status(201).json({ pets: pets });
    console.log(
      `DB | Pet owner pets | Pet owner ${petOwnerId} pets fetched successfully.`
    );
  } catch (error) {
    console.error("DB | Pet owner pets | Error:", error);
    res.status(500).json({ error: "Error fetching user's pets" });
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
      console.error(`DB| Update Pet | Pet with ID ${petId} not found.`);
      return res.status(404).json({ message: "Pet not found" });
    }

    console.log(`DB| Update Pet | Pet with ID ${petId} updated successfully.`);
    res
      .status(200)
      .json({ message: `Pet with ID ${petId} updated successfully.` });
  } catch (error) {
    console.error("DB| Update Pet | Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deletePet = async (req, res) => {
  try {
    const petId = req.params.petId;

    // Find and delete the pet
    const pet = await Pet.findByIdAndDelete(petId);
    if (!pet) {
      console.error(`DB| Delete Pet | Pet with ID ${petId} not found.`);
      return res.status(404).json({ message: "Pet not found" });
    }

    res.status(200).json({ message: "Pet deleted successfully" });
    console.log(`DB| Delete Pet | Pet with ID ${petId} deleted successfully.`);
  } catch (error) {
    console.error("DB| Delete Pet | Error:", error);
    res.status(500).json({ message: "Error deleting pet", error });
  }
};

// ----------- Appointments -----------
const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find();
    res.status(200).json(appointments);
    console.log(
      "DB | Get all appointments | All appointments fetched successfully."
    );
  } catch (error) {
    console.error("DB | Get all appointments | Error:", error);
    return res.status(500).json({ error: error.message });
  }
};

const deleteAppointment = async (req, res) => {
  try {
    const appointmentId = req.params.appointmentId;
    const appointment = await Appointment.findByIdAndDelete(appointmentId);
    if (!appointment) {
      console.error(
        `DB | Delete appointment | Appointment with ID ${appointmentId} not found.`
      );
      res.status(404).json({ message: "Appointment not found" });
      return;
    }

    res.status(200).json(appointment);
    console.log(
      `DB | Delete appointment | Appointment with ID ${appointmentId} deleted successfully`
    );
  } catch (e) {
    res.status(500).json({ error: e.message });
    console.error("DB | Delete appointment | Error:", e);
  }
};

const getAppointmentsByOwner = async (req, res) => {
  try {
    const userId = req.params.petOwnerId;
    const appointments = await Appointment.find({
      petOwnerId: userId,
    }).populate("vetId", ["name", "phoneNumber"]);
    res.status(200).json({ appointments });
    console.log(
      `DB | Get appointments by owner id | Appointments for user ${userId} fetched successfully`
    );
  } catch (e) {
    console.error("DB | Get appointments by owner id | Error:", e);
    return res.status(500).json({ error: e.message });
  }
};

const addAppointmentsByOwner = async (req, res) => {
  try {
    const userId = req.params.petOwnerId;
    const { vetId, date, time } = req.body;

    const isAppointmentExists = await Appointment.findOne({
      petOwnerId: userId,
      vetId: vetId,
      date: date,
    });
    if (isAppointmentExists) {
      console.error(
        "DB | Add appointment by owner ID | Error: Appointment already exists"
      );
      return res.status(409).json({ message: "Appointment already exists" });
    }

    const newAppointment = await Appointment.create({
      petOwnerId: userId,
      vetId: new mongoose.Types.ObjectId(vetId), // Convert vetId to a valid ObjectId
      date: date,
      time: time,
    });

    res.status(200).json(newAppointment);
    console.log(
      `DB | Add appointment by owner ID | Appointment for user ${userId} added successfully`
    );
  } catch (e) {
    console.error(
      "DB | Add appointment by owner ID | Error adding appointment by user ID:",
      e
    );
    return res.status(500).json({ error: e.message });
  }
};

const getAppointmentsByVet = async (req, res) => {
  try {
    const userId = req.params.vetId;
    const appointments = await Appointment.find({ vetId: userId });
    res.status(200).json(appointments);
    console.log(
      `DB | Get appointments by vet id | Appointments for vet ${userId} fetched successfully`
    );
  } catch (e) {
    console.error("DB | Get appointments by vet id | Error:", e);
    return res.status(500).json({ error: e.message });
  }
};

export {
  registerPetOwner,
  loginPetOwner,
  updatePetOwnerInfo,
  getPetOwnerDetails,
  registerVeterinarian,
  loginVeterinarian,
  rateVeterinarian,
  getVeterinarians,
  getVeterinarianInfo,
  updateVeterinarianInfo,
  getTipsByVetId,
  getAllTips,
  addTip,
  getTip,
  updateTipInfo,
  deleteTip,
  addPet,
  getPetInfo,
  getPetsByOwnerId,
  updatePetInfo,
  deletePet,
  getAllAppointments,
  deleteAppointment,
  getAppointmentsByOwner,
  addAppointmentsByOwner,
  getAppointmentsByVet,
};
