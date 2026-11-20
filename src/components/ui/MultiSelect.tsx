import React, { useEffect, useRef, useState } from "react";

export interface MultiOption {
  value: string;
  label: string;
}

/** A dropdown with checkboxes: pick several values at once. Closes on a click elsewhere or Escape. */
export const MultiSelect: React.FC<{ label: string; hint?: string; options: MultiOption[]; value: string[]; onChange: (next: string[]) => void; placeholder: string }> = ({
  label,
  hint,
  options,
  value,
  onChange,
  placeholder,
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent ? e.key === "Escape" : !ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", close);
    };
  }, [open]);

  const toggle = (v: string) => onChange(value.includes(v) ? value.filter((x) => x !== v) : [...value, v]);
  const summary = value.length === 0 ? placeholder : value.length <= 2 ? value.map((v) => options.find((o) => o.value === v)?.label ?? v).join(", ") : `${value.length} επιλεγμένες`;

  return (
    <div className="flex flex-col gap-1 text-xs font-semibold text-gray-400" ref={ref}>
      {label}
      <div className="relative">
        <button
          type="button"
          aria-haspopup="listbox"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
          className="bg-gray-950 border border-gray-800 rounded-lg px-2.5 py-2 text-sm text-gray-100 w-full text-left truncate focus:outline-none focus:border-blue-500"
        >
          {summary}
        </button>
        {open && (
          <div role="listbox" aria-multiselectable className="absolute z-40 mt-1 w-full min-w-56 max-h-64 overflow-y-auto bg-gray-900 border border-gray-800 rounded-lg shadow-xl py-1">
            {value.length > 0 && (
              <button type="button" onClick={() => onChange([])} className="w-full text-left px-3 py-1.5 text-xs text-blue-400 hover:bg-gray-800">
                Καθαρισμός επιλογής
              </button>
            )}
            {options.map((o) => (
              <label key={o.value} className="flex items-center gap-2 px-3 py-1.5 text-sm font-normal text-gray-200 hover:bg-gray-800 cursor-pointer">
                <input type="checkbox" checked={value.includes(o.value)} onChange={() => toggle(o.value)} />
                {o.label}
              </label>
            ))}
          </div>
        )}
      </div>
      {hint && <span className="text-[10px] font-normal text-gray-500">{hint}</span>}
    </div>
  );
};
