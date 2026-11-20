// The API stores car.gr's English values and codes; the UI is Greek. Unknown values are shown as they are.
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

export const FUEL_VALUES = Object.keys(FUEL); // the values the API uses, for filters

export const fuelLabel = (fuel?: string | null): string => (fuel ? (FUEL[fuel] ?? fuel) : "—");

export const sellerLabel = (seller?: string | null): string => (seller === "Dealer" ? "Έμπορος" : seller === "Private" ? "Ιδιώτης" : seller || "—");

export const CONFIDENCE_LABEL: Record<string, string> = { High: "Υψηλή", Medium: "Μέτρια", Low: "Χαμηλή" };
export const confidenceLabel = (c?: string | null): string => (c ? (CONFIDENCE_LABEL[c] ?? c) : "—");

export const SIGNAL_LABEL: Record<string, string> = { none: "Κανένα", low: "Χαμηλό", medium: "Μεσαίο", high: "Υψηλό" };

/** Names for the postcode areas we are sure of; every other area is shown by its code. */
const AREA_NAME: Record<string, string> = { "10": "Αθήνα", "11": "Αθήνα", "12": "Αθήνα", "13": "Αθήνα", "14": "Αθήνα", "15": "Αθήνα", "16": "Αθήνα", "17": "Αθήνα", "18": "Πειραιάς", "19": "Αν. Αττική", "26": "Πάτρα", "38": "Βόλος", "54": "Θεσσαλονίκη", "55": "Θεσσαλονίκη", "56": "Θεσσαλονίκη", "57": "Θεσσαλονίκη", "70": "Ηράκλειο", "71": "Ηράκλειο", "73": "Χανιά", "81": "Λέσβος" };
export const areaLabel = (prefix: string, count: number): string => `${prefix}${AREA_NAME[prefix] ? ` · ${AREA_NAME[prefix]}` : ""} (${count})`;
