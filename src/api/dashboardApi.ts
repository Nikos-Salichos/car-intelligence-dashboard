import { apiClient } from "./apiClient";
import * as T from "../types";

export const dashboardApi = {
  getVfmLeaderboard: async (minScore = 80): Promise<T.VfmLeaderboardDto[]> => {
    const { data } = await apiClient.get(`/Reports/vfm-leaderboard?minScore=${minScore}`);
    return data;
  },

  getMarketAdvisor: async (brand: string, model: string): Promise<T.MarketAdvisorDto> => {
    const { data } = await apiClient.get(`/Reports/market-advisor?brand=${encodeURIComponent(brand)}&model=${encodeURIComponent(model)}`);
    return data;
  },

  // 🌟 ADDED: Fetches unique Brand + Model pairings hierarchically from the backend
  getAvailableCars: async (): Promise<T.AvailableCarsMap> => {
    const { data } = await apiClient.get("/Reports/available-cars");
    return data;
  },

  getCompetitionAnalysis: async (): Promise<T.CompetitionAnalysisDto[]> => {
    const { data } = await apiClient.get("/Reports/competition-analysis");
    return data;
  },

  getFuelMarketShare: async (): Promise<T.FuelMarketShareDto[]> => {
    const { data } = await apiClient.get("/Reports/fuel-market-share");
    return data;
  },

  getGeographicDistribution: async (): Promise<T.GeographicDistributionDto[]> => {
    const { data } = await apiClient.get("/Reports/geographic-distribution");
    return data;
  },

  getScraperHealth: async (): Promise<T.ScraperHealthDto> => {
    const { data } = await apiClient.get("/Reports/scraper-health");
    return data;
  },

  getMarketAlerts: async (daysLookback = 3): Promise<T.MarketAlertDto[]> => {
    const { data } = await apiClient.get(`/Reports/market-alerts?daysLookback=${daysLookback}`);
    return data;
  },

  getBulkDepreciation: async (): Promise<T.BulkDepreciationDto[]> => {
    const { data } = await apiClient.get("/Reports/bulk-depreciation");
    return data;
  },

  getFastMovingInventory: async (): Promise<T.FastMovingCarDto[]> => {
    const { data } = await apiClient.get("/Reports/fast-moving-inventory");
    return data;
  },

  // Fetches top value-for-money deals calculated globally across all active listings
  getGlobalDeals: async (
    page: number = 1,
    pageSize: number = 100
  ): Promise<{
    page: number;
    pageSize: number;
    data: T.GlobalDealDto[];
  }> => {
    const { data } = await apiClient.get("/Reports/global-deals", {
      params: {
        page,
        pageSize,
      },
    });

    return data;
  },
};
