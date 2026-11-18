import React, { useMemo, useState } from "react";
import { reportsApi } from "../../api/reports";
import { useApi } from "../../hooks/useApi";
import { CompetitionAnalysisDto } from "../../types";
import { Sort } from "../../types/opportunities";
import { Column, DataTable } from "../ui/DataTable";
import { Empty, Loading, Notice } from "../ui/Feedback";
import { Money } from "./cells";
import { km, pct } from "../../utils/format";

type Row = CompetitionAnalysisDto;

const side = (count: number, price: number, mileage: number) => (
  <>
    <div className="font-semibold text-gray-100">{count} αγγελίες</div>
    <div className="text-[11px] text-gray-500">
      διάμεσος {price.toLocaleString("el-GR")} € · {km(mileage)}
    </div>
  </>
);

const COLUMNS: Column<Row>[] = [
  { key: "model", header: "Μοντέλο", sortable: true, card: "title", render: (r) => <span className="font-bold text-gray-100 text-sm">{r.brand} {r.model}</span> },
  { key: "private", header: "Ιδιώτες", sortable: true, render: (r) => side(r.privateListingsCount, r.privateMedianPrice, r.privateMedianMileage) },
  { key: "dealer", header: "Έμποροι", sortable: true, render: (r) => side(r.dealerListingsCount, r.dealerMedianPrice, r.dealerMedianMileage) },
  { key: "margin", header: "Περιθώριο (διάμεσοι)", sortable: true, title: "Πόσο περισσότερο ζητούν οι έμποροι από τους ιδιώτες, διάμεση τιμή προς διάμεση τιμή", render: (r) => <Money value={r.medianMargin} good /> },
  { key: "marginPct", header: "Περιθώριο %", sortable: true, render: (r) => pct(r.marginPct) },
];

const VALUE: Record<string, (r: Row) => number | string> = {
  model: (r) => `${r.brand} ${r.model}`,
  private: (r) => r.privateMedianPrice,
  dealer: (r) => r.dealerMedianPrice,
  margin: (r) => r.medianMargin,
  marginPct: (r) => r.marginPct,
};

/** The "per model" way to read the private-to-dealer gap: models where dealers ask more than private sellers (median to median). */
export const ModelComparison: React.FC = () => {
  const { data, error, loading } = useApi(() => reportsApi.competitionAnalysis(), "models", "Η φόρτωση της σύγκρισης ανά μοντέλο απέτυχε. Δοκιμάστε ξανά.");
  const [sort, setSort] = useState<Sort>({ key: "margin", dir: "desc" });

  const rows = useMemo(() => {
    const value = VALUE[sort.key];
    const sign = sort.dir === "asc" ? 1 : -1;
    return [...(data ?? [])].sort((a, b) => (value(a) > value(b) ? sign : value(a) < value(b) ? -sign : 0));
  }, [data, sort]);

  return (
    <div className="flex flex-col gap-3">
      {error && <Notice tone="danger">{error}</Notice>}
      {loading && <Loading text="Φόρτωση..." />}
      {data && !loading && (rows.length === 0 ? <Empty>Δεν βρέθηκαν μοντέλα με αρκετές αγγελίες και από τις δύο πλευρές.</Empty> : (
        <DataTable<Row>
          columns={COLUMNS}
          rows={rows}
          rowKey={(r) => `${r.brand}|${r.model}`}
          sort={sort}
          onSort={(key) => setSort((s) => ({ key, dir: s.key === key && s.dir === "desc" ? "asc" : "desc" }))}
          caption="Ιδιώτες έναντι εμπόρων ανά μοντέλο"
        />
      ))}
      <p className="text-[11px] text-gray-500">Διάμεσες τιμές όλων των ετών και χιλιομέτρων του μοντέλου: δείχνουν πού αξίζει να ψάξεις, όχι τι να προσφέρεις. Για συγκεκριμένα αυτοκίνητα δες το «Ανά αγγελία».</p>
    </div>
  );
};
