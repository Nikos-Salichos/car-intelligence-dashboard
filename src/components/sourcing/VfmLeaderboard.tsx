import React, { useState, useMemo } from "react";
import { VfmLeaderboardDto } from "../../types";

interface Props {
  data: VfmLeaderboardDto[];
  initialMinScore: number;
  onExecute: (score: number) => void;
  isLoading?: boolean;
}

export const VfmLeaderboard: React.FC<Props> = ({
  data,
  initialMinScore,
  onExecute,
  isLoading = false,
}) => {
  const [inputValue, setInputValue] = useState<string>(initialMinScore.toString());
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(15);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const score = Number(inputValue);
    if (!isNaN(score)) {
      setCurrentPage(1);
      onExecute(score);
    } else {
      alert("Please enter a valid numeric VFM score.");
    }
  };

  // Client-side quick filter for fast response
  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return data;
    const term = searchTerm.toLowerCase();
    return data.filter(
      (item) =>
        item.brand.toLowerCase().includes(term) ||
        item.model.toLowerCase().includes(term) ||
        item.addressSeller.toLowerCase().includes(term) ||
        item.fuelType.toLowerCase().includes(term)
    );
  }, [data, searchTerm]);

  // Client-side pagination logic
  const totalPages = Math.ceil(filteredData.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage, pageSize]);

  return (
    <div className="relative bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] rounded-xl z-20 flex items-center justify-center font-semibold text-blue-600">
          Updating records...
        </div>
      )}

      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Sourcing Tool (VFM Leaderboard)</h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Total deals found: <span className="font-semibold text-gray-700">{filteredData.length}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          {/* Quick Search */}
          <input
            type="text"
            placeholder="Search Brand, Model, Location..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1 lg:w-60"
          />

          {/* Min VFM Form */}
          <form onSubmit={handleSubmit} className="flex items-center gap-2 text-sm">
            <label htmlFor="minScore" className="text-gray-600 font-medium whitespace-nowrap">
              Min VFM:
            </label>
            <input
              id="minScore"
              type="number"
              step="0.1"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isLoading}
              className="w-20 px-3 py-1.5 rounded-lg border border-gray-300 text-center font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-1.5 rounded-lg transition-colors disabled:bg-gray-300"
            >
              Filter
            </button>
          </form>
        </div>
      </div>

      {/* Data Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-100">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200 text-gray-500 text-xs uppercase tracking-wider bg-gray-50">
              <th className="py-3 px-4">Asset / Model</th>
              <th className="py-3 px-4">Price</th>
              <th className="py-3 px-4">Mileage</th>
              <th className="py-3 px-4">Fuel & Engine</th>
              <th className="py-3 px-4">Seller Address</th>
              <th className="py-3 px-4">VFM Score</th>
              <th className="py-3 px-4 text-right">Listing</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {paginatedData.length > 0 ? (
              paginatedData.map((item) => (
                <tr key={item.listingUrl} className="hover:bg-blue-50/30 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-gray-900">
                    {item.brand} {item.model}
                    {item.carYear && <span className="ml-1 text-xs font-normal text-gray-500">({item.carYear})</span>}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-gray-800">
                    €{item.price?.toLocaleString()}
                    {item.priceDiscountOrIncreasePct < 0 && (
                      <span className="ml-2 text-xs font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                        {item.priceDiscountOrIncreasePct}%
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-gray-600">
                    {item.mileage?.toLocaleString()} km
                  </td>
                  <td className="py-3.5 px-4 text-gray-500 text-xs">
                    {item.fuelType} {item.engineCc ? `(${item.engineCc} cc)` : ""}
                  </td>
                  <td className="py-3.5 px-4 text-xs text-gray-600 max-w-[220px] truncate" title={item.addressSeller}>
                    {item.addressSeller}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                      {item.vfmScore}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <a
                      href={item.listingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      View Deal ↗
                    </a>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="py-8 text-center text-gray-400">
                  No listings found matching criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4 pt-4 border-t border-gray-100 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <span>Rows per page:</span>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="border border-gray-300 rounded px-2 py-1 focus:outline-none"
          >
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>

        <div className="flex items-center gap-3">
          <span>
            Page <strong className="text-gray-800">{currentPage}</strong> of <strong>{totalPages}</strong>
          </span>
          <div className="flex gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Prev
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};