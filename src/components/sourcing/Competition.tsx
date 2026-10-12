import React, { useMemo, useState } from "react";
import type { CompetitionAnalysisDto } from "../../types";
import { useIsMobile } from "../../hooks/useIsMobile";
import { CompetitionDesktop } from "./CompetitionDesktop";
import { CompetitionMobile } from "./CompetitionMobile";
import { formatEuro } from "./negotiationUtils";
import { formatPct } from "../../utils/competitionUtils";

interface Props {
    readonly data: CompetitionAnalysisDto[];
    readonly minPerSide: number;
    readonly onChangeMinPerSide: (value: number) => void;
    readonly isLoading?: boolean;
}

const OPTIONS = [2, 3, 5, 10];

const median = (values: number[]): number => {
    if (values.length === 0) return 0;
    const a = [...values].sort((x, y) => x - y);
    const mid = Math.floor(a.length / 2);
    return a.length % 2 === 1 ? a[mid] : (a[mid - 1] + a[mid]) / 2;
};

const KpiCard: React.FC<{ readonly label: string; readonly value: string; readonly hint?: string }> = ({
    label,
    value,
    hint,
}) => (
    <div className="rounded-xl border border-gray-800 bg-gray-900 p-4">
        <div className="text-[11px] uppercase tracking-wider text-gray-500">{label}</div>
        <div className="mt-1 text-xl font-extrabold text-gray-100">{value}</div>
        {hint && <div className="mt-0.5 text-xs text-gray-500">{hint}</div>}
    </div>
);

export const Competition: React.FC<Props> = ({ data, minPerSide, onChangeMinPerSide, isLoading = false }) => {
    const isMobile = useIsMobile(768);
    const [search, setSearch] = useState<string>("");

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return data;
        return data.filter((r) => `${r.brand} ${r.model}`.toLowerCase().includes(q));
    }, [data, search]);

    const kpis = useMemo(() => {
        const top = data.reduce<CompetitionAnalysisDto | null>(
            (best, r) => (best === null || r.medianMargin > best.medianMargin ? r : best),
            null,
        );
        return {
            models: data.length,
            medianPct: median(data.map((r) => r.marginPct)),
            top,
        };
    }, [data]);

    return (
        <div className="relative w-full h-full bg-gray-950 text-gray-100 font-sans flex flex-col flex-1 touch-manipulation gap-4">
            {isLoading && (
                <div className="absolute inset-0 bg-gray-950/85 backdrop-blur-md z-30 flex items-center justify-center font-bold text-blue-400 text-sm">
                    <span className="animate-pulse">Φόρτωση δεδομένων...</span>
                </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h2 className="text-lg font-bold">Ιδιώτες vs Έμποροι</h2>
                    <p className="text-xs text-gray-500">
                        Διάμεση τιμή ανά μοντέλο: πόσο ακριβότερα πουλάνε οι έμποροι από τους ιδιώτες. {filtered.length} μοντέλα.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Αναζήτηση μάρκας / μοντέλου..."
                        className="w-48 rounded-lg border border-gray-700 bg-gray-900 px-3 py-1.5 text-xs text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />

                    <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">Ελάχιστες αγγελίες ανά πλευρά:</span>
                        <div className="flex overflow-hidden rounded-lg border border-gray-700">
                            {OPTIONS.map((n) => (
                                <button
                                    key={n}
                                    onClick={() => onChangeMinPerSide(n)}
                                    className={`px-3 py-1.5 text-xs font-semibold transition-colors ${minPerSide === n ? "bg-blue-600 text-white" : "bg-gray-900 text-gray-300 hover:bg-gray-800"
                                        }`}
                                >
                                    {n}+
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <KpiCard label="Μοντέλα με σύγκριση" value={kpis.models.toLocaleString("el-GR")} />
                <KpiCard
                    label="Διάμεσο περιθώριο"
                    value={formatPct(Math.round(kpis.medianPct * 10) / 10)}
                    hint={kpis.medianPct >= 0 ? "Οι έμποροι ζητούν περισσότερα από ιδιώτες" : "Οι έμποροι ζητούν λιγότερα από ιδιώτες"}
                />
                <KpiCard
                    label="Μεγαλύτερο περιθώριο"
                    value={kpis.top ? formatEuro(kpis.top.medianMargin) : "-"}
                    hint={kpis.top ? `${kpis.top.brand} ${kpis.top.model}` : undefined}
                />
            </div>

            {isMobile ? <CompetitionMobile data={filtered} /> : <CompetitionDesktop data={filtered} />}

            <p className="text-[11px] leading-relaxed text-gray-500">
                Το περιθώριο είναι μικτό: δεν περιλαμβάνει συντήρηση, εγγύηση, ΦΠΑ ή κόστος αποθήκευσης. Η ένδειξη ⚠
                σημαίνει ότι τα αυτοκίνητα των εμπόρων έχουν πάνω από 20.000 km διαφορά από των ιδιωτών, άρα η σύγκριση
                είναι μερικώς άδικη.
            </p>
        </div>
    );
};