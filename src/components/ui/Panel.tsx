import React from "react";

/** The one card of the app: dark surface, thin border, optional title. */
export const Panel: React.FC<{ title?: string; children: React.ReactNode; className?: string }> = ({ title, children, className = "" }) => (
  <section className={`bg-gray-900 border border-gray-800 rounded-xl p-4 sm:p-5 ${className}`}>
    {title && <h2 className="text-sm font-bold text-gray-200 mb-3">{title}</h2>}
    {children}
  </section>
);

/** A number with a caption (price, days, margin...). */
export const StatTile: React.FC<{ label: string; value: React.ReactNode; hint?: string }> = ({ label, value, hint }) => (
  <div className="bg-gray-900 border border-gray-800 rounded-lg p-3">
    <div className="text-[11px] text-gray-500 uppercase tracking-wide">{label}</div>
    <div className="text-lg font-bold text-gray-100 mt-0.5">{value}</div>
    {hint && <div className="text-[11px] text-gray-500 mt-0.5">{hint}</div>}
  </div>
);
