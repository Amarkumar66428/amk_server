const express = require('express');
const router = express.Router();
const authController = require('../../controllers/auth.controller');

/**
 * @route   POST /api/v2/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post("/register", authController.registerUser);

/**
 * @route   POST /api/v2/auth/login
 * @desc    Login a user
 * @access  Public
 */
router.post("/login", authController.loginUser);

module.exports = router;

