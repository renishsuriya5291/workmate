const mongoose = require("mongoose");

const ContractSchema = new mongoose.Schema(
  {
    job: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    freelancer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["active", "completed", "terminated", "disputed"],
      default: "active",
    },
    startDate: { type: Date },
    endDate: { type: Date },

    // New fields for tracking work
    milestones: [
      {
        description: { type: String },
        dueDate: { type: Date },
        amount: { type: Number },
        status: {
          type: String,
          enum: ["pending", "completed", "in_review"],
          default: "pending",
        },
      },
    ],
    deliverables: [String],

    messages: [
      {
        sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        content: { type: String },
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },

  { timestamps: true }
);

module.exports = mongoose.model("Contract", ContractSchema);
