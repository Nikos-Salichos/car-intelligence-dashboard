import React, { useState, useMemo } from "react";
import { CarDto, FairMarketPriceDto } from "../../types";

interface Props {
    cars: CarDto[];
    loadingCars: boolean;
    calculating: boolean;
    result: FairMarketPriceDto | null;
    onCalculate: (carId: string, userMileage: number) => void;
}

export const FairMarketPriceCalculator: React.FC<Props> = ({
    cars,
    loadingCars,
    calculating,
    result,
    onCalculate,
}) => {
    const [selectedBrand, setSelectedBrand] = useState<string>("");
    const [selectedCarId, setSelectedCarId] = useState<string>("");
    const [userMileage, setUserMileage] = useState<number | "">(30000);

    // Extract unique brands list sorted alphabetically
    const brands = useMemo(() => {
        const set = new Set(cars.map((c) => c.brand));
        return Array.from(set).sort();
    }, [cars]);

    // Filter models based on selected brand
    const filteredModels = useMemo(() => {
        if (!selectedBrand) return [];
        return cars.filter((c) => c.brand === selectedBrand);
    }, [cars, selectedBrand]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCarId || userMileage === "") return;
        onCalculate(selectedCarId, Number(userMileage));
    };

    return (
        <div className="w-full max-w-4xl mx-auto flex flex-col gap-6">
            {/* Search / Controls Form */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-xl">
                <h2 className="text-xl font-bold text-gray-100 mb-4">
                    Υπολογισμός Δίκαιης Αξίας Αγοράς (Fair Market Price)
                </h2>

                {loadingCars ? (
                    <div className="text-sm text-blue-400 animate-pulse">
                        Φόρτωση διαθέσιμων οχημάτων...
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Brand Dropdown */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-gray-400">Μάρκα (Brand)</label>
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

                        {/* Model Dropdown */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-gray-400">Μοντέλο (Model)</label>
                            <select
                                disabled={!selectedBrand}
                                className="bg-gray-950 border border-gray-800 rounded-lg p-2.5 text-sm text-gray-100 focus:outline-none focus:border-blue-500 disabled:opacity-40 transition-colors"
                                value={selectedCarId}
                                onChange={(e) => setSelectedCarId(e.target.value)}
                            >
                                <option value="">Επιλέξτε Μοντέλο</option>
                                {filteredModels.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.model}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Mileage Input */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-gray-400">Χιλιόμετρα Οχήματος (km)</label>
                            <input
                                type="number"
                                min="0"
                                step="1"
                                className="bg-gray-950 border border-gray-800 rounded-lg p-2.5 text-sm text-gray-100 focus:outline-none focus:border-blue-500 transition-colors"
                                value={userMileage}
                                onChange={(e) => setUserMileage(e.target.value === "" ? "" : Number(e.target.value))}
                                placeholder="π.χ. 45000"
                            />
                        </div>

                        {/* Submit Button */}
                        <div className="md:col-span-3 flex justify-end mt-2">
                            <button
                                type="submit"
                                disabled={!selectedCarId || userMileage === "" || calculating}
                                className="bg-blue-600 hover:bg-blue-500 disabled:bg-gray-800 disabled:text-gray-500 text-white font-semibold py-2.5 px-6 rounded-lg text-sm transition-all flex items-center gap-2"
                            >
                                {calculating && <span className="animate-spin">⏳</span>}
                                {calculating ? "Υπολογισμός..." : "Υπολογισμός Αξίας"}
                            </button>
                        </div>
                    </form>
                )}
            </div>

            {/* Results Display */}
            {result && (
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-xl grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
                    <div className="flex flex-col justify-between border-b md:border-b-0 md:border-r border-gray-800 pb-4 md:pb-0 md:pr-6">
                        <div>
                            <span className="text-xs font-semibold text-blue-400 tracking-wider uppercase">
                                {result.brand}
                            </span>
                            <h3 className="text-2xl font-bold text-gray-100 mt-1">{result.model}</h3>
                        </div>

                        <div className="mt-4 flex flex-col gap-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400">Χιλιόμετρα Χρήστη:</span>
                                <span className="font-semibold text-gray-200">
                                    {result.userMileage.toLocaleString("el-GR")} km
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400">Μέσος Όρος Αγοράς (km):</span>
                                <span className="font-semibold text-gray-200">
                                    {result.marketAvgMileage.toLocaleString("el-GR")} km
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400">Μέση Τιμή Αγοράς:</span>
                                <span className="font-semibold text-gray-200">
                                    {result.marketAvgPrice.toLocaleString("el-GR")} €
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Highlighted Fair Market Price */}
                    <div className="flex flex-col items-center justify-center bg-gray-950 border border-gray-800 rounded-xl p-6 text-center">
                        <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                            ΔΙΚΑΙΗ ΤΙΜΗ ΑΓΟΡΑΣ (Fair Market Price)
                        </span>
                        <div className="text-4xl font-extrabold text-green-400 mt-2">
                            {result.fairMarketPrice.toLocaleString("el-GR")} €
                        </div>
                        <p className="text-xs text-gray-500 mt-3">
                            * Η τιμή διαμορφώνεται αυτόματα βάσει της απόκλισης των χιλιομέτρων σας από τον μέσο όρο της αγοράς.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};