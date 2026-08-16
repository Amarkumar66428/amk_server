const express = require('express');
const router = express.Router();
const { auth } = require('../../middleware');
const userController = require('../../controllers/user.controller');

/**
 * @route   GET /api/v2/user/profile
 * @desc    Get user profile
 * @access  Private
 */
router.get("/profile",auth, userController.getUserProfile);

module.exports = router;

