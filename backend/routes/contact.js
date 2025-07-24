const express = require("express");
const Message = require("../models/Message");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const router = express.Router();

// JWT auth middleware
function auth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secretkey");
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
}

// Admin check middleware
async function adminOnly(req, res, next) {
  const user = await User.findById(req.user.userId);
  if (!user || user.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
}

// POST /api/contact - submit a support message
router.post("/contact", auth, async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ message: "All fields are required." });
    }
    const msg = new Message({ name, email, message });
    await msg.save();
    res.status(201).json({ message: "Support message submitted." });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
});

// POST /api/support - submit a support message from dashboard
router.post("/support", auth, async (req, res) => {
  try {
    const { subject, message } = req.body;
    if (!subject || !message) {
      return res
        .status(400)
        .json({ message: "Subject and message are required." });
    }

    // Get user info from token
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const msg = new Message({
      name: user.name,
      email: user.email,
      message: `Subject: ${subject}\n\n${message}`,
    });
    await msg.save();
    res.status(201).json({ message: "Support message submitted." });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
});

// POST /api/support - submit a support message (alternative endpoint)
router.post("/support", auth, async (req, res) => {
  try {
    const { subject, message } = req.body;
    if (!subject || !message) {
      return res
        .status(400)
        .json({ message: "Subject and message are required." });
    }
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    const msg = new Message({
      name: user.name,
      email: user.email,
      message: `Subject: ${subject}\n\nMessage: ${message}`,
    });
    await msg.save();
    res.status(201).json({ message: "Support message submitted." });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
});

// GET /api/contact - admin: get all support messages
router.get("/contact", auth, adminOnly, async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
});

// GET /api/logs - admin only: get system logs
router.get("/logs", auth, adminOnly, async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 }).limit(50);
    const logs = messages.map((msg) => ({
      id: msg._id,
      type: "support_message",
      action: "Message submitted",
      user: msg.name,
      details: msg.message.substring(0, 100) + "...",
      timestamp: msg.createdAt,
      ip: "N/A",
    }));
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
});

module.exports = router;
