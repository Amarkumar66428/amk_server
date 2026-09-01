const express = require('express');
const router = express.Router();

// Import v1 route modules
const weatherRoutes = require('./weather.routes');
// const authRoutes = require('./auth.routes');
// const userRoutes = require('./user.routes');

// V1 Route definitions
router.use('/weather', weatherRoutes);
// router.use('/auth', authRoutes);
// router.use('/users', userRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'API v1 is healthy',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;

