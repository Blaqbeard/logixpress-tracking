// backend/createAdmin.js
const mongoose = require("mongoose");
const User = require("./models/User");

// Usage: node createAdmin.js "Admin Name" admin@email.com password123
const [, , name, email, password] = process.argv;

if (!name || !email || !password) {
  console.error(
    'Usage: node createAdmin.js "Admin Name" admin@email.com password123'
  );
  process.exit(1);
}

const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/your_db_name";

async function run() {
  await mongoose.connect(MONGO_URI);
  try {
    const admin = await User.createAdmin(name, email, password);
    console.log("Admin created:", admin);
  } catch (err) {
    console.error("Error creating admin:", err.message);
  } finally {
    mongoose.disconnect();
  }
}

run();
