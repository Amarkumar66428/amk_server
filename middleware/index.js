const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { errorResponse } = require("../utils/response");
// Custom middleware functions

// Example: Authentication middleware
const auth = async (req, res, next) => {
  let token;

  // Check if the authorization header exists and starts with "Bearer"
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Extract the token string
      token = req.headers.authorization.split(" ")[1];

      // Verify the token using your secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find the user by ID from the token payload and attach to the request object
      // We use .select('-password') to ensure we don't attach the password to req.user
      req.user = await User.findById(decoded.id).select("-password");

      next(); // Move on to the actual route handler
    } catch (error) {
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};

// Example: Validation middleware
const validateRequest = (schema) => {
  return (req, res, next) => {
    // Add validation logic here
    next();
  };
};

module.exports = {
  auth,
  validateRequest,
};
