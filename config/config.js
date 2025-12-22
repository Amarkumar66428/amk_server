// Application configuration

module.exports = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  apiVersion: 'v1',
  
  
  // Add more configuration as needed
  // jwtSecret: process.env.JWT_SECRET,
  // dbConfig: {
  //   host: process.env.DB_HOST,
  //   port: process.env.DB_PORT,
  //   name: process.env.DB_NAME
  // }
};

