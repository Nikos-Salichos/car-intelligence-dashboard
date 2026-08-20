import React from "react";
import { useVfmLeaderboardData } from "../hooks/useVfmLeaderboardData";
import { VfmLeaderboard } from "../components/sourcing/VfmLeaderboard";

export const VfmLeaderboardPage: React.FC = () => {
  const { vfmLeaderboard, loading, error, minScore, updateMinScore } = useVfmLeaderboardData(0.0);

  return (
    <div className="p-6 bg-gray-950 min-h-screen w-full flex-1 flex flex-col">
      <div className="w-full flex-1 flex flex-col">
        {error && (
          <div className="p-3 bg-red-950/40 border border-red-900/60 text-red-400 rounded-lg mb-4 text-xs font-medium">
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
    </div>
  );
};

export default VfmLeaderboardPage;