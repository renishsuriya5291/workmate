// src/routes/v1/index.js
const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const AuthController = require('../controllers/AuthController');

router.get('/user', UserController.getUser);
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);

module.exports = router;
