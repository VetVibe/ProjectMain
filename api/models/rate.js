import { Schema, Types, model } from "mongoose";

const RateSchema = new Schema({
  vetId: {
    type: Types.ObjectId,
    ref: "Veterinarian",
    required: true,
  },
  petOwnerId: {
    type: Types.ObjectId,
    ref: "Pet Owner",
    required: true,
  },
  rate: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
  },
  content: {
    type: String,
  },
  when: {
    type: Date,
    default: Date.now,
  },
});

const Rate = model("Rate", RateSchema);
export default Rate;
