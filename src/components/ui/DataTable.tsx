import React from "react";
import { Sort } from "../../types/opportunities";

export interface Column<T> {
  key: string; // also the sort key sent to the server (or used by the table itself when it sorts)
  header: string;
  render: (row: T) => React.ReactNode;
  sortable?: boolean;
  title?: string; // tooltip on the header
  card?: "title" | "hide"; // phones: this column is the card title / is left out. Others become "header: value" lines.
}

interface Props<T> {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  sort?: Sort | null;
  onSort?: (key: string) => void;
  caption: string; // read by screen readers
}

const TH = "py-2 pr-4 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap";

/** The one table of the app. A real table on wide screens, a list of cards on phones, from the same column definitions. */
export function DataTable<T>({ columns, rows, rowKey, sort, onSort, caption }: Props<T>) {
  const ariaSort = (c: Column<T>) => (sort?.key === c.key ? (sort.dir === "asc" ? "ascending" : "descending") : c.sortable ? "none" : undefined);
  const title = columns.find((c) => c.card === "title") ?? columns[0];
  const lines = columns.filter((c) => c !== title && c.card !== "hide" && c.header !== "");
  const actions = columns.filter((c) => c.header === "");

  return (
    <>
      <div className="hidden md:block overflow-x-auto bg-gray-900 border border-gray-800 rounded-xl px-4">
        <table className="w-full">
          <caption className="sr-only">{caption}</caption>
          <thead>
            <tr>
              {columns.map((c) => (
                <th key={c.key} scope="col" className={TH} title={c.title} aria-sort={ariaSort(c)}>
                  {c.sortable && onSort ? (
                    <button onClick={() => onSort(c.key)} className="uppercase tracking-wide hover:text-gray-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-400">
                      {c.header}
                      <span aria-hidden className="ml-1">{sort?.key === c.key ? (sort.dir === "asc" ? "▲" : "▼") : ""}</span>
                    </button>
                  ) : (
                    c.header
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={rowKey(row)} className="border-t border-gray-800">
                {columns.map((c) => (
                  <td key={c.key} className="py-2.5 pr-4 align-top text-xs text-gray-300 whitespace-nowrap">
                    {c.render(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="md:hidden flex flex-col gap-3" aria-label={caption}>
        {rows.map((row) => (
          <li key={rowKey(row)} className="bg-gray-900 border border-gray-800 rounded-xl p-3.5 flex flex-col gap-2.5">
            <div>{title.render(row)}</div>
            <dl className="grid grid-cols-2 gap-x-3 gap-y-2">
              {lines.map((c) => (
                <div key={c.key}>
                  <dt className="text-[10px] text-gray-500 uppercase tracking-wide">{c.header}</dt>
                  <dd className="text-xs text-gray-200 mt-0.5">{c.render(row)}</dd>
                </div>
              ))}
            </dl>
            {actions.length > 0 && <div className="flex gap-2">{actions.map((c) => <React.Fragment key={c.key}>{c.render(row)}</React.Fragment>)}</div>}
          </li>
        ))}
      </ul>
    </>
  );
}
