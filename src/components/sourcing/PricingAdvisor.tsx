import React, { useState, useMemo } from "react";
import { dashboardApi } from "../../api/dashboardApi";
import { MarketAdvisorDto, AvailableCarsMap } from "../../types";

interface Props {
  carsMap?: AvailableCarsMap | null;
}

export const PricingAdvisor: React.FC<Props> = ({ carsMap }) => {
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [metrics, setMetrics] = useState<MarketAdvisorDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 🔒 SAFE fallback (prevents runtime crashes if carsMap is null or undefined)
  const safeCarsMap = useMemo(() => carsMap ?? {}, [carsMap]);

  // Memoize brands array to prevent unnecessary recalculations on re-renders
  const brands = useMemo(() => Object.keys(safeCarsMap), [safeCarsMap]);

  // Dynamically resolve models whenever the selected brand changes
  const models = useMemo(() => {
    if (!brand) return [];
    return safeCarsMap[brand] ?? [];
  }, [brand, safeCarsMap]);

  const handleLookup = async () => {
    if (!brand || !model) {
      setError("Please select both brand and model.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await dashboardApi.getMarketAdvisor(brand, model);
      setMetrics(data);
    } catch (err: unknown) {
      console.error("[PricingAdvisor] API error:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to fetch market data");
      }
      setMetrics(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#fff",
        padding: "1.5rem",
        borderRadius: "8px",
        boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
      }}
    >
      <h3>Pricing Advisor (Market Overview)</h3>

      {/* ERROR STATE */}
      {error && (
        <div
          style={{
            marginBottom: "1rem",
            padding: "0.75rem",
            backgroundColor: "#ffe5e5",
            color: "#b00020",
            borderRadius: "6px",
          }}
        >
          {error}
        </div>
      )}

      {/* INPUTS */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
        <select
          value={brand}
          onChange={(e) => {
            setBrand(e.target.value);
            setModel(""); // Clear model selection when brand shifts
          }}
          style={{ padding: "0.5rem", flex: 1 }}
        >
          <option value="">Select Brand</option>
          {brands.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>

        <select value={model} onChange={(e) => setModel(e.target.value)} disabled={!brand} style={{ padding: "0.5rem", flex: 1 }}>
          <option value="">Select Model</option>
          {models.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>

        <button
          onClick={handleLookup}
          disabled={loading || !brand || !model}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: loading || !brand || !model ? "#999" : "#0070f3",
            color: "#fff",
            border: "none",
            cursor: loading || !brand || !model ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Evaluating..." : "Query Engine"}
        </button>
      </div>

      {/* RESULTS */}
      {metrics && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "1rem",
            backgroundColor: "#f9f9f9",
            padding: "1rem",
            borderRadius: "6px",
          }}
        >
          <div>
            <strong>Total Pool Listings:</strong> {metrics.totalActiveListings ?? 0} units
          </div>

          <div>
            <strong>Average Price:</strong> €{(metrics.averagePrice ?? 0).toLocaleString()}
          </div>

          <div>
            <strong>Volatility Index:</strong> {metrics.priceVolatilityPercentage ?? 0}%
          </div>

          <div>
            <strong>Price Standard Deviation:</strong> €{(metrics.priceStandardDeviation ?? 0).toLocaleString()}
          </div>

          <div>
            <strong>Minimum Entry Price:</strong> €{(metrics.minimumPrice ?? 0).toLocaleString()}
          </div>

          <div>
            <strong>Maximum Ceiling Price:</strong> €{(metrics.maximumPrice ?? 0).toLocaleString()}
          </div>
        </div>
      )}
    </div>
  );
};
