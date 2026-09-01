const axios = require("axios");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { successResponse, errorResponse } = require("../utils/response");
const logger = require("../utils/logger");
const config = require("config");
const User = require("../models/user");
const {
  generateToken,
  hashPassword,
  validatePassword,
} = require("../helper/index");

const registerUser = async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    if (!email || !password || !firstName || !lastName) {
      return errorResponse(res, "All fields are required", 400);
    }

    const hashedPassword = await hashPassword(password);

    const user = await User.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      platform: "amko",
      role: "user",
    });
    return successResponse(res, user, "User registered successfully", 201);
  } catch (error) {
    logger.error(error);
    return errorResponse(res, error.message, 400);
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return errorResponse(res, "Email and password are required", 400);
    }

    const user = await User.findOne({ email });
    if (!user) {
      return errorResponse(res, "Invalid credentials", 404);
    }
    if (!validatePassword(password, user.password)) {
      return errorResponse(res, "Invalid credentials", 401);
    }
    const token = generateToken(user._id);
    return successResponse(
      res,
      { user: { email: user.email, _id: user._id }, token },
      "User logged in successfully",
      200,
    );
  } catch (error) {
    logger.error(error);
    return errorResponse(res, error.message, 400);
  }
};

module.exports = {
  registerUser,
  loginUser,
};
