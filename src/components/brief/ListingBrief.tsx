import React from "react";
import { Link } from "react-router-dom";
import { LinkButton } from "../ui/Button";
import { Notice } from "../ui/Feedback";
import { Panel, StatTile } from "../ui/Panel";
import { PriceHistoryChart } from "./PriceHistoryChart";
import { ReliabilityBox } from "./ReliabilityBox";
import { daysSourceText, flagText, reasonText, unknownFlagText, verdictText } from "./briefTexts";
import { NegotiationBriefDto } from "../../types";
import { days, eur, km, pct } from "../../utils/format";
import { confidenceLabel, fuelLabel, sellerLabel } from "../../utils/labels";

/** Everything a buyer needs to negotiate one listing, top to bottom: warnings, numbers, what to offer, how sure we are, history, comparables. */
export const ListingBrief: React.FC<{ brief: NegotiationBriefDto }> = ({ brief: b }) => {
  const verdict = verdictText[b.advice.verdict];
  const gapPct = Math.round(((b.price - b.fairPrice) / b.fairPrice) * 100);

  return (
    <>
      <div>
        <Link to="/opportunities" className="text-xs text-blue-400 hover:text-blue-300">← Πίσω στις ευκαιρίες</Link>
        <h1 className="text-xl font-bold text-white mt-1">
          {b.brand} {b.model}
        </h1>
        <div className="text-xs text-gray-400">
          {fuelLabel(b.fuelType)} · {km(b.mileage)} · {sellerLabel(b.sellerType)} · {b.addressSeller}
        </div>
      </div>

      {b.flags.map((f) => (
        <Notice key={f} tone="warning">⚠ {flagText[f] ?? unknownFlagText}</Notice>
      ))}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatTile label="Ζητούμενη τιμή" value={eur(b.price)} hint={gapPct === 0 ? undefined : `${Math.abs(gapPct)}% ${gapPct > 0 ? "πάνω από" : "κάτω από"} τη δίκαιη`} />
        <StatTile label="Δίκαιη τιμή" value={eur(b.fairPrice)} hint={`Εύρος ${eur(b.fairLow)} – ${eur(b.fairHigh)}`} />
        <StatTile label="Στην αγορά" value={days(b.daysListed)} hint={daysSourceText(b.daysSource)} />
        <StatTile label="Μειώσεις τιμής" value={b.priceDropCount} hint={b.totalDropPct > 0 ? `Συνολικά −${pct(b.totalDropPct)}` : undefined} />
      </div>

      <ReliabilityBox brief={b} />

      <Panel title="Τι να προσφέρεις">
        <div className={`text-sm ${verdict?.color ?? "text-gray-300"}`}>{verdict?.label}</div>
        <div className="grid grid-cols-3 gap-3 mt-4 text-center">
          <Offer label="Πρώτη προσφορά" value={b.advice.openingOffer} />
          <Offer label="Στόχος" value={b.advice.targetPrice} tone="text-emerald-400" />
          <Offer label="Μην πληρώσεις πάνω από" value={b.advice.walkAwayPrice} tone="text-amber-300" />
        </div>
        {b.advice.reasons.length > 0 && (
          <ul className="mt-4 list-disc list-inside text-sm text-gray-300 space-y-1">
            {b.advice.reasons.map((r) => <li key={r.code}>{reasonText(r)}</li>)}
          </ul>
        )}
        <p className="text-[11px] text-gray-500 mt-4">
          Ενδεικτικές τιμές: βασίζονται σε ζητούμενες τιμές αγγελιών (όχι σε τιμές πώλησης) και στο μοντέλο της αγοράς (αξιοπιστία: {confidenceLabel(b.confidence)}, {b.comparableCount} συγκρίσιμες
          αγγελίες). Διαφορές κάτω από ~10% είναι θόρυβος.
        </p>
      </Panel>

      <Panel title="Ιστορικό τιμής">
        <p className="text-[11px] text-gray-500 mb-2">Οι ημερομηνίες είναι όταν καταγράψαμε εμείς την τιμή, όχι όταν την άλλαξε ο πωλητής.</p>
        <PriceHistoryChart points={b.priceHistory} />
      </Panel>

      <Panel title="Συγκρίσιμες αγγελίες">
        {b.comparables.length === 0 ? (
          <div className="text-xs text-gray-500">Δεν βρέθηκαν συγκρίσιμες αγγελίες.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-gray-300">
              <thead className="text-gray-500 text-left">
                <tr>
                  {["Έτος", "Χιλιόμετρα", "Τιμή", "Καύσιμο", "Πωλητής", ""].map((h) => <th key={h} className="py-1 pr-3 font-semibold">{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {b.comparables.map((c) => (
                  <tr key={c.listingId} className="border-t border-gray-800">
                    <td className="py-1.5 pr-3">{c.year}</td>
                    <td className="pr-3">{km(c.mileage)}</td>
                    <td className="pr-3 font-semibold text-gray-100">{eur(c.price)}</td>
                    <td className="pr-3">{fuelLabel(c.fuelType)}</td>
                    <td className="pr-3">{sellerLabel(c.sellerType)}</td>
                    <td><LinkButton href={c.listingUrl} variant="ghost">Άνοιγμα ↗</LinkButton></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>

      <div>
        <LinkButton href={b.listingUrl} variant="primary" size="md">Άνοιγμα αγγελίας στο car.gr ↗</LinkButton>
      </div>
    </>
  );
};

const Offer: React.FC<{ label: string; value: number; tone?: string }> = ({ label, value, tone = "text-gray-100" }) => (
  <div>
    <div className="text-[11px] text-gray-500 uppercase">{label}</div>
    <div className={`text-xl font-extrabold ${tone}`}>{eur(value)}</div>
  </div>
);
