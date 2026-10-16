"use client";

// PROTOTYPE (issue #10) Variant D: change-centric, not Release-centric. A flat feed of individual
// changes across Releases with filter chips (All / Features / Fixes); a Release is just a small
// divider. 12 changes first, then "Load more". Ignores ?render (it needs parsed entries).

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { allReleasesUrl, releaseDate, releases } from "./notes";

export const name = "Change feed";

const FILTERS = ["All", "Features", "Fixes"] as const;
const BADGE: Record<string, string> = {
  Features: "bg-blue-50 text-blue-700 border-blue-200",
  Fixes: "bg-amber-50 text-amber-700 border-amber-200",
  "Other changes": "bg-slate-50 text-slate-600 border-slate-200",
};
const LABEL: Record<string, string> = { Features: "Feature", Fixes: "Fix", "Other changes": "Other" };

export function VariantD() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const [limit, setLimit] = useState(12);

  const rows = releases.flatMap((r) =>
    r.categories
      .filter((c) => filter === "All" || c.title === filter)
      .flatMap((c) => c.entries.map((e) => ({ release: r, category: c.title, entry: e }))),
  );
  const shown = rows.slice(0, limit);

  return (
    <div className="max-w-2xl mx-auto text-left">
      <div className="flex items-center gap-1.5 mb-3">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => {
              setFilter(f);
              setLimit(12);
            }}
            className={`rounded-full px-3 py-1 text-xs font-mono border ${
              filter === f ? "bg-slate-900 border-slate-900 text-white" : "bg-white border-slate-300 text-slate-600 hover:border-slate-400"
            }`}
          >
            {f}
          </button>
        ))}
      </div>
      <ul className="rounded-xl border border-slate-200 bg-white divide-y divide-slate-100 shadow-sm">
        {shown.map(({ release, category, entry }, i) => (
          <li key={entry.pr}>
            {(i === 0 || shown[i - 1].release !== release) && (
              <div className="flex items-center gap-2 bg-slate-50 px-4 py-1.5 text-[11px] font-mono text-slate-500">
                <a href={release.html_url} target="_blank" rel="noopener noreferrer" className="font-semibold text-slate-800 hover:text-blue-600">
                  {release.name}
                </a>
                <span>{releaseDate(release)}</span>
              </div>
            )}
            <div className="flex items-start gap-3 px-4 py-2.5">
              <span className={`mt-0.5 shrink-0 w-16 text-center rounded border px-1 py-px text-[10px] font-mono ${BADGE[category]}`}>
                {LABEL[category]}
              </span>
              <span className="text-sm text-slate-700">{entry.title}</span>
              <a
                href={entry.url}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-auto shrink-0 font-mono text-xs text-slate-400 hover:text-blue-600"
              >
                #{entry.pr}
              </a>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-3 flex items-center justify-between text-xs font-mono">
        {limit < rows.length ? (
          <button type="button" onClick={() => setLimit((l) => l + 12)} className="font-semibold text-blue-600 hover:text-blue-700">
            Load more ({rows.length - limit} left)
          </button>
        ) : (
          <span />
        )}
        <a href={allReleasesUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-slate-500 hover:text-slate-700">
          All Releases on GitHub <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
        </a>
      </div>
    </div>
  );
}
