import React from "react";
import { Notice } from "../ui/Feedback";
import { Panel, StatTile } from "../ui/Panel";
import { FairMarketPriceDto } from "../../types";
import { eur, km } from "../../utils/format";
import { confidenceLabel, fuelLabel } from "../../utils/labels";

/** The answer of the valuation: one number, the range around it, and how far to trust it. The newer fields may be missing (older API): they are only shown when present. */
export const ValuationResult: React.FC<{ result: FairMarketPriceDto }> = ({ result: r }) => (
  <Panel>
    <div className="text-xs font-semibold text-blue-400 uppercase tracking-wider">{r.brand}</div>
    <h2 className="text-2xl font-bold text-gray-100">{r.model}</h2>

    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
      <StatTile label="Δίκαιη τιμή αγοράς" value={<span className={r.isIndicative ? "text-yellow-400" : "text-emerald-400"}>{eur(r.fairMarketPrice)}</span>} />
      {r.lowPrice !== undefined && r.highPrice !== undefined && <StatTile label="Εύρος" value={`${eur(r.lowPrice)} – ${eur(r.highPrice)}`} hint="Εκεί βρίσκεται το 50% των αγγελιών ανάλογων οχημάτων" />}
      <StatTile label="Συγκρίσιμες αγγελίες" value={r.sampleSize} hint={r.confidence ? `Αξιοπιστία: ${confidenceLabel(r.confidence)}` : undefined} />
      <StatTile label="Μέση τιμή αγοράς" value={eur(r.marketAvgPrice)} hint={`Μέσα χιλιόμετρα ${km(r.marketAvgMileage)}`} />
    </div>

    {r.fuelUsed && r.engineCcUsed !== undefined && (
      <p className="text-[11px] text-gray-500 mt-3">
        Υπολογίστηκε για: {fuelLabel(r.fuelUsed)}, {r.engineCcUsed.toLocaleString("el-GR")} cc, {km(r.userMileage)}
      </p>
    )}
    {r.isIndicative && (
      <Notice tone="warning" className="mt-3">
        {r.mileageOutOfRange ? "Ενδεικτική τιμή: τα χιλιόμετρά σας είναι εκτός του εύρους των αγγελιών της αγοράς." : "Ενδεικτική τιμή: υπάρχουν λίγες αγγελίες με παρόμοια χιλιόμετρα."}
      </Notice>
    )}
    <p className="text-[11px] text-gray-500 mt-3">* Εκτίμηση βάσει ζητούμενων τιμών αγγελιών (όχι τιμών πώλησης), με μοντέλο που λαμβάνει υπόψη έτος, χιλιόμετρα, καύσιμο και κινητήρα.</p>
  </Panel>
);
