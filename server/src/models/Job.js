const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema(
  {
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true }, // made required for better filtering
    budget: { type: Number, required: true }, // making budget required
    connectsRequired: { type: Number, required: true },

    // Skills required for the job
    skills: [{ type: String }],

    // Freelancer assigned to this job
    freelancerAssigned: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    status: {
      type: String,
      enum: ["open", "in_progress", "closed"],
      default: "open",
    },

    //liked by freelancers
    likedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Reference to User model
      },
    ],

    // Payment terms
    paymentType: {
      type: String,
      enum: ["hourly", "fixed"],
      default: "fixed",
    },
    paymentSchedule: {
      type: String,
      enum: ["upon_completion", "weekly", "monthly"],
      default: "upon_completion",
    },

    // Additional information
    location: { type: String }, // optional, for remote or local jobs
    privacy: {
      type: String,
      enum: ["public", "private"],
      default: "public",
    },
  },
  { timestamps: true }
);

JobSchema.pre("remove", async function (next) {
  const Job = this.model("Job");
  const Proposal = mongoose.model("Proposal"); // Assuming you have a Proposal model
  const User = mongoose.model("User");
  try {
    // Delete proposals related to the job being removed
    await Proposal.deleteMany({ job: this._id });
    await User.updateMany(
      { likedBy: this._id },
      { $pull: { likedBy: this._id } }
    );
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model("Job", JobSchema);
