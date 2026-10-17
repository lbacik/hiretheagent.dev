"use client";

// Client half of the Change log section: filter chips (All / Features /
// Fixes) and paging by 12 from the single fetched payload, with no further
// requests. Fed by the server ChangeLog with the already-flattened rows.

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import {
  ALL_RELEASES_URL,
  CHANGE_LOG_FILTERS,
  CHANGE_LOG_PAGE_SIZE,
  filterChangeLogRows,
  pageChangeLogRows,
  remainingChangeLogCount,
  type ChangeLogFilter,
  type ChangeLogRow,
} from "@/lib/change-log";
import { formatReleaseDate } from "@/lib/releases";

const BADGE: Record<string, string> = {
  Features: "bg-blue-50 text-blue-700 border-blue-200",
  Fixes: "bg-amber-50 text-amber-700 border-amber-200",
  "Other changes": "bg-slate-50 text-slate-600 border-slate-200",
};

const LABEL: Record<string, string> = {
  Features: "Feature",
  Fixes: "Fix",
  "Other changes": "Other",
};

export function ChangeLogFeed({ rows }: { rows: ChangeLogRow[] }) {
  const [filter, setFilter] = useState<ChangeLogFilter>("All");
  const [limit, setLimit] = useState(CHANGE_LOG_PAGE_SIZE);

  const filtered = filterChangeLogRows(rows, filter);
  const shown = pageChangeLogRows(filtered, limit);
  const left = remainingChangeLogCount(filtered, limit);

  return (
    <div className="text-left" data-changelog-feed>
      <div className="flex items-center gap-1.5 mb-3">
        {CHANGE_LOG_FILTERS.map((entry) => (
          <button
            key={entry}
            type="button"
            data-changelog-filter={entry}
            onClick={() => {
              setFilter(entry);
              setLimit(CHANGE_LOG_PAGE_SIZE);
            }}
            className={`rounded-full px-3 py-1 text-xs font-mono border ${
              filter === entry
                ? "bg-slate-900 border-slate-900 text-white"
                : "bg-white border-slate-300 text-slate-600 hover:border-slate-400"
            }`}
          >
            {entry}
          </button>
        ))}
      </div>

      <ul className="rounded-xl border border-slate-200 bg-white divide-y divide-slate-100 shadow-sm">
        {shown.map((row, i) => {
          const previous = shown[i - 1];
          const newRelease = i === 0 || previous?.releaseTag !== row.releaseTag;
          return (
            <li key={row.key}>
              {newRelease && (
                <div className="flex items-center gap-2 bg-slate-50 px-4 py-1.5 text-[11px] font-mono text-slate-500">
                  <a
                    href={row.releaseUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-slate-800 hover:text-blue-600"
                  >
                    {row.releaseName}
                  </a>
                  <span>{formatReleaseDate(row.releaseCreatedAt)}</span>
                </div>
              )}
              {row.kind === "maintenance" && (
                <p className="px-4 py-2.5 text-sm text-slate-500 italic">
                  Maintenance release, no user-facing changes.
                </p>
              )}
              {row.kind === "fallback" && (
                <p className="px-4 py-2.5 text-sm text-slate-700 whitespace-pre-line">
                  {row.text}
                </p>
              )}
              {row.kind === "change" && (
                <div className="flex items-start gap-3 px-4 py-2.5">
                  <span
                    className={`mt-0.5 shrink-0 w-16 text-center rounded border px-1 py-px text-[10px] font-mono ${BADGE[row.category] ?? BADGE["Other changes"]}`}
                  >
                    {LABEL[row.category] ?? row.category}
                  </span>
                  <span className="text-sm text-slate-700">{row.title}</span>
                  <a
                    href={row.prUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-auto shrink-0 font-mono text-xs text-slate-400 hover:text-blue-600"
                  >
                    #{row.prNumber}
                  </a>
                </div>
              )}
            </li>
          );
        })}
      </ul>

      <div className="mt-3 flex items-center justify-between text-xs font-mono">
        {left > 0 ? (
          <button
            type="button"
            data-changelog-load-more
            onClick={() => setLimit((value) => value + CHANGE_LOG_PAGE_SIZE)}
            className="font-semibold text-blue-600 hover:text-blue-700"
          >
            Load more ({left} left)
          </button>
        ) : (
          <span />
        )}
        <a
          href={ALL_RELEASES_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-slate-500 hover:text-slate-700"
        >
          All Releases on GitHub <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
        </a>
      </div>
    </div>
  );
}
