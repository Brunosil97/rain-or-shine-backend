import { WeatherAPI } from "../services/WeatherApi.ts";
import { assertEquals } from "jsr:@std/assert";

// Mocking the fetch function for the tests
const mockFetch = (response: unknown, ok: boolean = true): void => {
  globalThis.fetch = () =>
    Promise.resolve({
      ok, // Use the provided "ok" status
      json: () => Promise.resolve(response),
    } as Response);
};


// Testing getCoordinates for a successful response
Deno.test("WeatherAPI: getCoordinates should return coordinates for a valid city", async () => {
  const mockResponse = [{ lat: 51.5074, lon: -0.1278 }];
  mockFetch(mockResponse);

  const weatherAPI = new WeatherAPI();
  const result = await weatherAPI.getCoordinates("London");

  assertEquals(result.lat, 51.5074);
  assertEquals(result.lon, -0.1278);
});

// Testing getCoordinates for an API error response
Deno.test("WeatherAPI: getCoordinates should return an error when city is not found", async () => {
  const mockResponse = { message: "city not found" };
  mockFetch(mockResponse, false);

  const weatherAPI = new WeatherAPI();
  const result = await weatherAPI.getCoordinates("UnknownCity");

  assertEquals(result.error, "city not found");
});

// Testing fetchWeather for a successful response
Deno.test("WeatherAPI: fetchWeather should return weather data for valid coordinates", async () => {
  const mockResponse = { temp: 20, weather: [{ description: "clear sky" }] };
  mockFetch(mockResponse);

  const weatherAPI = new WeatherAPI();
  const result = await weatherAPI.fetchWeather("51.5074", "-0.1278");

  assertEquals(result.temp, 20);
  assertEquals(result.weather[0].description, "clear sky");
});

// Testing fetchWeather for an API error response
Deno.test("WeatherAPI: fetchWeather should return an error for invalid coordinates", async () => {
  const mockResponse = { message: "invalid coordinates" };
  mockFetch(mockResponse, false);

  const weatherAPI = new WeatherAPI();
  const result = await weatherAPI.fetchWeather("invalidLat", "invalidLon");

  assertEquals(result.error, "invalid coordinates");
});
