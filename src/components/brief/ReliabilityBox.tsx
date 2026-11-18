import React from "react";
import { NegotiationBriefDto } from "../../types";
import { km } from "../../utils/format";

type Level = { label: string; box: string; dot: string };
const LEVELS: Record<"good" | "medium" | "low", Level> = {
  good: { label: "Καλή βάση σύγκρισης", box: "border-emerald-900/60 bg-emerald-950/30", dot: "bg-emerald-400" },
  medium: { label: "Μέτρια βάση σύγκρισης", box: "border-amber-900/60 bg-amber-950/30", dot: "bg-amber-400" },
  low: { label: "Αδύναμη βάση σύγκρισης", box: "border-red-900/60 bg-red-950/30", dot: "bg-red-400" },
};

// How much the fair price can be trusted: how many listings really look like this car, and how far this car is from them.
export const ReliabilityBox: React.FC<{ brief: NegotiationBriefDto }> = ({ brief: b }) => {
  const outside = b.comparableMinMileage !== null && b.comparableMaxMileage !== null && (b.mileage < b.comparableMinMileage || b.mileage > b.comparableMaxMileage);
  const level = LEVELS[b.similarCount >= 5 && !outside ? "good" : b.similarCount >= 2 ? "medium" : "low"];
  const region = b.regionPriceVsModelPct;

  return (
    <section className={`border rounded-xl p-4 ${level.box}`} aria-label="Αξιοπιστία δίκαιης τιμής">
      <div className="flex items-center gap-2 text-sm font-bold text-gray-100">
        <span className={`inline-block w-2.5 h-2.5 rounded-full ${level.dot}`} aria-hidden />
        {level.label}
      </div>
      <p className="text-xs text-gray-300 mt-2">
        Η δίκαιη τιμή βασίζεται σε <strong>{b.comparableCount}</strong> αγγελίες του μοντέλου, από τις οποίες μόνο <strong>{b.similarCount}</strong> μοιάζουν
        πραγματικά με αυτό (ίδιο καύσιμο, ±1 έτος, ±40.000 km).
      </p>
      {b.comparableMinMileage !== null && b.comparableMaxMileage !== null && (
        <p className={`text-xs mt-1 ${outside ? "text-red-300" : "text-gray-400"}`}>
          Χιλιόμετρα συγκρίσιμων: {km(b.comparableMinMileage)} – {km(b.comparableMaxMileage)}. Αυτό το όχημα: {km(b.mileage)}
          {outside && " (εκτός εύρους: η τιμή είναι εκτίμηση)"}.
        </p>
      )}
      {region !== null && b.regionPostalPrefix && (
        <p className="text-xs text-gray-400 mt-1">
          Περιοχή ΤΚ {b.regionPostalPrefix}…: οι ζητούμενες τιμές είναι κατά μέσο όρο {region >= 0 ? "+" : ""}
          {region}% σε σχέση με το μοντέλο ({b.regionListingCount} αγγελίες).{" "}
          {Math.abs(region) < 8 ? "Δεν προσαρμόζουμε την τιμή: η διαφορά είναι μικρότερη από τον θόρυβο της αγοράς (~8%)." : "Η διαφορά είναι αρκετά μεγάλη: λάβετέ την υπόψη."}
        </p>
      )}
    </section>
  );
};
