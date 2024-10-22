const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware");
const { getReviews } = require("../controllers/reviewController");

router.get("/", authenticateToken, getReviews);

module.exports = router;
