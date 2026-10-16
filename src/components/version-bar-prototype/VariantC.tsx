"use client";

// PROTOTYPE (issue #9) Variant C: a hairline strip, sticky, aligned to the Header's content column.
// Left: a version chip. Right: a "What's new" toggle that drops an inline panel with this
// Release's categorized notes, so the latest changes are readable without leaving the viewport.
// Mobile: chip + toggle only; the panel spans the full width.

import { useState } from "react";
import { ArrowDown, ArrowUpRight, ChevronDown } from "lucide-react";
import { release, isFresh, releasedOn } from "./release";

export const name = "Chip + expandable notes";

export function VariantC() {
  const [open, setOpen] = useState(false);

  return (
    <div className="sticky top-16 z-20 bg-white/90 backdrop-blur-md border-b border-slate-200/90">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-8 flex items-center justify-between text-xs font-mono">
        <span className="inline-flex items-center gap-2 text-slate-600">
          <span className={`h-1.5 w-1.5 rounded-full ${isFresh ? "bg-emerald-500" : "bg-slate-400"}`} />
          simple-coding-agent
          <span className="rounded-md border border-slate-300 bg-slate-100 px-1.5 py-px font-semibold text-slate-900">
            {release.name}
          </span>
          <span className="hidden sm:inline text-slate-400">{releasedOn}</span>
        </span>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 font-semibold"
        >
          What&apos;s new
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
        </button>
      </div>

      {open && (
        <div className="absolute inset-x-0 top-full border-b border-slate-200 bg-white shadow-lg shadow-slate-900/5">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:flex sm:justify-end">
            <div className="sm:w-96 text-left">
              {release.categories.map((c) => (
                <div key={c.title} className="mb-3">
                  <h4 className="text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-500 mb-1">
                    {c.title}
                  </h4>
                  <ul className="space-y-1 text-sm text-slate-700">
                    {c.entries.map((e) => (
                      <li key={e.pr} className="flex gap-2">
                        <span className="text-slate-400">–</span>
                        <span>
                          {e.title} <span className="font-mono text-xs text-slate-400">#{e.pr}</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              <div className="flex items-center gap-4 pt-2 border-t border-slate-100 text-xs font-mono">
                <a
                  href="#changelog"
                  onClick={() => setOpen(false)}
                  className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold"
                >
                  Full Change log
                  <ArrowDown className="w-3.5 h-3.5 ml-0.5" />
                </a>
                <a
                  href={release.htmlUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-slate-500 hover:text-slate-700"
                >
                  Release on GitHub
                  <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
