// config/config.js

module.exports = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || "development",
  apiVersion: "v1",
  mongoURI: process.env.MONGODB_URI || "mongodb://mongodb-service:27017/amk",
};