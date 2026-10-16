"use client";

// PROTOTYPE (issue #9): three sticky version bar variants under the Header on the home page,
// switchable via `?variant=A|B|C`. Throwaway: lives on branch prototype/version-bar only.

import { useSearchParams } from "next/navigation";
import { PrototypeSwitcher } from "@/components/PrototypeSwitcher";
import { VariantA, name as nameA } from "./VariantA";
import { VariantB, name as nameB } from "./VariantB";
import { VariantC, name as nameC } from "./VariantC";

const VARIANTS = [
  { key: "A", name: nameA, Component: VariantA },
  { key: "B", name: nameB, Component: VariantB },
  { key: "C", name: nameC, Component: VariantC },
];

export function VersionBarPrototype() {
  const requested = useSearchParams().get("variant")?.toUpperCase();
  const current = VARIANTS.find((v) => v.key === requested) ?? VARIANTS[0];

  return (
    <>
      <current.Component />
      <PrototypeSwitcher variants={VARIANTS.map(({ key, name }) => ({ key, name }))} current={current.key} />
    </>
  );
}

// Placeholder target for the bar's "Change log" links (the section itself is issue #10).
export function ChangeLogPlaceholder() {
  return (
    <section
      id="changelog"
      className="mt-16 sm:mt-24 max-w-md mx-auto scroll-mt-28 rounded-xl border border-dashed border-fuchsia-400 p-6 text-xs font-mono text-fuchsia-700"
    >
      PROTOTYPE: Change log section goes here (issue #10)
    </section>
  );
}
