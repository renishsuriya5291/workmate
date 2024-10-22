const Joi = require("joi");
const Project = require("../models/Project");

const projectValidationSchema = Joi.object({
  title: Joi.string().required().messages({
    "string.empty": "Title is required",
  }),
  description: Joi.string().required().messages({
    "string.empty": "Description is required",
  }),
  image: Joi.string().uri().required().messages({
    "string.uri": "Image must be a valid URL",
  }),
  role: Joi.string().optional(),
  technologies: Joi.array().items(Joi.string()).required().messages({
    "array.base": "Technologies must be an array",
    "array.includesRequiredUnknowns": "Each technology must be a string",
  }),
  liveLink: Joi.string().uri().allow("").optional().messages({
    "string.uri": "Live link must be a valid URL",
  }), // liveLink is optional and must be a valid URL if provided
});

// Controller function for adding a new project
const add = async (req, res) => {
  // Validate the request body
  const { error } = projectValidationSchema.validate(req.body);

  // If validation fails, send a 400 error response
  if (error) {
    return res.status(400).json({
      message: "Validation error",
      details: error.details.map((detail) => detail.message),
    });
  }

  try {
    const { title, description, image, role, technologies, liveLink } =
      req.body;

    // Check if the title already exists in the database
    const existingProject = await Project.findOne({ title });
    if (existingProject) {
      return res.status(400).json({
        message:
          "A project with the same title already exists. Please choose a different title.",
      });
    }

    // Create a new project
    const newProject = new Project({
      title,
      description,
      image,
      role,
      technologies,
      liveLink,
      owner: req.user.id,
    });

    // Save the project to the database
    await newProject.save();

    // Send success response
    res.status(201).json({
      message: "Project created successfully",
      project: newProject,
    });
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(500).json({
      message: "Failed to create project",
      error: error.message,
    });
  }
};

const getProjects = async (req, res) => {
  try {
    // Find all projects related to the user ID
    const projects = await Project.find({ owner: req.user.id });

    // Check if projects were found
    if (!projects || projects.length === 0) {
      return res.status(404).json({
        message: "No projects found for this user.",
      });
    }

    // Send the projects in the response
    res.status(200).json({
      message: "Projects retrieved successfully.",
      projects,
    });
  } catch (error) {
    console.error("Error retrieving projects:", error);
    res.status(500).json({
      message: "Failed to retrieve projects.",
      error: error.message,
    });
  }
};

const update = async (req, res) => {
  const { id } = req.params;
  const { title, ...updatedData } = req.body; // Destructure the title from the request body

  try {
    // Check for another project with the same title, excluding the current project
    const existingProject = await Project.findOne({ title, _id: { $ne: id } });

    if (existingProject) {
      return res
        .status(400)
        .json({ message: "A project with this title already exists." });
    }

    // Proceed with updating the project if no duplicate title is found
    const updatedProject = await Project.findByIdAndUpdate(
      id,
      { ...updatedData, title },
      {
        new: true, // Return the updated document
        runValidators: true, // Ensure validation is applied
      }
    );

    // Check if the project was found and updated
    if (!updatedProject) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Respond with the updated project data
    res.status(200).json({ project: updatedProject });
  } catch (error) {
    // Handle errors (e.g., validation errors)
    console.error(error);
    res
      .status(400)
      .json({ message: "Error updating project", error: error.message });
  }
};

const deleteProject = async (req, res) => {
  const { id } = req.params; // Extract project ID from request parameters

  try {
    // Attempt to delete the project by ID
    const deletedProject = await Project.findByIdAndDelete(id);

    // Check if the project was found and deleted
    if (!deletedProject) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Respond with a success message
    res.status(200).json({
      message: "Project deleted successfully",
      project: deletedProject,
    });
  } catch (error) {
    // Handle errors (e.g., invalid ID format)
    console.error(error);
    res
      .status(400)
      .json({ message: "Error deleting project", error: error.message });
  }
};

module.exports = {
  add,
  getProjects,
  update,
  deleteProject,
};
