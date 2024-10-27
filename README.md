# Weather API Backend with Deno

This is a weather API backend service built using [Deno](https://deno.land/), a modern, secure runtime for JavaScript and TypeScript. It integrates with the OpenWeatherMap API to fetch weather data, including city coordinates (using the Geocoding API) and detailed weather forecasts (using the One Call API).

## Features

- Fetches latitude and longitude of a city using the OpenWeatherMap Geocoding API.
- Fetches detailed weather data (current, hourly, and daily forecasts) using the One Call API.

## Project Structure

- **`server.ts`**: The entry point for running the Deno HTTP server.
- **`services/WeatherApi.ts`**: Contains the `WeatherAPI` class, which handles interaction with the OpenWeatherMap API (both geocoding and weather data fetching).
- **`services/CitiesApi.ts`**: Contains the `CitiesAPI` class, which handles interaction with CountriesNow API (retrieving all cities per country).

## Requirements

- Deno (v2.x or later): Make sure you have [Deno installed](https://deno.land/manual/getting_started/installation).
- OpenWeatherMap API Key: You need an API key from OpenWeatherMap to access the weather data. You can obtain one from [here](https://home.openweathermap.org/users/sign_up).

## Installation and Setup

### 1. Clone the Repository

First, clone the repository to your local machine:

```bash
git clone https://github.com/your-repo/rain-or-shine-backend.git
cd rain-or-shine-backend
```

### 2. Set Up Environment Variables

Create a .env file in the root of the project and add your OpenWeatherMap API key:

```bash
OPENWEATHER_API_KEY=your_openweathermap_api_key_here
```

This will be used to authenticate your requests to the OpenWeatherMap API.

### 3. Install Dependencies

Deno automatically handles imports from URLs, so there is no need for package managers like npm or yarn. The project imports any required modules directly.

### 4. Run the Server

Run the Deno server using the following command:

```bash
deno run --allow-net --allow-env --allow-read server.ts
```

-  **`--allow-net`**: Grants network access so the server can make HTTP requests to the OpenWeatherMap API.
-  **`--allow-env`**: Grants access to environment variables (to read the OpenWeatherMap API key from .env).
-  **`--allow-read`**: Grants acces to allow all reads from file system.

### 5. Make API Requests

Once the server is running, you can make GET requests to the /weather endpoint to fetch weather data.

#### Example Request (By City):

```bash
http://localhost:8000/weather?city=London
```

This will:

- First, fetch the latitude and longitude for the city London using the OpenWeatherMap Geocoding API.
- Then, it will use those coordinates to fetch detailed weather information using the One Call API.

Example Response:

```json
{
  "lat": 51.5074,
  "lon": -0.1278,
  "timezone": "Europe/London",
  "current": {
    "temp": 22.3,
    "feels_like": 21.5,
    "weather": [{ "description": "clear sky", "icon": "01d" }]
  },
  "hourly": [...],
  "daily": [...]
}
```

### 6. Run Tests

Deno provides a built-in testing framework. You can run all tests in your project with the following command:

```bash
deno test --allow-net --allow-env --allow-read tests/
```