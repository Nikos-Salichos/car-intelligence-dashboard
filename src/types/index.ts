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

// 🌟 Unified MarketAdvisorDto - combined duplicate entries into a single clean declaration
export interface MarketAdvisorDto {
  brand: string;
  model: string;
  totalActiveListings: number;
  averagePrice: number;
  minimumPrice: number;
  maximumPrice: number;
  priceStandardDeviation: number;
  priceVolatilityPercentage: number;
  averageMileage: number;
}

export interface CompetitionAnalysisDto {
  brand: string;
  model: string;
  privateListingsCount: number;
  privateAvgPrice: number | null;
  dealerListingsCount: number;
  dealerAvgPrice: number | null;
  potentialDealerMargin: number;
}

export interface FuelMarketShareDto {
  fuelType: string;
  totalListings: number;
  marketSharePercentage: number;
  averagePrice: number;
}

export interface GeographicDistributionDto {
  region: string;
  totalListings: number;
  averagePrice: number;
}

export interface ScraperHealthDto {
  totalTrackedModels: number;
  activeListingsCount: number;
  totalCarGrActive: number;
  totalAutoTritiModels: number;
  newListingsImportedToday: number;
}

export interface LookupDataDto {
  availableFuelTypes: string[];
  engineCcMinimumRange: number;
  engineCcMaximumRange: number;
}

export interface MarketAlertDto {
  brand: string;
  model: string;
  alertCategory: string;
  unitsAffectedCount: number;
  generatedMessage: string;
}

export interface BulkDepreciationDto {
  brand: string;
  model: string;
  samplePoints: number;
  averagePrice: number;
  averageMileage: number;
  priceLossPerTenThousandKm: number;
}

export interface FastMovingCarDto {
  brand: string;
  model: string;
  totalSoldUnitsSample: number;
  averageDaysToSell: number;
}

export type AvailableCarsMap = Record<string, string[]>;

export interface GlobalDealDto {
  brand: string;
  model: string;
  price: number;
  mileage: number;
  listingUrl: string;
  engineCc: number;
  sellerType: string;
  fuelType: string;
  addressSeller: string;
  vfmScore: number;
}
