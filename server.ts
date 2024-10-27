import { WeatherAPI } from "./services/WeatherApi.ts";
import { CitiesAPI } from "./services/CitiesApi.ts";

const weatherAPI = new WeatherAPI();
const citiesAPI = new CitiesAPI();

// Function to add CORS headers
function withCORS(response: Response) {
  const headers = new Headers(response.headers);
  headers.set("Access-Control-Allow-Origin", "*");
  headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  headers.set("Access-Control-Allow-Headers", "Content-Type");
  return new Response(response.body, {
    ...response,
    headers,
  });
}

// Handle OPTIONS requests (for preflight checks)
function handleOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

// Create HTTP server with CORS handling
Deno.serve(async (req: Request) => {
  const url = new URL(req.url);

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") return handleOptions();

  if (url.pathname === "/weather" && req.method === "GET") {
    const city = url.searchParams.get("city") ?? "";
    console.log(`Received request: city=${city}`);
    const coordinates = await weatherAPI.getCoordinates(city);

    if ("error" in coordinates && coordinates.error) {
      return withCORS(new Response(JSON.stringify({ error: coordinates.error }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }));
    }

    if ("lat" in coordinates && "lon" in coordinates) {
      const { lat, lon } = coordinates;
      const weatherData = await weatherAPI.fetchWeather(lat, lon);
    
      let status = 200;
      if ("error" in weatherData && weatherData.error) {
        status = 400;
      }

      return withCORS(new Response(JSON.stringify(weatherData), {
        status: status,
        headers: { "Content-Type": "application/json" },
      }));
    }
  }

  if (url.pathname === "/cities" && req.method === "GET") {
    console.log("Received request for all cities");
    const citiesData = await citiesAPI.getAllCities();
    return withCORS(new Response(JSON.stringify(citiesData), {
      status: citiesData.error ? 400 : 200,
      headers: { "Content-Type": "application/json" },
    }));
  }

  return withCORS(new Response("Not Found", { status: 404 }));
});

console.log("Server is running on http://localhost:8000");
