import router from "../routes/weather.routes";
import axios from "axios";
import request from "supertest";
import express from "express";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("Weather Routes", () => {
  test("should fetch weather forecast", async () => {
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

    const app = express();
    app.use("/weather", router);

    const result = await request(app).get("/weather/Accra").expect(200);

    expect(result.body.city).toBe("Accra");
    expect(result.body.temperature).toBe(23);
  });
});
