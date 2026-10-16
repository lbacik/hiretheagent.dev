"use client";

// PROTOTYPE (issue #10): four Change log section variants below the newsletter form on the home
// page, switchable via `?variant=A|B|C|D`; Release-note rendering switchable via
// `?render=parsed|markdown`. Throwaway: lives on branch prototype/change-log-section only.

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { PrototypeSwitcher } from "@/components/PrototypeSwitcher";
import { useRenderMode } from "./notes";
import { VariantA, name as nameA } from "./VariantA";
import { VariantB, name as nameB } from "./VariantB";
import { VariantC, name as nameC } from "./VariantC";
import { VariantD, name as nameD } from "./VariantD";

const VARIANTS = [
  { key: "A", name: nameA, Component: VariantA },
  { key: "B", name: nameB, Component: VariantB },
  { key: "C", name: nameC, Component: VariantC },
  { key: "D", name: nameD, Component: VariantD },
];

export function ChangeLogPrototype() {
  const searchParams = useSearchParams();
  const requested = searchParams.get("variant")?.toUpperCase();
  const current = VARIANTS.find((v) => v.key === requested) ?? VARIANTS[0];
  const mode = useRenderMode();
  const toggled = new URLSearchParams(searchParams.toString());
  toggled.set("render", mode === "markdown" ? "parsed" : "markdown");

  return (
    <section id="changelog" className="mt-16 sm:mt-24 scroll-mt-28">
      <div className="text-center mb-4">
        <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-500">Change log</h3>
        <p className="text-xs text-slate-500 font-mono mt-0.5">What changed in each simple-coding-agent Release.</p>
      </div>
      <current.Component />
      <Link
        href={`?${toggled.toString()}#changelog`}
        scroll={false}
        replace
        className="fixed bottom-16 left-1/2 -translate-x-1/2 z-50 rounded-full bg-fuchsia-600 text-white font-mono text-[11px] px-3 py-1 shadow-lg ring-2 ring-white hover:bg-fuchsia-700"
      >
        PROTOTYPE · notes: {mode === "markdown" ? "react-markdown" : "custom parser"} (click to switch)
      </Link>
      <PrototypeSwitcher variants={VARIANTS.map(({ key, name }) => ({ key, name }))} current={current.key} />
    </section>
  );
}
