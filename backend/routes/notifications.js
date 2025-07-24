const express = require("express");
const Notification = require("../models/Notification");
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

// GET /api/notifications - get all notifications for logged-in user
router.get("/", auth, async (req, res) => {
  try {
    const notifications = await Notification.find({
      user: req.user.userId,
    }).sort({ date: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/notifications/all - admin only: get all notifications with user info
router.get("/all", auth, async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden: Admins only" });
    }
    const notifications = await Notification.find({})
      .sort({ date: -1 })
      .populate("user", "name email");
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/notifications - create a new notification
router.post("/", auth, async (req, res) => {
  try {
    let { title, message, type, createdAt } = req.body;
    if (!title) title = "Notification";
    if (!type) type = "info";
    if (!createdAt) createdAt = new Date();
    if (!message) {
      return res
        .status(400)
        .json({ message: "Title and message are required" });
    }

    const notification = new Notification({
      user: req.user.userId,
      title,
      message,
      type,
      createdAt,
      date: createdAt,
    });

    await notification.save();
    res.status(201).json(notification);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
