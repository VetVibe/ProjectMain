import express from "express";
import bodyparser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import { default as router } from "./apiRoutes.js";

const app = express();
const port = 3000;
app.use(cors());

// Set the maximum payload size to 10MB
app.use(bodyparser.json({ limit: "20mb" }));
app.use(bodyparser.urlencoded({ limit: "20mb", extended: true }));

// Connect to MongoDB
mongoose
  .connect("mongodb+srv://vivianu2014:vvvas123@cluster1.6ieglfk.mongodb.net/", {})
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log("Error connecting to MongoDB", error);
  });

app.use(bodyparser.json());
app.use(router);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
