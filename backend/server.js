require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads")); // Serve uploaded files

// Connect to MongoDB
mongoose
  .connect("mongodb+srv://priya:DVRUg3UZgxNRVVQR@cluster0.no2rn.mongodb.net/", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

// Define Branch Schema
const branchSchema = new mongoose.Schema({
  branchName: String,
  branchLocation: String,
  branchLogo: String, // Store file path
});
const Branch = mongoose.model("Branch", branchSchema);

// Multer Storage Configuration for File Uploads
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// Create a Branch (POST API)
app.post("/api/createBranch", upload.single("branchLogo"), async (req, res) => {
  try {
    const { branchName, branchLocation } = req.body;
    const branchLogo = req.file ? `/uploads/${req.file.filename}` : null;

    const newBranch = new Branch({ branchName, branchLocation, branchLogo });
    await newBranch.save();
    res.status(201).json({ message: "Branch created successfully", newBranch });
  } catch (error) {
    res.status(500).json({ error: "Error creating branch" });
  }
});

// Get All Branches (GET API)
app.get("/api/getAllBranches", async (req, res) => {
  try {
    const branches = await Branch.find();
    res.status(200).json(branches);
  } catch (error) {
    res.status(500).json({ error: "Error fetching branches" });
  }
});

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
