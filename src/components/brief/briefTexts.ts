import { NegotiationReason } from "../../types";

const eur = (n: number) => `${Math.round(n).toLocaleString("el-GR")} €`;

// The API sends codes; this is the only place that turns them into Greek sentences.
export const reasonText = (r: NegotiationReason): string => {
  switch (r.code) {
    case "above_fair":
      return `Η τιμή είναι ${r.value}% πάνω από τη δίκαιη τιμή της αγοράς.`;
    case "far_above_fair":
      return "Η απόκλιση είναι μεγάλη: υπάρχουν πολλές φθηνότερες συγκρίσιμες αγγελίες.";
    case "long_listed":
      return `Είναι αγγελία εδώ και ${r.value} μέρες.`;
    case "very_long_listed":
      return "Πάνω από 2 μήνες στην αγορά: ο πωλητής μάλλον πιέζεται να πουλήσει.";
    case "price_already_dropped":
      return `Ο πωλητής έχει ήδη μειώσει την τιμή ${r.value} φορά/ές.`;
    case "price_negotiable":
      return "Ο πωλητής δηλώνει ότι η τιμή είναι συζητήσιμη.";
    default:
      return r.code;
  }
};

export const flagText: Record<string, string> = {
  suspect_price: "Ύποπτα χαμηλή τιμή: συχνά λάθος ή κρυφή ζημιά. Ελέγξτε την αγγελία πριν προχωρήσετε.",
  foreign_plate: "Όχημα με ξένες πινακίδες (εισαγωγή): ελέγξτε τα χαρτιά και το κόστος ταξινόμησης.",
  possible_duplicate: "Υπάρχει αγγελία με ακριβώς τα ίδια στοιχεία: πιθανή διπλή καταχώριση ή μεταπωλητής.",
  low_confidence: "Λίγες συγκρίσιμες αγγελίες: η εκτίμηση είναι λιγότερο αξιόπιστη.",
  high_mileage_per_year: "Πολλά χιλιόμετρα για την ηλικία του (πάνω από 25.000 km τον χρόνο).",
};

export const verdictText: Record<string, { label: string; color: string }> = {
  bargain: { label: "Καλή τιμή: δεν αξίζει να ρισκάρεις να τη χάσεις", color: "text-emerald-400" },
  fair: { label: "Λογική τιμή: υπάρχει μικρό περιθώριο", color: "text-blue-300" },
  overpriced: { label: "Ακριβή: υπάρχει περιθώριο διαπραγμάτευσης", color: "text-amber-300" },
};

export const daysSourceText = (source: string) => (source === "Published" ? "από τη δημοσίευση στο car.gr" : "από τότε που την είδαμε πρώτη φορά");

export { eur };
