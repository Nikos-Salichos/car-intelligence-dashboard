import React from "react";
import { useNegotiationSignals } from "../hooks/useNegotiationSignals";
import { useTokenRefreshOnActivity } from "../hooks/useTokenRefreshOnActivity";
import { NegotiationSignals } from "../components/sourcing/NegotiationSignals";

export const NegotiationSignalsPage: React.FC = () => {
  const { signals, loading, error, minSignal, updateMinSignal } = useNegotiationSignals("medium");

  useTokenRefreshOnActivity();

  return (
    <div className="p-6 bg-gray-950 min-h-screen w-full flex-1 flex flex-col">
      <div className="w-full flex-1 flex flex-col">
        {error && <div className="p-3 bg-red-950/40 border border-red-900/60 text-red-400 rounded-lg mb-4 text-xs font-medium">{error}</div>}

        <NegotiationSignals data={signals} minSignal={minSignal} onChangeSignal={updateMinSignal} isLoading={loading} />
      </div>
    </div>
  );
};

export default NegotiationSignalsPage;
