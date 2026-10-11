import React from "react";
import type { NegotiationSignalDto } from "../../types";

export const formatEuro = (n: number) => `€${Math.round(n).toLocaleString("el-GR")}`;

export const formatDate = (iso: string | null) => (iso ? new Date(iso).toLocaleDateString("el-GR", { day: "2-digit", month: "short" }) : "-");

// totalDropPct is positive when the price went down overall
export const formatTotalDrop = (pct: number) => (pct > 0 ? `−${pct}%` : pct < 0 ? `+${Math.abs(pct)}%` : "0%");

const BADGE_STYLES: Record<string, string> = {
  high: "bg-emerald-950/60 text-emerald-400 border-emerald-800/60",
  medium: "bg-amber-950/60 text-amber-400 border-amber-800/60",
  low: "bg-gray-800 text-gray-300 border-gray-700",
};

const BADGE_LABELS: Record<string, string> = {
  high: "Υψηλό",
  medium: "Μέτριο",
  low: "Χαμηλό",
};

export const NegotiationBadge: React.FC<{ level: NegotiationSignalDto["negotiationSignal"] }> = ({ level }) => {
  if (level === "none") return null;
  return <span className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-bold border ${BADGE_STYLES[level]}`}>{BADGE_LABELS[level]}</span>;
};
