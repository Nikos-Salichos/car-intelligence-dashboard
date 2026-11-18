import React from "react";
import { Button } from "../ui/Button";
import { Checkbox, Field, Select, TextInput } from "../ui/Field";
import { Panel } from "../ui/Panel";
import { NEGOTIATION_PRESETS, NegotiationSignal, OpportunityFilters, OpportunityView } from "../../types/opportunities";
import { FUEL_VALUES, fuelLabel, SIGNAL_LABEL } from "../../utils/labels";

interface Props {
  view: OpportunityView;
  value: OpportunityFilters;
  onChange: (next: OpportunityFilters) => void;
  onApply: () => void;
}

/** The filters of one view. Edits are held until "Εφαρμογή": every change would otherwise trigger a request. */
export const OpportunityFilterForm: React.FC<Props> = ({ view, value, onChange, onApply }) => {
  const set = <K extends keyof OpportunityFilters>(key: K, v: OpportunityFilters[K]) => onChange({ ...value, [key]: v });
  const text = (key: keyof OpportunityFilters, props: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <TextInput value={value[key] as string} onChange={(e) => set(key, e.target.value as never)} {...props} />
  );

  return (
    <Panel>
      <form
        className="grid grid-cols-2 md:grid-cols-4 gap-3"
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
          <Select value={value.fuel} onChange={(e) => set("fuel", e.target.value)}>
            <option value="">Όλα</option>
            {FUEL_VALUES.map((f) => (
              <option key={f} value={f}>
                {fuelLabel(f)}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Περιοχή (ΤΚ)" hint="2 πρώτα ψηφία, π.χ. 81 = Λέσβος">
          {text("region", { inputMode: "numeric", maxLength: 2, placeholder: "—" })}
        </Field>
        {view !== "flip" && (
          <Field label="Πωλητής">
            <Select value={value.seller} onChange={(e) => set("seller", e.target.value)}>
              <option value="">Όλοι</option>
              <option value="Dealer">Έμποροι</option>
              <option value="Private">Ιδιώτες</option>
            </Select>
          </Field>
        )}

        {view === "all" && (
          <>
            <Field label="Ελάχιστη έκπτωση vs αγορά (%)">{text("minScore", { type: "number", placeholder: "π.χ. 10" })}</Field>
            <Checkbox className="col-span-2" label="Να εμφανίζονται και οι ύποπτα φθηνές" hint="Συχνά λάθος τιμή ή κρυφή ζημιά. Μπαίνουν πάντα τελευταίες." checked={value.showSuspect} onChange={(c) => set("showSuspect", c)} />
          </>
        )}

        {(view === "new" || view === "flip") && (
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
              <Select value={value.days} onChange={(e) => set("days", e.target.value)}>
                {[1, 2, 3, 7, 14].map((d) => (
                  <option key={d} value={d}>
                    {d === 1 ? "1 ημέρα" : `${d} ημέρες`}
                  </option>
                ))}
              </Select>
            </Field>
            <Checkbox
              className="col-span-2"
              label="Μόλις έπεσαν κάτω από τη δίκαιη τιμή"
              hint="Αγγελίες οποιασδήποτε ηλικίας που με μείωση τιμής (στις ημέρες που επιλέγεις) πέρασαν από πάνω προς τα κάτω."
              checked={value.crossedBelowFair}
              onChange={(c) => set("crossedBelowFair", c)}
            />
          </>
        )}

        {view === "negotiation" && (
          <>
            <div className="col-span-2 md:col-span-4 flex flex-wrap items-center gap-2">
              <span className="text-xs text-gray-400">Γρήγορη επιλογή:</span>
              <Button variant="secondary" size="sm" onClick={() => onChange({ ...value, ...NEGOTIATION_PRESETS.ripe })}>
                Ώριμες (πολλές μέρες, ακριβές)
              </Button>
              <Button variant="secondary" size="sm" onClick={() => onChange({ ...value, ...NEGOTIATION_PRESETS.dropped })}>
                Όλες με μείωση τιμής
              </Button>
            </div>
            <Field label="Ελάχιστο σήμα διαπραγμάτευσης">
              <Select value={value.minSignal} onChange={(e) => set("minSignal", e.target.value as NegotiationSignal)}>
                {(Object.keys(SIGNAL_LABEL) as NegotiationSignal[]).map((s) => (
                  <option key={s} value={s}>
                    {SIGNAL_LABEL[s]}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Μειώσεις τιμής τουλάχιστον">{text("minDrops", { type: "number", min: 0 })}</Field>
            <Field label="Στην αγορά τουλάχιστον (ημέρες)">{text("minDays", { type: "number", min: 0 })}</Field>
            <Field label="Στην αγορά το πολύ (ημέρες)" hint="Παλιότερες αγγελίες συνήθως δεν κινούνται">{text("maxDays", { type: "number", min: 1, placeholder: "365" })}</Field>
            <Field label="Πόσο πάνω από τη δίκαιη το πολύ (%)" hint="Πολύ πάνω από την αγορά δεν είναι διαπραγμάτευση">
              {text("maxOverpricingPct", { type: "number", min: 1 })}
            </Field>
            <Checkbox className="col-span-2" label="Μόνο όσες ζητούν πάνω από τη δίκαιη τιμή" checked={value.aboveFairOnly} onChange={(c) => set("aboveFairOnly", c)} />
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
          <Button type="submit">Εφαρμογή</Button>
        </div>
      </form>
    </Panel>
  );
};
