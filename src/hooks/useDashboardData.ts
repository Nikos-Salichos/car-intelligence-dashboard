import { useState, useEffect } from "react";
import { dashboardApi } from "../api/dashboardApi";
import { withRetry } from "../utils/withRetry";
import * as T from "../types";

// English Comment: Cleaned Hook declaration handling core metrics without any external VFM parameter dependencies
export const useDashboardData = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // English Comment: Removed vfmLeaderboard state to completely decouple the pipeline from the main dashboard context
  const [competition, setCompetition] = useState<T.CompetitionAnalysisDto[]>([]);
  const [fuelShare, setFuelShare] = useState<T.FuelMarketShareDto[]>([]);
  const [geoDistribution, setGeoDistribution] = useState<T.GeographicDistributionDto[]>([]);
  const [scraperHealth, setScraperHealth] = useState<T.ScraperHealthDto | null>(null);
  const [marketAlerts, setMarketAlerts] = useState<T.MarketAlertDto[]>([]);
  const [bulkDepreciation, setBulkDepreciation] = useState<T.BulkDepreciationDto[]>([]);
  const [fastInventory, setFastInventory] = useState<T.FastMovingCarDto[]>([]);
  const [availableCars, setAvailableCars] = useState<T.AvailableCarsMap | null>(null);

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        // English Comment: Executing global dashboard pipelines concurrently, omitted specific leaderboard endpoint
        const results = await Promise.allSettled([
          withRetry(() => dashboardApi.getCompetitionAnalysis()),
          withRetry(() => dashboardApi.getFuelMarketShare()),
          withRetry(() => dashboardApi.getGeographicDistribution()),
          withRetry(() => dashboardApi.getScraperHealth()),
          withRetry(() => dashboardApi.getMarketAlerts()),
          withRetry(() => dashboardApi.getBulkDepreciation()),
          withRetry(() => dashboardApi.getFastMovingInventory()),
          withRetry(() => dashboardApi.getAvailableCars()),
        ]);

        const [competitionRes, fuelShareRes, geoDistributionRes, scraperHealthRes, marketAlertsRes, bulkDepreciationRes, fastInventoryRes, availableCarsRes] = results;

        if (competitionRes.status === "fulfilled") setCompetition(competitionRes.value);
        if (fuelShareRes.status === "fulfilled") setFuelShare(fuelShareRes.value);
        if (geoDistributionRes.status === "fulfilled") setGeoDistribution(geoDistributionRes.value);
        if (scraperHealthRes.status === "fulfilled") setScraperHealth(scraperHealthRes.value);
        if (marketAlertsRes.status === "fulfilled") setMarketAlerts(marketAlertsRes.value);
        if (bulkDepreciationRes.status === "fulfilled") setBulkDepreciation(bulkDepreciationRes.value);
        if (fastInventoryRes.status === "fulfilled") setFastInventory(fastInventoryRes.value);
        if (availableCarsRes.status === "fulfilled") setAvailableCars(availableCarsRes.value);

        const failedCount = results.filter((r) => r.status === "rejected").length;
        if (failedCount > 0) {
          setError(`Warning: ${failedCount} background metrics pipelines failed to load even after retry fallback strategies.`);
        } else {
          setError(null);
        }
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred while processing remote metrics pipelines.";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []); // English Comment: Empty dependency array ensures this fires strictly once on component initialization

  return {
    loading,
    error,
    competition,
    fuelShare,
    geoDistribution,
    scraperHealth,
    marketAlerts,
    bulkDepreciation,
    fastInventory,
    availableCars,
  };
};