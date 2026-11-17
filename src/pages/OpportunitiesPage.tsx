import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useOpportunities } from "../hooks/useOpportunities";
import { useTokenRefreshOnActivity } from "../hooks/useTokenRefreshOnActivity";
import { OpportunityFilterForm } from "../components/opportunities/OpportunityFilterForm";
import { OpportunityTable } from "../components/opportunities/OpportunityTable";
import { DEFAULT_FILTERS, OpportunityView } from "../types/opportunities";

const VIEWS: { id: OpportunityView; label: string; help: string }[] = [
  {
    id: "new",
    label: "Νέες ευκαιρίες",
    help: "Αγγελίες που μόλις δημοσιεύτηκαν και είναι φθηνότερες από την αγορά, ταξινομημένες κατά καθαρό περιθώριο μεταπώλησης. Οι καλύτερες πουλιούνται πρώτες: η ταχύτητα μετράει.",
  },
  {
    id: "mature",
    label: "Ώριμες για διαπραγμάτευση",
    help: "Ακριβότερες από την αγορά, εδώ και πολλές μέρες και με μείωση τιμής ήδη: ο πωλητής έχει περιθώριο. Ταξινόμηση κατά εκτιμώμενη εξοικονόμηση.",
  },
  {
    id: "flip",
    label: "Από ιδιώτη σε έμπορο",
    help: "Ιδιώτες που ζητούν λιγότερα από όσα ζητούν οι έμποροι για παρόμοιο αυτοκίνητο (ίδιο καύσιμο, ±1 έτος, ±30.000 km).",
  },
];

const isView = (v: string | null): v is OpportunityView => VIEWS.some((x) => x.id === v);

export const OpportunitiesPage: React.FC = () => {
  const [params, setParams] = useSearchParams();
  const view: OpportunityView = isView(params.get("view")) ? (params.get("view") as OpportunityView) : "new";
  const [draft, setDraft] = useState(DEFAULT_FILTERS);
  const [applied, setApplied] = useState(DEFAULT_FILTERS);
  const { data, error, loading } = useOpportunities(view, applied);

  useTokenRefreshOnActivity();
  const current = VIEWS.find((v) => v.id === view)!;

  return (
    <div className="p-4 sm:p-6 bg-gray-950 min-h-screen w-full flex-1 flex flex-col gap-4">
      <div role="tablist" aria-label="Προβολές ευκαιριών" className="flex gap-2 overflow-x-auto">
        {VIEWS.map((v) => (
          <button
            key={v.id}
            role="tab"
            aria-selected={v.id === view}
            onClick={() => setParams({ view: v.id })}
            className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap ${v.id === view ? "bg-blue-600 text-white" : "bg-gray-900 text-gray-400 hover:text-gray-200 border border-gray-800"}`}
          >
            {v.label}
          </button>
        ))}
      </div>

      <p className="text-xs text-gray-400 max-w-4xl">{current.help}</p>

      <OpportunityFilterForm view={view} value={draft} onChange={setDraft} onApply={() => setApplied(draft)} />

      {error && (
        <div role="alert" className="p-3 bg-red-950/40 border border-red-900/60 text-red-400 rounded-lg text-xs font-medium">
          {error}
        </div>
      )}
      {loading && <div className="text-sm text-blue-400 animate-pulse">Αναζήτηση ευκαιριών...</div>}

      {data && !loading && (
        <>
          <div className="text-xs text-gray-400">
            {data.total === 0 ? "Δεν βρέθηκαν αγγελίες με αυτά τα κριτήρια." : `${data.total} αποτελέσματα${data.total > data.items.length ? ` (εμφανίζονται τα ${data.items.length} καλύτερα)` : ""}`}
          </div>
          {data.items.length > 0 && <OpportunityTable view={view} items={data.items} />}
        </>
      )}

      <p className="text-[11px] text-gray-500 max-w-4xl">
        Τα ποσά είναι εκτιμήσεις από ζητούμενες τιμές αγγελιών, όχι τιμές πώλησης, και δεν περιλαμβάνουν κρυφά έξοδα ή ζημιές. Η μεταπώληση υπολογίζεται συντηρητικά
        (κάτω άκρο του εύρους). Έλεγξε πάντα την αγγελία και το όχημα πριν αποφασίσεις.
      </p>
    </div>
  );
};

export default OpportunitiesPage;
