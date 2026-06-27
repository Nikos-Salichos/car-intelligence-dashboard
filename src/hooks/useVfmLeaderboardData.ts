import { useState, useEffect } from "react";
import { dashboardApi } from "../api/dashboardApi";
import { withRetry } from "../utils/withRetry";
import * as T from "../types";

// English Comment: Isolated hook declaration specifically for managing the independent VFM Leaderboard lifecycle
export const useVfmLeaderboardData = (initialMinScore: number = 80) => {
    const [minScore, setMinScore] = useState<number>(initialMinScore);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [vfmLeaderboard, setVfmLeaderboard] = useState<T.VfmLeaderboardDto[]>([]);

    useEffect(() => {
        const fetchLeaderboardData = async () => {
            setLoading(true);
            try {
                // English Comment: Executing the specialized API pipeline for the leaderboard with standard retry logic
                const data = await withRetry(() => dashboardApi.getVfmLeaderboard(minScore));
                setVfmLeaderboard(data);
                setError(null);
            } catch (err: unknown) {
                // English Comment: Standard catch boundary fallback for unexpected request failures
                const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred while fetching the leaderboard metrics.";
                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboardData();
    }, [minScore]);

    return {
        loading,
        error,
        vfmLeaderboard,
        minScore,
        updateMinScore: setMinScore,
    };
};