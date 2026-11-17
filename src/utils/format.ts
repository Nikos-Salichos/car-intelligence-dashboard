export const eur = (n: number | null | undefined): string => (n === null || n === undefined ? "—" : `${Math.round(n).toLocaleString("el-GR")} €`);
export const km = (n: number): string => `${Math.round(n).toLocaleString("el-GR")} km`;
export const pct = (n: number): string => `${n.toLocaleString("el-GR", { maximumFractionDigits: 1 })}%`;
export const days = (n: number): string => (n === 0 ? "σήμερα" : n === 1 ? "1 ημέρα" : `${n} ημέρες`);
