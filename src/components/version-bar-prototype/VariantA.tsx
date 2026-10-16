"use client";

// PROTOTYPE (issue #9) Variant A: always-visible dark ticker, stacked sticky under the Header.
// Reworks the old AnnouncementBar look: one line, version + date + headline change + two links.
// Mobile: headline drops, version/date/links stay on one line.

import { ArrowDown, ArrowUpRight } from "lucide-react";
import { release, headline, releasedOn } from "./release";

export const name = "Stacked dark ticker";

export function VariantA() {
  return (
    <div className="sticky top-16 z-20 bg-slate-900 text-slate-200 border-b border-slate-800 text-xs font-mono">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-9 flex items-center justify-center gap-2 sm:gap-3 whitespace-nowrap">
        <span className="relative flex h-2 w-2 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
        </span>
        <span>
          <span className="hidden sm:inline text-slate-400">simple-coding-agent </span>
          <span className="text-amber-300 font-bold">{release.name}</span>
        </span>
        <span className="text-slate-500">·</span>
        <span className="text-slate-400">{releasedOn}</span>
        {headline && (
          <>
            <span className="hidden md:inline text-slate-500">·</span>
            <span className="hidden md:inline truncate max-w-[28rem]">{headline}</span>
          </>
        )}
        <a
          href="#changelog"
          className="inline-flex items-center text-blue-400 hover:text-blue-300 font-semibold underline underline-offset-2 ml-1"
        >
          Change log
          <ArrowDown className="w-3.5 h-3.5 ml-0.5" />
        </a>
        <a
          href={release.htmlUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:inline-flex items-center text-blue-400 hover:text-blue-300 font-semibold underline underline-offset-2"
        >
          Release
          <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
        </a>
      </div>
    </div>
  );
}
