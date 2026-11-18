import React from "react";

type Tone = "info" | "success" | "warning" | "danger" | "neutral";

const TONE: Record<Tone, string> = {
  info: "bg-blue-950/40 border-blue-900/60 text-blue-200",
  success: "bg-emerald-950/40 border-emerald-900/60 text-emerald-300",
  warning: "bg-amber-950/40 border-amber-900/60 text-amber-300",
  danger: "bg-red-950/40 border-red-900/60 text-red-300",
  neutral: "bg-gray-900 border-gray-800 text-gray-300",
};

/** A message box. Danger and warning are announced to screen readers. */
export const Notice: React.FC<{ tone?: Tone; children: React.ReactNode; className?: string }> = ({ tone = "info", children, className = "" }) => (
  <div role={tone === "danger" || tone === "warning" ? "alert" : "status"} className={`border rounded-lg px-3 py-2 text-xs font-medium ${TONE[tone]} ${className}`}>
    {children}
  </div>
);

/** A small coloured label (signal level, seller type, confidence...). */
export const Badge: React.FC<{ tone?: Tone; title?: string; children: React.ReactNode }> = ({ tone = "neutral", title, children }) => (
  <span title={title} className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold border whitespace-nowrap ${TONE[tone]}`}>
    {children}
  </span>
);

export const Loading: React.FC<{ text?: string }> = ({ text = "Φόρτωση..." }) => (
  <div role="status" className="text-sm text-blue-400 animate-pulse py-6 text-center">
    {text}
  </div>
);

export const Empty: React.FC<{ children: React.ReactNode }> = ({ children }) => <div className="text-sm text-gray-500 py-8 text-center">{children}</div>;
