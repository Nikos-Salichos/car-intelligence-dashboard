import { useCallback, useEffect, useState } from "react";
import { dashboardApi } from "../api/dashboardApi";
import type { CompetitionAnalysisDto } from "../types";

export const useCompetitionAnalysis = (initialMinPerSide = 3) => {
    const [minPerSide, setMinPerSide] = useState<number>(initialMinPerSide);
    const [rows, setRows] = useState<CompetitionAnalysisDto[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        const load = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await dashboardApi.getCompetitionAnalysis(minPerSide);
                if (!cancelled) setRows(data);
            } catch (err: unknown) {
                if (!cancelled) {
                    setError(err instanceof Error ? err.message : "Αποτυχία φόρτωσης δεδομένων");
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        void load();
        return () => {
            cancelled = true;
        };
    }, [minPerSide]);

    const updateMinPerSide = useCallback((value: number) => setMinPerSide(value), []);

    return { rows, loading, error, minPerSide, updateMinPerSide };
};