const Joi = require("joi");
const Job = require("../models/Job");
const User = require("../models/User");

const jobSchema = Joi.object({
  title: Joi.string().required().messages({
    "string.empty": "Title is required and must be a string.",
  }),
  description: Joi.string().required().messages({
    "string.empty": "Description is required and must be a string.",
  }),
  category: Joi.string().required().messages({
    "string.empty": "Category is required and must be a string.",
  }),
  budget: Joi.number().required().messages({
    "number.base": "Budget is required and must be a number.",
  }),
  connectsRequired: Joi.number().required().messages({
    "number.base": "Connects required is required and must be a number.",
  }),
  skills: Joi.array().items(Joi.string()).optional(),
  paymentType: Joi.string().valid("hourly", "fixed").required().messages({
    "any.only": 'Payment type must be "hourly" or "fixed".',
  }),
  paymentSchedule: Joi.string()
    .valid("upon_completion", "weekly", "monthly")
    .required()
    .messages({
      "any.only":
        'Payment schedule must be "upon_completion", "weekly", or "monthly".',
    }),
  location: Joi.string().optional(),
  privacy: Joi.string().valid("public", "private").required().messages({
    "any.only": 'Privacy must be "public" or "private".',
  }),
});

const add = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user.role === "freelancer") {
      return res
        .status(400)
        .json({ message: "freelancers not allowed to create job" });
    }
    const job = await Job.findOne({
      title: req?.body?.title,
      client: req?.user.id,
    });
    if (job) {
      return res
        .status(404)
        .json({ message: "job already present with same title" });
    }
    const { error } = jobSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const {
      title,
      description,
      category,
      budget,
      connectsRequired,
      skills,
      paymentType,
      paymentSchedule,
      location,
      privacy,
    } = req.body;

    const newJob = new Job({
      client: req.user.id, // Set the client to the authenticated user's ID
      title,
      description,
      category,
      budget,
      connectsRequired,
      skills,
      paymentType,
      paymentSchedule,
      location,
      privacy,
    });

    const savedJob = await newJob.save();
    res.status(201).json({ job: savedJob });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating job", error });
  }
};

const allJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ client: req.user.id });

    res.status(200).json({
      success: true,
      data: jobs,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const editJob = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user.role === "freelancer") {
      return res
        .status(400)
        .json({ message: "freelancers not allowed to create job" });
    }
    console.log("srgr");
    const { jobId } = req.params;
    const updatedData = req.body;
    const { error } = jobSchema.validate(updatedData);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const job = await Job.findByIdAndUpdate(jobId, updatedData, { new: true });

    if (!job) {
      return res.status(404).json({ message: "Job not found." });
    }
    return res.status(200).json({ message: "Job updated successfully.", job });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "An error occurred while editing the job.", error });
  }
};
const cancel = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user.role === "freelancer") {
      return res
        .status(400)
        .json({ message: "Freelancers are not allowed to cancel jobs." });
    }

    const { jobId } = req.params; // Assuming job ID is passed as a URL parameter
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found." });
    }

    if (job.client.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "You are not authorized to cancel this job." });
    }

    const updatedJob = await Job.findByIdAndUpdate(
      jobId,
      { status: req.body.status },
      { new: true }
    );
    return res
      .status(200)
      .json({ message: "Job successfully cancelled.", job: updatedJob });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "An error occurred while cancelling the job." });
  }
};

const deleteJob = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user.role === "freelancer") {
      return res
        .status(400)
        .json({ message: "freelancers not allowed to create job" });
    }
    const { jobId } = req.params; // Assuming job ID is passed as a URL parameter
    const job = await Job.findById(jobId);
    if (job.client.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this job." });
    }
    await Job.findByIdAndDelete(jobId);
    return res
      .status(200)
      .json({ message: "Job deleted successfully.", _id: jobId });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "An error occurred while deleting the job." });
  }
};
const getAllJob = async (req, res) => {
  try {
    const jobs = await Job.find({
      privacy: "public",
      status: { $ne: "closed" },
    });
    if (!jobs) {
      return res.status(404).json({ message: "not jobs not aviales" });
    }

    res.status(200).json({ jobs: jobs });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "An error occurred get jobs  the job." });
  }
};
const addliked = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    // Check if the user is a client
    if (user.role === "client") {
      return res
        .status(400)
        .json({ message: "Clients are not allowed to like jobs" });
    }

    const { jobId } = req.params; // Expect jobId in the request body

    // Validate job ID
    if (!jobId) {
      return res.status(400).json({ message: "Job ID is required" });
    }

    // Find the job
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Check if the job is already liked
    const alreadyLiked = user.likedJobs.includes(jobId);
    const jobLikedByUser = job.likedBy.includes(user._id);

    if (alreadyLiked) {
      // If already liked, remove from user and job
      user.likedJobs = user.likedJobs.filter((id) => id.toString() !== jobId);
      job.likedBy = job.likedBy.filter(
        (id) => id.toString() !== user._id.toString()
      );
      await user.save();
      await job.save();

      const { password, ...userWithoutPassword } = user.toObject();
      return res.status(200).json({
        message: "Job unliked successfully",
        job,
        user: userWithoutPassword,
      });
    } else {
      // If not liked, add to user and job
      user.likedJobs.push(jobId);
      job.likedBy.push(user._id);
      await user.save();
      await job.save();

      // Create a new object without the password
      const { password, ...userWithoutPassword } = user.toObject(); // Use toObject to convert Mongoose document to plain object

      return res.status(200).json({
        message: "Job liked successfully",
        job,
        user: userWithoutPassword,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  add,
  allJobs,
  editJob,
  deleteJob,
  getAllJob,
  addliked,
  cancel,
};
