const express = require("express");
const connectToMongo = require("./src/config/connectToMongo");
const cors = require("cors");
const cookieParser = require("cookie-parser"); // Import cookie-parser
const app = express();
const port = process.env.PORT || 5000;

require("dotenv").config();

const v1Routes = require("./src/routes/auth.router.js");
const v2Routes = require("./src/routes/user.router.js");
const project = require("./src/routes/project.router.js");
const review = require("./src/routes/review.route.js");
const jobs = require("./src/routes/job.router.js");
const proposals = require("./src/routes/proposals.js");
const contracts = require("./src/routes/Contract.route.js");
// CORS configuration
const corsOptions = {
  origin: "http://localhost:3000", // Replace this with your frontend's URL in production
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use cookie-parser middleware
app.use(cookieParser()); // Initialize cookie-parser

// Connect to MongoDB
connectToMongo();

// Define routes
app.use("/api", v1Routes);
app.use("/api/user", v2Routes);
app.use("/api/project", project);
app.use("/api/review", review);
app.use("/api/job", jobs);
app.use("/api/proposal", proposals);
app.use("/api/contract", contracts);

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
