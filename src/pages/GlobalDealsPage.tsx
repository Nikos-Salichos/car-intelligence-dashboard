// ==========================================
// File: GlobalDealsPage.tsx
// ==========================================

import React from "react";
import { useGlobalDeals } from "../hooks/useGlobalDeals";

export const GlobalDealsPage: React.FC = () => {
  const {
    deals,
    loading,
    error,
    brandFilter,
    setBrandFilter,
    modelFilter,
    setModelFilter,
    maxPrice,
    setMaxPrice,
    maxMileage,
    setMaxMileage,
    fuelFilter,
    setFuelFilter,
    minVfm,
    setMinVfm,
    page,
    setPage,
    pageSizeInput,
    setPageSizeInput,
    execute,
  } = useGlobalDeals();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="relative flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-indigo-100 rounded-full absolute"></div>
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="mt-4 text-slate-600 font-medium tracking-wide text-sm animate-pulse">
          Analyzing active marketplace inventories...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
        <div className="bg-white border border-red-100 p-8 rounded-2xl max-w-md text-center shadow-xl shadow-red-500/5">
          <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto text-red-500 text-xl font-bold mb-4">
            ⚠️
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">
            Pipeline Synchronization Failed
          </h3>
          <p className="text-slate-500 text-sm leading-relaxed mb-4">
            {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gradient-to-br from-slate-50 via-slate-100/50 to-slate-200/30 min-h-screen font-sans antialiased text-slate-800">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* HEADER */}
        <div className="flex justify-between items-center bg-slate-900 text-white p-6 rounded-2xl shadow-sm">
          <div>
            <h1 className="text-2xl font-bold">Global Marketplace Deals</h1>
            <p className="text-slate-400 text-sm">Page {page}</p>
          </div>

          {/* BACKEND CONTROLS */}
          <div className="flex items-center gap-3 bg-slate-800 p-2.5 rounded-xl border border-slate-700">
            <div className="flex flex-col">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Backend Page Size
              </label>
              <input
                type="number"
                min="1"
                max="50"
                className="w-24 mt-1 border border-slate-600 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-900 text-white font-semibold"
                value={pageSizeInput}
                onChange={(e) => setPageSizeInput(Number(e.target.value))}
              />
            </div>
            <button
              onClick={execute}
              className="h-9 px-4 mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-lg shadow-md transition transform active:scale-95"
            >
              Apply Size
            </button>
          </div>
        </div>

        {/* TABLE DISPLAY */}
        <div className="bg-white rounded-2xl border overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm table-fixed">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500 tracking-wider border-b">
                {/* Column Headers */}
                <tr>
                  <th className="p-4 text-left w-1/6">Brand</th>
                  <th className="p-4 text-left w-1/6">Model</th>
                  <th className="p-4 text-left w-1/6">Max Price</th>
                  <th className="p-4 text-left w-1/6">Max Mileage</th>
                  <th className="p-4 text-left w-1/6">Fuel</th>
                  <th className="p-4 text-center w-1/6">Min VFM ({minVfm}%)</th>
                </tr>
                {/* Inline Column Filter Inputs */}
                <tr className="bg-slate-100/60 border-b border-slate-200">
                  <td className="p-2">
                    <input
                      type="text"
                      className="w-full border rounded-lg px-2.5 py-1.5 text-xs font-normal focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-slate-800"
                      placeholder="Filter Brand..."
                      value={brandFilter}
                      onChange={(e) => setBrandFilter(e.target.value)}
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="text"
                      className="w-full border rounded-lg px-2.5 py-1.5 text-xs font-normal focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-slate-800"
                      placeholder="Filter Model..."
                      value={modelFilter}
                      onChange={(e) => setModelFilter(e.target.value)}
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="text"
                      className="w-full border rounded-lg px-2.5 py-1.5 text-xs font-normal focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-slate-800"
                      placeholder="Max $..."
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="text"
                      className="w-full border rounded-lg px-2.5 py-1.5 text-xs font-normal focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-slate-800"
                      placeholder="Max Mi..."
                      value={maxMileage}
                      onChange={(e) => setMaxMileage(e.target.value)}
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="text"
                      className="w-full border rounded-lg px-2.5 py-1.5 text-xs font-normal focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-slate-800"
                      placeholder="Filter Fuel..."
                      value={fuelFilter}
                      onChange={(e) => setFuelFilter(e.target.value)}
                    />
                  </td>
                  <td className="p-2 text-center">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={minVfm}
                      onChange={(e) => setMinVfm(Number(e.target.value))}
                      className="w-full accent-indigo-600 mt-1"
                    />
                  </td>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {deals.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-400">
                      No matching records found for the applied column filters.
                    </td>
                  </tr>
                ) : (
                  deals.map((deal, index) => (
                    <tr key={`${deal.id}-${index}`} className="hover:bg-indigo-50/30 transition-colors">
                      <td className="p-4 font-bold text-slate-900 truncate">{deal.brand}</td>
                      <td className="p-4 text-slate-700 truncate">{deal.model}</td>
                      <td className="p-4 font-medium truncate">{deal.price}</td>
                      <td className="p-4 text-slate-500 truncate">{deal.mileage}</td>
                      <td className="p-4 text-slate-500 truncate">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                          {deal.fuelType}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <span className={`inline-block font-bold text-sm px-2.5 py-1 rounded-lg ${deal.vfmScore >= 70 ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                          }`}>
                          {deal.vfmScore}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION PANEL */}
          <div className="flex justify-between items-center p-4 border-t bg-slate-50">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page <= 1}
              className="px-4 py-2 bg-white border rounded-xl text-xs font-semibold text-slate-600 shadow-sm hover:bg-slate-50 disabled:opacity-50 transition"
            >
              Prev
            </button>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wide">
              Page {page}
            </div>
            <button
              onClick={() => setPage(page + 1)}
              className="px-4 py-2 bg-white border rounded-xl text-xs font-semibold text-slate-600 shadow-sm hover:bg-slate-50 transition"
            >
              Next
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};