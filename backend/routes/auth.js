const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const router = express.Router();

// Register route
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Password validation
    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters long." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already registered." });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    // Always set role to 'user' on registration
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: "user",
    });
    await user.save();
    res.status(201).json({ message: "User registered successfully." });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
});

// Login route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    // Check if user is suspended
    if (user.suspended) {
      return res
        .status(403)
        .json({ message: "Account is suspended. Please contact support." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    // Update last active time
    user.lastActive = new Date();
    await user.save();

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role, name: user.name },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "2h" }
    );
    res.json({
      token,
      user: { name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
});

// JWT auth middleware (reuse from above or define if not present)
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

// GET /api/account - get current user profile
router.get("/account", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/account - update profile (name, email)
router.put("/account", auth, async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!name && !email) {
      return res.status(400).json({ message: "Nothing to update." });
    }
    const update = {};
    if (name) update.name = name;
    if (email) update.email = email;
    // Prevent email collision
    if (email) {
      const existing = await User.findOne({ email });
      if (existing && existing._id.toString() !== req.user.userId) {
        return res.status(409).json({ message: "Email already in use." });
      }
    }
    // Never allow role to be updated here
    const user = await User.findByIdAndUpdate(req.user.userId, update, {
      new: true,
      runValidators: true,
    }).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/account/password - change password
router.put("/account/password", auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "Current and new password required." });
    }
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Current password incorrect." });
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ message: "Password updated successfully." });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE /api/account - delete account
router.delete("/account", auth, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.user.userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    // Optionally: delete related data (shipments, messages, notifications)
    res.json({ message: "Account deleted successfully." });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/user/profile - update profile (name, email)
router.put("/user/profile", auth, async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!name && !email) {
      return res.status(400).json({ message: "Nothing to update." });
    }
    const update = {};
    if (name) update.name = name;
    if (email) update.email = email;
    // Prevent email collision
    if (email) {
      const existing = await User.findOne({ email });
      if (existing && existing._id.toString() !== req.user.userId) {
        return res.status(409).json({ message: "Email already in use." });
      }
    }
    const user = await User.findByIdAndUpdate(req.user.userId, update, {
      new: true,
      runValidators: true,
    }).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/user/contact - update contact information
router.put("/user/contact", auth, async (req, res) => {
  try {
    const { phone, address } = req.body;
    const update = {};
    if (phone !== undefined) update.phone = phone;
    if (address !== undefined) update.address = address;

    const user = await User.findByIdAndUpdate(req.user.userId, update, {
      new: true,
      runValidators: true,
    }).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/user/notifications - update notification preferences
router.put("/user/notifications", auth, async (req, res) => {
  try {
    const { emailNotifications, smsNotifications, pushNotifications } =
      req.body;
    const update = {};
    if (emailNotifications !== undefined)
      update.emailNotifications = emailNotifications;
    if (smsNotifications !== undefined)
      update.smsNotifications = smsNotifications;
    if (pushNotifications !== undefined)
      update.pushNotifications = pushNotifications;

    const user = await User.findByIdAndUpdate(req.user.userId, update, {
      new: true,
      runValidators: true,
    }).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/user/shipping - update shipping address
router.put("/user/shipping", auth, async (req, res) => {
  try {
    const { firstName, lastName, street, city, state, zipCode } = req.body;
    const shippingAddress = {};
    if (firstName !== undefined) shippingAddress.firstName = firstName;
    if (lastName !== undefined) shippingAddress.lastName = lastName;
    if (street !== undefined) shippingAddress.street = street;
    if (city !== undefined) shippingAddress.city = city;
    if (state !== undefined) shippingAddress.state = state;
    if (zipCode !== undefined) shippingAddress.zipCode = zipCode;

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { shippingAddress },
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/user/password - change password
router.put("/user/password", auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "Current and new password required." });
    }
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Current password incorrect." });
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ message: "Password updated successfully." });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE /api/user/delete - delete account
router.delete("/user/delete", auth, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.user.userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    // Optionally: delete related data (shipments, messages, notifications)
    res.json({ message: "Account deleted successfully." });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/users - list all users (admin only)
router.get("/users", auth, adminOnly, async (req, res) => {
  try {
    // Only fetch users with role "user", exclude admins
    const users = await User.find({ role: "user" }).select("-password");

    // Get shipment counts for each user
    const Shipment = require("../models/Shipment");
    const usersWithShipmentCounts = await Promise.all(
      users.map(async (user) => {
        const shipmentCount = await Shipment.countDocuments({ user: user._id });
        return {
          ...user.toObject(),
          shipmentCount,
        };
      })
    );

    res.json(usersWithShipmentCounts);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/users - add new user (admin only)
router.post("/users", auth, adminOnly, async (req, res) => {
  try {
    const { name, email, password, role = "user" } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email, and password are required." });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already registered." });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: role === "admin" ? "admin" : "user", // Ensure valid role
    });

    await user.save();

    // Return user without password
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json(userResponse);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/users/:id/activity - get user activity (admin only)
router.get("/users/:id/activity", auth, adminOnly, async (req, res) => {
  try {
    const Shipment = require("../models/Shipment");
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get user's shipments as activity
    const shipments = await Shipment.find({ user: req.params.id })
      .select("trackingNumber status createdAt estimatedDelivery")
      .sort({ createdAt: -1 })
      .limit(20);

    const activity = shipments.map((shipment) => ({
      type: "Shipment",
      description: `Shipment ${shipment.trackingNumber} - ${shipment.status}`,
      date: shipment.createdAt,
      trackingNumber: shipment.trackingNumber,
      status: shipment.status,
      estimatedDelivery: shipment.estimatedDelivery,
    }));

    res.json(activity);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/users/:id - update user (admin only)
router.put("/users/:id", auth, adminOnly, async (req, res) => {
  try {
    const { name, email, role } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: "Name and email are required." });
    }

    // Check if email already exists for different user
    const existingUser = await User.findOne({ email });
    if (existingUser && existingUser._id.toString() !== req.params.id) {
      return res.status(409).json({ message: "Email already in use." });
    }

    const update = { name, email };
    if (role) update.role = role === "admin" ? "admin" : "user";

    const user = await User.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE /api/users/:id - delete a user (admin only)
router.delete("/users/:id", auth, adminOnly, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted successfully." });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/users - admin only: get all users
router.get("/users", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }
    const users = await User.find({}).select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/users/:id/role - admin only: update user role
router.put("/users/:id/role", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }
    const { role } = req.body;
    const targetUser = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select("-password");
    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(targetUser);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/users/:id/suspend - admin only: suspend user
router.put("/users/:id/suspend", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }
    const { suspended } = req.body;
    const targetUser = await User.findByIdAndUpdate(
      req.params.id,
      { suspended },
      { new: true }
    ).select("-password");
    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(targetUser);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/forgot-password - request password reset
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Generate reset token (in production, send email)
    const resetToken =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);
    user.resetToken = resetToken;
    user.resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour
    await user.save();

    res.json({ message: "Password reset link sent to your email." });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
});

// POST /api/reset-password - reset password with token
router.post("/reset-password", async (req, res) => {
  try {
    const { email, token, newPassword } = req.body;
    if (!email || !token || !newPassword) {
      return res.status(400).json({ message: "All fields are required." });
    }

    if (newPassword.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters long." });
    }

    const user = await User.findOne({
      email,
      resetToken: token,
      resetTokenExpiry: { $gt: new Date() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired reset token." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    res.json({ message: "Password reset successfully." });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
});

module.exports = router;
