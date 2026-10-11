import React from "react";
import type { NegotiationSignalDto } from "../../types";
import { NegotiationBadge, formatDate, formatEuro, formatTotalDrop } from "./negotiationUtils";

interface Props {
  data: NegotiationSignalDto[];
}

export const NegotiationSignalsMobile: React.FC<Props> = ({ data }) => {
  if (data.length === 0) {
    return <p className="p-6 text-center text-gray-500 text-sm">Δεν βρέθηκαν αγγελίες με αυτά τα φίλτρα.</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      {data.map((s) => (
        <a key={s.listingId} href={s.listingUrl} target="_blank" rel="noopener noreferrer" className="block rounded-xl border border-gray-800 bg-gray-900 p-4 active:bg-gray-800">
          <div className="flex items-start justify-between gap-2">
            <div className="font-bold text-gray-100 leading-tight">
              {s.brand} <span className="font-medium text-gray-300">{s.model}</span>
            </div>
            <NegotiationBadge level={s.negotiationSignal} />
          </div>

          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-xs text-gray-500 line-through">{formatEuro(s.initialPrice)}</span>
            <span className="text-lg font-bold text-gray-100">{formatEuro(s.currentPrice)}</span>
            <span className={`text-sm font-bold ${s.totalDropPct > 0 ? "text-emerald-400" : "text-red-400"}`}>{formatTotalDrop(s.totalDropPct)}</span>
          </div>

          <div className="mt-2 flex gap-3 text-xs text-gray-400">
            <span>{s.dropCount}× μείωση τιμής</span>
            {s.raiseCount > 0 && <span>{s.raiseCount}× αύξηση τιμής</span>}
            <span>Τελευταία μείωση: {formatDate(s.lastDropAt)}</span>
          </div>
        </a>
      ))}
    </div>
  );
};
