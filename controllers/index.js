// Example controller structure
// This file can be used as a reference for creating new controllers

// Example controller function
const exampleController = async (req, res, next) => {
  try {
    // Controller logic here
    res.json({
      success: true,
      message: 'Example controller response'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  exampleController
};

