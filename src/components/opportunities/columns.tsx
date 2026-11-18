import { Column } from "../ui/DataTable";
import { OpportunityDto, OpportunityView } from "../../types/opportunities";
import { Actions, CarCell, DiscountBadge, Money, SignalBadge } from "./cells";
import { days, eur, km, pct, shortDate } from "../../utils/format";

type Col = Column<OpportunityDto>;

// The building blocks every view picks from. `key` is the sort key the server understands.
const car: Col = { key: "car", header: "Αυτοκίνητο", sortable: true, card: "title", render: (o) => <CarCell o={o} /> };
const price: Col = {
  key: "price",
  header: "Τιμή",
  sortable: true,
  render: (o) => (
    <>
      <Money value={o.price} />
      {o.crossedBelowFair && o.previousPrice !== null && <div className="text-[11px] text-emerald-300">έπεσε από {eur(o.previousPrice)}</div>}
    </>
  ),
};
const fair: Col = { key: "fair", header: "Δίκαιη τιμή", sortable: true, render: (o) => eur(o.fairPrice) };
const discount: Col = { key: "discount", header: "Έκπτωση vs αγορά", sortable: true, title: "Πόσο φθηνότερη από την αναμενόμενη τιμή για το ίδιο μοντέλο, έτος, χιλιόμετρα, καύσιμο και κινητήρα", render: (o) => <DiscountBadge o={o} /> };
const mileage: Col = { key: "mileage", header: "Χιλιόμετρα", sortable: true, render: (o) => km(o.mileage) };
const age: Col = { key: "days", header: "Ηλικία αγγελίας", sortable: true, render: (o) => days(o.daysListed) };
const margin: Col = { key: "margin", header: "Καθαρό περιθώριο", sortable: true, title: "Μεταπώληση μείον τιμή αγοράς μείον έξοδα", render: (o) => <Money value={o.netMargin} good /> };
const roi: Col = { key: "roi", header: "Απόδοση", sortable: true, render: (o) => (o.roiPct === null ? "—" : pct(o.roiPct)) };
const actions: Col = { key: "actions", header: "", render: (o) => <Actions o={o} /> };

const resale = (label: string): Col => ({
  key: "resale",
  header: label,
  sortable: true,
  title: "Συντηρητικά: το κάτω άκρο του εύρους τιμών που ζητούνται για παρόμοια αυτοκίνητα, όχι ο μέσος όρος",
  render: (o) => (
    <>
      <Money value={o.resalePrice} />
      {o.referenceCount !== null && (
        <div className="text-[11px] text-gray-500">
          από {o.referenceCount} αγγελίες εμπόρων (διάμεσος {eur(o.referenceMedian)})
        </div>
      )}
    </>
  ),
});

const signal: Col = { key: "signal", header: "Σήμα διαπραγμάτευσης", sortable: true, render: (o) => <SignalBadge o={o} /> };
const drops: Col = {
  key: "drops",
  header: "Μειώσεις τιμής",
  sortable: true,
  render: (o) => (
    <>
      {o.priceDropCount} {o.totalDropPct > 0 && <span className="text-[11px] text-gray-500">(−{pct(o.totalDropPct)})</span>}
      {o.lastDropAt && <div className="text-[11px] text-gray-500">τελευταία: {shortDate(o.lastDropAt)}</div>}
    </>
  ),
};
const opening: Col = { key: "opening", header: "Πρώτη προσφορά", render: (o) => <Money value={o.openingOffer} /> };
const target: Col = { key: "target", header: "Στόχος", render: (o) => <Money value={o.targetPrice} /> };
const savings: Col = { key: "savings", header: "Εξοικονόμηση", sortable: true, render: (o) => <Money value={o.estimatedSavings} good /> };

export const COLUMNS: Record<OpportunityView, Col[]> = {
  all: [car, price, fair, discount, mileage, age, actions],
  new: [car, price, fair, discount, resale("Μεταπώληση (κάτω εύρος)"), margin, roi, age, actions],
  negotiation: [car, price, fair, signal, drops, age, opening, target, savings, actions],
  flip: [car, price, resale("Μεταπώληση (έμποροι)"), margin, roi, age, actions],
};
