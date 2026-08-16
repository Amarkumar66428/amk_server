const express = require('express');
const router = express.Router();

// Import versioned route modules
const v1Routes = require('./v1/index');
const v2Routes = require('./v2/index');

// API Version routes
router.use('/v1', v1Routes);
router.use('/v2', v2Routes);

// Default route - API information
router.get('/', (req, res) => {
  res.json({ 
    success: true, 
    message: 'AMK API',
    versions: {
      v1: '/api/v1',
      v2: '/api/v2'
    },
    timestamp: new Date().toISOString()
  });
});

module.exports = router;

