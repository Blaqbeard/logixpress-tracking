const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  suspended: { type: Boolean, default: false },
  lastActive: { type: Date, default: Date.now },
  resetToken: { type: String },
  resetTokenExpiry: { type: Date },
  // Contact Information
  phone: { type: String },
  address: { type: String },
  // Notification Preferences
  emailNotifications: { type: Boolean, default: true },
  smsNotifications: { type: Boolean, default: false },
  pushNotifications: { type: Boolean, default: true },
  // Shipping Address
  shippingAddress: {
    firstName: { type: String },
    lastName: { type: String },
    street: { type: String },
    city: { type: String },
    state: { type: String },
    zipCode: { type: String },
  },
  createdAt: { type: Date, default: Date.now },
});

// Instance method to check if user is admin
userSchema.methods.isAdmin = function () {
  return this.role === "admin";
};

// Instance method to check if user is suspended
userSchema.methods.isSuspended = function () {
  return this.suspended === true;
};

// Static method to create an admin
userSchema.statics.createAdmin = async function (name, email, password) {
  const existing = await this.findOne({ email });
  if (existing) throw new Error("Admin with this email already exists");
  const bcrypt = require("bcrypt");
  const hashedPassword = await bcrypt.hash(password, 10);
  return this.create({ name, email, password: hashedPassword, role: "admin" });
};

module.exports = mongoose.model("User", userSchema);
