import { Router } from "express";
import axios from "axios";

const router = Router();
const API_KEY = process.env.OPENWEATHER_API_KEY!;
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

router.get("/:city", async (req, res) => {
    try {
        const { city } = req.params;

        const response = await axios.get(BASE_URL, {
            params: {
                q: city,
                appid: API_KEY,
                units: "metric" // or "imperial"
            }
        });

        res.json(response.data);

    } catch (error: any) {
        res.status(500).json({
            error: "Failed to fetch weather data",
            message: error.response?.data || error.message
        });
    }
});

export default router;
