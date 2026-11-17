import { useState, useEffect } from "react";
import { dashboardApi } from "../api/dashboardApi";
import { withRetry } from "../utils/withRetry";
import * as T from "../types";

// English Comment: Isolated hook declaration specifically for managing the independent Κατάταξη Ευκαιριών lifecycle
export const useVfmLeaderboardData = (initialMinScore: number = 0.0) => {
    const [minScore, setMinScore] = useState<number>(initialMinScore);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [vfmLeaderboard, setVfmLeaderboard] = useState<T.VfmLeaderboardDto[]>([]);

    useEffect(() => {
        let isCancelled = false;

        const fetchLeaderboardData = async () => {
            setLoading(true);
            try {
                // English Comment: Executing the specialized API pipeline for the leaderboard with standard retry logic
                const data = await withRetry(() => dashboardApi.getVfmLeaderboard(minScore));
                if (!isCancelled) {
                    setVfmLeaderboard(data);
                    setError(null);
                }
            } catch {
                if (!isCancelled) {
                    // English Comment: Standard catch boundary fallback for unexpected request failures
                    const errorMessage =
                        "Η φόρτωση της κατάταξης απέτυχε. Δοκιμάστε ξανά.";
                    setError(errorMessage);
                }
            } finally {
                if (!isCancelled) {
                    setLoading(false);
                }
            }
        };

        fetchLeaderboardData();

        return () => {
            isCancelled = true;
        };
    }, [minScore]);

    return {
        loading,
        error,
        vfmLeaderboard,
        minScore,
        updateMinScore: setMinScore,
    };
};