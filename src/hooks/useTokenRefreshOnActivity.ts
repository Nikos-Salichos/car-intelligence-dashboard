import { useEffect, useRef } from "react";
import { authApi } from "../api/authApi";

const REFRESH_INTERVAL = 5 * 60 * 1000;
const ACTIVITY_EVENTS = ["mousemove", "keydown", "click", "scroll", "wheel"] as const;

export const useTokenRefreshOnActivity = () => {
  const lastRefreshTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    const handleUserActivity = async () => {
      const now = Date.now();
      if (now - lastRefreshTimeRef.current < REFRESH_INTERVAL) return;

      lastRefreshTimeRef.current = now;
      try {
        const userEmail = localStorage.getItem("userEmail") || "";
        const response = await authApi.refreshToken(userEmail);
        if (response?.token) localStorage.setItem("token", response.token);
      } catch (err) {
        console.error("Failed to refresh token on user activity:", err);
      }
    };

    ACTIVITY_EVENTS.forEach((e) => window.addEventListener(e, handleUserActivity));
    return () => {
      ACTIVITY_EVENTS.forEach((e) => window.removeEventListener(e, handleUserActivity));
    };
  }, []);
};
