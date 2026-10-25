import React, { useState, useMemo } from "react";
import { CarDto, FairMarketPriceDto } from "../../types";

interface Props {
  cars: CarDto[];
  loadingCars: boolean;
  calculating: boolean;
  result: FairMarketPriceDto | null;
  onCalculate: (carId: string, userMileage: number) => void;
}

const MAX_MILEAGE = 1_000_000;

const formatNumber = (value: number) => value.toLocaleString("el-GR");

export const FairMarketPriceCalculator: React.FC<Props> = ({ cars, loadingCars, calculating, result, onCalculate }) => {
  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [selectedCarId, setSelectedCarId] = useState<string>("");
  const [userMileage, setUserMileage] = useState<number | "">(30000);

  // Μοναδικές μάρκες, ταξινομημένες αλφαβητικά
  const brands = useMemo(() => {
    const set = new Set(cars.map((c) => c.brand));
    return Array.from(set).sort();
  }, [cars]);

  // Μοντέλα της επιλεγμένης μάρκας
  const filteredModels = useMemo(() => {
    if (!selectedBrand) return [];
    return cars.filter((c) => c.brand === selectedBrand);
  }, [cars, selectedBrand]);

  const mileageInvalid = userMileage !== "" && (userMileage < 0 || userMileage > MAX_MILEAGE);
  const canSubmit = !!selectedCarId && userMileage !== "" && !mileageInvalid && !calculating;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    onCalculate(selectedCarId, Number(userMileage));
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6">
      {/* Φόρμα */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-xl">
        <h2 className="text-xl font-bold text-gray-100 mb-4">Υπολογισμός Δίκαιης Αξίας Αγοράς (Fair Market Price)</h2>

        {loadingCars ? (
          <div className="text-sm text-blue-400 animate-pulse">Φόρτωση διαθέσιμων οχημάτων...</div>
        ) : (
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Μάρκα */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-400">Μάρκα</label>
              <select
                className="bg-gray-950 border border-gray-800 rounded-lg p-2.5 text-sm text-gray-100 focus:outline-none focus:border-blue-500 transition-colors"
                value={selectedBrand}
                onChange={(e) => {
                  setSelectedBrand(e.target.value);
                  setSelectedCarId("");
                }}
              >
                <option value="">Επιλέξτε Μάρκα</option>
                {brands.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            {/* Μοντέλο */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-400">Μοντέλο</label>
              <select disabled={!selectedBrand} className="bg-gray-950 border border-gray-800 rounded-lg p-2.5 text-sm text-gray-100 focus:outline-none focus:border-blue-500 disabled:opacity-40 transition-colors" value={selectedCarId} onChange={(e) => setSelectedCarId(e.target.value)}>
                <option value="">Επιλέξτε Μοντέλο</option>
                {filteredModels.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.model}
                  </option>
                ))}
              </select>
            </div>

            {/* Χιλιόμετρα */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-400">Χιλιόμετρα Οχήματος</label>
              <input
                type="number"
                min="0"
                max={MAX_MILEAGE}
                step="1"
                className={`bg-gray-950 border rounded-lg p-2.5 text-sm text-gray-100 focus:outline-none transition-colors ${mileageInvalid ? "border-red-700 focus:border-red-500" : "border-gray-800 focus:border-blue-500"}`}
                value={userMileage}
                onChange={(e) => setUserMileage(e.target.value === "" ? "" : Number(e.target.value))}
                placeholder="π.χ. 45000"
              />
              {mileageInvalid && <span className="text-xs text-red-400">Εισάγετε τιμή από 0 έως {formatNumber(MAX_MILEAGE)} km.</span>}
            </div>

            {/* Υποβολή */}
            <div className="md:col-span-3 flex justify-end mt-2">
              <button type="submit" disabled={!canSubmit} className="bg-blue-600 hover:bg-blue-500 disabled:bg-gray-800 disabled:text-gray-500 text-white font-semibold py-2.5 px-6 rounded-lg text-sm transition-all flex items-center gap-2">
                {calculating && <span className="animate-spin">⏳</span>}
                {calculating ? "Υπολογισμός..." : "Υπολογισμός Αξίας"}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Αποτέλεσμα */}
      {result && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-xl grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
          <div className="flex flex-col justify-between border-b md:border-b-0 md:border-r border-gray-800 pb-4 md:pb-0 md:pr-6">
            <div>
              <span className="text-xs font-semibold text-blue-400 tracking-wider uppercase">{result.brand}</span>
              <h3 className="text-2xl font-bold text-gray-100 mt-1">{result.model}</h3>
            </div>

            <div className="mt-4 flex flex-col gap-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Χιλιόμετρα Χρήστη:</span>
                <span className="font-semibold text-gray-200">{formatNumber(result.userMileage)} km</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Μέσος Όρος Αγοράς (km):</span>
                <span className="font-semibold text-gray-200">{formatNumber(result.marketAvgMileage)} km</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Μέση Τιμή Αγοράς:</span>
                <span className="font-semibold text-gray-200">{formatNumber(result.marketAvgPrice)} €</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Αγγελίες που χρησιμοποιήθηκαν:</span>
                <span className="font-semibold text-gray-200">
                  {result.sampleSize} από {result.totalListings}
                </span>
              </div>
            </div>
          </div>

          {/* Δίκαιη τιμή */}
          <div className="flex flex-col items-center justify-center bg-gray-950 border border-gray-800 rounded-xl p-6 text-center">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">ΔΙΚΑΙΗ ΤΙΜΗ ΑΓΟΡΑΣ</span>
            <div className={`text-4xl font-extrabold mt-2 ${result.isIndicative ? "text-yellow-400" : "text-green-400"}`}>{formatNumber(result.fairMarketPrice)} €</div>

            {result.isIndicative && (
              <div className="mt-3 text-xs font-medium text-yellow-300 bg-yellow-950/40 border border-yellow-900/60 rounded-lg px-3 py-2">
                {result.mileageOutOfRange
                  ? "Ενδεικτική τιμή: τα χιλιόμετρά σας είναι εκτός του εύρους των αγγελιών της αγοράς."
                  : "Ενδεικτική τιμή: υπάρχουν λίγες αγγελίες με παρόμοια χιλιόμετρα."}
              </div>
            )}

            <p className="text-xs text-gray-500 mt-3">* Η τιμή βασίζεται στις αγγελίες του ίδιου μοντέλου με τα πιο κοντινά χιλιόμετρα στα δικά σας.</p>
          </div>
        </div>
      )}
    </div>
  );
};
