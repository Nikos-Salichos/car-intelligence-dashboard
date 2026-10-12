import React, { useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import {
    ColDef,
    ICellRendererParams,
    ModuleRegistry,
    AllCommunityModule,
    themeQuartz,
    colorSchemeDark,
} from "ag-grid-community";
import type { CompetitionAnalysisDto } from "../../types";
import { formatEuro } from "./negotiationUtils";
import { MarginBadge } from "./MarginBadge";

ModuleRegistry.registerModules([AllCommunityModule]);

const myTheme = themeQuartz.withPart(colorSchemeDark);

const localeText = {
    page: "Σελίδα",
    to: "έως",
    of: "από",
    first: "Πρώτη",
    previous: "Προηγούμενη",
    next: "Επόμενη",
    last: "Τελευταία",
    pageSizeSelectorLabel: "Μοντέλα ανά σελίδα:",
    noRowsToShow: "Δεν βρέθηκαν μοντέλα",
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

type CellParams = ICellRendererParams<CompetitionAnalysisDto>;

interface Props {
    readonly data: CompetitionAnalysisDto[];
}

export const CompetitionDesktop: React.FC<Props> = ({ data }) => {
    const columnDefs = useMemo<ColDef<CompetitionAnalysisDto>[]>(
        () => [
            {
                colId: "car",
                headerName: "Αυτοκίνητο",
                valueGetter: (p) => `${p.data?.brand ?? ""} ${p.data?.model ?? ""}`.trim(),
                cellRenderer: (p: CellParams) => (
                    <span className="font-bold text-white">
                        {p.data?.brand} <span className="font-medium text-gray-300">{p.data?.model}</span>
                    </span>
                ),
                filter: "agTextColumnFilter",
                minWidth: 200,
                flex: 1.5,
            },
            {
                colId: "privateListingsCount",
                headerName: "Αγγελίες ιδιωτών",
                field: "privateListingsCount",
                cellClass: "text-gray-300",
                filter: "agNumberColumnFilter",
                minWidth: 150,
                flex: 0.8,
            },
            {
                colId: "privateMedianPrice",
                headerName: "Τιμή ιδιωτών",
                field: "privateMedianPrice",
                valueFormatter: (p) => (p.value == null ? "-" : formatEuro(p.value)),
                cellClass: "font-semibold text-gray-100",
                filter: "agNumberColumnFilter",
                minWidth: 140,
                flex: 1,
            },
            {
                colId: "dealerListingsCount",
                headerName: "Αγγελίες εμπόρων",
                field: "dealerListingsCount",
                cellClass: "text-gray-300",
                filter: "agNumberColumnFilter",
                minWidth: 150,
                flex: 0.8,
            },
            {
                colId: "dealerMedianPrice",
                headerName: "Τιμή εμπόρων",
                field: "dealerMedianPrice",
                valueFormatter: (p) => (p.value == null ? "-" : formatEuro(p.value)),
                cellClass: "font-semibold text-gray-100",
                filter: "agNumberColumnFilter",
                minWidth: 140,
                flex: 1,
            },
            {
                colId: "medianMargin",
                headerName: "Περιθώριο (€)",
                field: "medianMargin",
                valueFormatter: (p) => (p.value == null ? "-" : formatEuro(p.value)),
                cellClass: (p) => (p.value > 0 ? "font-extrabold text-emerald-400" : "font-extrabold text-red-400"),
                sort: "desc",
                filter: "agNumberColumnFilter",
                minWidth: 140,
                flex: 1,
            },
            {
                colId: "marginPct",
                headerName: "Περιθώριο (%)",
                field: "marginPct",
                cellRenderer: (p: CellParams) => (p.data ? <MarginBadge pct={p.data.marginPct} /> : null),
                filter: "agNumberColumnFilter",
                minWidth: 140,
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
        <div
            className="w-full rounded-lg border border-gray-800 bg-gray-950 overflow-hidden shadow-2xl"
            style={{ height: "calc(100dvh - 330px)", minHeight: 500 }}
        >
            <AgGridReact<CompetitionAnalysisDto>
                theme={myTheme}
                rowData={data}
                columnDefs={columnDefs}
                defaultColDef={defaultColDef}
                localeText={localeText}
                getRowId={(p) => `${p.data.brand}|${p.data.model}`}
                pagination={true}
                paginationPageSize={25}
                paginationPageSizeSelector={[25, 50, 100]}
                animateRows={true}
                rowHeight={48}
            />
        </div>
    );
};