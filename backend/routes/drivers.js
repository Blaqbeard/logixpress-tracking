const express = require("express");
const Driver = require("../models/Driver");
const Shipment = require("../models/Shipment");
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
  const User = require("../models/User");
  const user = await User.findById(req.user.userId);
  if (!user || user.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
}

// GET /api/drivers - list all drivers (admin only)
router.get("/drivers", auth, adminOnly, async (req, res) => {
  try {
    const drivers = await Driver.find({ isActive: true });

    // Get shipment counts and details for each driver
    const driversWithAssignments = await Promise.all(
      drivers.map(async (driver) => {
        const assignedShipments = await Shipment.find({
          trackingNumber: { $in: driver.assignedShipments },
        }).select("trackingNumber status recipient.address estimatedDelivery");

        return {
          ...driver.toObject(),
          assignedShipments: assignedShipments,
          assignmentCount: assignedShipments.length,
        };
      })
    );

    res.json(driversWithAssignments);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/drivers - add new driver (admin only)
router.post("/drivers", auth, adminOnly, async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      vehicle,
      workingDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      workingHours = { start: "08:00", end: "18:00" },
    } = req.body;

    if (!name || !email || !phone || !vehicle) {
      return res.status(400).json({
        message: "Name, email, phone, and vehicle information are required.",
      });
    }

    // Check if email already exists
    const existingDriver = await Driver.findOne({ email });
    if (existingDriver) {
      return res.status(409).json({ message: "Email already registered." });
    }

    // Check if vehicle plate number already exists
    const existingVehicle = await Driver.findOne({
      "vehicle.plateNumber": vehicle.plateNumber,
    });
    if (existingVehicle) {
      return res
        .status(409)
        .json({ message: "Vehicle plate number already registered." });
    }

    const driver = new Driver({
      name,
      email,
      phone,
      vehicle,
      availability: {
        workingDays,
        workingHours,
      },
    });

    await driver.save();

    res.status(201).json(driver);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/drivers/:id - update driver (admin only)
router.put("/drivers/:id", auth, adminOnly, async (req, res) => {
  try {
    const { name, email, phone, vehicle, availability } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({
        message: "Name, email, and phone are required.",
      });
    }

    // Check if email already exists for different driver
    const existingDriver = await Driver.findOne({ email });
    if (existingDriver && existingDriver._id.toString() !== req.params.id) {
      return res.status(409).json({ message: "Email already in use." });
    }

    // Check if vehicle plate number already exists for different driver
    if (vehicle && vehicle.plateNumber) {
      const existingVehicle = await Driver.findOne({
        "vehicle.plateNumber": vehicle.plateNumber,
      });
      if (existingVehicle && existingVehicle._id.toString() !== req.params.id) {
        return res
          .status(409)
          .json({ message: "Vehicle plate number already in use." });
      }
    }

    const update = { name, email, phone };
    if (vehicle) update.vehicle = vehicle;
    if (availability) update.availability = availability;

    const driver = await Driver.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    });

    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }

    res.json(driver);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/drivers/:id/status - update driver status (admin only)
router.put("/drivers/:id/status", auth, adminOnly, async (req, res) => {
  try {
    const { status, location } = req.body;

    if (!status || !["online", "offline", "busy"].includes(status)) {
      return res.status(400).json({
        message: "Valid status (online, offline, busy) is required.",
      });
    }

    const update = { status };
    if (location) update.location = location;

    const driver = await Driver.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    });

    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }

    res.json(driver);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/drivers/:id/assignments - get driver assignments (admin only)
router.get("/drivers/:id/assignments", auth, adminOnly, async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id);
    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }

    const assignments = await Shipment.find({
      trackingNumber: { $in: driver.assignedShipments },
    }).select(
      "trackingNumber status sender recipient package estimatedDelivery createdAt"
    );

    res.json(assignments);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/drivers/:id/assign - assign shipment to driver (admin only)
router.post("/drivers/:id/assign", auth, adminOnly, async (req, res) => {
  try {
    const { trackingNumber } = req.body;

    if (!trackingNumber) {
      return res.status(400).json({ message: "Tracking number is required." });
    }

    // Check if shipment exists
    const shipment = await Shipment.findOne({ trackingNumber });
    if (!shipment) {
      return res.status(404).json({ message: "Shipment not found" });
    }

    // Check if driver exists
    const driver = await Driver.findById(req.params.id);
    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }

    // Add shipment to driver's assignments if not already assigned
    if (!driver.assignedShipments.includes(trackingNumber)) {
      driver.assignedShipments.push(trackingNumber);
      await driver.save();
    }

    res.json({ message: "Shipment assigned successfully", driver });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE /api/drivers/:id/assign/:trackingNumber - unassign shipment from driver (admin only)
router.delete(
  "/drivers/:id/assign/:trackingNumber",
  auth,
  adminOnly,
  async (req, res) => {
    try {
      const driver = await Driver.findById(req.params.id);
      if (!driver) {
        return res.status(404).json({ message: "Driver not found" });
      }

      // Remove shipment from driver's assignments
      driver.assignedShipments = driver.assignedShipments.filter(
        (tn) => tn !== req.params.trackingNumber
      );
      await driver.save();

      res.json({ message: "Shipment unassigned successfully", driver });
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

// DELETE /api/drivers/:id - delete driver (admin only)
router.delete("/drivers/:id", auth, adminOnly, async (req, res) => {
  try {
    const driver = await Driver.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }

    res.json({ message: "Driver deactivated successfully." });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
