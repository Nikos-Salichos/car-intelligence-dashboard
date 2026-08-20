import React, { useMemo, useCallback, useState, useRef, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import {
  ColDef,
  ModuleRegistry,
  AllCommunityModule,
  ValidationModule,
  themeQuartz,
  colorSchemeDark,
  GridApi,
  GridReadyEvent
} from "ag-grid-community";
import { VfmLeaderboardDto } from "../../types";

// English Comment: Register AG Grid Community modules and validation
ModuleRegistry.registerModules([
  AllCommunityModule,
  ValidationModule
]);

interface Props {
  data: VfmLeaderboardDto[];
  initialMinScore?: number;
  onExecute?: (score: number) => void;
  isLoading?: boolean;
}

export const VfmLeaderboard: React.FC<Props> = ({
  data,
  isLoading = false,
}) => {
  const [gridApi, setGridApi] = useState<GridApi<VfmLeaderboardDto> | null>(null);
  const [isColumnMenuOpen, setIsColumnMenuOpen] = useState<boolean>(false);
  const [columnsState, setColumnsState] = useState<{ id: string; headerName: string; hide: boolean }[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // English Comment: Configure dark Quartz theme via modern v33+ Theming API
  const myTheme = useMemo(() => {
    return themeQuartz.withPart(colorSchemeDark);
  }, []);

  // English Comment: Close column dropdown menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsColumnMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // English Comment: Update column visibility state for the UI menu
  const syncColumnState = useCallback((api: GridApi<VfmLeaderboardDto>) => {
    const colDefs = api.getColumnDefs() || [];
    const colState = api.getColumnState();

    const mappedCols = colState.map((col) => {
      const colDef = colDefs.find((c) => (c as ColDef).field === col.colId || (c as ColDef).colId === col.colId) as ColDef;
      return {
        id: col.colId,
        headerName: (colDef?.headerName as string) || col.colId,
        hide: !!col.hide,
      };
    });

    setColumnsState(mappedCols);
  }, []);

  // English Comment: Save Grid API reference on grid initialization and initial column sync
  const onGridReady = useCallback((params: GridReadyEvent<VfmLeaderboardDto>) => {
    setGridApi(params.api);
    syncColumnState(params.api);
  }, [syncColumnState]);

  // English Comment: Handler to reset all column filters
  const handleClearFilters = useCallback(() => {
    if (gridApi) {
      gridApi.setFilterModel(null);
    }
  }, [gridApi]);

  // English Comment: Fix for AG Grid v36+ using setColumnsVisible with array input
  const toggleColumnVisibility = useCallback((colId: string, currentHide: boolean) => {
    if (gridApi) {
      gridApi.setColumnsVisible([colId], currentHide);
      syncColumnState(gridApi);
    }
  }, [gridApi, syncColumnState]);

  // English Comment: Reset column visibility to initial setup (default visible vs hidden columns)
  const handleResetColumnVisibility = useCallback(() => {
    if (gridApi) {
      gridApi.resetColumnState();
      syncColumnState(gridApi);
    }
  }, [gridApi, syncColumnState]);

  // English Comment: Complete column definitions mapping all VfmLeaderboardDto properties
  const columnDefs = useMemo<ColDef<VfmLeaderboardDto>[]>(() => [
    // --- VISIBLE BY DEFAULT ---
    {
      colId: "assetModel",
      headerName: "BRAND MODEL",
      valueGetter: (params) => `${params.data?.brand || ""} ${params.data?.model || ""}`,
      cellRenderer: (params: any) => (
        <div className="flex items-center gap-2 h-full">
          <span className="font-bold text-white tracking-wide">
            {params.data?.brand} {params.data?.model}
          </span>
          {params.data?.carYear && (
            <span className="text-[11px] font-bold px-1.5 py-0.5 rounded bg-gray-800 text-gray-200 border border-gray-700">
              {params.data.carYear}
            </span>
          )}
        </div>
      ),
      filter: "agTextColumnFilter",
      sortable: true,
      minWidth: 220,
      flex: 1.5,
    },
    {
      colId: "price",
      headerName: "CURRENT PRICE",
      field: "price",
      cellRenderer: (params: any) => {
        const discount = params.data?.priceDiscountOrIncreasePct;
        return (
          <div className="flex items-center gap-2 h-full">
            <span className="text-emerald-400 font-extrabold text-sm">
              €{params.data?.price?.toLocaleString()}
            </span>
            {discount !== undefined && discount !== null && discount < 0 && (
              <span className="text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-700 px-1.5 py-0.5 rounded">
                {discount}%
              </span>
            )}
          </div>
        );
      },
      filter: "agNumberColumnFilter",
      sortable: true,
      minWidth: 140,
      flex: 1,
    },
    {
      colId: "originalPriceEuros",
      headerName: "ORIGINAL MSRP",
      field: "originalPriceEuros",
      cellRenderer: (params: any) => (
        <div className="flex items-center h-full">
          {params.value ? (
            <span className="line-through text-gray-400 font-medium text-xs">
              €{params.value.toLocaleString()}
            </span>
          ) : (
            <span className="text-gray-600">—</span>
          )}
        </div>
      ),
      filter: "agNumberColumnFilter",
      sortable: true,
      minWidth: 130,
      flex: 1,
    },
    {
      colId: "mileage",
      headerName: "MILEAGE",
      field: "mileage",
      cellRenderer: (params: any) => (
        <div className="flex items-center h-full text-gray-200 font-semibold text-xs">
          {params.value ? `${params.value.toLocaleString()} km` : "—"}
        </div>
      ),
      filter: "agNumberColumnFilter",
      sortable: true,
      minWidth: 120,
      flex: 1,
    },
    {
      colId: "specsFuel",
      headerName: "SPECS & FUEL",
      valueGetter: (params) => {
        if (!params.data) return "";
        const isElectric = params.data.fuelType?.toLowerCase().includes("electric") ||
          params.data.fuelType?.toLowerCase().includes("ev");
        const unit = isElectric ? "kW" : "cc";
        const powerOrCapacity = params.data.engineCc ? `(${params.data.engineCc} ${unit})` : "";
        return `${params.data.fuelType || ""} ${powerOrCapacity}`.trim();
      },
      cellRenderer: (params: any) => {
        if (!params.data) return <span className="text-gray-600">—</span>;

        // English Comment: Dynamically display kW for electric vehicles and cc for internal combustion engines
        const isElectric = params.data.fuelType?.toLowerCase().includes("electric") ||
          params.data.fuelType?.toLowerCase().includes("ev");
        const unit = isElectric ? "kW" : "cc";

        return (
          <div className="flex items-center h-full text-gray-200 text-xs font-medium">
            <span>{params.data.fuelType || "—"}</span>
            {params.data.engineCc && (
              <span className="text-gray-400 ml-1">
                ({params.data.engineCc} {unit})
              </span>
            )}
          </div>
        );
      },
      filter: "agTextColumnFilter",
      minWidth: 150,
      flex: 1,
    },
    {
      colId: "addressSeller",
      headerName: "SELLER ADDRESS",
      field: "addressSeller",
      // English Comment: Keeping full seller address explicit with strong white/light typography
      cellRenderer: (params: any) => (
        <div className="flex items-center h-full">
          <span className="text-gray-200 text-xs font-normal whitespace-normal leading-normal" title={params.value}>
            {params.value || "—"}
          </span>
        </div>
      ),
      filter: "agTextColumnFilter",
      minWidth: 280,
      flex: 2,
    },
    {
      colId: "vfmScore",
      headerName: "VFM SCORE",
      field: "vfmScore",
      cellRenderer: (params: any) => (
        <div className="flex items-center h-full">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-black bg-blue-900/90 text-blue-200 border border-blue-600">
            {params.value}
          </span>
        </div>
      ),
      filter: "agNumberColumnFilter",
      sortable: true,
      sort: "desc",
      minWidth: 110,
      flex: 0.9,
    },

    // --- HIDDEN BY DEFAULT (AVAILABLE IN COLUMNS MENU) ---
    {
      colId: "sellerType",
      headerName: "SELLER TYPE",
      field: "sellerType",
      hide: true,
      filter: "agTextColumnFilter",
      sortable: true,
      minWidth: 130,
    },
    {
      colId: "avgCategoryPrice",
      headerName: "AVG CAT. PRICE",
      field: "avgCategoryPrice",
      hide: true,
      cellRenderer: (params: any) => (
        <span className="text-xs text-gray-300 font-medium">
          {params.value ? `€${params.value.toLocaleString()}` : "—"}
        </span>
      ),
      filter: "agNumberColumnFilter",
      sortable: true,
      minWidth: 140,
    },
    {
      colId: "avgCategoryMileage",
      headerName: "AVG CAT. MILEAGE",
      field: "avgCategoryMileage",
      hide: true,
      cellRenderer: (params: any) => (
        <span className="text-xs text-gray-300 font-medium">
          {params.value ? `${params.value.toLocaleString()} km` : "—"}
        </span>
      ),
      filter: "agNumberColumnFilter",
      sortable: true,
      minWidth: 150,
    },
    {
      colId: "createdAt",
      headerName: "CREATED AT",
      field: "createdAt",
      hide: true,
      cellRenderer: (params: any) => (
        <span className="text-xs text-gray-400">
          {params.value ? new Date(params.value).toLocaleDateString() : "—"}
        </span>
      ),
      filter: "agDateColumnFilter",
      sortable: true,
      minWidth: 130,
    },

    // --- ACTION BUTTON (ALWAYS VISIBLE) ---
    {
      colId: "action",
      headerName: "ACTION",
      field: "listingUrl",
      cellRenderer: (params: any) => (
        <div className="flex items-center h-full">
          <a
            href={params.value}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 bg-blue-600 hover:bg-blue-500 text-white font-bold px-3 py-1 rounded text-xs transition-all shadow-sm"
          >
            Deal ↗
          </a>
        </div>
      ),
      sortable: false,
      filter: false,
      minWidth: 100,
      flex: 0.8,
    },
  ], []);

  const defaultColDef = useMemo<ColDef>(() => ({
    resizable: true,
    floatingFilter: true,
  }), []);

  return (
    <div className="w-full h-full bg-gray-950 text-gray-100 font-sans flex flex-col flex-1">
      {isLoading && (
        <div className="absolute inset-0 bg-gray-950/85 backdrop-blur-md z-30 flex items-center justify-center font-bold text-blue-400 text-sm">
          <span className="animate-pulse">Loading market data...</span>
        </div>
      )}

      {/* Header Toolbar */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-bold tracking-tight text-white">VFM Leaderboard</h1>
          <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-gray-900 text-gray-300 border border-gray-800">
            {data.length} listings
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Columns Visibility Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsColumnMenuOpen(!isColumnMenuOpen)}
              className="inline-flex items-center gap-1.5 bg-gray-900 hover:bg-gray-800 text-gray-300 hover:text-white font-semibold text-xs px-3 py-1.5 rounded border border-gray-800 hover:border-gray-700 transition-all shadow-sm"
            >
              <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Columns
            </button>

            {isColumnMenuOpen && (
              <div className="absolute right-0 mt-2 w-60 bg-gray-900 border border-gray-800 rounded-lg shadow-xl z-50 p-2">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-gray-800 px-1">
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Visible Columns</span>
                  <button
                    onClick={handleResetColumnVisibility}
                    className="text-[11px] text-blue-400 hover:text-blue-300 font-semibold"
                  >
                    Reset Default
                  </button>
                </div>
                <div className="flex flex-col gap-1 max-h-64 overflow-y-auto pr-1">
                  {columnsState.map((col) => (
                    <label
                      key={col.id}
                      className="flex items-center justify-between px-2 py-1 rounded hover:bg-gray-800 cursor-pointer text-xs text-gray-200 transition-colors"
                    >
                      <span>{col.headerName}</span>
                      <input
                        type="checkbox"
                        checked={!col.hide}
                        onChange={() => toggleColumnVisibility(col.id, col.hide)}
                        className="rounded bg-gray-950 border-gray-700 text-blue-600 focus:ring-0 cursor-pointer"
                      />
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Clear Filters Button */}
          <button
            onClick={handleClearFilters}
            className="inline-flex items-center gap-1.5 bg-gray-900 hover:bg-gray-800 text-gray-300 hover:text-white font-semibold text-xs px-3 py-1.5 rounded border border-gray-800 hover:border-gray-700 transition-all shadow-sm"
            title="Reset all column filters"
          >
            <svg
              className="w-3.5 h-3.5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            Clear Filters
          </button>
        </div>
      </div>

      {/* AG Grid Component */}
      <div className="w-full h-[calc(100vh-170px)] rounded-lg border border-gray-800 bg-gray-950 overflow-hidden shadow-2xl">
        <AgGridReact
          theme={myTheme}
          rowData={data}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          onGridReady={onGridReady}
          pagination={true}
          paginationPageSize={25}
          paginationPageSizeSelector={[25, 50, 100]}
          animateRows={true}
          rowHeight={48}
        />
      </div>
    </div>
  );
};