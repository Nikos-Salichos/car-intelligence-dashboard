import React from "react";
import { Button } from "./Button";

export const Pagination: React.FC<{ page: number; totalPages: number; total: number; onPage: (page: number) => void }> = ({ page, totalPages, total, onPage }) => (
  <nav aria-label="Σελίδες" className="flex items-center justify-between gap-3 text-xs text-gray-400">
    <span>{total.toLocaleString("el-GR")} αποτελέσματα</span>
    <div className="flex items-center gap-2">
      <Button variant="secondary" size="sm" disabled={page <= 1} onClick={() => onPage(page - 1)}>
        ← Προηγούμενη
      </Button>
      <span aria-live="polite">
        Σελίδα {page} από {totalPages}
      </span>
      <Button variant="secondary" size="sm" disabled={page >= totalPages} onClick={() => onPage(page + 1)}>
        Επόμενη →
      </Button>
    </div>
  </nav>
);
