import "jsr:@std/dotenv/load";

export class WeatherAPI {
  readonly #apiKey: string;
  readonly #geoBaseUrl: string;
  readonly #oneCallBaseUrl: string;

  constructor() {
    const apiKey = Deno.env.get("OPENWEATHER_API_KEY");
    if (!apiKey) {
      throw new Error("OpenWeatherMap API key is missing.");
    }
    this.#apiKey = apiKey;
    this.#geoBaseUrl = "http://api.openweathermap.org/geo/1.0/direct";
    this.#oneCallBaseUrl = "https://api.openweathermap.org/data/3.0/onecall";
  }

  // Method to fetch latitude and longitude using the Geocoding API
  public async getCoordinates(city: string) {
    if (!city) {
      return { error: "City is required." };
    }

    const url = `${this.#geoBaseUrl}?q=${city}&limit=1&appid=${this.#apiKey}`;
    console.log(`Fetching coordinates for city: ${city}`);

    try {
      const response = await fetch(url);

      if (!response.ok) {
        const error = await response.json(); // Get the actual API error message
        return { error: error.message || "Error fetching coordinates" };
      }

      const data = await response.json();
      if (data.length === 0) {
        return { error: "No coordinates found for the specified city" };
      }

      const { lat, lon } = data[0]; // Extract latitude and longitude
      return { lat, lon };

    } catch (error: unknown) {
      // Type checking for the error
      if (error instanceof Error) {
        console.log("Error fetching coordinates:", error.message);
        return { error: error.message };
      } else {
        console.log("Unknown error fetching coordinates:", error);
        return { error: "Unknown error fetching coordinates" };
      }
    }
  }

  // Method to fetch weather data using the One Call API
  public async fetchWeather(lat: string, lon: string) {
    if (!lat || !lon) {
      return { error: "Latitude and Longitude are required." };
    }

    const url = `${this.#oneCallBaseUrl}?lat=${lat}&lon=${lon}&exlcude=minutely&appid=${this.#apiKey}&units=metric`;

    console.log(`Fetching weather data for coordinates: [${lat}, ${lon}]`);

    try {
      const response = await fetch(url);

      if (!response.ok) {
        const error = await response.json(); // Get the actual API error message
        return { error: error.message || "Error fetching weather data" };
      }

      const data = await response.json();
      console.log("Weather data fetched successfully:", data);
      return data;

    } catch (error: unknown) {
      // Type checking for the error
      if (error instanceof Error) {
        console.log("Error fetching weather data:", error.message);
        return { error: error.message };
      } else {
        console.log("Unknown error fetching weather data:", error);
        return { error: "Unknown error fetching weather data" };
      }
    }
  }
}