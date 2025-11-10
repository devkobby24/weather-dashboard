import router from "../routes/weather.routes";
import axios from "axios";
import request from "supertest";
import express from "express";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("Weather Routes", () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use("/weather", router);
    jest.clearAllMocks();
  });

  describe("GET /weather/:city - Successful cases", () => {
    test("should fetch weather forecast for a valid city", async () => {
      const geoResponse = { data: [{ lat: 5.6037, lon: -0.187 }] };
      const currentWeatherResponse = {
        data: {
          name: "Accra",
          main: { temp: 23 },
          weather: [{ description: "raining" }],
        },
      };
      const forecastResponse = {
        data: {
          list: [
            {
              dt_txt: "2025-11-06 12:00:00",
              main: { temp: 23 },
              weather: [{ description: "raining" }],
            },
          ],
        },
      };

      mockedAxios.get
        .mockResolvedValueOnce(geoResponse)
        .mockResolvedValueOnce(currentWeatherResponse)
        .mockResolvedValueOnce(forecastResponse);

      const result = await request(app).get("/weather/Accra").expect(200);

      expect(result.body.city).toBe("Accra");
      expect(result.body.temperature).toBe(23);
      expect(result.body.weather).toBe("raining");
      expect(result.body.forecast).toHaveLength(1);
    });

    test("should return correct temperature for hot city", async () => {
      const geoResponse = { data: [{ lat: 25.2048, lon: 55.2708 }] };
      const currentWeatherResponse = {
        data: {
          name: "Dubai",
          main: { temp: 45 },
          weather: [{ description: "sunny" }],
        },
      };
      const forecastResponse = {
        data: {
          list: [
            {
              dt_txt: "2025-11-07 12:00:00",
              main: { temp: 46 },
              weather: [{ description: "sunny" }],
            },
          ],
        },
      };

      mockedAxios.get
        .mockResolvedValueOnce(geoResponse)
        .mockResolvedValueOnce(currentWeatherResponse)
        .mockResolvedValueOnce(forecastResponse);

      const result = await request(app).get("/weather/Dubai").expect(200);

      expect(result.body.temperature).toBe(45);
      expect(result.body.weather).toBe("sunny");
    });

    test("should return correct temperature for cold city", async () => {
      const geoResponse = { data: [{ lat: 59.9139, lon: 10.7522 }] };
      const currentWeatherResponse = {
        data: {
          name: "Oslo",
          main: { temp: -5 },
          weather: [{ description: "snow" }],
        },
      };
      const forecastResponse = {
        data: {
          list: [
            {
              dt_txt: "2025-11-07 12:00:00",
              main: { temp: -3 },
              weather: [{ description: "snow" }],
            },
          ],
        },
      };

      mockedAxios.get
        .mockResolvedValueOnce(geoResponse)
        .mockResolvedValueOnce(currentWeatherResponse)
        .mockResolvedValueOnce(forecastResponse);

      const result = await request(app).get("/weather/Oslo").expect(200);

      expect(result.body.temperature).toBe(-5);
      expect(result.body.weather).toBe("snow");
    });

    test("should return multiple forecast items", async () => {
      const geoResponse = { data: [{ lat: 40.7128, lon: -74.006 }] };
      const currentWeatherResponse = {
        data: {
          name: "New York",
          main: { temp: 15 },
          weather: [{ description: "cloudy" }],
        },
      };
      const forecastResponse = {
        data: {
          list: [
            {
              dt_txt: "2025-11-07 12:00:00",
              main: { temp: 15 },
              weather: [{ description: "cloudy" }],
            },
            {
              dt_txt: "2025-11-07 15:00:00",
              main: { temp: 14 },
              weather: [{ description: "rainy" }],
            },
            {
              dt_txt: "2025-11-07 18:00:00",
              main: { temp: 12 },
              weather: [{ description: "rainy" }],
            },
            {
              dt_txt: "2025-11-07 21:00:00",
              main: { temp: 10 },
              weather: [{ description: "clear" }],
            },
            {
              dt_txt: "2025-11-08 00:00:00",
              main: { temp: 8 },
              weather: [{ description: "clear" }],
            },
          ],
        },
      };

      mockedAxios.get
        .mockResolvedValueOnce(geoResponse)
        .mockResolvedValueOnce(currentWeatherResponse)
        .mockResolvedValueOnce(forecastResponse);

      const result = await request(app).get("/weather/New York").expect(200);

      expect(result.body.forecast).toHaveLength(5);
      expect(result.body.forecast[0].temp).toBe(15);
      expect(result.body.forecast[4].temp).toBe(8);
    });

    test("should handle city names with spaces", async () => {
      const geoResponse = { data: [{ lat: -33.8688, lon: 151.2093 }] };
      const currentWeatherResponse = {
        data: {
          name: "Sydney",
          main: { temp: 22 },
          weather: [{ description: "sunny" }],
        },
      };
      const forecastResponse = {
        data: {
          list: [
            {
              dt_txt: "2025-11-07 12:00:00",
              main: { temp: 22 },
              weather: [{ description: "sunny" }],
            },
          ],
        },
      };

      mockedAxios.get
        .mockResolvedValueOnce(geoResponse)
        .mockResolvedValueOnce(currentWeatherResponse)
        .mockResolvedValueOnce(forecastResponse);

      const result = await request(app)
        .get("/weather/New%20York")
        .expect(200);

      expect(result.body.city).toBe("Sydney");
    });
  });

  describe("GET /weather/:city - Error cases", () => {
    test("should return 404 when city is not found", async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: [] });

      const result = await request(app).get("/weather/InvalidCity").expect(404);

      expect(result.body.error).toBe("City not found");
    });

    test("should return 500 when geo API fails", async () => {
      mockedAxios.get.mockRejectedValueOnce({
        response: {
          status: 401,
          data: { message: "Invalid API key" },
        },
      });

      const result = await request(app).get("/weather/Accra").expect(500);

      expect(result.body.error).toBe("Failed to fetch weather data");
      expect(result.body.details).toBeDefined();
    });

    test("should return 500 when current weather API fails", async () => {
      const geoResponse = { data: [{ lat: 5.6037, lon: -0.187 }] };

      mockedAxios.get
        .mockResolvedValueOnce(geoResponse)
        .mockRejectedValueOnce({
          response: {
            status: 500,
            data: { message: "Service unavailable" },
          },
        });

      const result = await request(app).get("/weather/Accra").expect(500);

      expect(result.body.error).toBe("Failed to fetch weather data");
    });

    test("should return 500 when forecast API fails", async () => {
      const geoResponse = { data: [{ lat: 5.6037, lon: -0.187 }] };
      const currentWeatherResponse = {
        data: {
          name: "Accra",
          main: { temp: 23 },
          weather: [{ description: "raining" }],
        },
      };

      mockedAxios.get
        .mockResolvedValueOnce(geoResponse)
        .mockResolvedValueOnce(currentWeatherResponse)
        .mockRejectedValueOnce({
          response: {
            status: 429,
            data: { message: "Rate limit exceeded" },
          },
        });

      const result = await request(app).get("/weather/Accra").expect(500);

      expect(result.body.error).toBe("Failed to fetch weather data");
    });

    test("should handle network error gracefully", async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error("Network error"));

      const result = await request(app).get("/weather/Accra").expect(500);

      expect(result.body.error).toBe("Failed to fetch weather data");
      expect(result.body.details).toContain("Network error");
    });
  });

  describe("GET /weather/:city - Response structure validation", () => {
    test("should return all required fields in response", async () => {
      const geoResponse = { data: [{ lat: 5.6037, lon: -0.187 }] };
      const currentWeatherResponse = {
        data: {
          name: "Accra",
          main: { temp: 23.5 },
          weather: [{ description: "partly cloudy" }],
        },
      };
      const forecastResponse = {
        data: {
          list: [
            {
              dt_txt: "2025-11-07 12:00:00",
              main: { temp: 24 },
              weather: [{ description: "partly cloudy" }],
            },
          ],
        },
      };

      mockedAxios.get
        .mockResolvedValueOnce(geoResponse)
        .mockResolvedValueOnce(currentWeatherResponse)
        .mockResolvedValueOnce(forecastResponse);

      const result = await request(app).get("/weather/Accra").expect(200);

      expect(result.body).toHaveProperty("city");
      expect(result.body).toHaveProperty("temperature");
      expect(result.body).toHaveProperty("weather");
      expect(result.body).toHaveProperty("forecast");
      expect(Array.isArray(result.body.forecast)).toBe(true);
    });

    test("should have correct data types in response", async () => {
      const geoResponse = { data: [{ lat: 5.6037, lon: -0.187 }] };
      const currentWeatherResponse = {
        data: {
          name: "Accra",
          main: { temp: 23 },
          weather: [{ description: "raining" }],
        },
      };
      const forecastResponse = {
        data: {
          list: [
            {
              dt_txt: "2025-11-06 12:00:00",
              main: { temp: 23 },
              weather: [{ description: "raining" }],
            },
          ],
        },
      };

      mockedAxios.get
        .mockResolvedValueOnce(geoResponse)
        .mockResolvedValueOnce(currentWeatherResponse)
        .mockResolvedValueOnce(forecastResponse);

      const result = await request(app).get("/weather/Accra").expect(200);

      expect(typeof result.body.city).toBe("string");
      expect(typeof result.body.temperature).toBe("number");
      expect(typeof result.body.weather).toBe("string");
      expect(Array.isArray(result.body.forecast)).toBe(true);
    });

    test("forecast items should have correct structure", async () => {
      const geoResponse = { data: [{ lat: 5.6037, lon: -0.187 }] };
      const currentWeatherResponse = {
        data: {
          name: "Accra",
          main: { temp: 23 },
          weather: [{ description: "raining" }],
        },
      };
      const forecastResponse = {
        data: {
          list: [
            {
              dt_txt: "2025-11-06 12:00:00",
              main: { temp: 23 },
              weather: [{ description: "raining" }],
            },
            {
              dt_txt: "2025-11-06 15:00:00",
              main: { temp: 25 },
              weather: [{ description: "sunny" }],
            },
          ],
        },
      };

      mockedAxios.get
        .mockResolvedValueOnce(geoResponse)
        .mockResolvedValueOnce(currentWeatherResponse)
        .mockResolvedValueOnce(forecastResponse);

      const result = await request(app).get("/weather/Accra").expect(200);

      result.body.forecast.forEach(
        (item: { time: string; temp: number; description: string }) => {
          expect(item).toHaveProperty("time");
          expect(item).toHaveProperty("temp");
          expect(item).toHaveProperty("description");
          expect(typeof item.time).toBe("string");
          expect(typeof item.temp).toBe("number");
          expect(typeof item.description).toBe("string");
        }
      );
    });
  });

  describe("GET /weather/:city - Edge cases", () => {
    test("should handle decimal temperatures correctly", async () => {
      const geoResponse = { data: [{ lat: 5.6037, lon: -0.187 }] };
      const currentWeatherResponse = {
        data: {
          name: "Accra",
          main: { temp: 23.567 },
          weather: [{ description: "raining" }],
        },
      };
      const forecastResponse = {
        data: {
          list: [
            {
              dt_txt: "2025-11-06 12:00:00",
              main: { temp: 23.567 },
              weather: [{ description: "raining" }],
            },
          ],
        },
      };

      mockedAxios.get
        .mockResolvedValueOnce(geoResponse)
        .mockResolvedValueOnce(currentWeatherResponse)
        .mockResolvedValueOnce(forecastResponse);

      const result = await request(app).get("/weather/Accra").expect(200);

      expect(result.body.temperature).toBe(23.567);
      expect(result.body.forecast[0].temp).toBe(23.567);
    });

    test("should handle empty forecast list", async () => {
      const geoResponse = { data: [{ lat: 5.6037, lon: -0.187 }] };
      const currentWeatherResponse = {
        data: {
          name: "Accra",
          main: { temp: 23 },
          weather: [{ description: "raining" }],
        },
      };
      const forecastResponse = {
        data: {
          list: [],
        },
      };

      mockedAxios.get
        .mockResolvedValueOnce(geoResponse)
        .mockResolvedValueOnce(currentWeatherResponse)
        .mockResolvedValueOnce(forecastResponse);

      const result = await request(app).get("/weather/Accra").expect(200);

      expect(result.body.forecast).toHaveLength(0);
      expect(Array.isArray(result.body.forecast)).toBe(true);
    });

    test("should handle special characters in weather description", async () => {
      const geoResponse = { data: [{ lat: 5.6037, lon: -0.187 }] };
      const currentWeatherResponse = {
        data: {
          name: "Accra",
          main: { temp: 23 },
          weather: [{ description: "light rain & drizzle" }],
        },
      };
      const forecastResponse = {
        data: {
          list: [
            {
              dt_txt: "2025-11-06 12:00:00",
              main: { temp: 23 },
              weather: [{ description: "light rain & drizzle" }],
            },
          ],
        },
      };

      mockedAxios.get
        .mockResolvedValueOnce(geoResponse)
        .mockResolvedValueOnce(currentWeatherResponse)
        .mockResolvedValueOnce(forecastResponse);

      const result = await request(app).get("/weather/Accra").expect(200);

      expect(result.body.weather).toContain("&");
      expect(result.body.forecast[0].description).toContain("&");
    });

    test("should call API with correct parameters", async () => {
      const geoResponse = { data: [{ lat: 5.6037, lon: -0.187 }] };
      const currentWeatherResponse = {
        data: {
          name: "Accra",
          main: { temp: 23 },
          weather: [{ description: "raining" }],
        },
      };
      const forecastResponse = {
        data: {
          list: [
            {
              dt_txt: "2025-11-06 12:00:00",
              main: { temp: 23 },
              weather: [{ description: "raining" }],
            },
          ],
        },
      };

      mockedAxios.get
        .mockResolvedValueOnce(geoResponse)
        .mockResolvedValueOnce(currentWeatherResponse)
        .mockResolvedValueOnce(forecastResponse);

      await request(app).get("/weather/Accra").expect(200);

      expect(mockedAxios.get).toHaveBeenCalledTimes(3);
      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining("geo/1.0/direct"),
        expect.objectContaining({
          params: expect.objectContaining({
            q: "Accra",
            limit: 1,
          }),
        })
      );
    });
  });
});
