"use client";

// PROTOTYPE: floating variant switcher for throwaway UI prototypes.
// Cycles the `?variant=` search param; hidden in production builds.

import { useCallback, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface PrototypeVariant {
  key: string;
  name: string;
}

export function PrototypeSwitcher({ variants }: { variants: PrototypeVariant[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = searchParams.get("variant") ?? variants[0].key;
  const index = Math.max(0, variants.findIndex((v) => v.key === current));

  const go = useCallback(
    (delta: number) => {
      const next = variants[(index + delta + variants.length) % variants.length];
      const params = new URLSearchParams(searchParams.toString());
      params.set("variant", next.key);
      router.replace(`${pathname}?${params}`, { scroll: false });
    },
    [index, variants, searchParams, pathname, router],
  );

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      if (el?.closest("input, textarea, [contenteditable='true']")) return;
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [go]);

  if (process.env.NODE_ENV === "production") return null;

  const variant = variants[index];
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-1 rounded-full bg-fuchsia-950 text-white font-mono text-xs shadow-2xl ring-2 ring-fuchsia-400 p-1">
      <button
        type="button"
        onClick={() => go(-1)}
        className="p-1.5 rounded-full hover:bg-fuchsia-800 cursor-pointer"
        aria-label="Previous variant"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      <span className="px-2 whitespace-nowrap">
        <span className="font-bold">{variant.key}</span> ({variant.name})
      </span>
      <button
        type="button"
        onClick={() => go(1)}
        className="p-1.5 rounded-full hover:bg-fuchsia-800 cursor-pointer"
        aria-label="Next variant"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
