import { apiClient } from "./apiClient";
import * as T from "../types";
import { OpportunityPageDto } from "../types/opportunities";

export const dashboardApi = {
  getVfmLeaderboard: async (minScore = 0.0): Promise<T.VfmLeaderboardDto[]> => {
    const { data } = await apiClient.get(`/Reports/vfm-leaderboard?minScore=${minScore}`);
    return data;
  },

  getOpportunities: async (params: Record<string, string | number | boolean>): Promise<OpportunityPageDto> => {
    const { data } = await apiClient.get("/Reports/opportunities", { params });
    return data;
  },

  getListingBrief: async (listingId: string): Promise<T.NegotiationBriefDto> => {
    const { data } = await apiClient.get("/Reports/listing-brief", { params: { listingId } });
    return data;
  },

  getCars: async (): Promise<T.CarDto[]> => {
    const { data } = await apiClient.get("/Reports/cars");
    return data;
  },

  getFairMarketPrice: async (carId: string, userMileage: number, options: T.FairMarketPriceOptions = {}): Promise<T.FairMarketPriceDto> => {
    const { data } = await apiClient.get("/Reports/fair-market-price", { params: { carId, userMileage, ...options } });
    return data;
  },

  getNegotiationSignals: async (minSignal: T.NegotiationLevel = "medium", take = 200): Promise<T.NegotiationSignalDto[]> => {
    const { data } = await apiClient.get("/Reports/negotiation-signals", {
      params: { minSignal, take },
    });
    return data;
  },

  getCompetitionAnalysis: async (minPerSide = 3): Promise<T.CompetitionAnalysisDto[]> => {
    const { data } = await apiClient.get("/Reports/competition-analysis", {
      params: { minPerSide },
    });
    return data;
  },
};
