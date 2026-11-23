"use client";

// THROWAWAY PROTOTYPE SWITCHER (see prototype/UI.md)
// Floating bottom bar to flip between UI variants (?variant=A|B|C) and surface prototype state.

import { useCallback, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight, FlaskConical, Layers } from "lucide-react";

export interface PrototypeVariantMeta {
  key: string;
  name: string;
  secondTabTitle: string;
  summary: string;
}

interface PrototypeSwitcherProps {
  variants: PrototypeVariantMeta[];
  current: string;
  activeTab: "skill" | "details";
  onTabChange: (tab: "skill" | "details") => void;
}

export function PrototypeSwitcher({
  variants,
  current,
  activeTab,
  onTabChange,
}: PrototypeSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentIdx = Math.max(
    0,
    variants.findIndex((v) => v.key === current),
  );
  const activeMeta = variants[currentIdx] ?? variants[0];

  const selectVariant = useCallback(
    (nextKey: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("variant", nextKey);
      router.replace(`${pathname}?${params.toString()}#dashboard-deploy`, {
        scroll: false,
      });
    },
    [pathname, router, searchParams],
  );

  const cycle = useCallback(
    (delta: number) => {
      if (variants.length === 0) return;
      const nextIdx =
        (currentIdx + delta + variants.length) % variants.length;
      const target = variants[nextIdx];
      if (target) selectVariant(target.key);
    },
    [currentIdx, selectVariant, variants],
  );

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable)
      ) {
        return;
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        cycle(-1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        cycle(1);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [cycle]);

  if (process.env.NODE_ENV === "production") {
    return null;
  }

  return (
    <div
      role="region"
      aria-label="UI Prototype Variant Switcher"
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[min(96vw,46rem)] rounded-2xl bg-slate-950/95 text-slate-100 border border-slate-700/90 shadow-2xl shadow-slate-950/50 backdrop-blur-md px-3.5 py-2.5 font-mono text-xs"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        {/* Left: Prototype badge + Arrow controls */}
        <div className="flex items-center gap-1.5">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-400/30 text-[10px] font-bold uppercase tracking-wider">
            <FlaskConical className="w-3 h-3" />
            Prototype
          </span>

          <button
            type="button"
            onClick={() => cycle(-1)}
            aria-label="Previous variant (Left Arrow)"
            title="Previous variant (←)"
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          <div className="flex items-center gap-1">
            {variants.map((v) => {
              const isCurrent = v.key === activeMeta?.key;
              return (
                <button
                  key={v.key}
                  type="button"
                  onClick={() => selectVariant(v.key)}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                    isCurrent
                      ? "bg-blue-600 text-white shadow-xs"
                      : "bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800"
                  }`}
                >
                  {v.key}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => cycle(1)}
            aria-label="Next variant (Right Arrow)"
            title="Next variant (→)"
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Center: Current Variant label */}
        <div className="min-w-0 flex-1 text-center sm:text-left px-1 truncate">
          <span className="font-bold text-white">
            {activeMeta?.key} ({activeMeta?.name})
          </span>
        </div>

        {/* Right: Quick inner-tab toggle to compare both tabs across variants */}
        <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800">
          <button
            type="button"
            onClick={() => onTabChange("skill")}
            className={`px-2 py-1 rounded-md text-[11px] transition-colors cursor-pointer ${
              activeTab === "skill"
                ? "bg-emerald-600 text-white font-bold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Tab 1: Skill
          </button>
          <button
            type="button"
            onClick={() => onTabChange("details")}
            className={`px-2 py-1 rounded-md text-[11px] transition-colors cursor-pointer ${
              activeTab === "details"
                ? "bg-amber-600 text-white font-bold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Tab 2: Compose
          </button>
        </div>
      </div>

      {/* Surfaced state row (Rule 5: print/render full relevant state on every switch) */}
      <div className="mt-1.5 pt-1.5 border-t border-slate-800/90 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-[11px] text-slate-400">
        <div className="flex items-center gap-1.5 truncate">
          <Layers className="w-3 h-3 text-blue-400 shrink-0" />
          <span>
            state:{" "}
            <code className="text-emerald-300">
              ?variant={activeMeta?.key}
            </code>{" "}
            • activeTab:{" "}
            <code className="text-amber-300">{activeTab}</code>
          </span>
        </div>
        <div className="truncate">
          2nd tab title:{" "}
          <span className="text-slate-200 font-semibold">
            &ldquo;{activeMeta?.secondTabTitle}&rdquo;
          </span>
        </div>
      </div>
    </div>
  );
}
