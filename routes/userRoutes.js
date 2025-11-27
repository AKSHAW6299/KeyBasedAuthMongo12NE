import express from "express";
import bcrypt from "bcrypt";
import crypto from "crypto";
import User from "../models/userModel.js";
import { apiKeyAuth } from "../middleware/apiKeyAuth.js";

const router = express.Router();

// RAW API Key Generator
function generateApiKey() {
  return crypto.randomBytes(Number(process.env.API_KEY_BYTES)).toString("hex");
}

// ===============================
// SIGNUP
// ===============================
router.post("/signup", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res.status(400).json({ message: "Username & password required!" });

  const existing = await User.findOne({ username });

  if (existing)
    return res.status(400).json({ message: "Username already exists" });

  const hashedPassword = bcrypt.hashSync(password, 10);

  await User.create({
    username,
    password: hashedPassword,
  });

  res.json({ message: "User registered successfully" });
});

// ===============================
// LOGIN → Generates NEW API KEY
// ===============================
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });

  if (!user) return res.status(404).json({ message: "User not found" });

  if (!bcrypt.compareSync(password, user.password))
    return res.status(403).json({ message: "Invalid password" });

  const rawApiKey = generateApiKey();
  const hashedApiKey = bcrypt.hashSync(rawApiKey, 10);

  user.api_key_hash = hashedApiKey;
  await user.save();

  res.json({
    message: "Login successful",
    apiKey: rawApiKey, // return raw key once
  });
});

// ===============================
// PROTECTED ROUTE
// ===============================
// router.get("/protected", apiKeyAuth, (req, res) => {
//   res.json({
//     message: "Protected data accessed ✔️",
//     user: req.user.username,
//   });
// });
// ===============================


// 1️⃣ Basic profile route
router.get("/profile", apiKeyAuth, (req, res) => {
  res.json({
    message: "Your profile info",
    user: req.user.username,
  });
});

// 2️⃣ Dashboard route
router.get("/dashboard", apiKeyAuth, (req, res) => {
  res.json({
    message: "Dashboard data loaded",
    stats: {
    usage: "12% API usage",
    keyAssigned: true,
    },
  });
});

// 3️⃣ Settings route
router.get("/settings", apiKeyAuth, (req, res) => {
  res.json({
    message: "Settings loaded",
    userSettings: {
      theme: "dark",
      notifications: true,
    },
  });
});

// 4️⃣ Secure Admin-only route (example)
router.get("/admin/data", apiKeyAuth, (req, res) => {
  res.json({
    message: "Admin Data Accessed",
    securityLevel: "High",
  });
});

export default router;
