// One way to write a number in the whole app (Greek locale): 12.000 €, 25,2%, 72.000 km, 05/11/26.
export const eur = (n: number | null | undefined): string => (n === null || n === undefined ? "—" : `${Math.round(n).toLocaleString("el-GR")} €`);
export const km = (n: number): string => `${Math.round(n).toLocaleString("el-GR")} km`;
export const pct = (n: number): string => `${n.toLocaleString("el-GR", { maximumFractionDigits: 1 })}%`;
export const days = (n: number): string => (n === 0 ? "σήμερα" : n === 1 ? "1 ημέρα" : `${n} ημέρες`);
export const shortDate = (iso: string | null | undefined): string =>
  iso ? new Date(iso).toLocaleDateString("el-GR", { day: "2-digit", month: "2-digit", year: "2-digit" }) : "—";
