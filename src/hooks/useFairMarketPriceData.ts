import { useState, useEffect } from "react";
import { dashboardApi } from "../api/dashboardApi";
import { withRetry } from "../utils/withRetry";
import * as T from "../types";

export const useFairMarketPriceData = () => {
    const [cars, setCars] = useState<T.CarDto[]>([]);
    const [loadingCars, setLoadingCars] = useState<boolean>(true);
    const [calculating, setCalculating] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<T.FairMarketPriceDto | null>(null);

    // Fetch cars list on initial load
    useEffect(() => {
        let isCancelled = false;

        const fetchCars = async () => {
            setLoadingCars(true);
            try {
                const data = await withRetry(() => dashboardApi.getCars());
                if (!isCancelled) {
                    setCars(data);
                    setError(null);
                }
            } catch (err: unknown) {
                if (!isCancelled) {
                    const errorMessage =
                        err instanceof Error
                            ? err.message
                            : "An error occurred while fetching the cars list.";
                    setError(errorMessage);
                }
            } finally {
                if (!isCancelled) {
                    setLoadingCars(false);
                }
            }
        };

        fetchCars();

        return () => {
            isCancelled = true;
        };
    }, []);

    // Function to trigger valuation calculation
    const calculatePrice = async (carId: string, userMileage: number) => {
        if (!carId) {
            setError("Παρακαλώ επιλέξτε όχημα.");
            return;
        }

        setCalculating(true);
        setError(null);

        try {
            const data = await withRetry(() =>
                dashboardApi.getFairMarketPrice(carId, userMileage)
            );
            setResult(data);
        } catch (err: unknown) {
            const errorMessage =
                err instanceof Error
                    ? err.message
                    : "An error occurred while calculating the fair market price.";
            setError(errorMessage);
        } finally {
            setCalculating(false);
        }
    };

    return {
        cars,
        loadingCars,
        calculating,
        error,
        result,
        calculatePrice,
    };
};