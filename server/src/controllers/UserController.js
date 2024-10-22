const jwt = require("jsonwebtoken");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { uploadCloudinary } = require("../utils/cloudniry.js");

const getUser = async (req, res) => {
  try {
    // Extract token from cookies
    const token = req.cookies.token; // Assuming the cookie is named 'token'

    // Check if token exists
    if (!token) {
      return res
        .status(203)
        .json({ success: false, error: "Unauthorized. Please Login First!" });
    }

    // Verify the token and extract the user information
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user by the decoded user ID
    const user = await User.findById(decoded.id); // decoded.id contains the user ID
    if (!user) {
      return res.status(203).json({ success: false, error: "User not found." });
    }

    // Return the user data, excluding the password
    const { password, ...userWithoutPassword } = user.toObject();
    return res.status(200).json({ success: true, user: userWithoutPassword });
  } catch (error) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return res
        .status(403)
        .json({ success: false, error: "Forbidden. Invalid Token!" });
    }

    return res
      .status(500)
      .json({ success: false, error: "Server error. Please try again." });
  }
};

const update = async (req, res) => {
  const {
    firstName,
    lastName,
    location,
    hourlyRate,
    country,
    bio,
    bioTitle,
    skills,
    experience,
  } = req.body;
  console.log(experience);

  try {
    const userId = req.user.id; // Modify as necessary based on your auth setup

    // Find the user
    const user = await User.findById(userId);

    // Check if user exists
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Update the specified fields
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (location) user.location = location;
    if (hourlyRate) user.hourlyRate = hourlyRate;
    if (country) user.country = country;
    if (bio) user.bio = bio;
    if (bioTitle) user.bioTitle = bioTitle;
    if (skills) user.skills = skills;
    if (experience) user.experience = experience;
    // console.log(user.experience);
    // Save the updated user
    const updatedUser = await user.save();

    // Create a response object without the password
    const { password, ...userWithoutPassword } = updatedUser._doc;

    res
      .status(200)
      .json({ msg: "User updated successfully", data: userWithoutPassword });
  } catch (error) {
    console.error("Error updating user:", error); // Logging the error for debugging
    res.status(500).json({ msg: "Internal server error" });
  }
};

module.exports = { getUser, update };
