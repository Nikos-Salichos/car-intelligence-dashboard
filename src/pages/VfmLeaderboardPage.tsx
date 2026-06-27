import React from "react";
import { useVfmLeaderboardData } from "../hooks/useVfmLeaderboardData";
import { VfmLeaderboard } from "../components/sourcing/VfmLeaderboard";

// English Comment: Isolated View Page wrapping the extracted standalone Vfm Leaderboard state model
export const VfmLeaderboardPage: React.FC = () => {
    const { vfmLeaderboard, loading, error, minScore, updateMinScore } = useVfmLeaderboardData(80);

    return (
        <div style={{ padding: "2rem", backgroundColor: "#f4f6f8", minHeight: "100vh", fontFamily: "system-ui, sans-serif" }}>
            {error && (
                <div style={{ padding: "1rem", backgroundColor: "#ffebee", color: "#c62828", borderRadius: "4px", marginBottom: "1rem" }}>
                    {error}
                </div>
            )}

            <VfmLeaderboard
                data={vfmLeaderboard}
                initialMinScore={minScore}
                onExecute={updateMinScore}
                isLoading={loading}
            />
        </div>
    );
};

export default VfmLeaderboardPage;