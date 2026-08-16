const User = require("../models/user");
const { errorResponse, successResponse } = require("../utils/response");
const logger = require("../utils/logger");

const getUserProfile = async (req, res) => {
  try {
    const userId = req.user._id; // Assuming you have the user ID in the request object
    const user = await User.findById(userId).select("-password -platform"); // Exclude the password field
    if (!user) {
      return errorResponse(res, "User not found", 404);
    }
    return successResponse(res, user, "User data retrieved successfully", 200);
  } catch (error) {
    logger.error(error);
    return errorResponse(res, error.message, 400);
  }
};

module.exports = {
  getUserProfile,
};
