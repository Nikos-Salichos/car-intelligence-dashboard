import React, { useState } from "react";
import { reportsApi } from "../../api/reports";
import { useApi } from "../../hooks/useApi";
import { DataTable } from "../ui/DataTable";
import { Empty, Loading, Notice } from "../ui/Feedback";
import { Pagination } from "../ui/Pagination";
import { COLUMNS } from "./columns";
import { OpportunityFilterForm } from "./OpportunityFilterForm";
import { buildQuery } from "./query";
import { DEFAULT_FILTERS, OpportunityDto, OpportunityView, Sort } from "../../types/opportunities";

const CAPTION: Record<OpportunityView, string> = {
  all: "Όλες οι αγγελίες",
  new: "Νέες ευκαιρίες",
  negotiation: "Αγγελίες με περιθώριο διαπραγμάτευσης",
  flip: "Από ιδιώτη σε έμπορο",
};

/** One view of the hub, with its own filters, sorting and paging. The page re-mounts it (key) when the view changes. */
export const OpportunityList: React.FC<{ view: OpportunityView }> = ({ view }) => {
  const [draft, setDraft] = useState(DEFAULT_FILTERS);
  const [applied, setApplied] = useState(DEFAULT_FILTERS);
  const [sort, setSort] = useState<Sort | null>(null);
  const [page, setPage] = useState(1);

  const query = buildQuery(view, applied, sort, page);
  const { data, error, loading } = useApi(() => reportsApi.opportunities(query), JSON.stringify(query), "Η φόρτωση των ευκαιριών απέτυχε. Δοκιμάστε ξανά.");

  const apply = () => {
    setApplied(draft);
    setPage(1);
  };

  // A click on a header: first descending (best first), second ascending, third back to the ranking of the view.
  const toggleSort = (key: string) => {
    setPage(1);
    setSort((s) => (s?.key !== key ? { key, dir: "desc" } : s.dir === "desc" ? { key, dir: "asc" } : null));
  };

  return (
    <div className="flex flex-col gap-4">
      <OpportunityFilterForm view={view} value={draft} onChange={setDraft} onApply={apply} />
      {error && <Notice tone="danger">{error}</Notice>}
      {loading && <Loading text="Αναζήτηση ευκαιριών..." />}
      {data && !loading && (
        <>
          {data.items.length === 0 ? (
            <Empty>Δεν βρέθηκαν αγγελίες με αυτά τα κριτήρια.</Empty>
          ) : (
            <DataTable<OpportunityDto> columns={COLUMNS[view]} rows={data.items} rowKey={(o) => o.listingId} sort={sort} onSort={toggleSort} caption={CAPTION[view]} />
          )}
          {data.total > 0 && <Pagination page={data.page} totalPages={data.totalPages} total={data.total} onPage={setPage} />}
        </>
      )}
    </div>
  );
};
