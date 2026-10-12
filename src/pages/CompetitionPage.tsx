import React from "react";
import { useCompetitionAnalysis } from "../hooks/useCompetitionAnalysis";
import { useTokenRefreshOnActivity } from "../hooks/useTokenRefreshOnActivity";
import { Competition } from "../components/sourcing/Competition";

export const CompetitionPage: React.FC = () => {
    const { rows, loading, error, minPerSide, updateMinPerSide } = useCompetitionAnalysis(3);

    useTokenRefreshOnActivity();

    return (
        <div className="p-6 bg-gray-950 min-h-screen w-full flex-1 flex flex-col">
            <div className="w-full flex-1 flex flex-col">
                {error && (
                    <div className="p-3 bg-red-950/40 border border-red-900/60 text-red-400 rounded-lg mb-4 text-xs font-medium">
                        {error}
                    </div>
                )}

                <Competition
                    data={rows}
                    minPerSide={minPerSide}
                    onChangeMinPerSide={updateMinPerSide}
                    isLoading={loading}
                />
            </div>
        </div>
    );
};

export default CompetitionPage;