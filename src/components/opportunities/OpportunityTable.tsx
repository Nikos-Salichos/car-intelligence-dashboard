import React from "react";
import { Link } from "react-router-dom";
import { OpportunityDto, OpportunityView } from "../../types/opportunities";
import { days, eur, km, pct } from "../../utils/format";
import { fuelLabel, sellerLabel } from "../../utils/labels";

const TH = "py-2 pr-4 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap";
const TD = "py-2.5 pr-4 align-top text-xs text-gray-300 whitespace-nowrap";

const Money: React.FC<{ value: number | null; strong?: boolean }> = ({ value, strong }) => (
  <span className={`${strong ? "font-extrabold" : "font-semibold"} ${value !== null && value < 0 ? "text-red-400" : strong ? "text-emerald-400" : "text-gray-100"}`}>{eur(value)}</span>
);

const CarCell: React.FC<{ o: OpportunityDto }> = ({ o }) => (
  <div className="min-w-[180px] whitespace-normal">
    <div className="font-bold text-gray-100 text-sm">
      {o.brand} {o.model}
    </div>
    <div className="text-[11px] text-gray-400">
      {fuelLabel(o.fuelType)} · {km(o.mileage)} · {sellerLabel(o.sellerType)}
    </div>
    <div className="text-[11px] text-gray-500">{o.addressSeller}</div>
    {o.isSuspect && <div className="text-[11px] text-amber-300 font-semibold">⚠ Ύποπτα φθηνή: ελέγξτε την</div>}
    {o.confidence === "Medium" && <div className="text-[11px] text-gray-500">Μέτρια αξιοπιστία εκτίμησης</div>}
  </div>
);

const Actions: React.FC<{ o: OpportunityDto }> = ({ o }) => (
  <div className="flex gap-2">
    <Link to={`/brief/${o.listingId}`} className="bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-100 font-bold px-2.5 py-1 rounded text-xs">
      Φάκελος
    </Link>
    <a href={o.listingUrl} target="_blank" rel="noopener noreferrer" className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-2.5 py-1 rounded text-xs">
      Άνοιγμα ↗
    </a>
  </div>
);

const Row: React.FC<{ view: OpportunityView; o: OpportunityDto }> = ({ view, o }) => (
  <tr className="border-t border-gray-800">
    <td className={TD}>
      <CarCell o={o} />
    </td>
    <td className={TD}>
      <div className="text-sm">
        <Money value={o.price} />
      </div>
      {view === "new" && o.crossedBelowFair && o.previousPrice !== null && <div className="text-[11px] text-emerald-300">έπεσε από {eur(o.previousPrice)}</div>}
    </td>
    <td className={TD}>
      <div>{eur(o.fairPrice)}</div>
      <div className="text-[11px] text-gray-500">{o.discountPct >= 0 ? `${pct(o.discountPct)} φθηνότερη` : `${pct(Math.abs(o.discountPct))} ακριβότερη`}</div>
    </td>

    {view === "mature" ? (
      <>
        <td className={TD}>{days(o.daysListed)}</td>
        <td className={TD}>
          {o.priceDropCount} {o.totalDropPct > 0 && <span className="text-[11px] text-gray-500">(−{pct(o.totalDropPct)})</span>}
        </td>
        <td className={TD}>
          <Money value={o.openingOffer} />
        </td>
        <td className={TD}>
          <Money value={o.targetPrice} />
        </td>
        <td className={TD}>
          <Money value={o.estimatedSavings} strong />
        </td>
      </>
    ) : (
      <>
        <td className={TD}>
          <Money value={o.resalePrice} />
          {view === "flip" && o.referenceCount !== null && (
            <div className="text-[11px] text-gray-500">
              από {o.referenceCount} αγγελίες εμπόρων (διάμεσος {eur(o.referenceMedian)})
            </div>
          )}
        </td>
        <td className={TD}>
          <Money value={o.netMargin} strong />
        </td>
        <td className={TD}>{o.roiPct === null ? "—" : pct(o.roiPct)}</td>
        <td className={TD}>{days(o.daysListed)}</td>
      </>
    )}
    <td className={TD}>
      <Actions o={o} />
    </td>
  </tr>
);

export const OpportunityTable: React.FC<{ view: OpportunityView; items: OpportunityDto[] }> = ({ view, items }) => (
  <div className="overflow-x-auto bg-gray-900 border border-gray-800 rounded-xl px-4">
    <table className="w-full">
      <thead>
        <tr>
          <th className={TH}>Αυτοκίνητο</th>
          <th className={TH}>Τιμή</th>
          <th className={TH}>Δίκαιη τιμή</th>
          {view === "mature" ? (
            <>
              <th className={TH}>Στην αγορά</th>
              <th className={TH}>Μειώσεις</th>
              <th className={TH}>Πρώτη προσφορά</th>
              <th className={TH}>Στόχος</th>
              <th className={TH}>Εξοικονόμηση</th>
            </>
          ) : (
            <>
              <th className={TH} title="Συντηρητικά: το κάτω άκρο του εύρους τιμών που ζητούνται για παρόμοια αυτοκίνητα, όχι ο μέσος όρος">
                {view === "flip" ? "Μεταπώληση (έμποροι)" : "Μεταπώληση (κάτω εύρος)"}
              </th>
              <th className={TH}>Καθαρό περιθώριο</th>
              <th className={TH}>Απόδοση</th>
              <th className={TH}>Ηλικία αγγελίας</th>
            </>
          )}
          <th className={TH} />
        </tr>
      </thead>
      <tbody>
        {items.map((o) => (
          <Row key={o.listingId} view={view} o={o} />
        ))}
      </tbody>
    </table>
  </div>
);
