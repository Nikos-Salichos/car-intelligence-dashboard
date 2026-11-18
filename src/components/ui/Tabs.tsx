/** Switches between a few views of the same page. Real buttons with tab semantics, so the keyboard and screen readers work. */
export function Tabs<T extends string>({ tabs, value, onChange, label }: { tabs: { id: T; label: string }[]; value: T; onChange: (id: T) => void; label: string }) {
  return (
    <div role="tablist" aria-label={label} className="flex gap-2 overflow-x-auto">
      {tabs.map((t) => (
        <button
          key={t.id}
          role="tab"
          aria-selected={t.id === value}
          onClick={() => onChange(t.id)}
          className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-colors ${
            t.id === value ? "bg-blue-600 text-white" : "bg-gray-900 text-gray-400 hover:text-gray-200 border border-gray-800"
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
