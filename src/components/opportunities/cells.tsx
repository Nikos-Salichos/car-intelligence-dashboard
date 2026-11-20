import React from "react";
import { LinkButton } from "../ui/Button";
import { Badge } from "../ui/Feedback";
import { OpportunityDto } from "../../types/opportunities";
import { eur, km, pct } from "../../utils/format";
import { confidenceLabel, fuelLabel, SIGNAL_LABEL, sellerLabel } from "../../utils/labels";

/** Euro amount: red when negative, optionally green when it is the number the user is hunting for. */
export const Money: React.FC<{ value: number | null; good?: boolean }> = ({ value, good }) => (
  <span className={`font-semibold ${value !== null && value < 0 ? "text-red-400" : good ? "text-emerald-400 font-extrabold" : "text-gray-100"}`}>{eur(value)}</span>
);

export const CarCell: React.FC<{ o: OpportunityDto }> = ({ o }) => (
  <div className="min-w-[180px] whitespace-normal">
    <div className="font-bold text-gray-100 text-sm">
      {o.brand} {o.model}
    </div>
    <div className="text-[11px] text-gray-400">
      {fuelLabel(o.fuelType)} · {km(o.mileage)} · {sellerLabel(o.sellerType)}
    </div>
    <div className="text-[11px] text-gray-500">{o.addressSeller}</div>
  </div>
);

/** How much cheaper than the market price expected for this exact car. A suspiciously cheap price is a warning, not a score. */
export const DiscountBadge: React.FC<{ o: OpportunityDto }> = ({ o }) => {
  if (o.isSuspect) return <Badge tone="warning" title="Τόσο φθηνή τιμή είναι πιο πιθανό λάθος ή κρυφή ζημιά παρά ευκαιρία. Ελέγξτε την αγγελία.">⚠ Έλεγχος τιμής</Badge>;
  const cheaper = o.discountPct > 0;
  return (
    <Badge
      tone={cheaper ? "info" : "neutral"}
      title={`Αξιοπιστία εκτίμησης: ${confidenceLabel(o.confidence)}. Διαφορές κάτω από ~10% είναι θόρυβος της αγοράς.`}
    >
      {cheaper ? "−" : "+"}
      {pct(Math.abs(o.discountPct))} vs αγορά
    </Badge>
  );
};

export const SignalBadge: React.FC<{ o: OpportunityDto }> = ({ o }) => (
  <Badge tone={o.negotiationSignal === "high" ? "success" : o.negotiationSignal === "medium" ? "info" : "neutral"} title="Πόσο έχει ήδη υποχωρήσει ο πωλητής στην τιμή">
    {SIGNAL_LABEL[o.negotiationSignal]}
  </Badge>
);

export const Actions: React.FC<{ o: OpportunityDto }> = ({ o }) => (
  <div className="flex gap-2">
    <LinkButton to={`/brief/${o.listingId}`} newTab>Φάκελος</LinkButton>
    <LinkButton href={o.listingUrl} variant="primary">
      Άνοιγμα ↗
    </LinkButton>
  </div>
);
