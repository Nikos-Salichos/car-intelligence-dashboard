import React from "react";
import { formatPct } from "../../utils/competitionUtils";

interface Props {
    readonly pct: number;
}

export const MarginBadge: React.FC<Props> = ({ pct }) => {
    let style = "bg-gray-800 text-gray-300 border-gray-700";
    if (pct >= 15) style = "bg-emerald-950/60 text-emerald-400 border-emerald-800/60";
    else if (pct >= 5) style = "bg-amber-950/60 text-amber-400 border-amber-800/60";
    else if (pct < 0) style = "bg-red-950/60 text-red-400 border-red-800/60";

    return (
        <span className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-bold border ${style}`}>
            {formatPct(pct)}
        </span>
    );
};