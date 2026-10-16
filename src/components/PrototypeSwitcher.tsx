"use client";

// PROTOTYPE: floating variant switcher. Hidden in production builds.

import { useCallback, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function PrototypeSwitcher({
  variants,
  current,
}: {
  variants: { key: string; name: string }[];
  current: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const index = Math.max(0, variants.findIndex((v) => v.key === current));

  const go = useCallback(
    (delta: number) => {
      const next = variants[(index + delta + variants.length) % variants.length];
      const params = new URLSearchParams(searchParams.toString());
      params.set("variant", next.key);
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [index, variants, searchParams, pathname, router],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      if (el && (el.closest("input, textarea, select") || el.isContentEditable)) return;
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  if (process.env.NODE_ENV === "production") return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1 rounded-full bg-fuchsia-600 text-white shadow-xl shadow-fuchsia-900/30 px-1.5 py-1.5 font-mono text-xs ring-2 ring-white">
      <button type="button" onClick={() => go(-1)} aria-label="Previous variant" className="p-1.5 rounded-full hover:bg-white/20">
        <ChevronLeft className="w-4 h-4" />
      </button>
      <span className="px-2 whitespace-nowrap">
        PROTOTYPE · {variants[index].key} ({variants[index].name})
      </span>
      <button type="button" onClick={() => go(1)} aria-label="Next variant" className="p-1.5 rounded-full hover:bg-white/20">
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
