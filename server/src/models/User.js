const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["client", "freelancer", "admin"],
      required: true,
    },
    firstName: { type: String },
    lastName: { type: String },

    // Freelancer-specific fields
    skills: {
      type: [String],
    },
    experience: {
      type: String,
    },
    hourlyRate: {
      type: Number,
    },

    location: { type: String },
    profilePicture: {
      type: String,
      default: "/avatar-1.png",
    },
    verified: { type: Boolean, default: false },
    bioTitle: { type: String },
    bio: { type: String },
    country: { type: String },
    connects: { type: Number, default: 40 },

    // Reviews
    reviewsGiven: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
    reviewsReceived: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],

    // Liked jobs
    likedJobs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job", // Reference to Job model
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
