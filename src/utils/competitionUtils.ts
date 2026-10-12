import type { CompetitionAnalysisDto } from "../types";

export const MIN_RELIABLE_SIDE = 4;

export const getMinSide = (r: CompetitionAnalysisDto): number =>
    Math.min(r.privateListingsCount, r.dealerListingsCount);

export const formatPct = (pct: number): string => `${pct > 0 ? "+" : ""}${pct}%`;