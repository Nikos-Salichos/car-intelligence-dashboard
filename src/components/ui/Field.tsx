import React from "react";

const CONTROL = "bg-gray-950 border border-gray-800 rounded-lg px-2.5 py-2 text-sm text-gray-100 w-full focus:outline-none focus:border-blue-500 disabled:opacity-40";

/** Label above a control, with an optional hint underneath. The label wraps the control, so clicking it focuses the control. */
export const Field: React.FC<{ label: string; hint?: string; className?: string; children: React.ReactNode }> = ({ label, hint, className = "", children }) => (
  <label className={`flex flex-col gap-1 text-xs font-semibold text-gray-400 ${className}`}>
    {label}
    {children}
    {hint && <span className="text-[10px] font-normal text-gray-500">{hint}</span>}
  </label>
);

export const TextInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({ className = "", ...rest }) => <input className={`${CONTROL} ${className}`} {...rest} />;

export const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = ({ className = "", ...rest }) => <select className={`${CONTROL} ${className}`} {...rest} />;

export const Checkbox: React.FC<{ label: string; hint?: string; checked: boolean; onChange: (checked: boolean) => void; className?: string }> = ({ label, hint, checked, onChange, className = "" }) => (
  <label className={`flex items-start gap-2 text-xs text-gray-300 ${className}`}>
    <input type="checkbox" className="mt-0.5" checked={checked} onChange={(e) => onChange(e.target.checked)} />
    <span>
      <strong className="font-semibold">{label}</strong>
      {hint && <span className="block text-[10px] text-gray-500">{hint}</span>}
    </span>
  </label>
);
