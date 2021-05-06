import axios from "axios";

export const GOV_API = axios.create({
  baseURL: "https://cdn-api.co-vin.in/api",
});
export const ALERTS_API = axios.create({
  baseURL: "https://covid-vaccine-alerts-backend.rishabh-anand.com/api/v1",
});
