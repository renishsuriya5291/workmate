const User = require("../models/User");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const register = async (req, res) => {
  const { email, password, firstName, username, lastName, country, role } =
    req.body;

  // Validate using Joi
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    firstName: Joi.string().required(),
    username: Joi.string().required(),
    lastName: Joi.string().required(),
    country: Joi.string().required(),
    role: Joi.string().valid("client", "freelancer", "admin").required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res
      .status(400)
      .send({ success: false, error: error.details[0].message });
  }

  // Check if user already exists
  const emailFromDb = await User.findOne({ email });
  if (emailFromDb) {
    return res
      .status(400)
      .send({ success: false, error: "User Already Exists!" });
  }

  // Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create the user
  const user = await User.create({
    email,
    password: hashedPassword,
    username,
    firstName,
    lastName,
    country,
    role,
  });

  // Send user data without password
  res.status(201).json({
    success: true,
    message: "Registered Successfully!",
    user: {
      id: user._id,
      email: user.email,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      country: user.country,
      role: user.role,
      experience: "",
    },
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  // Validate email and password using Joi
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res
      .status(400)
      .send({ success: false, error: error.details[0].message });
  }

  // Find the user by email
  const user = await User.findOne({ email });
  if (!user) {
    return res
      .status(401)
      .send({ success: false, error: "Invalid Credentials" });
  }

  // Compare passwords
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res
      .status(401)
      .send({ success: false, error: "Invalid Credentials" });
  }

  // Generate JWT token
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  // Send token in an HTTP-only cookie
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Only send cookie over HTTPS
    sameSite: "strict", // Prevent CSRF attacks
    maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie expiration in ms (7 days)
  });

  // Remove password from user object before sending
  const { password: _, ...userWithoutPassword } = user.toObject();

  res.status(200).json({
    success: true,
    message: "Logged in Successfully!",
    user: userWithoutPassword,
  });
};

const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict", // Optional: Use strict sameSite for extra security
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully!",
    });
  } catch (error) {
    console.error("Error during logout:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred during logout.",
    });
  }
};

module.exports = { register, login, logout };
