import { Schema, Types, model } from "mongoose";

const tipSchema = new Schema({
  content: {
    type: String,
    required: true,
  },
  vetId: {
    type: Types.ObjectId,
    ref: "Veterinarian",
    required: true,
  },
});

const Tip = model("Tip", tipSchema);
export default Tip;
