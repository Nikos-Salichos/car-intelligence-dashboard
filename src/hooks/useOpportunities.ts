import { useEffect, useState } from "react";
import axios from "axios";
import { dashboardApi } from "../api/dashboardApi";
import { OpportunityFilters, OpportunityPageDto, OpportunityView } from "../types/opportunities";

// Only the settings a view understands are sent, and empty inputs are not sent at all.
export const buildQuery = (view: OpportunityView, f: OpportunityFilters): Record<string, string | number | boolean> => {
  const q: Record<string, string | number | boolean> = { view };
  const text = (key: string, value: string) => value.trim() && (q[key] = value.trim());
  text("brand", f.brand);
  text("maxPrice", f.maxPrice);
  text("minYear", f.minYear);
  text("maxMileage", f.maxMileage);
  text("fuel", f.fuel);
  text("region", f.region);
  if (view !== "flip") text("seller", f.seller); // the flip view is private sellers by definition
  if (view !== "mature") {
    text("costs", f.costs);
    text("minMargin", f.minMargin);
  }
  if (view === "new") {
    text("days", f.days);
    if (f.crossedBelowFair) q.crossedBelowFair = true;
    if (f.includeSuspect) q.includeSuspect = true;
  }
  if (view === "mature") {
    text("minDays", f.minDays);
    text("minDrops", f.minDrops);
    text("maxOverpricingPct", f.maxOverpricingPct);
  }
  if (view === "mature" || view === "flip") text("maxDays", f.maxDays);
  if (view === "flip") text("minComparables", f.minComparables);
  return q;
};

// No retry on purpose: a 404/400 is an answer ("not enough data", "bad filter"), asking again will not change it.
export const useOpportunities = (view: OpportunityView, applied: OpportunityFilters) => {
  const [data, setData] = useState<OpportunityPageDto | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const key = JSON.stringify(buildQuery(view, applied));

  useEffect(() => {
    let cancelled = false;
    setLoading(true); // eslint-disable-line react-hooks/set-state-in-effect -- a new query always starts as "loading"
    dashboardApi
      .getOpportunities(JSON.parse(key))
      .then((page) => !cancelled && (setData(page), setError(null)))
      .catch((err: unknown) => {
        if (cancelled) return;
        const message = axios.isAxiosError(err) ? (err.response?.data as { message?: string } | undefined)?.message : undefined;
        setData(null);
        setError(message ?? "Η φόρτωση των ευκαιριών απέτυχε. Δοκιμάστε ξανά.");
      })
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [key]);

  return { data, error, loading };
};
