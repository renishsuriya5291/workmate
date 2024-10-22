const mongoose = require("mongoose");

const ProposalSchema = new mongoose.Schema(
  {
    job: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    freelancer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: { type: Number, required: true }, // proposed payment amount
    description: { type: String, required: true }, // proposal message
    estimatedDuration: { type: String }, // e.g., "1 week", "2 months"
    attachments: [{ type: String }], // URLs to attached files
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
    createdAt: { type: Date, default: Date.now }, // track when the proposal was made
    updatedAt: { type: Date }, // track when the proposal was last updated
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Proposal", ProposalSchema);
