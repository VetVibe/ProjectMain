// Import the mongoose library
const mongoose = require("mongoose");

const tipSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  vetId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
});

const Tip = mongoose.model("Tip", tipSchema);
module.exports = Tip;
