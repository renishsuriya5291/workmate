const Job = require("../models/Job");
const Proposal = require("../models/Proposal");
const Contract = require("../models/Contract"); // Import the Contract model
const moment = require("moment"); // Make sure to install moment.js if you haven't

const addContract = async (req, res) => {
  const { jobId, proposalId } = req.params;

  try {
    // Find the job
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Find the accepted proposal
    const acceptedProposal = await Proposal.findById(proposalId);
    if (!acceptedProposal) {
      return res.status(404).json({ message: "Proposal not found" });
    }

    // Update the job with the freelancer
    job.freelancerAssigned = acceptedProposal.freelancer;
    job.status = "in_progress"; // Update job status if needed
    await job.save();

    // Update the accepted proposal status
    acceptedProposal.status = "accepted";
    await acceptedProposal.save();

    // Delete other proposals for this job
    await Proposal.deleteMany({ job: jobId, _id: { $ne: proposalId } });

    // Set startDate to now
    const startDate = new Date();

    // Calculate endDate based on proposal's estimated duration
    let endDate;
    const duration = acceptedProposal.estimatedDuration; // Assuming this is a field in the proposal

    if (duration) {
      // Extract number and unit from the duration string
      const match = duration.match(/(\d+)\s*(\w+)/);
      if (match) {
        const value = parseInt(match[1], 10);
        const unit = match[2].toLowerCase();

        // Map the unit to moment.js duration formats
        switch (unit) {
          case "week":
          case "weeks":
            endDate = moment(startDate).add(value, "weeks").toDate();
            break;
          case "month":
          case "months":
            endDate = moment(startDate).add(value, "months").toDate();
            break;
          case "year":
          case "years":
            endDate = moment(startDate).add(value, "years").toDate();
            break;
          default:
            return res.status(400).json({ message: "Invalid duration unit" });
        }
      } else {
        return res.status(400).json({ message: "Invalid duration format" });
      }
    } else {
      return res
        .status(400)
        .json({ message: "Estimated duration is required" });
    }

    // Create a new contract
    const newContract = new Contract({
      job: job._id,
      freelancer: acceptedProposal.freelancer,
      client: job.client, // Assuming the job has a client field
      amount: acceptedProposal.amount, // Or any amount logic you have
      startDate,
      endDate,
    });

    await newContract.save();

    return res.status(201).json({
      message: "Contract created",
      contract: newContract,
      job,
      proposal: acceptedProposal,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getAllContracts = async (req, res) => {
  try {
    // Fetch all contracts from the database
    const contracts = await Contract.find()
      .populate("job") // Populate job details if needed
      .populate("freelancer") // Populate freelancer details if needed
      .populate("client"); // Populate client details if needed

    return res.status(200).json({ contracts });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const createMilestone = async (req, res) => {
  const { contractId } = req.params;
  const userId = req.user.id;

  try {
    const contract = await Contract.findById(contractId);
    if (!contract) {
      return res.status(404).json({ message: "Contract not found" });
    }

    if (contract.client.toString() !== userId) {
      return res.status(403).json({
        message:
          "Forbidden: You are not allowed to create a milestone for this contract",
      });
    }

    // Destructure milestone data from the request body
    const { description, dueDate, amount } = req.body;

    // Ensure the new milestone's due date is later than the last milestone's due date
    const lastMilestone = contract.milestones[contract.milestones.length - 1];

    if (lastMilestone && new Date(dueDate) <= new Date(lastMilestone.dueDate)) {
      return res.status(400).json({
        message:
          "The new milestone's due date must be later than the last milestone's due date.",
      });
    }

    // Create the new milestone
    const newMilestone = { description, dueDate, amount };
    contract.milestones.push(newMilestone);

    // Save the contract with the updated milestones
    await contract.save();

    return res.status(201).json({ contract: contract });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "An error occurred while creating the milestone" });
  }
};

module.exports = { addContract, getAllContracts, createMilestone };
