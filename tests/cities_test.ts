import { CitiesAPI } from "../services/CitiesApi.ts";
import { assertEquals } from "jsr:@std/assert";

// Reusing the mockFetch function from previous tests
const mockFetch = (response: unknown, ok: boolean = true): void => {
  globalThis.fetch = () =>
    Promise.resolve({
      ok,
      json: () => Promise.resolve(response),
    } as Response);
};

// Testing getAllCities for a successful response
Deno.test("CitiesAPI: getAllCities should return city data for a successful response", async () => {
  const mockResponse = {
    error: false,
    msg: "cities retrieved",
    data: [
      {
        name: "Country1",
        cities: ["City1", "City2"],
      },
      {
        name: "Country2",
        cities: ["City3", "City4"],
      },
    ],
  };
  mockFetch(mockResponse);

  const citiesAPI = new CitiesAPI();
  const result = await citiesAPI.getAllCities();

  assertEquals(result.error, false);

  if ("msg" in result) {
  assertEquals(result.msg, "cities retrieved");
  }
  if ("data" in result) {
  assertEquals(result.data.length, 2);
  assertEquals(result.data[0].name, "Country1");
  assertEquals(result.data[0].cities[0], "City1");

  }
});

// Testing getAllCities for an API error response
Deno.test("CitiesAPI: getAllCities should return an error message when API request fails", async () => {
  const mockResponse = { message: "API error occurred" };
  mockFetch(mockResponse, false);

  const citiesAPI = new CitiesAPI();
  const result = await citiesAPI.getAllCities();

  assertEquals(result.error, "API error occurred");
});

// Testing getAllCities for a network error
Deno.test("CitiesAPI: getAllCities should return an error message for network issues", async () => {
  globalThis.fetch = () =>
    Promise.reject(new Error("Network error"));

  const citiesAPI = new CitiesAPI();
  const result = await citiesAPI.getAllCities();

  assertEquals(result.error, "Network error");
});
