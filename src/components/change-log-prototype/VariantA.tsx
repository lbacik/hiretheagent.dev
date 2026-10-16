"use client";

// PROTOTYPE (issue #10) Variant A: the proposal from the ticket. The latest 5 Releases as an
// accordion, the newest expanded, the rest collapsed to one header row each; a link to all
// Releases on GitHub below.

import { useState } from "react";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { Notes, allReleasesUrl, releaseDate, releases } from "./notes";

export const name = "Latest 5 accordion";

export function VariantA() {
  const [open, setOpen] = useState<string | null>(releases[0]?.tag_name ?? null);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="space-y-2">
        {releases.slice(0, 5).map((r, i) => {
          const isOpen = open === r.tag_name;
          return (
            <div key={r.tag_name} className="rounded-xl border border-slate-200 bg-white shadow-sm">
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : r.tag_name)}
                aria-expanded={isOpen}
                className="w-full flex items-center gap-3 px-4 py-3 text-left"
              >
                <span className="rounded-md border border-slate-300 bg-slate-100 px-1.5 py-px font-mono text-xs font-semibold text-slate-900">
                  {r.name}
                </span>
                {i === 0 && <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-600">Latest</span>}
                <span className="text-xs font-mono text-slate-400">{releaseDate(r)}</span>
                <span className="ml-auto text-xs font-mono text-slate-400">
                  {r.changeCount} {r.changeCount === 1 ? "change" : "changes"}
                </span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
              </button>
              {isOpen && (
                <div className="px-4 pb-4 border-t border-slate-100 pt-3">
                  <Notes release={r} />
                  <a
                    href={r.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center text-xs font-mono text-slate-500 hover:text-slate-700"
                  >
                    Release on GitHub <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
                  </a>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <a
        href={allReleasesUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-flex items-center text-xs font-mono font-semibold text-blue-600 hover:text-blue-700"
      >
        All {releases.length} Releases on GitHub <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
      </a>
    </div>
  );
}
