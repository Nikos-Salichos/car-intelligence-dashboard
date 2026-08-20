import React from "react";
import { useVfmLeaderboardData } from "../hooks/useVfmLeaderboardData";
import { VfmLeaderboard } from "../components/sourcing/VfmLeaderboard";

export const VfmLeaderboardPage: React.FC = () => {
    const { vfmLeaderboard, loading, error, minScore, updateMinScore } = useVfmLeaderboardData(0.0);

    return (
        <div className="p-4 sm:p-8 bg-gray-50 min-h-screen font-sans">
            <div className="max-w-7xl mx-auto">
                {error && (
                    <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg mb-6 text-sm">
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