import React, { useMemo, useState } from "react";
import type { NegotiationLevel, NegotiationSignalDto } from "../../types";
import { useIsMobile } from "../../hooks/useIsMobile";
import { NegotiationSignalsDesktop } from "./NegotiationSignalsDesktop";
import { NegotiationSignalsMobile } from "./NegotiationSignalsMobile";

interface Props {
  data: NegotiationSignalDto[];
  minSignal: NegotiationLevel;
  onChangeSignal: (level: NegotiationLevel) => void;
  isLoading?: boolean;
}

const LEVELS: { value: NegotiationLevel; label: string }[] = [
  { value: "high", label: "Μόνο υψηλό" },
  { value: "medium", label: "Μέτριο+" },
  { value: "low", label: "Όλα" },
];

export const NegotiationSignals: React.FC<Props> = ({ data, minSignal, onChangeSignal, isLoading = false }) => {
  const isMobile = useIsMobile(768);
  const [search, setSearch] = useState<string>("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return data;
    return data.filter((s) => `${s.brand} ${s.model}`.toLowerCase().includes(q));
  }, [data, search]);

  return (
    <div className="relative w-full h-full bg-gray-950 text-gray-100 font-sans flex flex-col flex-1 touch-manipulation gap-4">
      {isLoading && (
        <div className="absolute inset-0 bg-gray-950/85 backdrop-blur-md z-30 flex items-center justify-center font-bold text-blue-400 text-sm">
          <span className="animate-pulse">Φόρτωση δεδομένων...</span>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold">Περιθώριο Διαπραγμάτευσης</h2>
          <p className="text-xs text-gray-500">Πωλητές που έχουν ήδη μειώσει την τιμή τους: περισσότερο περιθώριο για διαπραγμάτευση. {filtered.length} αγγελίες.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Αναζήτηση μάρκας / μοντέλου..." className="w-48 rounded-lg border border-gray-700 bg-gray-900 px-3 py-1.5 text-xs text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />

          <div className="flex overflow-hidden rounded-lg border border-gray-700">
            {LEVELS.map((l) => (
              <button key={l.value} onClick={() => onChangeSignal(l.value)} className={`px-3 py-1.5 text-xs font-semibold transition-colors ${minSignal === l.value ? "bg-blue-600 text-white" : "bg-gray-900 text-gray-300 hover:bg-gray-800"}`}>
                {l.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {isMobile ? <NegotiationSignalsMobile data={filtered} /> : <NegotiationSignalsDesktop data={filtered} />}
    </div>
  );
};
