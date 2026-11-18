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
  sampleSize: number;
  totalListings: number;
  mileageOutOfRange: boolean;
  isIndicative: boolean;
  // Optional on purpose: an older API (deployed before this UI) does not send them, and the page must not crash.
  lowPrice?: number;
  highPrice?: number;
  confidence?: "High" | "Medium" | "Low";
  fuelUsed?: string;
  engineCcUsed?: number;
  horsepowerUsed?: number;
}

export interface PricePointDto {
  recordedAt: string;
  price: number;
  change: number | null;
  changePct: number | null;
}

export interface NegotiationReason {
  code: string;
  value: number;
}

export interface NegotiationAdvice {
  verdict: "bargain" | "fair" | "overpriced";
  openingOffer: number;
  targetPrice: number;
  walkAwayPrice: number;
  reasons: NegotiationReason[];
}

export interface ComparableListingDto {
  listingId: string;
  listingUrl: string;
  year: number;
  price: number;
  mileage: number;
  fuelType: string;
  sellerType: string;
  discountPct: number;
}

export interface NegotiationBriefDto {
  listingId: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuelType: string;
  sellerType: string;
  addressSeller: string;
  listingUrl: string;
  fairPrice: number;
  fairLow: number;
  fairHigh: number;
  discountPct: number;
  confidence: "High" | "Medium" | "Low";
  comparableCount: number;
  similarCount: number; // same fuel, year +-1, +-40.000 km
  comparableMinMileage: number | null;
  comparableMaxMileage: number | null;
  regionPostalPrefix: string | null;
  regionListingCount: number;
  regionPriceVsModelPct: number | null;
  daysListed: number;
  daysSource: "Published" | "FirstSeen";
  priceDropCount: number;
  totalDropPct: number;
  priceNegotiable: boolean | null;
  priceHistory: PricePointDto[];
  advice: NegotiationAdvice;
  flags: string[];
  comparables: ComparableListingDto[];
}

export interface FairMarketPriceOptions {
  fuel?: string;
  engineCc?: number;
}

export interface CompetitionAnalysisDto {
  brand: string;
  model: string;
  privateListingsCount: number;
  privateMedianPrice: number;
  privateMedianMileage: number;
  dealerListingsCount: number;
  dealerMedianPrice: number;
  dealerMedianMileage: number;
  medianMargin: number;
  marginPct: number;
}