const express = require("express");
const Shipment = require("../models/Shipment");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const notificationService = require("../services/notificationService");

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
  const User = require("../models/User");
  const user = await User.findById(req.user.userId);
  if (!user || user.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
}

// GET /api/shipments - get all shipments for logged-in user
router.get("/", auth, async (req, res) => {
  try {
    // Find shipments for this user
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    const shipments = await Shipment.find({ user: user._id });
    res.json(shipments);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/shipments - create a new shipment
router.post("/", auth, async (req, res) => {
  try {
    const {
      trackingNumber,
      sender,
      recipient,
      package: packageDetails,
      preferences,
      status,
      estimatedDelivery,
    } = req.body;

    // Validate required fields
    if (!trackingNumber || !sender || !recipient || !packageDetails) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Check if tracking number already exists
    const existingShipment = await Shipment.findOne({ trackingNumber });
    if (existingShipment) {
      return res
        .status(409)
        .json({ message: "Tracking number already exists" });
    }

    // Create new shipment
    const shipment = new Shipment({
      trackingNumber,
      sender,
      recipient,
      package: packageDetails,
      preferences,
      status: status || "Pending Pickup",
      estimatedDelivery,
      user: req.user.userId,
    });

    await shipment.save();

    // Send real-time alerts to sender
    try {
      const alertResults = await notificationService.sendShipmentCreationAlert({
        sender: shipment.sender,
        recipient: shipment.recipient,
        trackingNumber: shipment.trackingNumber,
        package: shipment.package,
        preferences: shipment.preferences,
      });
      console.log("Alert results:", alertResults);
    } catch (alertError) {
      console.error("Failed to send alerts:", alertError);
      // Don't fail the shipment creation if alerts fail
    }

    // Create notification for the shipment creator
    const Notification = require("../models/Notification");
    await Notification.create({
      user: shipment.user,
      title: "Shipment Created",
      message: `Your shipment ${shipment.trackingNumber} has been created and is pending pickup.`,
      type: "success",
      createdAt: new Date(),
      read: false,
    });

    // Create notification for all admins
    const User = require("../models/User");
    const shipmentUser = await User.findById(shipment.user);
    const shipmentUserName =
      shipmentUser?.name || shipmentUser?.email || shipment.user;
    const admins = await User.find({ role: "admin" });
    for (const admin of admins) {
      await Notification.create({
        user: admin._id,
        title: "New Shipment Created",
        message: `A new shipment (${shipment.trackingNumber}) was created by user ${shipmentUserName}.`,
        type: "info",
        createdAt: new Date(),
        read: false,
      });
    }

    res.status(201).json(shipment);
  } catch (err) {
    console.error("Shipment creation error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/track - get a shipment by tracking number for the logged-in user
router.post("/track", auth, async (req, res) => {
  try {
    const { trackingNumber } = req.body;
    if (!trackingNumber)
      return res.status(400).json({ message: "Tracking number required" });
    const shipment = await Shipment.findOne({
      trackingNumber,
      user: req.user.userId,
    });
    if (!shipment)
      return res.status(404).json({ message: "Shipment not found" });
    res.json(shipment);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/shipments/all - get all shipments (admin only)
router.get("/all", auth, adminOnly, async (req, res) => {
  try {
    const shipments = await Shipment.find().populate("user", "name email role");
    res.json(shipments);
  } catch (err) {
    console.error("Error fetching admin shipments:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/shipments/:trackingNumber/status - update shipment status (admin only)
router.put("/:trackingNumber/status", auth, adminOnly, async (req, res) => {
  try {
    const { trackingNumber } = req.params;
    const { status } = req.body;

    console.log("Admin status update request:", { trackingNumber, status }); // Debug

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    // For admin status updates, find shipment by tracking number only (not restricted to admin's shipments)
    const shipment = await Shipment.findOne({
      trackingNumber,
    });

    if (!shipment) {
      console.log("Shipment not found:", trackingNumber); // Debug
      return res.status(404).json({ message: "Shipment not found" });
    }

    console.log(
      "Found shipment:",
      shipment.trackingNumber,
      "Current status:",
      shipment.status
    ); // Debug

    // Update status immediately
    shipment.status = status;
    await shipment.save();

    console.log(
      "Status updated successfully:",
      shipment.trackingNumber,
      "New status:",
      shipment.status
    ); // Debug

    // Send response immediately for faster UX
    res.json({ success: true, shipment });

    // Handle notifications asynchronously (don't block the response)
    setImmediate(async () => {
      try {
        // Create a notification for the user
        const Notification = require("../models/Notification");
        await Notification.create({
          user: shipment.user,
          title: "Shipment Status Update",
          message: `Your shipment ${shipment.trackingNumber} status changed to ${status}.`,
          type: "info",
          date: new Date(),
          createdAt: new Date(),
          read: false,
        });

        // Send appropriate notifications based on status
        let alertResults = null;

        if (status === "In Transit") {
          alertResults = await notificationService.sendPickupNotification({
            sender: shipment.sender,
            trackingNumber: shipment.trackingNumber,
          });
        } else if (status === "Delivered") {
          alertResults = await notificationService.sendDeliveryNotification({
            sender: shipment.sender,
            trackingNumber: shipment.trackingNumber,
          });
        }

        if (alertResults) {
          console.log("Status update alert results:", alertResults);
        }
      } catch (alertError) {
        console.error("Failed to send status update alerts:", alertError);
      }
    });
  } catch (err) {
    console.error("Status update error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
