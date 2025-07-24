const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ["Motorcycle", "Car", "Van", "Truck"],
    },
    plateNumber: { type: String, required: true, unique: true },
    capacity: { type: String, required: true },
    model: { type: String },
    year: { type: Number },
  },
  { _id: false }
);

const locationSchema = new mongoose.Schema(
  {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    address: { type: String, required: true },
  },
  { _id: false }
);

const driverSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  vehicle: { type: vehicleSchema, required: true },
  status: {
    type: String,
    required: true,
    enum: ["online", "offline", "busy"],
    default: "offline",
  },
  location: { type: locationSchema },
  assignedShipments: [{ type: String }], // Array of tracking numbers
  currentRoute: {
    startLocation: { type: locationSchema },
    endLocation: { type: locationSchema },
    waypoints: [{ type: locationSchema }],
    estimatedDuration: { type: Number }, // in minutes
    estimatedDistance: { type: Number }, // in kilometers
  },
  performance: {
    totalDeliveries: { type: Number, default: 0 },
    successfulDeliveries: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 },
    totalEarnings: { type: Number, default: 0 },
  },
  availability: {
    workingHours: {
      start: { type: String, default: "08:00" },
      end: { type: String, default: "18:00" },
    },
    workingDays: [
      {
        type: String,
        enum: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
      },
    ],
  },
  createdAt: { type: Date, default: Date.now },
  lastActive: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },
});

// Update lastActive when status changes
driverSchema.pre("save", function (next) {
  if (this.isModified("status")) {
    this.lastActive = new Date();
  }
  next();
});

module.exports = mongoose.model("Driver", driverSchema);
