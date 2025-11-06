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

    // console.log(geoResponse.data);

    const { lat, lon } = geoResponse.data[0];

    // Current weather
    const currentWeather = await axios.get(CURRENT_URL, {
      params: { lat, lon, appid: API_KEY, units: "metric" },
    });

    // 5-day forecast
    const forecast = await axios.get(FORECAST_URL, {
      params: { lat, lon, appid: API_KEY, units: "metric" },
    });

    interface ForecastItem {
      time: string;
      temp: number;
      description: string;
    }

    interface WeatherResult {
      city: string;
      temperature: number;
      weather: string;
      forecast: ForecastItem[];
    }

    interface CurrentWeatherData {
      name: string;
      main: {
      temp: number;
      };
      weather: Array<{
      description: string;
      }>;
    }

    interface ForecastData {
      list: Array<{
      dt_txt: string;
      main: {
        temp: number;
      };
      weather: Array<{
        description: string;
      }>;
      }>;
    }

    const result: WeatherResult = {
      city: (currentWeather.data as CurrentWeatherData).name,
      temperature: (currentWeather.data as CurrentWeatherData).main.temp,
      weather: (currentWeather.data as CurrentWeatherData).weather[0].description,
      forecast: (forecast.data as ForecastData).list.slice(0, 5).map((item): ForecastItem => ({
      time: item.dt_txt,
      temp: item.main.temp,
      description: item.weather[0].description
      }))
    };

    return res.json(result);

  } catch (error: any) {
    return res.status(500).json({
      error: "Failed to fetch weather data",
      details: error.response?.data || error.message,
    });
  }
});

export default router;
