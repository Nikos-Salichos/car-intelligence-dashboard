import React, { useEffect, useRef } from "react";
import { useVfmLeaderboardData } from "../hooks/useVfmLeaderboardData";
import { VfmLeaderboard } from "../components/sourcing/VfmLeaderboard";
import { authApi } from "../api/authApi";

export const VfmLeaderboardPage: React.FC = () => {
  const { vfmLeaderboard, loading, error, minScore, updateMinScore } = useVfmLeaderboardData(0.0);

  // English Comment: Timestamp ref to track the last token refresh time for throttling
  const lastRefreshTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    // English Comment: Minimum interval between token refresh calls (e.g., 5 minutes in ms)
    const REFRESH_INTERVAL = 5 * 60 * 1000;

    const handleUserActivity = async () => {
      const now = Date.now();

      // English Comment: Only refresh token if enough time has passed since the last refresh
      if (now - lastRefreshTimeRef.current >= REFRESH_INTERVAL) {
        lastRefreshTimeRef.current = now;
        try {
          const userEmail = localStorage.getItem("userEmail") || "";
          const response = await authApi.refreshToken(userEmail);

          if (response && response.token) {
            localStorage.setItem("token", response.token);
          }
        } catch (err) {
          // English Comment: Log error silently or handle token expiration
          console.error("Failed to refresh token on user activity:", err);
        }
      }
    };

    // English Comment: Attach activity listeners to track user interactions
    const activityEvents: string[] = ["mousemove", "keydown", "click", "scroll", "wheel"];

    activityEvents.forEach((event) => {
      window.addEventListener(event, handleUserActivity);
    });

    // English Comment: Cleanup event listeners on component unmount
    return () => {
      activityEvents.forEach((event) => {
        window.removeEventListener(event, handleUserActivity);
      });
    };
  }, []);

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