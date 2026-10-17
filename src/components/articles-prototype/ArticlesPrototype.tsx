"use client";

// PROTOTYPE: four Articles section variants between the hero intro and the workflow diagram on
// the home page, switchable via `?variant=A|B|C|D`. Throwaway: lives on branch
// prototype/articles-section only.

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

export function ArticlesPrototype() {
  const searchParams = useSearchParams();
  const requested = searchParams.get("variant")?.toUpperCase();
  const current = VARIANTS.find((v) => v.key === requested) ?? VARIANTS[0];

  return (
    <section id="articles" className="scroll-mt-28">
      <current.Component />
      <PrototypeSwitcher variants={VARIANTS.map(({ key, name }) => ({ key, name }))} current={current.key} />
    </section>
  );
}
