// Define interfaces for the known API structure
interface CityData {
  name: string;
  cities: string[];
}

export interface CitiesApiResponse {
  error: boolean;
  msg: string;
  data: CityData[];
}

export class CitiesAPI {
  private readonly citiesApiUrl: string;

  constructor(apiUrl: string = "https://countriesnow.space/api/v0.1/countries/info?returns=cities") {
    this.citiesApiUrl = apiUrl;
  }

  // Fetches all cities using the external API
  public async getAllCities(): Promise<CitiesApiResponse | { error: string }> {
    try {
      const response = await fetch(this.citiesApiUrl);

      if (!response.ok) {
        // This JSON parsing will only throw an error if response is not valid JSON
        const errorResponse = await response.json();
        const errorMsg = (errorResponse && errorResponse.message) ? errorResponse.message : "Error fetching cities";
        return { error: errorMsg };
      }

      const data: CitiesApiResponse = await response.json();
      return data;

    } catch (error: unknown) {
      console.error("Error fetching cities:", error);
      return { error: error instanceof Error ? error.message : "Unknown error" };
    }
  }
}
