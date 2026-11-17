import React from "react";
import { OpportunityFilters, OpportunityView } from "../../types/opportunities";
import { FUEL_VALUES, fuelLabel } from "../../utils/labels";

interface Props {
  view: OpportunityView;
  value: OpportunityFilters;
  onChange: (next: OpportunityFilters) => void;
  onApply: () => void;
}

const INPUT = "bg-gray-950 border border-gray-800 rounded-lg px-2.5 py-2 text-sm text-gray-100 focus:outline-none focus:border-blue-500 w-full";

const Field: React.FC<{ label: string; hint?: string; children: React.ReactNode }> = ({ label, hint, children }) => (
  <label className="flex flex-col gap-1 text-xs font-semibold text-gray-400">
    {label}
    {children}
    {hint && <span className="text-[10px] font-normal text-gray-500">{hint}</span>}
  </label>
);

export const OpportunityFilterForm: React.FC<Props> = ({ view, value, onChange, onApply }) => {
  const set = <K extends keyof OpportunityFilters>(key: K, v: OpportunityFilters[K]) => onChange({ ...value, [key]: v });
  const text = (key: keyof OpportunityFilters, props: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <input className={INPUT} value={value[key] as string} onChange={(e) => set(key, e.target.value as never)} {...props} />
  );

  return (
    <form
      className="bg-gray-900 border border-gray-800 rounded-xl p-4 grid grid-cols-2 md:grid-cols-4 gap-3"
      onSubmit={(e) => {
        e.preventDefault();
        onApply();
      }}
    >
      <Field label="Μάρκα">{text("brand", { placeholder: "π.χ. Toyota" })}</Field>
      <Field label="Μέγιστη τιμή (€)">{text("maxPrice", { type: "number", min: 0 })}</Field>
      <Field label="Από έτος">{text("minYear", { type: "number", min: 1990 })}</Field>
      <Field label="Μέγιστα χιλιόμετρα">{text("maxMileage", { type: "number", min: 0 })}</Field>

      <Field label="Καύσιμο">
        <select className={INPUT} value={value.fuel} onChange={(e) => set("fuel", e.target.value)}>
          <option value="">Όλα</option>
          {FUEL_VALUES.map((f) => (
            <option key={f} value={f}>
              {fuelLabel(f)}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Περιοχή (ΤΚ)" hint="2 πρώτα ψηφία, π.χ. 81 = Λέσβος">
        {text("region", { inputMode: "numeric", maxLength: 2, placeholder: "—" })}
      </Field>
      {view !== "flip" && (
        <Field label="Πωλητής">
          <select className={INPUT} value={value.seller} onChange={(e) => set("seller", e.target.value)}>
            <option value="">Όλοι</option>
            <option value="Dealer">Έμποροι</option>
            <option value="Private">Ιδιώτες</option>
          </select>
        </Field>
      )}

      {view !== "mature" && (
        <>
          <Field label="Έξοδα ανά αυτοκίνητο (€)" hint="service, μεταβίβαση, ΚΤΕΟ…">
            {text("costs", { type: "number", min: 0, max: 10000 })}
          </Field>
          <Field label="Ελάχιστο καθαρό περιθώριο (€)">{text("minMargin", { type: "number" })}</Field>
        </>
      )}

      {view === "new" && (
        <>
          <Field label="Δημοσιεύτηκαν τις τελευταίες">
            <select className={INPUT} value={value.days} onChange={(e) => set("days", e.target.value)} disabled={value.crossedBelowFair}>
              {[1, 2, 3, 7, 14].map((d) => (
                <option key={d} value={d}>
                  {d === 1 ? "1 ημέρα" : `${d} ημέρες`}
                </option>
              ))}
            </select>
          </Field>
          <label className="flex items-start gap-2 text-xs text-gray-300 col-span-2">
            <input type="checkbox" className="mt-0.5" checked={value.crossedBelowFair} onChange={(e) => set("crossedBelowFair", e.target.checked)} />
            <span>
              <strong>Μόλις έπεσαν κάτω από τη δίκαιη τιμή</strong>
              <span className="block text-[10px] text-gray-500">Αγγελίες οποιασδήποτε ηλικίας που με μείωση τιμής (στις ημέρες που επιλέγεις) πέρασαν κάτω από τη δίκαιη τιμή.</span>
            </span>
          </label>
          <label className="flex items-start gap-2 text-xs text-gray-300 col-span-2">
            <input type="checkbox" className="mt-0.5" checked={value.includeSuspect} onChange={(e) => set("includeSuspect", e.target.checked)} />
            <span>
              Να εμφανίζονται και οι ύποπτα φθηνές
              <span className="block text-[10px] text-gray-500">Συχνά λάθος τιμή ή κρυφή ζημιά. Ελέγξτε τις πριν κάνετε οτιδήποτε.</span>
            </span>
          </label>
        </>
      )}

      {view === "mature" && (
        <>
          <Field label="Στην αγορά τουλάχιστον (ημέρες)">{text("minDays", { type: "number", min: 1 })}</Field>
          <Field label="Μειώσεις τιμής τουλάχιστον">{text("minDrops", { type: "number", min: 0 })}</Field>
          <Field label="Στην αγορά το πολύ (ημέρες)" hint="Παλιότερες αγγελίες συνήθως δεν κινούνται">{text("maxDays", { type: "number", min: 1, placeholder: "365" })}</Field>
          <Field label="Πόσο πάνω από τη δίκαιη τιμή το πολύ (%)" hint="Πολύ πάνω από την αγορά δεν είναι διαπραγμάτευση">
            {text("maxOverpricingPct", { type: "number", min: 1 })}
          </Field>
        </>
      )}

      {view === "flip" && (
        <>
          <Field label="Συγκρίσιμες αγγελίες εμπόρων τουλάχιστον">{text("minComparables", { type: "number", min: 1 })}</Field>
          <Field label="Στην αγορά το πολύ (ημέρες)" hint="Φθηνή αγγελία που δεν πουλήθηκε για μήνες έχει συνήθως λόγο">
            {text("maxDays", { type: "number", min: 1, placeholder: "90" })}
          </Field>
        </>
      )}

      <div className="col-span-2 md:col-span-4 flex justify-end">
        <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm px-5 py-2 rounded-lg">
          Εφαρμογή
        </button>
      </div>
    </form>
  );
};
