// Response utility functions for consistent API responses

const successResponse = (res, data, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

const errorResponse = (res, message = 'Error', statusCode = 400) => {
  return res.status(statusCode).json({
    success: false,
    message,
    statusCode
  });
};

module.exports = {
  successResponse,
  errorResponse
};

