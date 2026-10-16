"use client";

// PROTOTYPE (issue #9) Variant B: a taller light banner that tucks behind the Header while you
// scroll down and slides back out when you scroll up (or are near the top).
// Content: "New" badge, version, date, change count, a single "What's new" CTA to the Change log.
// Mobile: stacks into two short lines.

import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUpRight, Tag } from "lucide-react";
import { release, changeCount, isFresh, releasedOn } from "./release";

export const name = "Hides on scroll down";

export function VariantB() {
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (y < 80) setHidden(false);
      else if (y > lastY.current + 4) setHidden(true);
      else if (y < lastY.current - 4) setHidden(false);
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`sticky top-16 z-20 transition-transform duration-300 ${hidden ? "-translate-y-full" : "translate-y-0"}`}
    >
      <div className="bg-blue-50/95 backdrop-blur-md border-b border-blue-200 text-slate-700">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2.5 flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-4 text-sm">
          <div className="flex items-center gap-2">
            {isFresh && (
              <span className="rounded-full bg-blue-600 text-white text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5">
                New
              </span>
            )}
            <Tag className="w-4 h-4 text-blue-600" />
            <span className="font-display font-semibold text-slate-950">
              simple-coding-agent {release.name}
            </span>
          </div>
          <span className="text-xs font-mono text-slate-500">
            released {releasedOn} · {changeCount} changes
          </span>
          <div className="flex items-center gap-3">
            <a
              href="#changelog"
              className="inline-flex items-center gap-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-1.5"
            >
              What&apos;s new
              <ArrowDown className="w-3.5 h-3.5" />
            </a>
            <a
              href={release.htmlUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-xs font-mono text-blue-700 hover:text-blue-900 underline underline-offset-2"
            >
              GitHub
              <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
