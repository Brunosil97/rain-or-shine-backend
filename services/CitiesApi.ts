export class CitiesAPI {
  private readonly citiesApiUrl = "https://countriesnow.space/api/v0.1/countries/info?returns=cities";

  // Fetches all cities using the external API
  public async getAllCities() {
    try {
      const response = await fetch(this.citiesApiUrl);

      if (!response.ok) {
        const error = await response.json();
        return { error: error.message || "Error fetching cities" };
      }

      const data = await response.json();
      return data;

    } catch (error) {
      console.error("Error fetching cities:", error);
      return { error: error instanceof Error ? error.message : "Unknown error" };
    }
  }
}
