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

/** Greek names of the prefectures as the addresses write them in Latin letters; an unknown one is shown as written. */
const PREFECTURE: Record<string, string> = {
  ATTIKIS: "Αττική", ATHINA: "Αθήνα", THESSALONIKI: "Θεσσαλονίκη", ACHAIA: "Αχαΐα", PATRA: "Πάτρα", PATRAS: "Πάτρα", AITOLOAKARNANIA: "Αιτωλοακαρνανία", ARCADIA: "Αρκαδία",
  ARGOLIS: "Αργολίδα", ARTA: "Άρτα", BOEOTIA: "Βοιωτία", CHANIA: "Χανιά", CHIOS: "Χίος", CORFU: "Κέρκυρα", CORINTH: "Κορινθία", CYCLADES: "Κυκλάδες", DODECANESE: "Δωδεκάνησα",
  DRAMA: "Δράμα", ELIAS: "Ηλεία", EVIA: "Εύβοια", EVROS: "Έβρος", EVRYTANIA: "Ευρυτανία", FLORINA: "Φλώρινα", FOKIDA: "Φωκίδα", FTHIOTIDA: "Φθιώτιδα", GREVENA: "Γρεβενά",
  HALKIDIKI: "Χαλκιδική", HERAKLION: "Ηράκλειο", IMATHIA: "Ημαθία", IOANNINA: "Ιωάννινα", IWANNINA: "Ιωάννινα", KARDITSA: "Καρδίτσα", KASTORIA: "Καστοριά", KAVALA: "Καβάλα",
  KEFALONIA: "Κεφαλονιά", KILKIS: "Κιλκίς", KOZANI: "Κοζάνη", LACONIA: "Λακωνία", LARISSA: "Λάρισα", LARISA: "Λάρισα", LASSITHI: "Λασίθι", LEFKADA: "Λευκάδα", LESVOS: "Λέσβος",
  MAGNESIA: "Μαγνησία", VOLOS: "Βόλος", MESSENIA: "Μεσσηνία", PELLA: "Πέλλα", PIERIA: "Πιερία", PREVEZA: "Πρέβεζα", RETHYMNO: "Ρέθυμνο", RHODOPE: "Ροδόπη", SAMOS: "Σάμος",
  SERRES: "Σέρρες", THESPROTIA: "Θεσπρωτία", TRIKALA: "Τρίκαλα", XANTHI: "Ξάνθη", ZAKINTHOS: "Ζάκυνθος",
};
const titleCase = (t: string) => t.toLowerCase().replace(/(^|[\s.-])\S/g, (c) => c.toUpperCase());

/** "15 · Αττική (Pallini, Gerakas) · 4.024": the code, the prefecture and the biggest towns, all read from the listings' addresses. */
export const areaLabel = (r: { value: string; count: number; name: string | null; towns: string[] }): string => {
  const name = r.name ? (PREFECTURE[r.name] ?? titleCase(r.name)) : "";
  const towns = r.towns.filter((t) => t !== r.name).map(titleCase).join(", ");
  return `${r.value}${name ? ` · ${name}` : ""}${towns ? ` (${towns})` : ""} · ${r.count}`;
};
