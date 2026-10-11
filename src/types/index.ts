export interface UserContext {
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  companyId: number;
}

export interface LoginResponse {
  token: string;
  userContext: UserContext;
}

export interface VfmLeaderboardDto {
  brand: string;
  model: string;
  carYear?: number;
  originalPriceEuros: number;
  price: number;
  priceDiscountOrIncreasePct: number;
  mileage: number;
  engineCc: number;
  listingUrl: string;
  sellerType: string;
  fuelType: string;
  addressSeller: string;
  createdAt: string;
  lastSeenAt: string;
  isActive: boolean;
  avgCategoryPrice: number;
  avgCategoryMileage: number;
  vfmScore: number;
}

export interface CarDto {
  id: string;
  brand: string;
  model: string;
  originalPriceEuros?: number;
  originalPriceProvider?: string;
}

export interface FairMarketPriceDto {
  brand: string;
  model: string;
  userMileage: number;
  marketAvgMileage: number;
  marketAvgPrice: number;
  fairMarketPrice: number;
}

export interface ScraperHealthDto {
  totalTrackedModels: number;
  activeListingsCount: number;
  totalCarGrActive: number;
  totalAutoTritiModels: number;
  newListingsImportedToday: number;
}

export type NegotiationLevel = "high" | "medium" | "low";

export interface NegotiationSignalDto {
  listingId: string;
  brand: string;
  model: string;
  listingUrl: string; // already a full car.gr URL from the backend
  currentPrice: number;
  initialPrice: number;
  totalDropPct: number;
  dropCount: number;
  raiseCount: number;
  lastDropAt: string | null;
  negotiationSignal: "high" | "medium" | "low" | "none";
}