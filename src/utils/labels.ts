// The API stores car.gr's English values; the UI is Greek. Unknown values are shown as they are.
const FUEL: Record<string, string> = {
  Petrol: "Βενζίνη",
  Diesel: "Πετρέλαιο",
  Hybrid: "Υβριδικό",
  "Hybrid petrol": "Υβριδικό βενζίνης",
  "Plug-in hybrid petrol": "Plug-in υβριδικό",
  Electric: "Ηλεκτρικό",
  "Gas/lpg": "Υγραέριο (LPG)",
  "Natural gas(cng)": "Φυσικό αέριο (CNG)",
};

export const fuelLabel = (fuel?: string | null): string => (fuel ? (FUEL[fuel] ?? fuel) : "—");

export const sellerLabel = (seller?: string | null): string => (seller === "Dealer" ? "Έμπορος" : seller === "Private" ? "Ιδιώτης" : seller || "—");
