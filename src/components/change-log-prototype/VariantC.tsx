"use client";

// PROTOTYPE (issue #10) Variant C: a version picker. Every stable Release is a pill, grouped by
// minor line (v0.5, v0.4, ...); one panel below shows the selected Release's full notes.
// Fixed footprint on the page no matter how many Releases exist.

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { Notes, releaseDate, releases } from "./notes";

export const name = "Version picker";

const minorOf = (tag: string) => tag.split(".").slice(0, 2).join(".");
const lines = releases.reduce<Record<string, typeof releases>>((acc, r) => {
  (acc[minorOf(r.tag_name)] ??= []).push(r);
  return acc;
}, {});

export function VariantC() {
  const [selected, setSelected] = useState(releases[0]);

  return (
    <div className="max-w-3xl mx-auto rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden text-left">
      <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 flex flex-wrap gap-x-5 gap-y-2">
        {Object.entries(lines).map(([minor, rs]) => (
          <div key={minor} className="flex items-center gap-1.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mr-0.5">{minor}</span>
            {rs.map((r) => (
              <button
                key={r.tag_name}
                type="button"
                onClick={() => setSelected(r)}
                aria-pressed={selected.tag_name === r.tag_name}
                className={`rounded-md px-1.5 py-px font-mono text-xs border transition-colors ${
                  selected.tag_name === r.tag_name
                    ? "bg-blue-600 border-blue-600 text-white font-semibold"
                    : "bg-white border-slate-300 text-slate-700 hover:border-blue-400"
                }`}
              >
                {r.tag_name.slice(minor.length) || r.tag_name}
              </button>
            ))}
          </div>
        ))}
      </div>
      <div className="p-5">
        <div className="flex items-baseline justify-between mb-3">
          <div className="flex items-baseline gap-3">
            <h4 className="font-display font-bold text-xl text-slate-950">{selected.name}</h4>
            <span className="text-xs font-mono text-slate-400">{releaseDate(selected)}</span>
          </div>
          <a
            href={selected.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-xs font-mono text-slate-500 hover:text-blue-600"
          >
            Release on GitHub <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
          </a>
        </div>
        <div className="max-h-80 overflow-y-auto pr-1">
          <Notes release={selected} />
        </div>
      </div>
    </div>
  );
}
