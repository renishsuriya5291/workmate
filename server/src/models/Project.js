const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      index: true, // Create an index for the title field
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String, // URL to the project's image
      match: /^(ftp|http|https):\/\/[^ "]+$/, // Basic URL validation (optional)
    },
    role: {
      type: String,
    },
    technologies: {
      type: [String], // Array of technologies used in the project
      required: true,
    },
    liveLink: {
      type: String, // URL to the live demo of the project
      match: /^(ftp|http|https):\/\/[^ "]+$/, // Basic URL validation (optional)
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId, // Reference to the User model
      ref: "User", // The model to which the ObjectId refers
      required: true, // Optional: Make it required if every project must have an owner
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

const Project = mongoose.model("Project", ProjectSchema);

module.exports = Project;
