const mongoose = require("mongoose");

const timelineSchema = new mongoose.Schema(
  {
    status: String,
    location: String,
    date: Date,
  },
  { _id: false }
);

const shipmentSchema = new mongoose.Schema({
  trackingNumber: { type: String, required: true, unique: true },
  status: { type: String, required: true },
  timeline: [timelineSchema],
  estimatedDelivery: Date,

  // Sender Information
  sender: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
  },

  // Recipient Information
  recipient: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    country: { type: String, required: true },
  },

  // Package Details
  package: {
    description: { type: String, required: true },
    weight: { type: Number, required: true },
    quantity: { type: Number, required: true, default: 1 },
    length: { type: Number },
    width: { type: Number },
    height: { type: Number },
    value: { type: Number },
  },

  // Shipment Preferences
  preferences: {
    deliveryType: {
      type: String,
      enum: ["standard", "express", "same-day"],
      default: "standard",
    },
    insurance: { type: Boolean, default: false },
    signatureRequired: { type: Boolean, default: false },
    notifyReceiver: { type: Boolean, default: true },
  },

  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Shipment", shipmentSchema);
