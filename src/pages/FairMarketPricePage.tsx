import React, { useEffect, useRef } from "react";
import { useFairMarketPriceData } from "../hooks/useFairMarketPriceData";
import { FairMarketPriceCalculator } from "../components/valuation/FairMarketPriceCalculator";
import { authApi } from "../api/authApi";

export const FairMarketPricePage: React.FC = () => {
    const { cars, loadingCars, calculating, error, result, calculatePrice } =
        useFairMarketPriceData();

    const lastRefreshTimeRef = useRef<number>(Date.now());

    useEffect(() => {
        const REFRESH_INTERVAL = 5 * 60 * 1000;

        const handleUserActivity = async () => {
            const now = Date.now();
            if (now - lastRefreshTimeRef.current >= REFRESH_INTERVAL) {
                lastRefreshTimeRef.current = now;
                try {
                    const userEmail = localStorage.getItem("userEmail") || "";
                    const response = await authApi.refreshToken(userEmail);
                    if (response && response.token) {
                        localStorage.setItem("token", response.token);
                    }
                } catch (err) {
                    console.error("Failed to refresh token on user activity:", err);
                }
            }
        };

        const activityEvents: string[] = ["mousemove", "keydown", "click", "scroll", "wheel"];
        activityEvents.forEach((event) => {
            window.addEventListener(event, handleUserActivity);
        });

        return () => {
            activityEvents.forEach((event) => {
                window.removeEventListener(event, handleUserActivity);
            });
        };
    }, []);

    return (
        <div className="p-6 bg-gray-950 min-h-screen w-full flex-1 flex flex-col items-center">
            <div className="w-full flex-1 flex flex-col">
                {error && (
                    <div className="p-3 bg-red-950/40 border border-red-900/60 text-red-400 rounded-lg mb-4 text-xs font-medium max-w-4xl mx-auto w-full">
                        {error}
                    </div>
                )}

                <FairMarketPriceCalculator
                    cars={cars}
                    loadingCars={loadingCars}
                    calculating={calculating}
                    result={result}
                    onCalculate={calculatePrice}
                />
            </div>
        </div>
    );
};

export default FairMarketPricePage;