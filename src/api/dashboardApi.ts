import { apiClient } from "./apiClient";
import * as T from "../types";

export const dashboardApi = {
  getVfmLeaderboard: async (minScore = 0.0): Promise<T.VfmLeaderboardDto[]> => {
    const { data } = await apiClient.get(`/Reports/vfm-leaderboard?minScore=${minScore}`);
    return data;
  },

  getCars: async (): Promise<T.CarDto[]> => {
    const { data } = await apiClient.get("/Reports/cars");
    return data;
  },

  getFairMarketPrice: async (carId: string, userMileage: number): Promise<T.FairMarketPriceDto> => {
    const { data } = await apiClient.get(
      `/Reports/fair-market-price?carId=${carId}&userMileage=${userMileage}`
    );
    return data;
  },
};