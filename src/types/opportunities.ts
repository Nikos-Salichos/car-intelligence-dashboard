export type OpportunityView = "new" | "mature" | "flip";

// One row for all three views; the optional fields are filled only by the views that need them.
export interface OpportunityDto {
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
  discountPct: number; // positive = cheaper than the model expects
  confidence: "High" | "Medium" | "Low";
  isSuspect: boolean;
  daysListed: number;
  priceDropCount: number;
  totalDropPct: number;
  // new + flip
  resalePrice: number | null;
  costs: number | null;
  netMargin: number | null;
  roiPct: number | null;
  // new, "just fell below the fair price"
  crossedBelowFair: boolean;
  previousPrice: number | null;
  // mature
  openingOffer: number | null;
  targetPrice: number | null;
  estimatedSavings: number | null;
  // flip
  referenceCount: number | null;
  referenceMedian: number | null;
}

export interface OpportunityPageDto {
  total: number;
  items: OpportunityDto[];
}

// What the filter form edits. Strings, because that is what inputs hold; empty = not set.
export interface OpportunityFilters {
  brand: string;
  maxPrice: string;
  minYear: string;
  maxMileage: string;
  fuel: string;
  region: string; // first two digits of the postcode
  seller: string; // "", "Dealer", "Private"
  costs: string;
  minMargin: string;
  days: string;
  crossedBelowFair: boolean;
  includeSuspect: boolean;
  minDays: string;
  minDrops: string;
  maxDays: string; // empty = the server default of the view (mature 365, flip 90)
  maxOverpricingPct: string;
  minComparables: string;
}

export const DEFAULT_FILTERS: OpportunityFilters = {
  brand: "",
  maxPrice: "",
  minYear: "",
  maxMileage: "",
  fuel: "",
  region: "",
  seller: "",
  costs: "500",
  minMargin: "300",
  days: "2",
  crossedBelowFair: false,
  includeSuspect: false,
  minDays: "45",
  minDrops: "1",
  maxDays: "",
  maxOverpricingPct: "35",
  minComparables: "3",
};
