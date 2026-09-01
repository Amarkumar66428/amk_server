const express = require('express');
const router = express.Router();
const weatherController = require('../../controllers/weather.controller');

/**
 * @route   GET /api/v1/weather
 * @desc    Get all data required for weather card (current + next 3 days)
 * @access  Public
 * @query   city (string) - City name (e.g., "London" or "New York")
 * @query   lat (number) - Latitude (optional, use with lon)
 * @query   lon (number) - Longitude (optional, use with lat)
 * @query   days (number) - Number of days for forecast (1-5, default: 5)
 * @query   units (string) - Temperature units: metric (Celsius), imperial (Fahrenheit), or kelvin (default: metric)
 * 
 * @example GET /api/v1/weather?city=London&days=5&units=metric
 * @example GET /api/v1/weather?lat=51.5074&lon=-0.1278&days=3&units=metric
 */
router.get('/', weatherController.getCurrentAndForecast);

module.exports = router;

