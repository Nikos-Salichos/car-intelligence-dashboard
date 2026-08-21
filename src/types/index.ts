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