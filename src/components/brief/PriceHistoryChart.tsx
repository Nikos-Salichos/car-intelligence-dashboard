import React from "react";
import { PricePointDto } from "../../types";

const W = 640;
const H = 240;
const M = { left: 64, right: 24, top: 28, bottom: 44 };
const MAX_LABELLED_POINTS = 8; // more points than this and only the tooltips show the details

const date = (t: number) => new Date(t).toLocaleDateString("el-GR", { day: "2-digit", month: "2-digit", year: "2-digit" });
const eur = (n: number) => `${Math.round(n).toLocaleString("el-GR")} €`;

// Price over time, one dot per recorded price (the dates are when WE saw the price, not when the seller changed it).
// The price is constant between two recordings, so the line is a step line, extended to today.
export const PriceHistoryChart: React.FC<{ points: PricePointDto[] }> = ({ points }) => {
  const [now] = React.useState(() => Date.now()); // fixed for the life of the chart (render must stay pure)
  if (points.length === 0) return <div className="text-xs text-gray-500">Δεν υπάρχει καταγεγραμμένο ιστορικό τιμής.</div>;

  const dots = points.map((p) => ({ t: new Date(p.recordedAt).getTime(), price: p.price, change: p.change ?? 0 }));
  const last = dots[dots.length - 1];
  const t0 = dots[0].t;
  const t1 = Math.max(now, last.t);
  const showToday = t1 - last.t > 12 * 3600 * 1000; // the last price is still the current one

  const prices = dots.map((d) => d.price);
  const rawLo = Math.min(...prices);
  const rawHi = Math.max(...prices);
  const pad = rawHi === rawLo ? rawHi * 0.05 : (rawHi - rawLo) * 0.2; // a flat price gets a calm band instead of a zero-height axis
  const lo = rawLo - pad;
  const hi = rawHi + pad;

  const x = (t: number) => M.left + ((t - t0) / Math.max(1, t1 - t0)) * (W - M.left - M.right);
  const y = (p: number) => H - M.bottom - ((p - lo) / (hi - lo)) * (H - M.top - M.bottom);

  const path = dots
    .map((d, i) => (i === 0 ? `M${x(d.t)},${y(d.price)}` : `L${x(d.t)},${y(dots[i - 1].price)} L${x(d.t)},${y(d.price)}`))
    .join(" ");
  const toToday = `M${x(last.t)},${y(last.price)} L${x(t1)},${y(last.price)}`;

  const grid = [rawHi, (rawHi + rawLo) / 2, rawLo].filter((v, i, a) => a.indexOf(v) === i);
  const labelAll = dots.length <= MAX_LABELLED_POINTS;
  const color = (i: number, change: number) => (i === 0 ? "#60a5fa" : change < 0 ? "#34d399" : "#f87171");

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="w-full"
      role="img"
      aria-label={`Ιστορικό τιμής: ${dots.map((d) => `${date(d.t)} ${eur(d.price)}`).join(", ")}`}
    >
      {grid.map((v) => (
        <g key={v}>
          <line x1={M.left} x2={W - M.right} y1={y(v)} y2={y(v)} stroke="#374151" strokeDasharray="3 4" />
          <text x={M.left - 8} y={y(v) + 4} textAnchor="end" fontSize="11" fill="#9ca3af">
            {eur(v)}
          </text>
        </g>
      ))}

      <path d={path} fill="none" stroke="#60a5fa" strokeWidth="2" />
      {showToday && <path d={toToday} fill="none" stroke="#60a5fa" strokeWidth="2" strokeDasharray="5 4" />}

      {dots.map((d, i) => (
        <g key={`${d.t}-${i}`}>
          <circle cx={x(d.t)} cy={y(d.price)} r={5.5} fill={color(i, d.change)} stroke="#111827" strokeWidth="1.5">
            <title>{`${date(d.t)}: ${eur(d.price)}${i > 0 ? ` (${d.change < 0 ? "" : "+"}${eur(d.change)})` : ""}`}</title>
          </circle>
          {labelAll && (
            <>
              <text x={x(d.t)} y={y(d.price) - 11} textAnchor="middle" fontSize="11" fontWeight="600" fill="#e5e7eb">
                {eur(d.price)}
              </text>
              <text x={x(d.t)} y={H - M.bottom + 18} textAnchor="middle" fontSize="10" fill="#9ca3af">
                {date(d.t)}
              </text>
            </>
          )}
        </g>
      ))}

      {showToday && (
        <g>
          <circle cx={x(t1)} cy={y(last.price)} r={5.5} fill="#111827" stroke="#60a5fa" strokeWidth="2">
            <title>{`Σήμερα: ${eur(last.price)}`}</title>
          </circle>
          {labelAll && (
            <text x={x(t1)} y={H - M.bottom + 18} textAnchor="middle" fontSize="10" fill="#9ca3af">
              σήμερα
            </text>
          )}
        </g>
      )}

      {!labelAll && (
        <>
          <text x={M.left} y={H - M.bottom + 18} fontSize="10" fill="#9ca3af">
            {date(t0)}
          </text>
          <text x={W - M.right} y={H - M.bottom + 18} textAnchor="end" fontSize="10" fill="#9ca3af">
            {date(t1)}
          </text>
        </>
      )}
    </svg>
  );
};
