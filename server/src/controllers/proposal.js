const Proposal = require("../models/Proposal");
const User = require("../models/User");
const Job = require("../models/Job");
const createProposal = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { amount, description, estimatedDuration, attachments } = req.body;

    // Validate input
    if (!description || !estimatedDuration) {
      return res.status(400).json({ error: "All fields are required." });
    }

    // Validate estimated duration format (1-4 weeks or months)
    const durationRegex = /^(1|2|3|4)\s*(week|month)(s)?$/i;
    if (!durationRegex.test(estimatedDuration)) {
      return res.status(400).json({
        error: "Estimated duration must be between 1-4 weeks or months.",
      });
    }

    // Check if the freelancer has already submitted a proposal for this job
    const existingProposal = await Proposal.findOne({
      job: jobId,
      freelancer: req.user.id,
    });
    if (existingProposal) {
      return res
        .status(400)
        .json({ error: "You have already submitted a proposal for this job." });
    }

    // Create the new proposal
    const newProposal = await Proposal.create({
      job: jobId,
      freelancer: req.user.id,
      amount,
      attachments, // Ensure attachments are included
      description,
      estimatedDuration,
      createdAt: new Date(),
    });

    return res.status(200).json(newProposal);
  } catch (error) {
    console.error("Error creating proposal:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};
const getAll = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    // console.log(user);
    if (user.role === "freelancer") {
      const proposals = await Proposal.find({
        freelancer: req.user.id,
      }); // Populate freelancer details

      return res.status(200).json(proposals);
    } else if (user.role === "client") {
      // Fetch jobs associated with the client
      const jobs = await Job.find({ client: req.user.id });
      if (!jobs || jobs.length === 0) {
        return res.status(404).json({ message: "No jobs found" });
      }

      // Fetch proposals for those jobs and populate freelancer details
      const jobIds = jobs.map((job) => job._id);
      const proposals = await Proposal.find({ job: { $in: jobIds } }).populate(
        "freelancer",
        "username experience profilePicture"
      );

      return res.status(200).json(proposals);
    } else {
      return res.status(403).json({ message: "Unauthorized role" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server Error" });
  }
};

const update = async (req, res) => {
  try {
    const { jobId, proId } = req.params;

    const { amount } = req.body;

    if (amount < 0)
      return res.status(404).json({ message: "Enter valid number" });

    const updatedProposal = await Proposal.findByIdAndUpdate(
      proId,
      { amount },
      { new: true }
    );

    if (!updatedProposal) {
      return res.status(404).json({ message: "Proposal not found" });
    }

    return res.status(200).json(updatedProposal);
  } catch (error) {
    console.error("Error updating proposal:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const deletePro = async (req, res) => {
  try {
    const { proId } = req.params; // Extract proposal ID from request parameters

    // Attempt to find and delete the proposal
    const deletedProposal = await Proposal.findByIdAndDelete(proId);

    // Check if a proposal was found and deleted
    if (!deletedProposal) {
      return res.status(404).json({ message: "Proposal not found." });
    }

    // Send a success response
    res
      .status(200)
      .json({ message: "Proposal deleted successfully.", deletedProposal });
  } catch (error) {
    // Handle errors
    console.error("Error deleting proposal:", error);
    res
      .status(500)
      .json({ message: "An error occurred while deleting the proposal." });
  }
};

// Search endpoint
const query = async (req, res) => {
  const searchQuery = req.query.search || "";
  const { jobId } = req.params;

  try {
    // Find users matching the username or experience
    const users = await User.find({
      $or: [
        { username: { $regex: searchQuery, $options: "i" } },
        { experience: { $regex: searchQuery, $options: "i" } },
      ],
    });

    // If no users are found, return an empty array or appropriate message

    // Extract user IDs from the found users
    const userIds = users.map((user) => user._id);

    // Find proposals associated with the found users
    const proposals = await Proposal.find({
      freelancer: { $in: userIds },
      job: jobId,
      $or: [
        { title: { $regex: searchQuery, $options: "i" } },
        { description: { $regex: searchQuery, $options: "i" } },
      ],
    }).populate("freelancer", "username experience profilePicture");
    res.status(200).json(proposals);
  } catch (error) {
    console.error("Error fetching proposals:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { createProposal, getAll, update, deletePro, query };
