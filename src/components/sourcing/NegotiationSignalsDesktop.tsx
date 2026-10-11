import React, { useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef, ICellRendererParams, ModuleRegistry, AllCommunityModule, themeQuartz, colorSchemeDark } from "ag-grid-community";
import type { NegotiationSignalDto } from "../../types";
import { NegotiationBadge, formatDate, formatEuro, formatTotalDrop } from "./negotiationUtils";

ModuleRegistry.registerModules([AllCommunityModule]);

const myTheme = themeQuartz.withPart(colorSchemeDark);

const LEVEL_LABELS: Record<string, string> = {
  high: "Υψηλό",
  medium: "Μέτριο",
  low: "Χαμηλό",
  none: "-",
};

const LEVEL_RANK: Record<string, number> = { high: 3, medium: 2, low: 1, none: 0 };

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

interface Props {
  data: NegotiationSignalDto[];
}

export const NegotiationSignalsDesktop: React.FC<Props> = ({ data }) => {
  const columnDefs = useMemo<ColDef<NegotiationSignalDto>[]>(
    () => [
      {
        colId: "car",
        headerName: "Αυτοκίνητο",
        valueGetter: (p) => `${p.data?.brand ?? ""} ${p.data?.model ?? ""}`.trim(),
        cellRenderer: (p: ICellRendererParams<NegotiationSignalDto>) => (
          <span className="font-bold text-white">
            {p.data?.brand} <span className="font-medium text-gray-300">{p.data?.model}</span>
          </span>
        ),
        filter: "agTextColumnFilter",
        minWidth: 200,
        flex: 1.5,
      },
      {
        colId: "signal",
        headerName: "Περιθώριο",
        valueGetter: (p) => LEVEL_LABELS[p.data?.negotiationSignal ?? "none"],
        cellRenderer: (p: ICellRendererParams<NegotiationSignalDto>) => (p.data ? <NegotiationBadge level={p.data.negotiationSignal} /> : null),
        comparator: (_a, _b, nodeA, nodeB) => LEVEL_RANK[nodeA.data?.negotiationSignal ?? "none"] - LEVEL_RANK[nodeB.data?.negotiationSignal ?? "none"],
        filter: "agTextColumnFilter",
        minWidth: 130,
        flex: 0.8,
      },
      {
        colId: "initialPrice",
        headerName: "Αρχική τιμή",
        field: "initialPrice",
        valueFormatter: (p) => (p.value == null ? "-" : formatEuro(p.value)),
        cellClass: "text-gray-400 line-through",
        filter: "agNumberColumnFilter",
        minWidth: 130,
        flex: 1,
      },
      {
        colId: "currentPrice",
        headerName: "Τρέχουσα τιμή",
        field: "currentPrice",
        valueFormatter: (p) => (p.value == null ? "-" : formatEuro(p.value)),
        cellClass: "font-extrabold text-emerald-400",
        filter: "agNumberColumnFilter",
        minWidth: 140,
        flex: 1,
      },
      {
        colId: "totalDropPct",
        headerName: "Συνολική μεταβολή",
        field: "totalDropPct",
        valueFormatter: (p) => (p.value == null ? "-" : formatTotalDrop(p.value)),
        cellClass: (p) => (p.value > 0 ? "font-bold text-emerald-400" : "font-bold text-red-400"),
        filter: "agNumberColumnFilter",
        minWidth: 160,
        flex: 1,
      },
      {
        colId: "dropCount",
        headerName: "Μειώσεις",
        field: "dropCount",
        valueFormatter: (p) => `${p.value}×`,
        sort: "desc",
        filter: "agNumberColumnFilter",
        minWidth: 110,
        flex: 0.7,
      },
      {
        colId: "raiseCount",
        headerName: "Αυξήσεις",
        field: "raiseCount",
        valueFormatter: (p) => (p.value > 0 ? `${p.value}×` : "-"),
        cellClass: "text-gray-400",
        filter: "agNumberColumnFilter",
        minWidth: 110,
        flex: 0.7,
      },
      {
        colId: "lastDropAt",
        headerName: "Τελευταία μείωση",
        valueGetter: (p) => (p.data?.lastDropAt ? new Date(p.data.lastDropAt) : null),
        valueFormatter: (p) => formatDate(p.data?.lastDropAt ?? null),
        cellClass: "text-gray-300",
        filter: "agDateColumnFilter",
        minWidth: 160,
        flex: 1,
      },
      {
        colId: "action",
        headerName: "Αγγελία",
        field: "listingUrl",
        cellRenderer: (p: ICellRendererParams<NegotiationSignalDto>) => (
          <a href={p.value} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold px-3 py-1.5 rounded text-xs transition-all shadow-sm">
            Άνοιγμα ↗
          </a>
        ),
        sortable: false,
        filter: false,
        floatingFilter: false,
        minWidth: 120,
        flex: 0.8,
      },
    ],
    [],
  );

  const defaultColDef = useMemo<ColDef>(
    () => ({
      resizable: true,
      sortable: true,
      floatingFilter: true,
    }),
    [],
  );

  return (
    <div className="w-full rounded-lg border border-gray-800 bg-gray-950 overflow-hidden shadow-2xl" style={{ height: "calc(100dvh - 260px)", minHeight: 1000 }}>
      <AgGridReact<NegotiationSignalDto> theme={myTheme} rowData={data} columnDefs={columnDefs} defaultColDef={defaultColDef} localeText={localeText} getRowId={(p) => p.data.listingId} pagination={true} paginationPageSize={25} paginationPageSizeSelector={[25, 50, 100]} animateRows={true} rowHeight={48} />
    </div>
  );
};
