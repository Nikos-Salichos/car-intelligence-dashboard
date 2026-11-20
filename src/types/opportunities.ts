export type OpportunityView = "all" | "new" | "negotiation" | "flip";
export type NegotiationSignal = "none" | "low" | "medium" | "high";
export type Confidence = "High" | "Medium" | "Low";

// One row for all views; the optional fields are filled only by the views that need them.
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
  confidence: Confidence;
  isSuspect: boolean;
  daysListed: number;
  priceDropCount: number;
  totalDropPct: number;
  lastDropAt: string | null;
  negotiationSignal: NegotiationSignal;
  // new + flip
  resalePrice: number | null;
  costs: number | null;
  netMargin: number | null;
  roiPct: number | null;
  // new, "just fell below the fair price"
  crossedBelowFair: boolean;
  previousPrice: number | null;
  // negotiation
  openingOffer: number | null;
  targetPrice: number | null;
  estimatedSavings: number | null;
  // flip
  referenceCount: number | null;
  referenceMedian: number | null;
}

export interface OpportunityPageDto {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  items: OpportunityDto[];
}

export type SortDirection = "asc" | "desc";
export interface Sort {
  key: string;
  dir: SortDirection;
}

// What the filter form edits. Strings, because that is what inputs hold; empty = not set.
export interface OpportunityFilters {
  // shared
  brand: string;
  model: string; // model names without the year, several separated by commas
  maxPrice: string;
  minYear: string;
  maxMileage: string;
  fuel: string;
  region: string; // first two digits of the postcode
  seller: string; // "", "Dealer", "Private"
  // all
  minScore: string;
  showSuspect: boolean;
  // new + flip
  costs: string;
  minMargin: string;
  // new
  days: string;
  crossedBelowFair: boolean;
  // negotiation
  minDays: string;
  maxDays: string; // empty = the server default of the view (negotiation 365, flip 90)
  minDrops: string;
  maxOverpricingPct: string;
  aboveFairOnly: boolean;
  minSignal: NegotiationSignal;
  // flip
  minComparables: string;
}

export const DEFAULT_FILTERS: OpportunityFilters = {
  brand: "",
  model: "",
  maxPrice: "",
  minYear: "",
  maxMileage: "",
  fuel: "",
  region: "",
  seller: "",
  minScore: "",
  showSuspect: true,
  costs: "500",
  minMargin: "300",
  days: "2",
  crossedBelowFair: false,
  minDays: "45",
  maxDays: "",
  minDrops: "1",
  maxOverpricingPct: "35",
  aboveFairOnly: true,
  minSignal: "none",
  minComparables: "3",
};

// The two ways to look at negotiation: sellers who waited and are still too dear, or simply everyone who has dropped the price.
export const NEGOTIATION_PRESETS: Record<"ripe" | "dropped", Partial<OpportunityFilters>> = {
  ripe: { minDays: "45", maxDays: "", minDrops: "1", maxOverpricingPct: "35", aboveFairOnly: true, minSignal: "none" },
  dropped: { minDays: "0", maxDays: "", minDrops: "1", maxOverpricingPct: "200", aboveFairOnly: false, minSignal: "low" },
};
