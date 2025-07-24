const express = require("express");
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const shipmentsRoutes = require("./routes/shipments");
const notificationsRoutes = require("./routes/notifications");
const analyticsRoutes = require("./routes/analytics");
const contactRoutes = require("./routes/contact");
const driversRoutes = require("./routes/drivers");

const app = express();
const PORT = process.env.PORT || 5000;

// Replace the default CORS setup with a more secure one
const corsOptions = {
  origin: "https://blaqbeard.github.io/logixpress-tracking",
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json());

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI || "";
if (!MONGO_URI) {
  console.warn(
    "MongoDB URI not set. Please provide your MongoDB connection string in a .env file as MONGO_URI."
  );
}

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use("/api", authRoutes);
app.use("/api/shipments", shipmentsRoutes);
app.use("/api/notifications", notificationsRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api", contactRoutes);
app.use("/api", driversRoutes);

app.get("/api/ping", (req, res) => {
  res.json({ message: "Server is running and CORS is enabled!" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
