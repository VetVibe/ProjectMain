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
});

const Rate = model("Rate", RateSchema);
export default Rate;
