const express = require('express');
const router = express.Router();

// Import v2 route modules
const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const toolsRoutes = require('./tools.routes');

// V2 Route definitions
router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/tools', toolsRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'API v2 is healthy',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;

