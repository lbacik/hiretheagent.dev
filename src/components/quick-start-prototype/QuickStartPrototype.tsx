"use client";

// PROTOTYPE (issue #3): four Quick start variants on the home page, switchable via `?variant=A|B|C|D`.
// Throwaway: lives on branch prototype/quick-start-section only.

import { useSearchParams } from "next/navigation";
import { PrototypeSwitcher } from "@/components/PrototypeSwitcher";
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

export function QuickStartPrototype() {
  const requested = useSearchParams().get("variant")?.toUpperCase();
  const current = VARIANTS.find((v) => v.key === requested) ?? VARIANTS[0];

  return (
    <>
      <current.Component />
      <PrototypeSwitcher variants={VARIANTS.map(({ key, name }) => ({ key, name }))} current={current.key} />
    </>
  );
}
