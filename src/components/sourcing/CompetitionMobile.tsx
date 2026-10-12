import React from "react";
import type { CompetitionAnalysisDto } from "../../types";
import { formatEuro } from "./negotiationUtils";
import { MarginBadge } from "./MarginBadge";

interface Props {
    readonly data: CompetitionAnalysisDto[];
}

export const CompetitionMobile: React.FC<Props> = ({ data }) => {
    if (data.length === 0) {
        return <p className="p-6 text-center text-gray-500 text-sm">Δεν βρέθηκαν μοντέλα.</p>;
    }

    return (
        <div className="flex flex-col gap-3">
            {data.map((r) => (
                <div key={`${r.brand}|${r.model}`} className="rounded-xl border border-gray-800 bg-gray-900 p-4">
                    <div className="flex items-start justify-between gap-2">
                        <div className="font-bold text-gray-100 leading-tight">
                            {r.brand} <span className="font-medium text-gray-300">{r.model}</span>
                        </div>
                        <MarginBadge pct={r.marginPct} />
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-2 rounded bg-gray-950/40 px-3 py-2">
                        <div>
                            <div className="text-xs text-gray-500">
                                Ιδιώτες ({r.privateListingsCount})
                            </div>
                            <div className="text-sm font-bold text-gray-100">{formatEuro(r.privateMedianPrice)}</div>
                        </div>
                        <div>
                            <div className="text-xs text-gray-500">
                                Έμποροι ({r.dealerListingsCount})
                            </div>
                            <div className="text-sm font-bold text-gray-100">{formatEuro(r.dealerMedianPrice)}</div>
                        </div>
                    </div>

                    <div className="mt-2 flex items-baseline justify-between">
                        <span className="text-xs text-gray-500">Περιθώριο</span>
                        <span className={`text-lg font-extrabold ${r.medianMargin > 0 ? "text-emerald-400" : "text-red-400"}`}>
                            {formatEuro(r.medianMargin)}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
};