import React, { useMemo, useCallback, useState } from "react";
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
  // English Comment: Reference to store Grid API instance for programmatically clearing filters
  const [gridApi, setGridApi] = useState<GridApi<VfmLeaderboardDto> | null>(null);

  // English Comment: Configure dark Quartz theme via modern v33+ Theming API
  const myTheme = useMemo(() => {
    return themeQuartz.withPart(colorSchemeDark);
  }, []);

  // English Comment: Save Grid API reference on grid initialization
  const onGridReady = useCallback((params: GridReadyEvent<VfmLeaderboardDto>) => {
    setGridApi(params.api);
  }, []);

  // English Comment: Handler to reset all column filters and global searches in AG Grid
  const handleClearFilters = useCallback(() => {
    if (gridApi) {
      gridApi.setFilterModel(null);
    }
  }, [gridApi]);

  // English Comment: Column definitions with full seller address preservation
  const columnDefs = useMemo<ColDef<VfmLeaderboardDto>[]>(() => [
    {
      headerName: "ASSET / MODEL",
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
      headerName: "SPECS & FUEL",
      valueGetter: (params) =>
        `${params.data?.fuelType || ""} ${params.data?.engineCc ? `(${params.data.engineCc} cc)` : ""}`,
      cellRenderer: (params: any) => (
        <div className="flex items-center h-full text-gray-200 text-xs font-medium">
          {params.data?.fuelType}{" "}
          {params.data?.engineCc && (
            <span className="text-gray-400 ml-1">({params.data.engineCc} cc)</span>
          )}
        </div>
      ),
      filter: "agTextColumnFilter",
      minWidth: 150,
      flex: 1,
    },
    {
      headerName: "SELLER ADDRESS",
      field: "addressSeller",
      // English Comment: Preserving complete seller address display
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
      headerName: "VFM SCORE",
      field: "vfmScore",
      cellRenderer: (params: any) => (
        <div className="flex items-center h-full">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-black bg-blue-900/90 text-blue-200 border border-blue-600">
            {params.value?.toFixed(2)}
          </span>
        </div>
      ),
      filter: "agNumberColumnFilter",
      sortable: true,
      sort: "desc",
      minWidth: 110,
      flex: 0.9,
    },
    {
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

      {/* Header Toolbar with Clear Filters Button */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-bold tracking-tight text-white">VFM Leaderboard</h1>
          <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-gray-900 text-gray-300 border border-gray-800">
            {data.length} listings
          </span>
        </div>

        {/* Clear Filters Action */}
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