import React, { useMemo, useState } from "react";
import { reportsApi } from "../api/reports";
import { errorMessage, useApi } from "../hooks/useApi";
import { Page } from "../components/layout/Page";
import { Button } from "../components/ui/Button";
import { Field, Select, TextInput } from "../components/ui/Field";
import { Loading, Notice } from "../components/ui/Feedback";
import { Panel } from "../components/ui/Panel";
import { ValuationResult } from "../components/valuation/ValuationResult";
import { FairMarketPriceDto } from "../types";
import { FUEL_VALUES, fuelLabel } from "../utils/labels";

const MAX_MILEAGE = 500_000; // the API refuses more

/** What is a car worth? Pick the model and year, give the mileage (and, if you know them, fuel and engine size). */
export const ValuationPage: React.FC = () => {
  const cars = useApi(() => reportsApi.cars(), "cars", "Η φόρτωση των οχημάτων απέτυχε. Δοκιμάστε ξανά.");
  const [brand, setBrand] = useState("");
  const [carId, setCarId] = useState("");
  const [mileage, setMileage] = useState("30000");
  const [fuel, setFuel] = useState("");
  const [engineCc, setEngineCc] = useState("");
  const [result, setResult] = useState<FairMarketPriceDto | null>(null);
  const [calculating, setCalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const brands = useMemo(() => [...new Set((cars.data ?? []).map((c) => c.brand))].sort(), [cars.data]);
  const models = useMemo(() => (cars.data ?? []).filter((c) => c.brand === brand), [cars.data, brand]);
  const km = Number(mileage);
  const mileageInvalid = mileage === "" || !Number.isFinite(km) || km < 0 || km > MAX_MILEAGE;

  const calculate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!carId || mileageInvalid) return;
    setCalculating(true);
    setError(null);
    try {
      setResult(await reportsApi.fairMarketPrice(carId, km, { ...(fuel ? { fuel } : {}), ...(engineCc ? { engineCc: Number(engineCc) } : {}) }));
    } catch (err) {
      setResult(null);
      setError(errorMessage(err, "Η εκτίμηση τιμής απέτυχε. Δοκιμάστε ξανά."));
    } finally {
      setCalculating(false);
    }
  };

  return (
    <Page narrow title="Αποτίμηση" intro="Πόσο αξίζει ένα αυτοκίνητο σήμερα, με βάση τις τιμές που ζητούνται για παρόμοια αυτοκίνητα.">
      <Panel>
        {cars.loading ? (
          <Loading text="Φόρτωση διαθέσιμων οχημάτων..." />
        ) : (
          <form onSubmit={calculate} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Field label="Μάρκα">
              <Select value={brand} onChange={(e) => { setBrand(e.target.value); setCarId(""); }}>
                <option value="">Επιλέξτε μάρκα</option>
                {brands.map((b) => <option key={b} value={b}>{b}</option>)}
              </Select>
            </Field>
            <Field label="Μοντέλο και έτος">
              <Select disabled={!brand} value={carId} onChange={(e) => setCarId(e.target.value)}>
                <option value="">Επιλέξτε μοντέλο</option>
                {models.map((c) => <option key={c.id} value={c.id}>{c.model}</option>)}
              </Select>
            </Field>
            <Field label="Χιλιόμετρα" hint={mileageInvalid ? `Από 0 έως ${MAX_MILEAGE.toLocaleString("el-GR")} km.` : undefined}>
              <TextInput type="number" min={0} max={MAX_MILEAGE} value={mileage} onChange={(e) => setMileage(e.target.value)} aria-invalid={mileageInvalid} />
            </Field>
            <Field label="Καύσιμο (προαιρετικό)">
              <Select value={fuel} onChange={(e) => setFuel(e.target.value)}>
                <option value="">Αυτόματα (συνηθέστερο)</option>
                {FUEL_VALUES.map((f) => <option key={f} value={f}>{fuelLabel(f)}</option>)}
              </Select>
            </Field>
            <Field label="Κυβικά cc (προαιρετικό)">
              <TextInput type="number" min={600} max={8000} placeholder="π.χ. 1500" value={engineCc} onChange={(e) => setEngineCc(e.target.value)} />
            </Field>
            <div className="flex items-end justify-end">
              <Button type="submit" disabled={!carId || mileageInvalid || calculating}>{calculating ? "Υπολογισμός..." : "Υπολογισμός αξίας"}</Button>
            </div>
          </form>
        )}
      </Panel>
      {(cars.error || error) && <Notice tone="danger">{cars.error ?? error}</Notice>}
      {result && <ValuationResult result={result} />}
    </Page>
  );
};

export default ValuationPage;
