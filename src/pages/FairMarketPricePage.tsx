import React from "react";
import { useFairMarketPriceData } from "../hooks/useFairMarketPriceData";
import { useTokenRefreshOnActivity } from "../hooks/useTokenRefreshOnActivity";
import { FairMarketPriceCalculator } from "../components/valuation/FairMarketPriceCalculator";

export const FairMarketPricePage: React.FC = () => {
  const { cars, loadingCars, calculating, error, result, calculatePrice } = useFairMarketPriceData();

  useTokenRefreshOnActivity();

  return (
    <div className="p-6 bg-gray-950 min-h-screen w-full flex-1 flex flex-col items-center">
      <div className="w-full flex-1 flex flex-col">
        {error && <div className="p-3 bg-red-950/40 border border-red-900/60 text-red-400 rounded-lg mb-4 text-xs font-medium max-w-4xl mx-auto w-full">{error}</div>}

        <FairMarketPriceCalculator cars={cars} loadingCars={loadingCars} calculating={calculating} result={result} onCalculate={calculatePrice} />
      </div>
    </div>
  );
};

export default FairMarketPricePage;
