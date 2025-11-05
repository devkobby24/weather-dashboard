import { Router } from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const router = Router();
const API_KEY = process.env.OPENWEATHER_API_KEY!;

const GEO_URL = "https://api.openweathermap.org/geo/1.0/direct";
const CURRENT_URL = "https://api.openweathermap.org/data/2.5/weather";
const FORECAST_URL = "https://api.openweathermap.org/data/2.5/forecast";

router.get("/:city", async (req, res) => {
  try {
    const { city } = req.params;

    // Convert city name → lat/lon
    const geoResponse = await axios.get(GEO_URL, {
      params: { q: city, limit: 1, appid: API_KEY },
    });

    if (!geoResponse.data?.length) {
      return res.status(404).json({ error: "City not found" });
    }

    const { lat, lon } = geoResponse.data[0];

    // Current weather
    const currentWeather = await axios.get(CURRENT_URL, {
      params: { lat, lon, appid: API_KEY, units: "metric" },
    });

    // 5-day forecast
    const forecast = await axios.get(FORECAST_URL, {
      params: { lat, lon, appid: API_KEY, units: "metric" },
    });

    return res.json({
      city,
      coords: { lat, lon },
      current: currentWeather.data,
      forecast: forecast.data,
    });

  } catch (error: any) {
    return res.status(500).json({
      error: "Failed to fetch weather data",
      details: error.response?.data || error.message,
    });
  }
});

export default router;
