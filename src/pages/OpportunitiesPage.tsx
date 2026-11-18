import React from "react";
import { useSearchParams } from "react-router-dom";
import { Page } from "../components/layout/Page";
import { ModelComparison } from "../components/opportunities/ModelComparison";
import { OpportunityList } from "../components/opportunities/OpportunityList";
import { Tabs } from "../components/ui/Tabs";
import { OpportunityView } from "../types/opportunities";

const VIEWS: { id: OpportunityView; label: string; help: string }[] = [
  {
    id: "all",
    label: "Όλες",
    help: "Όλες οι αγγελίες, με πρώτες αυτές που είναι φθηνότερες από την τιμή που περιμένει η αγορά για το ίδιο αυτοκίνητο. Οι ύποπτα φθηνές μπαίνουν τελευταίες.",
  },
  {
    id: "new",
    label: "Νέες",
    help: "Αγγελίες που μόλις δημοσιεύτηκαν, ταξινομημένες κατά καθαρό περιθώριο μεταπώλησης με τα δικά σου έξοδα. Οι καλύτερες πουλιούνται πρώτες: η ταχύτητα μετράει.",
  },
  {
    id: "negotiation",
    label: "Διαπραγμάτευση",
    help: "Πωλητές που έχουν ήδη κατεβάσει την τιμή και μπορεί να τη κατεβάσουν ξανά, με πρώτη προσφορά, στόχο και εξοικονόμηση. Ταξινόμηση κατά εκτιμώμενη εξοικονόμηση.",
  },
  {
    id: "flip",
    label: "Ιδιώτης → Έμπορος",
    help: "Ιδιώτες που ζητούν λιγότερα από όσα ζητούν οι έμποροι για παρόμοιο αυτοκίνητο (ίδιο καύσιμο, ±1 έτος, ±30.000 km, ίδιος κινητήρας).",
  },
];

const isView = (v: string | null): v is OpportunityView => VIEWS.some((x) => x.id === v);

/** The hunting hub: four views of the same market. The view (and, for the last one, the way of reading it) lives in the URL, so a link shares it. */
export const OpportunitiesPage: React.FC = () => {
  const [params, setParams] = useSearchParams();
  const raw = params.get("view");
  const view: OpportunityView = isView(raw) ? raw : "all";
  const byModel = view === "flip" && params.get("by") === "model";
  const current = VIEWS.find((v) => v.id === view)!;

  return (
    <Page>
      <Tabs label="Προβολές ευκαιριών" tabs={VIEWS} value={view} onChange={(id) => setParams({ view: id })} />
      <p className="text-xs text-gray-400 max-w-4xl">{current.help}</p>

      {view === "flip" && (
        <Tabs
          label="Τρόπος ανάγνωσης"
          tabs={[
            { id: "listing", label: "Ανά αγγελία" },
            { id: "model", label: "Ανά μοντέλο" },
          ]}
          value={byModel ? "model" : "listing"}
          onChange={(id) => setParams(id === "model" ? { view, by: "model" } : { view })}
        />
      )}

      {byModel ? <ModelComparison /> : <OpportunityList key={view} view={view} />}

      <p className="text-[11px] text-gray-500 max-w-4xl">
        Τα ποσά είναι εκτιμήσεις από ζητούμενες τιμές αγγελιών, όχι τιμές πώλησης, και δεν περιλαμβάνουν κρυφά έξοδα ή ζημιές. Η μεταπώληση υπολογίζεται συντηρητικά (κάτω άκρο του εύρους). Έλεγξε
        πάντα την αγγελία και το όχημα πριν αποφασίσεις.
      </p>
    </Page>
  );
};

export default OpportunitiesPage;
