import { useCallback, useEffect, useState } from "react";
import axios from "axios";

/** The server answer's own Greek message (a 400/404 carries one), else the fallback. Never the English text of axios. */
export const errorMessage = (err: unknown, fallback: string): string => {
  const message = axios.isAxiosError(err) ? (err.response?.data as { message?: string } | undefined)?.message : undefined;
  return message ?? fallback;
};

/**
 * Loads data when `key` changes (a string, so callers decide what counts as a new request) and ignores answers that arrive late.
 * No retry on purpose: a 400/404 is an answer, asking again changes nothing.
 */
export function useApi<T>(load: () => Promise<T>, key: string, fallbackError: string) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true); // eslint-disable-line react-hooks/set-state-in-effect -- every new request starts as "loading"
    load()
      .then((result) => !cancelled && (setData(result), setError(null)))
      .catch((err: unknown) => !cancelled && (setData(null), setError(errorMessage(err, fallbackError))))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `key` stands for everything `load` depends on
  }, [key, attempt]);

  const reload = useCallback(() => setAttempt((n) => n + 1), []);
  return { data, error, loading, reload };
}
