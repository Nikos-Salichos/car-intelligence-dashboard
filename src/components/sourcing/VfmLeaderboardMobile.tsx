import { Link } from "react-router-dom";
import { fuelLabel } from "../../utils/labels";
import { ScoreBadge } from "./ScoreBadge";
import React, { useMemo, useState } from "react";
import { VfmLeaderboardDto } from "../../types";

interface Props {
    data: VfmLeaderboardDto[];
}

type MobileSortBy = "vfmScore" | "price" | "mileage";

export const VfmLeaderboardMobile: React.FC<Props> = ({ data }) => {
    const [mobileSearch, setMobileSearch] = useState<string>("");
    const [mobileSortBy, setMobileSortBy] =
        useState<MobileSortBy>("vfmScore");

    // English Comment: Filter and sort data for the mobile card view
    const processedMobileData = useMemo(() => {
        let result = [...data];

        // Search filter
        if (mobileSearch.trim()) {
            const query = mobileSearch.toLowerCase();

            result = result.filter(
                (item) =>
                    item.brand?.toLowerCase().includes(query) ||
                    item.model?.toLowerCase().includes(query) ||
                    item.addressSeller?.toLowerCase().includes(query) ||
                    fuelLabel(item.fuelType).toLowerCase().includes(query) ||
                    item.fuelType?.toLowerCase().includes(query)
            );
        }

        // Sorting
        result.sort((a, b) => {
            if (mobileSortBy === "vfmScore") {
                return (b.vfmScore || 0) - (a.vfmScore || 0);
            }

            if (mobileSortBy === "price") {
                return (a.price || 0) - (b.price || 0);
            }

            if (mobileSortBy === "mileage") {
                return (a.mileage || 0) - (b.mileage || 0);
            }

            return 0;
        });

        return result;
    }, [data, mobileSearch, mobileSortBy]);

    return (
        <div className="w-full h-full flex flex-col flex-1">
            {/* Mobile Header */}
            <div className="flex flex-col gap-3 mb-3">
                <div className="flex items-center justify-between gap-3">
                    <h1 className="text-base font-bold tracking-tight text-white">
                        Κατάταξη Ευκαιριών
                    </h1>

                    <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-gray-900 text-gray-300 border border-gray-800">
                        {data.length} listings
                    </span>
                </div>

                {/* Mobile Search & Sort Controls */}
                <div className="flex items-center gap-2 w-full">
                    <input
                        type="text"
                        placeholder="Αναζήτηση μοντέλου, καυσίμου, περιοχής..."
                        value={mobileSearch}
                        onChange={(event) =>
                            setMobileSearch(event.target.value)
                        }
                        className="flex-1 min-w-0 bg-gray-900 border border-gray-800 text-xs rounded px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                    />

                    <select
                        value={mobileSortBy}
                        onChange={(event) =>
                            setMobileSortBy(
                                event.target.value as MobileSortBy
                            )
                        }
                        className="bg-gray-900 border border-gray-800 text-xs rounded px-2 py-2 text-gray-300 focus:outline-none focus:border-blue-500"
                    >
                        <option value="vfmScore">
                            Ταξινόμηση: Έκπτωση vs αγορά
                        </option>
                        <option value="price">
                            Ταξινόμηση: Τιμή
                        </option>
                        <option value="mileage">
                            Ταξινόμηση: Χιλιόμετρα
                        </option>
                    </select>
                </div>
            </div>

            {/* Mobile Card List */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                {processedMobileData.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 text-xs">
                        Δεν βρέθηκαν αγγελίες.
                    </div>
                ) : (
                    processedMobileData.map((item, idx) => {
                        const isElectric =
                            item.fuelType
                                ?.toLowerCase()
                                .includes("electric") ||
                            item.fuelType
                                ?.toLowerCase()
                                .includes("ev");

                        const unit = isElectric ? "kW" : "cc";

                        return (
                            <div
                                // English Comment: Use listingUrl or index fallback as stable key
                                key={item.listingUrl || idx}
                                className="bg-gray-900 border border-gray-800 rounded-lg p-3.5 shadow-md flex flex-col gap-2.5"
                            >
                                {/* Top Row: Title & VFM Score */}
                                <div className="flex items-start justify-between gap-2">
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-1.5 flex-wrap">
                                            <span className="font-bold text-white text-sm tracking-wide">
                                                {item.brand} {item.model}
                                            </span>

                                            {item.carYear && (
                                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-gray-800 text-gray-300 border border-gray-700">
                                                    {item.carYear}
                                                </span>
                                            )}
                                        </div>

                                        <div className="text-[11px] text-gray-400 mt-0.5">
                                            {fuelLabel(item.fuelType)}{" "}
                                            {item.engineCc
                                                ? `(${item.engineCc} ${unit})`
                                                : ""}
                                        </div>
                                    </div>

                                    <span className="shrink-0">
                                        <ScoreBadge item={item} />
                                    </span>
                                </div>

                                {/* Price & Mileage Info */}
                                <div className="grid grid-cols-2 gap-2 py-2 border-y border-gray-800/80 my-0.5 bg-gray-950/40 rounded px-2.5">
                                    <div>
                                        <div className="text-[10px] text-gray-500 uppercase tracking-wider">
                                            Τιμή
                                        </div>

                                        <div className="flex items-center gap-1.5 mt-0.5">
                                            <span className="text-emerald-400 font-extrabold text-sm">
                                                €{item.price?.toLocaleString()}
                                            </span>

                                        </div>

                                        <div className="text-[10px] text-gray-400">
                                            Αναμενόμενη: €{item.expectedPrice?.toLocaleString("el-GR")}
                                            {item.savingsEuros > 0 && !item.isSuspect && (
                                                <span className="text-emerald-400"> (−€{item.savingsEuros.toLocaleString("el-GR")})</span>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <div className="text-[10px] text-gray-500 uppercase tracking-wider">
                                            Χιλιόμετρα
                                        </div>

                                        <div className="text-xs font-semibold text-gray-200 mt-0.5">
                                            {item.mileage
                                                ? `${item.mileage.toLocaleString()} km`
                                                : "—"}
                                        </div>
                                    </div>
                                </div>

                                {/* Address & Action */}
                                <div className="flex items-center justify-between gap-2 pt-0.5">
                                    <span
                                        className="text-[11px] text-gray-300 leading-tight truncate max-w-[40%]"
                                        title={item.addressSeller}
                                    >
                                        📍 {item.addressSeller || "Χωρίς διεύθυνση"}
                                    </span>

                                    <Link
                                        to={`/brief/${item.listingId}`}
                                        className="inline-flex items-center justify-center bg-gray-800 text-gray-100 font-bold px-3 py-1.5 rounded text-xs border border-gray-700 shrink-0"
                                    >
                                        Φάκελος
                                    </Link>

                                    <a
                                        href={item.listingUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center justify-center gap-1 bg-blue-600 active:bg-blue-700 text-white font-bold px-3 py-1.5 rounded text-xs transition-all shadow-sm shrink-0"
                                    >
                                        Άνοιγμα ↗
                                    </a>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};