const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["client", "freelancer", "admin"],
    required: true,
  },
  profilePicture: { type: String },
  firstName: { type: String },
  lastName: { type: String },
  skills: [String],
  experience: String,
  rate: { type: Number },
  hourlyRate: { type: Number },
  location: { type: String },
  profilePicture: {
    type: String,
    default: "/avatar-1.png",
  },
  verified: { type: Boolean, default: false },
  tags: [String],
  country: { type: String },
  connects: { type: Number, default: 40 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", UserSchema);
