// Custom middleware functions

// Example: Authentication middleware
const authenticate = (req, res, next) => {
  // Add authentication logic here
  // const token = req.headers.authorization;
  // if (!token) {
  //   return res.status(401).json({ success: false, message: 'Unauthorized' });
  // }
  next();
};

// Example: Validation middleware
const validateRequest = (schema) => {
  return (req, res, next) => {
    // Add validation logic here
    next();
  };
};

module.exports = {
  authenticate,
  validateRequest
};

