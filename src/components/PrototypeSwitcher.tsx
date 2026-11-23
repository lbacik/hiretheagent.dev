"use client";

// THROWAWAY PROTOTYPE SWITCHER (see prototype/UI.md)
// Floating bottom bar to flip between UI variants (?variant=A|B|C) and workflow tabs
// (?tab=workflow|landscape), surfacing the full prototype state on every switch.

import { useCallback, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  FlaskConical,
  Layers,
  Network,
} from "lucide-react";

export interface PrototypeVariantMeta {
  key: "A" | "B" | "C";
  name: string;
  articlesStyle: string;
  landscapeTabTitle: string;
  landscapeStyle: string;
}

export const PROTOTYPE_VARIANTS: PrototypeVariantMeta[] = [
  {
    key: "A",
    name: "Editorial Cards + Blueprint Vector SVG",
    articlesStyle: "3-col Editorial Story Cards (subtitle + summary + topic pills)",
    landscapeTabTitle: "Ecosystem & Contract",
    landscapeStyle: "Full vector blueprint SVG diagram + 5-repo quick-jump strip",
  },
  {
    key: "B",
    name: "Technical Dossiers + Interactive Topology",
    articlesStyle: "3-col Technical Dossier Cards (takeaway callout + bullet checklist)",
    landscapeTabTitle: "Tools Landscape",
    landscapeStyle: "Interactive 5-node topology explorer + live contract CLI inspector",
  },
  {
    key: "C",
    name: "Magazine Feature Cards + System Matrix",
    articlesStyle: "3-col Featured Cards with color-coded header band & series badge",
    landscapeTabTitle: "Fleet Architecture",
    landscapeStyle: "Dark-hub architectural diagram + 5-repository contract matrix table",
  },
];

export type WorkflowPrimaryTab = "workflow" | "landscape";

export function usePrototypeState(): {
  variant: "A" | "B" | "C";
  variantMeta: PrototypeVariantMeta;
  activeTab: WorkflowPrimaryTab;
  setVariant: (key: "A" | "B" | "C") => void;
  setActiveTab: (tab: WorkflowPrimaryTab) => void;
} {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const rawVariant = searchParams.get("variant")?.toUpperCase();
  const variant: "A" | "B" | "C" =
    rawVariant === "B" || rawVariant === "C" ? rawVariant : "A";
  const variantMeta =
    PROTOTYPE_VARIANTS.find((v) => v.key === variant) ?? PROTOTYPE_VARIANTS[0];

  const rawTab = searchParams.get("tab")?.toLowerCase();
  const activeTab: WorkflowPrimaryTab =
    rawTab === "workflow" ? "workflow" : "landscape";

  const setVariant = useCallback(
    (nextKey: "A" | "B" | "C") => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("variant", nextKey);
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  const setActiveTab = useCallback(
    (nextTab: WorkflowPrimaryTab) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("tab", nextTab);
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  return { variant, variantMeta, activeTab, setVariant, setActiveTab };
}

export function PrototypeSwitcher() {
  const { variant, variantMeta, activeTab, setVariant, setActiveTab } =
    usePrototypeState();

  const currentIdx = Math.max(
    0,
    PROTOTYPE_VARIANTS.findIndex((v) => v.key === variant),
  );

  const cycle = useCallback(
    (delta: number) => {
      const nextIdx =
        (currentIdx + delta + PROTOTYPE_VARIANTS.length) %
        PROTOTYPE_VARIANTS.length;
      const target = PROTOTYPE_VARIANTS[nextIdx];
      if (target) setVariant(target.key);
    },
    [currentIdx, setVariant],
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
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[min(96vw,54rem)] rounded-2xl bg-slate-950/95 text-slate-100 border border-slate-700/90 shadow-2xl shadow-slate-950/50 backdrop-blur-md px-3.5 py-2.5 font-mono text-xs"
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
            {PROTOTYPE_VARIANTS.map((v) => {
              const isCurrent = v.key === variantMeta.key;
              return (
                <button
                  key={v.key}
                  type="button"
                  onClick={() => setVariant(v.key)}
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
            {variantMeta.key} ({variantMeta.name})
          </span>
        </div>

        {/* Right: Quick section jumps & workflow tab switcher */}
        <div className="flex items-center gap-1.5">
          <a
            href="#articles"
            className="hidden md:inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-[11px] transition-colors"
          >
            <BookOpen className="w-3 h-3 text-blue-400" />
            <span>#articles</span>
          </a>

          <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800">
            <button
              type="button"
              onClick={() => setActiveTab("workflow")}
              className={`px-2 py-1 rounded-md text-[11px] transition-colors cursor-pointer ${
                activeTab === "workflow"
                  ? "bg-blue-600 text-white font-bold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Tab 1: Workflow
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("landscape")}
              className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] transition-colors cursor-pointer ${
                activeTab === "landscape"
                  ? "bg-emerald-600 text-white font-bold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Network className="w-3 h-3" />
              <span>Tab 2: {variantMeta.landscapeTabTitle}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Surfaced state row (Rule 5: print/render full relevant state on every switch) */}
      <div className="mt-1.5 pt-1.5 border-t border-slate-800/90 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-[11px] text-slate-400">
        <div className="flex items-center gap-1.5 truncate">
          <Layers className="w-3 h-3 text-blue-400 shrink-0" />
          <span>
            state:{" "}
            <code className="text-emerald-300">
              ?variant={variantMeta.key}&amp;tab={activeTab}
            </code>{" "}
            • 2nd tab name:{" "}
            <strong className="text-amber-300">
              &ldquo;{variantMeta.landscapeTabTitle}&rdquo;
            </strong>
          </span>
        </div>
        <div className="truncate text-slate-300">
          Articles: <span className="text-slate-400">{variantMeta.articlesStyle}</span>
        </div>
      </div>
    </div>
  );
}
