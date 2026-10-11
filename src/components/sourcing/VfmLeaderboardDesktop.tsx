import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef, ICellRendererParams, ModuleRegistry, AllCommunityModule, ValidationModule, themeQuartz, colorSchemeDark, GridApi, GridReadyEvent } from "ag-grid-community";
import { VfmLeaderboardDto } from "../../types";

// Register AG Grid Community modules once at module root scope
ModuleRegistry.registerModules([AllCommunityModule, ValidationModule]);

// Define theme outside the component scope to avoid recreation
const myTheme = themeQuartz.withPart(colorSchemeDark);

// Greek texts for the AG Grid built-in menus, filters and pagination
const localeText = {
  page: "Σελίδα",
  to: "έως",
  of: "από",
  first: "Πρώτη",
  previous: "Προηγούμενη",
  next: "Επόμενη",
  last: "Τελευταία",
  pageSizeSelectorLabel: "Αγγελίες ανά σελίδα:",
  noRowsToShow: "Δεν βρέθηκαν αγγελίες",
  filterOoo: "Φίλτρο...",
  contains: "Περιέχει",
  notContains: "Δεν περιέχει",
  equals: "Ίσο με",
  notEqual: "Διάφορο του",
  greaterThan: "Μεγαλύτερο από",
  greaterThanOrEqual: "Μεγαλύτερο ή ίσο",
  lessThan: "Μικρότερο από",
  lessThanOrEqual: "Μικρότερο ή ίσο",
  inRange: "Μεταξύ",
  blank: "Κενό",
  notBlank: "Μη κενό",
  andCondition: "ΚΑΙ",
  orCondition: "Ή",
  applyFilter: "Εφαρμογή",
  resetFilter: "Επαναφορά",
  clearFilter: "Καθαρισμός",
  startsWith: "Ξεκινά με",
  endsWith: "Τελειώνει με",
};

type CellParams = ICellRendererParams<VfmLeaderboardDto>;

interface Props {
  readonly data: VfmLeaderboardDto[];
}

export const VfmLeaderboardDesktop: React.FC<Props> = ({ data }) => {
  const [gridApi, setGridApi] = useState<GridApi<VfmLeaderboardDto> | null>(null);
  const [isColumnMenuOpen, setIsColumnMenuOpen] = useState<boolean>(false);
  const [columnsState, setColumnsState] = useState<
    {
      id: string;
      headerName: string;
      hide: boolean;
    }[]
  >([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close column dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsColumnMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Synchronize AG Grid column visibility state
  const syncColumnState = useCallback((api: GridApi<VfmLeaderboardDto>) => {
    const colDefs = api.getColumnDefs() || [];
    const colState = api.getColumnState();
    const mappedCols = colState.map((col) => {
      const colDef = colDefs.find((definition) => (definition as ColDef).field === col.colId || (definition as ColDef).colId === col.colId) as ColDef | undefined;
      return {
        id: col.colId,
        headerName: (colDef?.headerName as string) || col.colId,
        hide: !!col.hide,
      };
    });
    setColumnsState(mappedCols);
  }, []);

  // Save Grid API reference on initialization
  const onGridReady = useCallback(
    (params: GridReadyEvent<VfmLeaderboardDto>) => {
      setGridApi(params.api);
      syncColumnState(params.api);
    },
    [syncColumnState],
  );

  // Clear all AG Grid filters
  const handleClearFilters = useCallback(() => {
    if (gridApi) {
      gridApi.setFilterModel(null);
    }
  }, [gridApi]);

  // Toggle individual column visibility
  const toggleColumnVisibility = useCallback(
    (colId: string, currentHide: boolean) => {
      if (!gridApi) return;
      gridApi.setColumnsVisible([colId], currentHide);
      syncColumnState(gridApi);
    },
    [gridApi, syncColumnState],
  );

  // Reset column visibility to initial state
  const handleResetColumnVisibility = useCallback(() => {
    if (!gridApi) return;
    gridApi.resetColumnState();
    syncColumnState(gridApi);
  }, [gridApi, syncColumnState]);

  // Desktop AG Grid column definitions
  const columnDefs = useMemo<ColDef<VfmLeaderboardDto>[]>(
    () => [
      {
        colId: "assetModel",
        headerName: "Μάρκα",
        valueGetter: (params) => `${params.data?.brand || ""} ${params.data?.model || ""}`,
        cellRenderer: (params: CellParams) => (
          <div className="flex items-center gap-2 h-full">
            <span className="font-bold text-white tracking-wide">
              {params.data?.brand} {params.data?.model}
            </span>
          </div>
        ),
        filter: "agTextColumnFilter",
        sortable: true,
        minWidth: 180,
        flex: 1.5,
      },
      {
        colId: "price",
        headerName: "Τρέχουσα τιμή",
        field: "price",
        cellRenderer: (params: CellParams) => {
          const discount = params.data?.priceDiscountOrIncreasePct;
          return (
            <div className="flex items-center gap-2 h-full">
              <span className="text-emerald-400 font-extrabold text-sm">€{params.data?.price?.toLocaleString("el-GR")}</span>
              {discount !== undefined && discount !== null && discount < 0 && <span className="text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-700 px-1.5 py-0.5 rounded">{discount}%</span>}
            </div>
          );
        },
        filter: "agNumberColumnFilter",
        sortable: true,
        minWidth: 130,
        flex: 1,
      },
      {
        colId: "originalPriceEuros",
        headerName: "Αρχική τιμή λιανικής",
        field: "originalPriceEuros",
        cellRenderer: (params: CellParams) => <div className="flex items-center h-full">{params.value ? <span className="line-through text-gray-400 font-medium text-xs">€{params.value.toLocaleString("el-GR")}</span> : <span className="text-gray-600">—</span>}</div>,
        filter: "agNumberColumnFilter",
        sortable: true,
        minWidth: 150,
        flex: 1,
      },
      {
        colId: "mileage",
        headerName: "Χιλιόμετρα",
        field: "mileage",
        cellRenderer: (params: CellParams) => <div className="flex items-center h-full text-gray-200 font-semibold text-xs">{params.value ? `${params.value.toLocaleString("el-GR")} km` : "—"}</div>,
        filter: "agNumberColumnFilter",
        sortable: true,
        minWidth: 110,
        flex: 1,
      },
      {
        colId: "specsFuel",
        headerName: "Καύσιμο",
        valueGetter: (params) => {
          if (!params.data) return "";
          const isElectric = params.data.fuelType?.toLowerCase().includes("electric") || params.data.fuelType?.toLowerCase().includes("ev");
          const unit = isElectric ? "kW" : "cc";
          const powerOrCapacity = params.data.engineCc ? `(${params.data.engineCc} ${unit})` : "";
          return `${params.data.fuelType || ""} ${powerOrCapacity}`.trim();
        },
        cellRenderer: (params: CellParams) => {
          if (!params.data) {
            return <span className="text-gray-600">—</span>;
          }
          const isElectric = params.data.fuelType?.toLowerCase().includes("electric") || params.data.fuelType?.toLowerCase().includes("ev");
          const unit = isElectric ? "kW" : "cc";
          return (
            <div className="flex items-center h-full text-gray-200 text-xs font-medium">
              <span>{params.data.fuelType || "—"}</span>
              {Boolean(params.data.engineCc) && (
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
        colId: "sellerType",
        headerName: "Τύπος πωλητή",
        field: "sellerType",
        cellRenderer: (params: CellParams) => <div className="flex items-center h-full text-gray-200 text-xs font-medium">{params.value || "—"}</div>,
        filter: "agTextColumnFilter",
        sortable: true,
        minWidth: 130,
        flex: 1,
      },
      {
        colId: "addressSeller",
        headerName: "Περιοχή",
        field: "addressSeller",
        cellRenderer: (params: CellParams) => (
          <div className="flex items-center h-full">
            <span className="text-gray-200 text-xs font-normal whitespace-normal leading-normal" title={params.value}>
              {params.value || "—"}
            </span>
          </div>
        ),
        filter: "agTextColumnFilter",
        minWidth: 220,
        flex: 2,
      },
      {
        colId: "vfmScore",
        headerName: "Βαθμός κατάταξης",
        field: "vfmScore",
        cellRenderer: (params: CellParams) => (
          <div className="flex items-center h-full">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-black bg-blue-900/90 text-blue-200 border border-blue-600">{params.value}</span>
          </div>
        ),
        filter: "agNumberColumnFilter",
        sortable: true,
        sort: "desc",
        minWidth: 150,
        flex: 1,
      },
      {
        colId: "avgCategoryPrice",
        headerName: "Μέση τιμή κατηγορίας",
        field: "avgCategoryPrice",
        hide: true,
        cellRenderer: (params: CellParams) => <span className="text-xs text-gray-300 font-medium">{params.value ? `€${params.value.toLocaleString("el-GR")}` : "—"}</span>,
        filter: "agNumberColumnFilter",
        sortable: true,
        minWidth: 170,
      },
      {
        colId: "avgCategoryMileage",
        headerName: "Μέσα χιλιόμετρα κατηγορίας",
        field: "avgCategoryMileage",
        hide: true,
        cellRenderer: (params: CellParams) => <span className="text-xs text-gray-300 font-medium">{params.value ? `${params.value.toLocaleString("el-GR")} km` : "—"}</span>,
        filter: "agNumberColumnFilter",
        sortable: true,
        minWidth: 200,
      },
      {
        colId: "createdAt",
        headerName: "Ημερομηνία δημοσίευσης",
        field: "createdAt",
        cellRenderer: (params: CellParams) => <span className="text-xs text-gray-300">{params.value ? new Date(params.value).toLocaleDateString("el-GR") : "—"}</span>,
        filter: "agDateColumnFilter",
        sortable: true,
        minWidth: 180,
        flex: 1,
      },
      {
        colId: "action",
        headerName: "Αγγελία",
        field: "listingUrl",
        cellRenderer: (params: CellParams) => (
          <div className="flex items-center h-full">
            <a href={params.value} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold px-3 py-1.5 rounded text-xs transition-all shadow-sm">
              Άνοιγμα ↗
            </a>
          </div>
        ),
        sortable: false,
        filter: false,
        minWidth: 110,
        flex: 0.8,
      },
    ],
    [],
  );

  const defaultColDef = useMemo<ColDef>(
    () => ({
      resizable: true,
      floatingFilter: true,
    }),
    [],
  );

  return (
    <div className="w-full h-full flex flex-col flex-1">
      {/* Desktop Toolbar */}
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className="flex items-center justify-start gap-3">
          <h1 className="text-base sm:text-lg font-bold tracking-tight text-white">Κατάταξη Ευκαιριών</h1>
          <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-gray-900 text-gray-300 border border-gray-800">{data.length} αγγελίες</span>
        </div>
        {/* Desktop AG Grid Controls */}
        <div className="flex items-center gap-2">
          <div className="relative" ref={dropdownRef}>
            <button onClick={() => setIsColumnMenuOpen((previous) => !previous)} className="inline-flex items-center justify-center gap-1.5 bg-gray-900 hover:bg-gray-800 active:bg-gray-700 text-gray-300 hover:text-white font-semibold text-xs px-3 py-1.5 rounded border border-gray-800 hover:border-gray-700 transition-all shadow-sm">
              <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Στήλες
            </button>
            {isColumnMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-gray-900 border border-gray-800 rounded-lg shadow-xl z-50 p-2">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-gray-800 px-1">
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Ορατές στήλες</span>
                  <button onClick={handleResetColumnVisibility} className="text-[11px] text-blue-400 hover:text-blue-300 font-semibold">
                    Επαναφορά
                  </button>
                </div>
                <div className="flex flex-col gap-1 max-h-64 overflow-y-auto pr-1">
                  {columnsState.map((col) => (
                    <label key={col.id} className="flex items-center justify-between px-2 py-1 rounded hover:bg-gray-800 cursor-pointer text-xs text-gray-200 transition-colors">
                      <span>{col.headerName}</span>
                      <input type="checkbox" checked={!col.hide} onChange={() => toggleColumnVisibility(col.id, col.hide)} className="w-4 h-4 rounded bg-gray-950 border-gray-700 text-blue-600 focus:ring-0 cursor-pointer" />
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
          <button onClick={handleClearFilters} className="inline-flex items-center justify-center gap-1.5 bg-gray-900 hover:bg-gray-800 active:bg-gray-700 text-gray-300 hover:text-white font-semibold text-xs px-3 py-1.5 rounded border border-gray-800 hover:border-gray-700 transition-all shadow-sm" title="Επαναφορά όλων των φίλτρων">
            <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
            Καθαρισμός φίλτρων
          </button>
        </div>
      </div>
      {/* Desktop AG Grid */}
      <div className="w-full rounded-lg border border-gray-800 bg-gray-950 overflow-hidden shadow-2xl" style={{ height: "calc(100dvh - 260px)", minHeight: 1000 }}>
        <AgGridReact theme={myTheme} rowData={data} columnDefs={columnDefs} defaultColDef={defaultColDef} localeText={localeText} onGridReady={onGridReady} pagination={true} paginationPageSize={25} paginationPageSizeSelector={[25, 50, 100]} animateRows={true} rowHeight={48} />
      </div>
    </div>
  );
};
