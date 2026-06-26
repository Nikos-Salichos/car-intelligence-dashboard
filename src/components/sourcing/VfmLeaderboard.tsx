import React, { useState } from "react";
import { VfmLeaderboardDto } from "../../types";

interface Props {
  data: VfmLeaderboardDto[];
  initialMinScore: number;
  onExecute: (score: number) => void;
  isLoading?: boolean;
}

export const VfmLeaderboard: React.FC<Props> = ({ data, initialMinScore, onExecute, isLoading = false }) => {
  const [inputValue, setInputValue] = useState<string>(initialMinScore.toString());

  // English Comment: Resolved the SonarLint deprecated message warning by referencing standard FormEvent
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const score = Number(inputValue);

    if (score >= 1 && score <= 100) {
      onExecute(score);
    } else {
      alert("Please enter a score between 1 and 100.");
    }
  };

  return (
    <div style={{ backgroundColor: "#fff", padding: "1.5rem", borderRadius: "8px", boxShadow: "0 4px 6px rgba(0,0,0,0.05)", position: "relative" }}>
      {/* Visual background opacity layer to show background fetching seamlessly */}
      {isLoading && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(255, 255, 255, 0.6)",
            borderRadius: "8px",
            zIndex: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
            color: "#0070f3",
          }}
        >
          Updating records...
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <h3 style={{ margin: 0, color: "#222" }}>Sourcing Tool (VFM Leaderboard)</h3>

        <form onSubmit={handleSubmit} style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.9rem" }}>
          <label htmlFor="minScore" style={{ color: "#666" }}>
            Min VFM Score (1-100):
          </label>
          <input
            id="minScore"
            type="number"
            min="1"
            max="100"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isLoading}
            style={{
              width: "60px",
              padding: "0.3rem",
              borderRadius: "4px",
              border: "1px solid #ccc",
              textAlign: "center",
            }}
          />
          <span style={{ marginRight: "0.5rem" }}>%</span>
          <button
            type="submit"
            disabled={isLoading}
            style={{
              backgroundColor: isLoading ? "#ccc" : "#0070f3",
              color: "#fff",
              border: "none",
              padding: "0.4rem 1rem",
              borderRadius: "4px",
              cursor: isLoading ? "not-allowed" : "pointer",
              fontWeight: "500",
            }}
          >
            Execute
          </button>
        </form>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #eee", color: "#666", fontSize: "0.9rem" }}>
              <th style={{ padding: "0.75rem" }}>Asset Models</th>
              <th style={{ padding: "0.75rem" }}>Price</th>
              <th style={{ padding: "0.75rem" }}>Mileage</th>
              <th style={{ padding: "0.75rem" }}>Seller Address</th>
              <th style={{ padding: "0.75rem" }}>VFM Score</th>
              <th style={{ padding: "0.75rem" }}>Link</th>
            </tr>
          </thead>
          <tbody>
            {data && data.length > 0 ? (
              data.slice(0, 10).map((item) => (
                // English Comment: Fixed SonarLint key warning by utilizing unique identifier property listingUrl instead of index
                <tr key={item.listingUrl} style={{ borderBottom: "1px solid #f7f7f7", fontSize: "0.95rem" }}>
                  <td style={{ padding: "0.75rem", fontWeight: "bold" }}>
                    {item.brand} {item.model}
                  </td>
                  <td style={{ padding: "0.75rem" }}>€{item.price.toLocaleString()}</td>
                  <td style={{ padding: "0.75rem" }}>{item.mileage.toLocaleString()} km</td>
                  <td style={{ padding: "0.75rem", fontSize: "0.85rem", color: "#555" }}>{item.addressSeller}</td>
                  <td style={{ padding: "0.75rem", fontWeight: "bold", color: "#2e7d32" }}>{item.vfmScore}%</td>
                  <td style={{ padding: "0.75rem" }}>{item.listingUrl}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} style={{ padding: "1rem", textAlign: "center", color: "#999" }}>
                  No data found matching criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
