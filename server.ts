// server.ts
import { WeatherAPI } from "./services/WeatherApi.ts";

// Create an instance of the WeatherAPI class
const weatherAPI = new WeatherAPI();

// Create a simple HTTP server using Deno.serve
Deno.serve(async (req: Request) => {
  const url = new URL(req.url);

  // Extract the city from the query parameters
  const city = url.searchParams.get("city") ?? "";

  // Log the request for debugging purposes
  console.log(`Received request: city=${city}`);

  // Fetch coordinates using the Geocoding API
  if (url.pathname === "/weather" && req.method === "GET") {
    const coordinates = await weatherAPI.getCoordinates(city);

    // Check if an error occurred while fetching coordinates
    if (coordinates.error) {
      return new Response(JSON.stringify({ error: coordinates.error }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Fetch weather data using the One Call API
    const { lat, lon } = coordinates;
    const weatherData = await weatherAPI.fetchWeather(lat, lon);

    return new Response(JSON.stringify(weatherData), {
      status: weatherData.error ? 400 : 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response("Not Found", { status: 404 });
});

console.log("Server is running on http://localhost:8000");
