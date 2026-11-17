import React from "react";
import { Link } from "react-router-dom";
import { NegotiationBriefDto } from "../../types";
import { PriceHistoryChart } from "./PriceHistoryChart";
import { daysSourceText, eur, flagText, reasonText, verdictText } from "./briefTexts";
import { ReliabilityBox } from "./ReliabilityBox";

const CONFIDENCE: Record<string, string> = { High: "Υψηλή", Medium: "Μέτρια", Low: "Χαμηλή" };

const Stat: React.FC<{ label: string; value: React.ReactNode; hint?: string }> = ({ label, value, hint }) => (
  <div className="bg-gray-900 border border-gray-800 rounded-lg p-3">
    <div className="text-[11px] text-gray-500 uppercase tracking-wide">{label}</div>
    <div className="text-lg font-bold text-gray-100 mt-0.5">{value}</div>
    {hint && <div className="text-[11px] text-gray-500 mt-0.5">{hint}</div>}
  </div>
);

export const ListingBrief: React.FC<{ brief: NegotiationBriefDto }> = ({ brief: b }) => {
  const verdict = verdictText[b.advice.verdict];
  const gapPct = Math.round(((b.price - b.fairPrice) / b.fairPrice) * 100);

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-5">
      <div>
        <Link to="/vfmdashboard" className="text-xs text-blue-400 hover:text-blue-300">← Πίσω στη λίστα</Link>
        <h1 className="text-xl font-bold text-white mt-1">
          {b.brand} {b.model}
        </h1>
        <div className="text-xs text-gray-400">
          {b.fuelType} · {b.mileage.toLocaleString("el-GR")} km · {b.sellerType === "Dealer" ? "Έμπορος" : "Ιδιώτης"} · {b.addressSeller}
        </div>
      </div>

      {b.flags.length > 0 && (
        <div className="flex flex-col gap-2" role="alert">
          {b.flags.map((f) => (
            <div key={f} className="text-xs text-amber-300 bg-amber-950/40 border border-amber-900/60 rounded-lg px-3 py-2">
              ⚠ {flagText[f] ?? f}
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Stat label="Ζητούμενη τιμή" value={eur(b.price)} hint={gapPct === 0 ? undefined : `${Math.abs(gapPct)}% ${gapPct > 0 ? "πάνω από" : "κάτω από"} τη δίκαιη`} />
        <Stat label="Δίκαιη τιμή" value={eur(b.fairPrice)} hint={`Εύρος ${eur(b.fairLow)} – ${eur(b.fairHigh)}`} />
        <Stat label="Στην αγορά" value={`${b.daysListed} μέρες`} hint={daysSourceText(b.daysSource)} />
        <Stat label="Μειώσεις τιμής" value={b.priceDropCount} hint={b.totalDropPct > 0 ? `Συνολικά −${b.totalDropPct}%` : undefined} />
      </div>

      <ReliabilityBox brief={b} />

      <section className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <h2 className="text-sm font-bold text-gray-200">Τι να προσφέρεις</h2>
        <div className={`text-sm mt-1 ${verdict?.color ?? "text-gray-300"}`}>{verdict?.label}</div>
        <div className="grid grid-cols-3 gap-3 mt-4 text-center">
          <div>
            <div className="text-[11px] text-gray-500 uppercase">Πρώτη προσφορά</div>
            <div className="text-xl font-extrabold text-gray-100">{eur(b.advice.openingOffer)}</div>
          </div>
          <div>
            <div className="text-[11px] text-gray-500 uppercase">Στόχος</div>
            <div className="text-xl font-extrabold text-emerald-400">{eur(b.advice.targetPrice)}</div>
          </div>
          <div>
            <div className="text-[11px] text-gray-500 uppercase">Μην πληρώσεις πάνω από</div>
            <div className="text-xl font-extrabold text-amber-300">{eur(b.advice.walkAwayPrice)}</div>
          </div>
        </div>
        {b.advice.reasons.length > 0 && (
          <ul className="mt-4 list-disc list-inside text-sm text-gray-300 space-y-1">
            {b.advice.reasons.map((r) => (
              <li key={r.code}>{reasonText(r)}</li>
            ))}
          </ul>
        )}
        <p className="text-[11px] text-gray-500 mt-4">
          Ενδεικτικές τιμές: βασίζονται σε ζητούμενες τιμές αγγελιών (όχι σε τιμές πώλησης) και στο μοντέλο της αγοράς
          (αξιοπιστία: {CONFIDENCE[b.confidence] ?? b.confidence}, {b.comparableCount} συγκρίσιμες αγγελίες). Διαφορές κάτω από ~10% είναι θόρυβος.
        </p>
      </section>

      <section className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <h2 className="text-sm font-bold text-gray-200">Ιστορικό τιμής</h2>
        <p className="text-[11px] text-gray-500 mb-2">Οι ημερομηνίες είναι όταν καταγράψαμε εμείς την τιμή, όχι όταν την άλλαξε ο πωλητής.</p>
        <PriceHistoryChart points={b.priceHistory} />
      </section>

      <section className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <h2 className="text-sm font-bold text-gray-200 mb-2">Συγκρίσιμες αγγελίες</h2>
        {b.comparables.length === 0 ? (
          <div className="text-xs text-gray-500">Δεν βρέθηκαν συγκρίσιμες αγγελίες.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-gray-300">
              <thead className="text-gray-500 text-left">
                <tr>
                  <th className="py-1 pr-3">Έτος</th>
                  <th className="pr-3">Χιλιόμετρα</th>
                  <th className="pr-3">Τιμή</th>
                  <th className="pr-3">Καύσιμο</th>
                  <th className="pr-3">Πωλητής</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {b.comparables.map((c) => (
                  <tr key={c.listingId} className="border-t border-gray-800">
                    <td className="py-1.5 pr-3">{c.year}</td>
                    <td className="pr-3">{c.mileage.toLocaleString("el-GR")} km</td>
                    <td className="pr-3 font-semibold text-gray-100">{eur(c.price)}</td>
                    <td className="pr-3">{c.fuelType}</td>
                    <td className="pr-3">{c.sellerType === "Dealer" ? "Έμπορος" : "Ιδιώτης"}</td>
                    <td>
                      <a href={c.listingUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
                        Άνοιγμα ↗
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <a href={b.listingUrl} target="_blank" rel="noopener noreferrer" className="self-start bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm px-5 py-2.5 rounded-lg">
        Άνοιγμα αγγελίας στο car.gr ↗
      </a>
    </div>
  );
};
