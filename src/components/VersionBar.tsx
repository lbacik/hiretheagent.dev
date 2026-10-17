"use client";

import { useState } from "react";
import { ArrowDown, ArrowUpRight, ChevronDown } from "lucide-react";

import type { ReleaseNotes } from "@/lib/release-notes";

export type VersionBarRelease = {
  name: string;
  date: string;
  fresh: boolean;
  notes: ReleaseNotes;
  htmlUrl: string;
};

function ReleaseNotesView({ notes }: { notes: ReleaseNotes }) {
  if (notes.kind === "maintenance") {
    return (
      <p className="mb-3 text-sm text-slate-500 italic">
        Maintenance release, no user-facing changes.
      </p>
    );
  }
  if (notes.kind === "fallback") {
    return (
      <p className="mb-3 text-sm text-slate-700 whitespace-pre-line">
        {notes.text}
      </p>
    );
  }
  return (
    <>
      {notes.categories.map((category) => (
        <div key={category.title} className="mb-3">
          <h4 className="text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-500 mb-1">
            {category.title}
          </h4>
          <ul className="space-y-1 text-sm text-slate-700">
            {category.changes.map((change) => (
              <li key={change.prNumber} className="flex gap-2">
                <span aria-hidden="true" className="text-slate-400">
                  –
                </span>
                <span>
                  {change.title}{" "}
                  <a
                    href={change.prUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-xs text-slate-400 hover:text-blue-600"
                  >
                    #{change.prNumber}
                  </a>
                </span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </>
  );
}

export function VersionBar({ release }: { release: VersionBarRelease }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="sticky top-16 z-20 bg-white/90 backdrop-blur-md border-b border-slate-200/90">
      <div className="max-w-6xl mx-auto px-6 h-8 flex items-center justify-between text-xs font-mono">
        <span className="inline-flex items-center gap-2 text-slate-600">
          <span
            aria-hidden="true"
            className={`h-1.5 w-1.5 rounded-full ${release.fresh ? "bg-emerald-500" : "bg-slate-400"}`}
          />
          simple-coding-agent
          <span className="rounded-md border border-slate-300 bg-slate-100 px-1.5 py-px font-semibold text-slate-900">
            {release.name}
          </span>
          <span className="hidden sm:inline text-slate-400">{release.date}</span>
        </span>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 font-semibold"
        >
          What&apos;s new
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform ${open ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      {open && (
        <div className="absolute inset-x-0 top-full border-b border-slate-200 bg-white shadow-lg shadow-slate-900/5">
          <div className="max-w-6xl mx-auto px-6 py-4 sm:flex sm:justify-end">
            <div className="sm:w-96 text-left">
              <ReleaseNotesView notes={release.notes} />
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
