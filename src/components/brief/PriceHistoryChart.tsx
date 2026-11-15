import React from "react";
import { PricePointDto } from "../../types";

const W = 320;
const H = 90;
const PAD = 8;

// Step chart of the asking price over time. Needs at least two points to mean anything.
export const PriceHistoryChart: React.FC<{ points: PricePointDto[] }> = ({ points }) => {
  if (points.length < 2) return <div className="text-xs text-gray-500">Δεν έχει αλλάξει τιμή από τότε που την παρακολουθούμε.</div>;

  const times = points.map((p) => new Date(p.recordedAt).getTime());
  const prices = points.map((p) => p.price);
  const [t0, t1] = [Math.min(...times), Math.max(...times)];
  const [lo, hi] = [Math.min(...prices), Math.max(...prices)];
  const x = (t: number) => PAD + ((t - t0) / Math.max(1, t1 - t0)) * (W - 2 * PAD);
  const y = (p: number) => H - PAD - ((p - lo) / Math.max(1, hi - lo)) * (H - 2 * PAD);

  // Horizontal until the change, then straight down/up: the price is constant between two recordings.
  const path = points
    .map((p, i) => (i === 0 ? `M${x(times[0])},${y(p.price)}` : `L${x(times[i])},${y(points[i - 1].price)} L${x(times[i])},${y(p.price)}`))
    .join(" ");

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-sm" role="img" aria-label="Ιστορικό τιμής">
      <path d={path} fill="none" stroke="#60a5fa" strokeWidth="2" />
      <text x={PAD} y={12} fontSize="10" fill="#9ca3af">€{hi.toLocaleString("el-GR")}</text>
      <text x={PAD} y={H - 1} fontSize="10" fill="#9ca3af">€{lo.toLocaleString("el-GR")}</text>
    </svg>
  );
};
