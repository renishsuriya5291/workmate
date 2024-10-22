// const mongoose = require("mongoose");

// const ReviewSchema = new mongoose.Schema(
//   {
//     contract: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Contract",
//       required: true,
//     },
//     reviewer: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     reviewee: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     rating: { type: Number, min: 1, max: 5, required: true },
//     comment: { type: String },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Review", ReviewSchema);

const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema(
  {
    contract: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Contract",
      required: true,
    },
    reviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reviewee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    job: { type: mongoose.Schema.Types.ObjectId, ref: "Job" }, // Link to job being reviewed
    reviewType: {
      type: String,
      enum: ["client_to_freelancer", "freelancer_to_client"],
      required: true,
    },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Review", ReviewSchema);
