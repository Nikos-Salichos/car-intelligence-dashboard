import React from "react";
import { useGlobalDeals } from "../hooks/useGlobalDeals";

export const GlobalDealsPage: React.FC = () => {
  const { deals, loading, error, searchTerm, setSearchTerm, minVfm, setMinVfm } = useGlobalDeals();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="relative flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-indigo-100 rounded-full absolute"></div>
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="mt-4 text-slate-600 font-medium tracking-wide text-sm animate-pulse">Analyzing active marketplace inventories...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
        <div className="bg-white border border-red-100 p-8 rounded-2xl max-w-md text-center shadow-xl shadow-red-500/5">
          <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto text-red-500 text-xl font-bold mb-4">⚠️</div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Pipeline Synchronization Failed</h3>
          <p className="text-slate-500 text-sm leading-relaxed mb-4">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gradient-to-br from-slate-50 via-slate-100/50 to-slate-200/30 min-h-screen font-sans antialiased text-slate-800">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Header Panel Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-6 shadow-xl shadow-slate-900/10 text-white">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">Global Marketplace Deals</h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">Real-time aggregate value analytics and telemetry across remote listings.</p>
          </div>
          <div className="mt-4 sm:mt-0 bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/10 text-xs font-bold tracking-wide text-slate-200 self-start sm:self-center shadow-inner">
            ACTIVE INDEXED: <span className="text-amber-400 font-extrabold ml-1">{deals.length}</span>
          </div>
        </div>

        {/* Analytics Interactive Filter Controls */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="md:col-span-2">
            {/* English Comment: Associated label explicitly with the input via htmlFor for accessibility */}
            <label htmlFor="search-input" className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
              Filter Brand or Model Family
            </label>
            <div className="relative">
              <input id="search-input" type="text" className="block w-full border border-slate-200 rounded-xl pl-4 pr-10 py-3 text-sm placeholder-slate-400 font-medium focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all bg-slate-50/50 hover:bg-slate-50" placeholder="Search metrics (e.g., Citroen, Peugeot, Ford...)" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              <div className="absolute right-3.5 top-3.5 text-slate-400 pointer-events-none text-sm">🔍</div>
            </div>
          </div>
          <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-100">
            {/* English Comment: Adjusted range label configuration to match the updated 1-100 scales perfectly */}
            <div className="flex justify-between items-center mb-2.5">
              <label htmlFor="vfm-range" className="block text-xs font-bold text-slate-500 uppercase tracking-widest">
                Minimum VFM Threshold
              </label>
              <span className="text-xs font-black px-2.5 py-1 bg-indigo-600 text-white rounded-lg shadow-sm shadow-indigo-600/20">★ {minVfm}</span>
            </div>
            <input id="vfm-range" type="range" min="1" max="100" step="1" className="w-full accent-indigo-600 h-2 bg-slate-200 rounded-lg cursor-pointer appearance-none transition-all" value={minVfm} onChange={(e) => setMinVfm(Number(e.target.value))} />
          </div>
        </div>

        {/* Core Presentation Ledger Grid */}
        <div className="bg-white border border-slate-200/70 rounded-2xl shadow-md shadow-slate-200/40 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100 table-fixed">
              <thead className="bg-slate-50 text-slate-400 border-b border-slate-100">
                <tr>
                  <th scope="col" className="w-[24%] px-6 py-4 text-left text-xs font-bold uppercase tracking-widest text-slate-500">
                    Brand & Model
                  </th>
                  <th scope="col" className="w-[12%] px-6 py-4 text-left text-xs font-bold uppercase tracking-widest text-slate-500">
                    Price Point
                  </th>
                  <th scope="col" className="w-[12%] px-6 py-4 text-left text-xs font-bold uppercase tracking-widest text-slate-500">
                    Mileage
                  </th>
                  <th scope="col" className="w-[12%] px-6 py-4 text-left text-xs font-bold uppercase tracking-widest text-slate-500">
                    Fuel Mix
                  </th>
                  <th scope="col" className="w-[24%] px-6 py-4 text-left text-xs font-bold uppercase tracking-widest text-slate-500">
                    Address Seller
                  </th>
                  <th scope="col" className="w-[10%] px-6 py-4 text-center text-xs font-bold uppercase tracking-widest text-slate-500">
                    Value Efficiency
                  </th>
                  <th scope="col" className="w-[6%] px-6 py-4 text-center text-xs font-bold uppercase tracking-widest text-slate-500">
                    View
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {deals.map((deal, idx) => {
                  // English Comment: Calculate dynamic styling flags using high-contrast borders and matching text color indicators
                  let badgeStyles = "bg-indigo-50/60 text-indigo-700 border-indigo-100/70";
                  if (deal.vfmScore >= 85) {
                    badgeStyles = "bg-emerald-50 text-emerald-700 border-emerald-200/60";
                  } else if (deal.vfmScore >= 75) {
                    badgeStyles = "bg-amber-50 text-amber-700 border-amber-200/60";
                  }

                  return (
                    /* English Comment: Swapped index key with a stable identity fallback to ensure secure DOM reconciliation updates */
                    <tr key={deal.id || `${deal.brand}-${deal.model}-${idx}`} className="hover:bg-slate-50/70 transition-all duration-150 group">
                      <td className="px-6 py-4.5 whitespace-nowrap">
                        <div className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors tracking-tight text-sm sm:text-base">
                          {deal.brand} <span className="font-medium text-slate-500">{deal.model}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4.5 whitespace-nowrap text-sm font-bold text-slate-900">{(deal.price ?? 0).toLocaleString()} €</td>
                      <td className="px-6 py-4.5 whitespace-nowrap text-xs sm:text-sm font-semibold text-slate-600">
                        {(deal.mileage ?? 0).toLocaleString()} <span className="text-slate-400 font-normal">km</span>
                      </td>
                      <td className="px-6 py-4.5 whitespace-nowrap">
                        <span className="inline-flex items-center text-[11px] font-bold tracking-wide uppercase text-slate-600 px-2.5 py-1 rounded-md bg-slate-100/80 border border-slate-200/40">{deal.fuelType}</span>
                      </td>
                      {/* English Comment: Kept entire address for Addressseller cleanly without breaking structure boundaries */}
                      <td className="px-6 py-4.5">
                        <div className="text-xs text-slate-500 font-medium truncate max-w-xs transition-all group-hover:text-slate-700" title={deal.addressSeller}>
                          {deal.addressSeller}
                        </div>
                      </td>
                      <td className="px-6 py-4.5 whitespace-nowrap text-center">
                        <span className={`inline-flex items-center justify-center px-3 py-1 rounded-lg text-xs font-extrabold border ${badgeStyles} shadow-sm min-w-[48px]`}>{deal.vfmScore}</span>
                      </td>
                      <td className="px-6 py-4.5 whitespace-nowrap text-center text-sm">
                        <a href={deal.listingUrl} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 text-slate-600 hover:bg-indigo-600 hover:text-white transition-all shadow-sm group-hover:scale-105" title="View External Source Listing">
                          ↗
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {deals.length === 0 && (
            <div className="py-16 text-center bg-slate-50/30">
              <div className="w-16 h-16 bg-slate-100 border border-slate-200 rounded-2xl flex items-center justify-center mx-auto text-slate-400 text-2xl mb-4 shadow-inner">🔍</div>
              <h4 className="text-base font-bold text-slate-800 tracking-tight">No metrics match current configuration</h4>
              <p className="text-slate-400 text-xs mt-1 max-w-sm mx-auto leading-relaxed">Try adapting your brand query criteria filters or expand your minimum value telemetry requirements slider.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
