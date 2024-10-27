import "jsr:@std/dotenv/load";

interface WeatherApiResponse {
  lat: number;
  lon: number;
  timezone: string;
  timezone_offset: number;
  current: object;
  minutely: any[];
  hourly: any[];
  daily: any[];
}

interface Cordinates {
  lat: number;
  lon: number;
}

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

  /**
   * Fetches geographical coordinates (latitude and longitude) for a given city name.
   * @param {string} city - The name of the city to fetch coordinates for.
   * @returns {Promise<Coordinates | { error: string }>} - A promise that resolves to
   * an object containing coordinates if successful,
   * or an error message if unsuccessful.
   */
  public async getCoordinates(city: string): Promise<Cordinates | { error: string }> {
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
      const errorMessage = error instanceof Error ? error.message : "Unknown error fetching coordinates";
      console.log("Error fetching coordinates:", errorMessage);
      return { error: errorMessage };
    }
  }

  /**
   * Fetches weather data using the OpenWeatherMap One Call API for specified geographic coordinates.
   *
   * @param {number} lat - The latitude of the location for which to fetch weather data.
   * @param {number} lon - The longitude of the location for which to fetch weather data.
   * @returns {Promise<WeatherApiResponse | { error: string }>} - A promise resolving to the weather data if successful,
   *                                                              or an error message if unsuccessful.
   * 
   * @remarks
   * The function retrieves detailed weather data for a location, including current, hourly, and daily forecasts.
   * If the `response.ok` check fails, it attempts to retrieve the error message from the API response, providing 
   * a default message if none is available. In case of other errors (network or unknown errors), a custom error 
   * message is returned.
   */
  public async fetchWeather(lat: number, lon: number): Promise<WeatherApiResponse | { error: string }> {
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
      const errorMessage = error instanceof Error ? error.message : "Unknown error fetching weather data";
      console.log("Error fetching weather data:", errorMessage);
      return { error: errorMessage };
    }
  }
}