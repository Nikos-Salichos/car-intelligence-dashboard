import { useCallback, useEffect, useState } from "react";
import { dashboardApi } from "../api/dashboardApi";
import type { NegotiationLevel, NegotiationSignalDto } from "../types";

export const useNegotiationSignals = (initialLevel: NegotiationLevel = "medium") => {
  const [minSignal, setMinSignal] = useState<NegotiationLevel>(initialLevel);
  const [signals, setSignals] = useState<NegotiationSignalDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false; // ignore stale responses when the filter changes quickly

    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await dashboardApi.getNegotiationSignals(minSignal);
        if (!cancelled) setSignals(data);
      } catch (err: unknown) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load negotiation signals");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [minSignal]);

  const updateMinSignal = useCallback((level: NegotiationLevel) => setMinSignal(level), []);

  return { signals, loading, error, minSignal, updateMinSignal };
};