"use client";

// PROTOTYPE (issue #10) Variant B: a vertical timeline. Nothing is collapsed: each Release shows
// its notes trimmed to 3 entries per category. 5 Releases first, then "Show older" reveals the
// rest on the page itself instead of sending people to GitHub.

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { Notes, releaseDate, releases } from "./notes";

export const name = "Timeline, show older";

export function VariantB() {
  const [all, setAll] = useState(false);
  const shown = all ? releases : releases.slice(0, 5);

  return (
    <div className="max-w-3xl mx-auto text-left">
      <ol className="relative border-l border-slate-200 ml-2 sm:ml-28">
        {shown.map((r, i) => (
          <li key={r.tag_name} className="relative pl-6 pb-8 last:pb-2">
            <span
              className={`absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full ring-4 ring-white ${i === 0 ? "bg-blue-600" : "bg-slate-300"}`}
            />
            <div className="sm:absolute sm:-left-28 sm:w-24 sm:text-right sm:top-0.5 text-xs font-mono text-slate-400 mb-1 sm:mb-0">
              {releaseDate(r)}
            </div>
            <div className="flex items-baseline gap-3 mb-2">
              <h4 className="font-display font-bold text-lg text-slate-950">{r.name}</h4>
              <a
                href={r.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-xs font-mono text-slate-400 hover:text-blue-600"
              >
                GitHub <ArrowUpRight className="w-3 h-3 ml-0.5" />
              </a>
            </div>
            <Notes release={r} compact />
          </li>
        ))}
      </ol>
      {!all && releases.length > 5 && (
        <button
          type="button"
          onClick={() => setAll(true)}
          className="ml-2 sm:ml-28 mt-2 pl-6 text-xs font-mono font-semibold text-blue-600 hover:text-blue-700"
        >
          Show {releases.length - 5} older Releases
        </button>
      )}
    </div>
  );
}
