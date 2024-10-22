const AuthController = require("../controllers/AuthController");
const authenticateToken = require("../middleware");
const express = require("express");
const router = express.Router();
router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.delete("/logout", authenticateToken, AuthController.logout);
module.exports = router;
