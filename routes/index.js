const express = require('express');
const router = express.Router();

// Import versioned route modules
const v1Routes = require('./v1/index');

// API Version routes
router.use('/v1', v1Routes);

// Default route - API information
router.get('/', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Aditya Infrastructure API',
    versions: {
      v1: '/api/v1'
    },
    timestamp: new Date().toISOString()
  });
});

module.exports = router;

