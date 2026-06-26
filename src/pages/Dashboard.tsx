import React, { useState } from "react";
import { useDashboardData } from "../hooks/useDashboardData";
import { VfmLeaderboard } from "../components/sourcing/VfmLeaderboard";
import { PricingAdvisor } from "../components/sourcing/PricingAdvisor";
import { FastInventory } from "../components/sourcing/FastInventory";
import { MarketAlerts } from "../components/sourcing/MarketAlerts";
import { CompetitionMatrix } from "../components/analytics/CompetitionMatrix";
import { DepreciationCurve } from "../components/analytics/DepreciationCurve";
import { FuelMarketShare } from "../components/analytics/FuelMarketShare";
import { GeoDistribution } from "../components/analytics/GeoDistribution";
import { ScraperHealth } from "../components/health/ScraperHealth";

import type { VfmLeaderboardDto, CompetitionAnalysisDto, FuelMarketShareDto, GeographicDistributionDto, ScraperHealthDto, MarketAlertDto, BulkDepreciationDto, FastMovingCarDto, AvailableCarsMap } from "../types";

export const Dashboard: React.FC = () => {
  const [executedScore, setExecutedScore] = useState<number>(80);

  const dashboard = useDashboardData(executedScore) as unknown as {
    loading: boolean;
    error: string | null;

    vfmLeaderboard: VfmLeaderboardDto[];
    competition: CompetitionAnalysisDto[];
    fuelShare: FuelMarketShareDto[];
    geoDistribution: GeographicDistributionDto[];

    scraperHealth: ScraperHealthDto;

    marketAlerts: MarketAlertDto[];
    bulkDepreciation: BulkDepreciationDto[];
    fastInventory: FastMovingCarDto[];

    availableCars: AvailableCarsMap | Map<string, string[]>;
  };

  const { loading, error, vfmLeaderboard, competition, fuelShare, geoDistribution, scraperHealth, marketAlerts, bulkDepreciation, fastInventory, availableCars } = dashboard;

  if (error) {
    return (
      <div
        style={{
          padding: "2rem",
          margin: "2rem",
          backgroundColor: "#ffebee",
          color: "#c62828",
          borderRadius: "8px",
        }}
      >
        <h3>Pipeline Transport Exception</h3>
        <p>{error}</p>
      </div>
    );
  }

  const carsMap: AvailableCarsMap = Object.fromEntries(availableCars instanceof Map ? availableCars.entries() : Object.entries(availableCars ?? {})) as AvailableCarsMap;

  return (
    <div
      style={{
        padding: "2rem",
        backgroundColor: "#f4f6f8",
        minHeight: "100vh",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div style={{ marginBottom: "2rem" }}>
        <ScraperHealth health={scraperHealth} />
      </div>

      {loading && (
        <div
          style={{
            padding: "0.5rem 1rem",
            marginBottom: "1rem",
            backgroundColor: "#e3f2fd",
            color: "#0d47a1",
            borderRadius: "4px",
            fontSize: "0.9rem",
            fontWeight: "bold",
          }}
        >
          🔄 Syncing Gateway Matrix Kernels...
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "2rem",
          marginBottom: "2rem",
        }}
      >
        <VfmLeaderboard data={vfmLeaderboard} initialMinScore={executedScore} onExecute={setExecutedScore} isLoading={loading} />

        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          <PricingAdvisor carsMap={carsMap} />
          <MarketAlerts data={marketAlerts} />
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(450px, 1fr))",
          gap: "2rem",
        }}
      >
        <CompetitionMatrix data={competition} />
        <DepreciationCurve data={bulkDepreciation} />
        <FuelMarketShare data={fuelShare} />
        <GeoDistribution data={geoDistribution} />
        <FastInventory data={fastInventory} />
      </div>
    </div>
  );
};

export default Dashboard;
