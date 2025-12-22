const axios = require('axios');
const { successResponse, errorResponse } = require('../utils/response');
const logger = require('../utils/logger');

const WEATHER_API_BASE_URL = 'https://api.openweathermap.org/data/2.5';
const API_KEY = process.env.OPENWEATHER_API_KEY || '8108cad92f19dfc4eaba58c0a6a01aaa';

/**
 * Get both current weather and forecast in one request
 */
const getCurrentAndForecast = async (req, res, next) => {
  try {
    const { city, lat, lon, days = 5, units = 'metric' } = req.query;

    if (!API_KEY) {
      return errorResponse(res, 'OpenWeatherMap API key is not configured', 500);
    }

    // Fetch both current weather and forecast in parallel
    const [currentResponse, forecastResponse] = await Promise.all([
      getCurrentWeatherData(city, lat, lon, units),
      getForecastData(city, lat, lon, days, units)
    ]);

    const unitLabel = units === 'metric' ? 'Celsius' : units === 'imperial' ? 'Fahrenheit' : 'Kelvin';
    const unitSymbol = unitLabel === 'Celsius' ? '°C' : unitLabel === 'Fahrenheit' ? '°F' : 'K';

    // Build a compact \"card\" view suitable for dashboards / widgets
    const now = currentResponse.current.timestamp
      ? new Date(currentResponse.current.timestamp)
      : new Date();

    const dailyForecasts = forecastResponse.forecast?.dailyForecasts || [];

    const upcomingDaysForCard = dailyForecasts.slice(0, 3).map((dayData) => {
      const dateObj = new Date(dayData.date);
      return {
        label: formatDateLabel(dateObj),
        temperature: `${Math.round(Number(dayData.summary.maxTemp))}${unitSymbol}`
      };
    });

    // Final card-style payload matching UI needs
    const cardData = {
      location: {
        city: currentResponse.location.city,
        country: currentResponse.location.country
      },
      current: {
        condition: currentResponse.current.weather.main,
        description: currentResponse.current.weather.description,
        dateLabel: formatDateLabel(now), // e.g. \"Monday, 4th May\"
        temperature: `${Math.round(currentResponse.current.temperature)}${unitSymbol}`
      },
      upcoming: upcomingDaysForCard
    };

    return successResponse(res, cardData, 'Weather card data retrieved successfully');
  } catch (error) {
    console.log('error: ', error);
    logger.error('Error fetching current weather and forecast', error);
    next(error);
  }
};

// Helper function to get current weather data
const getCurrentWeatherData = async (city, lat, lon, units) => {
  let url = `${WEATHER_API_BASE_URL}/weather?appid=${API_KEY}&units=${units}`;
  
  if (city) {
    url += `&q=${encodeURIComponent(city)}`;
  } else if (lat && lon) {
    url += `&lat=${lat}&lon=${lon}`;
  } else {
    throw new Error('Please provide either city name or latitude and longitude');
  }

  const response = await axios.get(url);
  const weatherData = response.data;

  return {
    location: {
      city: weatherData.name,
      country: weatherData.sys.country,
      coordinates: {
        latitude: weatherData.coord.lat,
        longitude: weatherData.coord.lon
      }
    },
    current: {
      temperature: weatherData.main.temp,
      feelsLike: weatherData.main.feels_like,
      humidity: weatherData.main.humidity,
      pressure: weatherData.main.pressure,
      visibility: weatherData.visibility ? weatherData.visibility / 1000 : null,
      wind: {
        speed: weatherData.wind?.speed || 0,
        direction: weatherData.wind?.deg || null,
        gust: weatherData.wind?.gust || null
      },
      weather: {
        main: weatherData.weather[0].main,
        description: weatherData.weather[0].description,
        icon: weatherData.weather[0].icon,
        iconUrl: `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`
      },
      clouds: weatherData.clouds?.all || 0,
      sunrise: new Date(weatherData.sys.sunrise * 1000).toISOString(),
      sunset: new Date(weatherData.sys.sunset * 1000).toISOString(),
      timestamp: new Date(weatherData.dt * 1000).toISOString()
    }
  };
};

// Helper function to get forecast data
const getForecastData = async (city, lat, lon, days, units) => {
  const forecastDays = Math.min(Math.max(parseInt(days) || 5, 1), 5);
  let url = `${WEATHER_API_BASE_URL}/forecast?appid=${API_KEY}&units=${units}&cnt=${forecastDays * 8}`;

  if (city) {
    url += `&q=${encodeURIComponent(city)}`;
  } else if (lat && lon) {
    url += `&lat=${lat}&lon=${lon}`;
  } else {
    throw new Error('Please provide either city name or latitude and longitude');
  }

  const response = await axios.get(url);
  const forecastData = response.data;

  const forecastsByDate = {};
  forecastData.list.forEach(item => {
    const date = new Date(item.dt * 1000).toISOString().split('T')[0];
    
    if (!forecastsByDate[date]) {
      forecastsByDate[date] = {
        date: date,
        forecasts: []
      };
    }

    forecastsByDate[date].forecasts.push({
      time: new Date(item.dt * 1000).toISOString(),
      temperature: item.main.temp,
      feelsLike: item.main.feels_like,
      humidity: item.main.humidity,
      pressure: item.main.pressure,
      wind: {
        speed: item.wind?.speed || 0,
        direction: item.wind?.deg || null,
        gust: item.wind?.gust || null
      },
      weather: {
        main: item.weather[0].main,
        description: item.weather[0].description,
        icon: item.weather[0].icon,
        iconUrl: `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`
      },
      clouds: item.clouds?.all || 0,
      visibility: item.visibility ? item.visibility / 1000 : null,
      precipitation: {
        probability: item.pop * 100,
        rain: item.rain?.['3h'] || 0,
        snow: item.snow?.['3h'] || 0
      }
    });
  });

  const dailyForecasts = Object.values(forecastsByDate).map(dayData => {
    const temps = dayData.forecasts.map(f => f.temperature);
    const humidities = dayData.forecasts.map(f => f.humidity);
    const pressures = dayData.forecasts.map(f => f.pressure);
    
    return {
      date: dayData.date,
      summary: {
        minTemp: Math.min(...temps),
        maxTemp: Math.max(...temps),
        avgTemp: (temps.reduce((a, b) => a + b, 0) / temps.length).toFixed(2),
        avgHumidity: (humidities.reduce((a, b) => a + b, 0) / humidities.length).toFixed(2),
        avgPressure: (pressures.reduce((a, b) => a + b, 0) / pressures.length).toFixed(2),
        dominantWeather: getDominantWeather(dayData.forecasts)
      },
      hourlyForecasts: dayData.forecasts
    };
  });

  return {
    forecast: {
      days: forecastDays,
      dailyForecasts: dailyForecasts,
      totalForecasts: forecastData.list.length
    }
  };
};

// Helper function to determine dominant weather condition for a day
const getDominantWeather = (forecasts) => {
  const weatherCounts = {};
  forecasts.forEach(f => {
    const main = f.weather.main;
    weatherCounts[main] = (weatherCounts[main] || 0) + 1;
  });
  
  const dominant = Object.keys(weatherCounts).reduce((a, b) => 
    weatherCounts[a] > weatherCounts[b] ? a : b
  );
  
  const dominantForecast = forecasts.find(f => f.weather.main === dominant);
  return dominantForecast.weather;
};

// Helper: format date like \"Monday, 4th May\"
const formatDateLabel = (date) => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayName = days[date.getDay()];
  const dayOfMonth = date.getDate();
  const monthName = months[date.getMonth()];

  return `${dayName}, ${dayOfMonth}${getOrdinalSuffix(dayOfMonth)} ${monthName}`;
};

// Helper: ordinal suffix for day numbers (1st, 2nd, 3rd, 4th, ...)
const getOrdinalSuffix = (day) => {
  if (day > 3 && day < 21) return 'th';
  switch (day % 10) {
    case 1: return 'st';
    case 2: return 'nd';
    case 3: return 'rd';
    default: return 'th';
  }
};

module.exports = {
  // Single public API handler that returns card-style weather data
  getCurrentAndForecast
};

