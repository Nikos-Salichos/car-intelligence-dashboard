import { useState, useEffect } from "react";
import { dashboardApi } from "../api/dashboardApi";
import { withRetry } from "../utils/withRetry";
import * as T from "../types";

// English Comment: Hook declaration receiving minScore value parameter to trigger controlled re-fetches
export const useDashboardData = (minScore: number = 80) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // English Comment: Strongly typed React states mapped to the official backend API DTO contracts
  const [vfmLeaderboard, setVfmLeaderboard] = useState<T.VfmLeaderboardDto[]>([]);
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
        // English Comment: Wrapping each distinct API pipeline in the extracted retry wrapper to handle transient token availability anomalies individually
        const results = await Promise.allSettled([
          withRetry(() => dashboardApi.getVfmLeaderboard(minScore)),
          withRetry(() => dashboardApi.getCompetitionAnalysis()),
          withRetry(() => dashboardApi.getFuelMarketShare()),
          withRetry(() => dashboardApi.getGeographicDistribution()),
          withRetry(() => dashboardApi.getScraperHealth()),
          withRetry(() => dashboardApi.getMarketAlerts()),
          withRetry(() => dashboardApi.getBulkDepreciation()),
          withRetry(() => dashboardApi.getFastMovingInventory()),
          withRetry(() => dashboardApi.getAvailableCars()),
        ]);

        // English Comment: Destructuring settled promises safely and logging failing endpoints for debug purposes
        const [leaderboardRes, competitionRes, fuelShareRes, geoDistributionRes, scraperHealthRes, marketAlertsRes, bulkDepreciationRes, fastInventoryRes, availableCarsRes] = results;

        // English Comment: Check and assign vfmLeaderboard response
        if (leaderboardRes.status === "fulfilled") setVfmLeaderboard(leaderboardRes.value);

        // English Comment: Check and assign competition response
        if (competitionRes.status === "fulfilled") setCompetition(competitionRes.value);

        // English Comment: Check and assign fuelShare response
        if (fuelShareRes.status === "fulfilled") setFuelShare(fuelShareRes.value);

        // English Comment: Check and assign geoDistribution response
        if (geoDistributionRes.status === "fulfilled") setGeoDistribution(geoDistributionRes.value);

        // English Comment: Check and assign scraperHealth response
        if (scraperHealthRes.status === "fulfilled") setScraperHealth(scraperHealthRes.value);

        // English Comment: Check and assign marketAlerts response
        if (marketAlertsRes.status === "fulfilled") setMarketAlerts(marketAlertsRes.value);

        // English Comment: Check and assign bulkDepreciation response
        if (bulkDepreciationRes.status === "fulfilled") setBulkDepreciation(bulkDepreciationRes.value);

        // English Comment: Check and assign fastInventory response
        if (fastInventoryRes.status === "fulfilled") setFastInventory(fastInventoryRes.value);

        // English Comment: Check and assign availableCars response
        if (availableCarsRes.status === "fulfilled") setAvailableCars(availableCarsRes.value);

        // English Comment: Check if any critical API service failed entirely after 10 retry attempts to notify client UI
        const failedCount = results.filter((r) => r.status === "rejected").length;
        if (failedCount > 0) {
          setError(`Warning: ${failedCount} background metrics pipelines failed to load even after retry fallback strategies.`);
        } else {
          setError(null);
        }
      } catch (err: unknown) {
        // English Comment: Fallback catch boundary block for unexpected synchronous execution panics
        const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred while processing remote metrics pipelines.";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [minScore]); // English Comment: Adding minScore value subscription to trigger clean execution on click action

  return {
    loading,
    error,
    vfmLeaderboard,
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
