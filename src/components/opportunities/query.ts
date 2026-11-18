import { Query } from "../../api/reports";
import { OpportunityFilters, OpportunityView, Sort } from "../../types/opportunities";

export const PAGE_SIZE = 50;

/** Only the settings a view understands are sent, and empty inputs are not sent at all. */
export const buildQuery = (view: OpportunityView, f: OpportunityFilters, sort: Sort | null, page: number): Query => {
  const q: Query = { view, page, pageSize: PAGE_SIZE };
  const set = (key: string, value: string) => {
    const text = value.trim();
    if (text) q[key] = text;
  };

  set("brand", f.brand);
  set("maxPrice", f.maxPrice);
  set("minYear", f.minYear);
  set("maxMileage", f.maxMileage);
  set("fuel", f.fuel);
  set("region", f.region);
  if (view !== "flip") set("seller", f.seller); // the flip view is private sellers by definition

  if (view === "all") {
    set("minScore", f.minScore);
    q.includeSuspect = f.showSuspect;
  }
  if (view === "new") {
    set("costs", f.costs);
    set("minMargin", f.minMargin);
    set("days", f.days);
    if (f.crossedBelowFair) q.crossedBelowFair = true;
  }
  if (view === "negotiation") {
    set("minDays", f.minDays);
    set("maxDays", f.maxDays);
    set("minDrops", f.minDrops);
    set("maxOverpricingPct", f.maxOverpricingPct);
    q.aboveFairOnly = f.aboveFairOnly;
    q.minSignal = f.minSignal;
  }
  if (view === "flip") {
    set("costs", f.costs);
    set("minMargin", f.minMargin);
    set("minComparables", f.minComparables);
    set("maxDays", f.maxDays);
  }

  if (sort) {
    q.sort = sort.key;
    q.dir = sort.dir;
  }
  return q;
};
