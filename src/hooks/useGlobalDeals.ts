import { useState, useEffect } from "react";
import { dashboardApi } from "../api/dashboardApi";
import * as T from "../types";

export const useGlobalDeals = () => {
  const [deals, setDeals] = useState<T.GlobalDealDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // English Comment: Server-side pagination state
  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(50);

  // English Comment: UI-level filtering states
  const [searchTerm, setSearchTerm] = useState<string>("");
  // English Comment: Set to an integer base scale of 1-100 instead of small decimals
  const [minVfm, setMinVfm] = useState<number>(0);

  useEffect(() => {
    // English Comment: Ignore flag to prevent race conditions or state overwrites from unmounted component instances
    let isMounted = true;

    const fetchDeals = async () => {
      setLoading(true);
      try {
        const response = await dashboardApi.getGlobalDeals(page, pageSize);

        if (isMounted) {
          // English Comment: Extract the nested 'data' array property from the paginated API envelope wrapper safely
          if (response && response.data && Array.isArray(response.data)) {
            setDeals(response.data);
          } else if (Array.isArray(response)) {
            // English Comment: Fallback case if the API layer already unpacks the response envelope into a direct array
            setDeals(response);
          } else {
            setDeals([]);
          }
          setError(null);
        }
      } catch (err: unknown) {
        if (isMounted) {
          const errorMessage = err instanceof Error ? err.message : "Failed to fetch global deals.";
          setError(errorMessage);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchDeals();

    // English Comment: Cleanup function toggling the active mount flag when the effect triggers a re-fetch or unmounts
    return () => {
      isMounted = false;
    };
  }, [page, pageSize]);

  // English Comment: Map and transform values early so client-side filtering works on the 1-100 scale
  const transformedDeals = deals.map((deal) => {
    // English Comment: Convert the decimal score (e.g., 1.87) into a 1-100 scale (e.g., 93.5). Adjust multiplier as needed.
    const rawScore = deal.vfmScore ?? 0;
    const scaledScore = Math.round(rawScore * 50);

    return {
      ...deal,
      vfmScore: scaledScore,
      // English Comment: Force conversion of listingUrl to a primitive string to prevent object mismatches or type errors in layouts
      listingUrl: deal.listingUrl ? String(deal.listingUrl) : "",
      // English Comment: Explicitly keeping whole address data intact as specified by Addressseller requirements
      addressSeller: deal.addressSeller || "",
    };
  });

  // English Comment: Client-side filtering running directly against the newly scaled 1-100 metrics
  const filteredDeals = transformedDeals.filter((deal) => {
    const brandMatch = deal.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false;
    const modelMatch = deal.model?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false;
    const vfmMatch = deal.vfmScore >= minVfm;

    return (brandMatch || modelMatch) && vfmMatch;
  });

  return {
    deals: filteredDeals,
    loading,
    error,

    // filtering UI
    searchTerm,
    setSearchTerm,
    minVfm,
    setMinVfm,

    // pagination
    page,
    setPage,
    pageSize,
  };
};
