"use client";

import Link from "next/link";
import { Radar } from "lucide-react";

const CODING_AGENT_URL = "https://github.com/lbacik/coding-agent";

export function LabDispatch() {
  return (
    <div className="mt-6 mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden text-left divide-y divide-slate-200">
      {/* Graduated to Beta: Agent Dashboard */}
      <div className="p-3 sm:px-4 sm:py-2.5 bg-emerald-50/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <Radar className="w-4 h-4 text-emerald-600 shrink-0" aria-hidden="true" />
          <p className="text-xs text-slate-700 font-sans truncate">
            <span className="font-mono font-bold uppercase tracking-wider text-emerald-900 bg-emerald-200/80 px-1.5 py-0.5 rounded text-[10px] mr-2">
              BETA READY
            </span>
            <span className="font-semibold text-slate-900">Agent Dashboard</span> is now available for
            testing with Docker Compose.
          </p>
        </div>
        <a
          href="#dashboard"
          className="inline-flex items-center justify-center gap-1 shrink-0 w-32 h-8 font-mono text-[11px] leading-none font-bold text-emerald-800 hover:text-emerald-950 bg-emerald-100/90 hover:bg-emerald-200/80 active:bg-emerald-200 border border-emerald-300/90 px-3 rounded-xl transition-colors shadow-xs self-start sm:self-center whitespace-nowrap"
        >
          See Dashboard <span aria-hidden="true">↓</span>
        </a>
      </div>

      {/* Active Development: coding agent 'Rex' */}
      <div className="p-3 sm:px-4 sm:py-3 bg-amber-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start sm:items-center gap-3 min-w-0">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0 mt-1 sm:mt-0" aria-hidden="true" />
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono font-bold uppercase tracking-wider text-amber-900 bg-amber-200/90 px-2 py-0.5 rounded text-[10px] leading-tight">
                LAB DISPATCH
              </span>
              <span className="font-mono font-bold text-xs text-slate-900">Active Development:</span>
            </div>
            <p className="mt-0.5 text-xs text-slate-600 font-sans leading-normal">
              New graph-driven autonomous{" "}
              <Link
                href={CODING_AGENT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-slate-900 hover:text-blue-600 underline decoration-amber-400/80 underline-offset-2"
              >
                coding agent &apos;Rex&apos;
              </Link>
              .
            </p>
          </div>
        </div>
        <a
          href="#roadmap"
          className="inline-flex items-center justify-center gap-1 shrink-0 w-32 h-8 font-mono text-xs leading-none font-semibold text-amber-50 bg-amber-900 hover:bg-amber-950 active:bg-amber-950 px-3 rounded-xl transition-colors shadow-sm self-start sm:self-center whitespace-nowrap"
        >
          Roadmap <span aria-hidden="true">↓</span>
        </a>
      </div>
    </div>
  );
}
