import React from "react";
import { VfmLeaderboardDto } from "../../types";

const CONFIDENCE_LABEL: Record<string, string> = { High: "Υψηλή", Medium: "Μέτρια", Low: "Χαμηλή" };

// Score = how many % cheaper than the market price expected for this exact car (model, year, km, fuel, engine).
export const ScoreBadge: React.FC<{ item: VfmLeaderboardDto }> = ({ item }) => {
  if (item.isSuspect) {
    return (
      <span
        title="Τόσο φθηνή τιμή είναι πιο πιθανό λάθος ή κρυφή ζημιά παρά ευκαιρία. Ελέγξτε την αγγελία."
        className="inline-flex items-center px-2 py-0.5 rounded text-xs font-black bg-amber-950 text-amber-300 border border-amber-700"
      >
        ⚠ Έλεγχος τιμής
      </span>
    );
  }
  const cheaper = item.vfmScore > 0;
  return (
    <span
      title={`Σύγκριση με ${item.comparableCount} αγγελίες του ίδιου μοντέλου. Αξιοπιστία: ${CONFIDENCE_LABEL[item.confidence] ?? item.confidence}. Διαφορές κάτω από ~10% είναι θόρυβος της αγοράς.`}
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-black border ${
        cheaper ? "bg-blue-900/90 text-blue-200 border-blue-600" : "bg-gray-900 text-gray-400 border-gray-700"
      }`}
    >
      {cheaper ? "−" : "+"}
      {Math.abs(item.vfmScore).toFixed(1)}% vs αγορά
    </span>
  );
};
