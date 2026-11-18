import { apiClient } from "./client";
import { CarDto, CompetitionAnalysisDto, FairMarketPriceDto, FairMarketPriceOptions, NegotiationBriefDto } from "../types";
import { OpportunityPageDto } from "../types/opportunities";

export type Query = Record<string, string | number | boolean>;

export const reportsApi = {
  opportunities: async (params: Query): Promise<OpportunityPageDto> => (await apiClient.get("/Reports/opportunities", { params })).data,
  listingBrief: async (listingId: string): Promise<NegotiationBriefDto> => (await apiClient.get("/Reports/listing-brief", { params: { listingId } })).data,
  cars: async (): Promise<CarDto[]> => (await apiClient.get("/Reports/cars")).data,
  fairMarketPrice: async (carId: string, userMileage: number, options: FairMarketPriceOptions = {}): Promise<FairMarketPriceDto> =>
    (await apiClient.get("/Reports/fair-market-price", { params: { carId, userMileage, ...options } })).data,
  competitionAnalysis: async (minPerSide = 3): Promise<CompetitionAnalysisDto[]> => (await apiClient.get("/Reports/competition-analysis", { params: { minPerSide } })).data,
};
