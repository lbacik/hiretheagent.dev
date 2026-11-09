"use client";

// PROTOTYPE: Four variants of the Quick Start section with agent-forge v0.4.0 Worker Pools,
// switchable via `?variant=A|B|C|D` and Left/Right arrow keys on the existing `/` route.

import {
  createContext,
  Suspense,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ArrowDown, Boxes, ChevronLeft, ChevronRight } from "lucide-react";

export type PrototypeVariantKey = "A" | "B" | "C" | "D";

export interface PrototypeVariantMeta {
  key: PrototypeVariantKey;
  name: string;
  summary: string;
}

export const PROTOTYPE_VARIANTS: PrototypeVariantMeta[] = [
  {
    key: "A",
    name: "6-Step Linear Timeline",
    summary:
      "Inserts Step 4 (Scale the Pool with manage-pool) into the existing timeline with prompt + CLI command tables",
  },
  {
    key: "B",
    name: "Single vs. Pool Mode Toggle",
    summary:
      "Interactive [1 Worker] / [Worker Pool (N=2..4)] mode switcher that parameterizes all 5 steps & agentctl targets live",
  },
  {
    key: "C",
    name: "5 Steps + Pool Scaling Console",
    summary:
      "Keeps the 5 setup steps compact + adds a dedicated v0.4.0 Worker Pool Console card with topology & 4 operation tabs",
  },
  {
    key: "D",
    name: "Timeline + Dual-Tab Step 4",
    summary:
      "6-step timeline with visual Pool strip (agent..agent-N) + [manage-pool Skill] vs. [Direct CLI] tabs in Step 4",
  },
];

interface PrototypeVariantContextValue {
  variant: PrototypeVariantKey;
  setVariant: (next: PrototypeVariantKey) => void;
}

const PrototypeVariantContext = createContext<PrototypeVariantContextValue>({
  variant: "A",
  setVariant: () => {},
});

export function usePrototypeVariant() {
  return useContext(PrototypeVariantContext);
}

function isVariantKey(val: string | null): val is PrototypeVariantKey {
  return val === "A" || val === "B" || val === "C" || val === "D";
}

function SearchParamsSync({
  onSync,
}: {
  onSync: (v: PrototypeVariantKey) => void;
}) {
  const searchParams = useSearchParams();
  const raw = searchParams.get("variant")?.toUpperCase() ?? null;

  useEffect(() => {
    if (isVariantKey(raw)) {
      onSync(raw);
    } else {
      onSync("A");
    }
  }, [raw, onSync]);

  return null;
}

function VariantUpdaterInner({
  children,
  variant,
  setVariantState,
}: {
  children: React.ReactNode;
  variant: PrototypeVariantKey;
  setVariantState: (v: PrototypeVariantKey) => void;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const setVariant = useCallback(
    (next: PrototypeVariantKey) => {
      setVariantState(next);
      const params = new URLSearchParams(searchParams.toString());
      params.set("variant", next);
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams, setVariantState]
  );

  return (
    <PrototypeVariantContext.Provider value={{ variant, setVariant }}>
      {children}
    </PrototypeVariantContext.Provider>
  );
}

export function PrototypeVariantProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [variant, setVariantState] = useState<PrototypeVariantKey>("A");
  const router = useRouter();
  const pathname = usePathname();

  const setVariantFallback = useCallback(
    (next: PrototypeVariantKey) => {
      setVariantState(next);
      router.replace(`${pathname}?variant=${next}`, { scroll: false });
    },
    [pathname, router]
  );

  return (
    <PrototypeVariantContext.Provider
      value={{ variant, setVariant: setVariantFallback }}
    >
      <Suspense fallback={null}>
        <SearchParamsSync onSync={setVariantState} />
      </Suspense>
      <Suspense fallback={children}>
        <VariantUpdaterInner
          variant={variant}
          setVariantState={setVariantState}
        >
          {children}
        </VariantUpdaterInner>
      </Suspense>
    </PrototypeVariantContext.Provider>
  );
}

export function PrototypeSwitcher() {
  const { variant, setVariant } = usePrototypeVariant();

  const currentIndex = PROTOTYPE_VARIANTS.findIndex((v) => v.key === variant);
  const currentMeta = PROTOTYPE_VARIANTS[currentIndex] ?? PROTOTYPE_VARIANTS[0];

  const cycle = useCallback(
    (delta: number) => {
      const len = PROTOTYPE_VARIANTS.length;
      const nextIndex = (currentIndex + delta + len) % len;
      setVariant(PROTOTYPE_VARIANTS[nextIndex].key);
    },
    [currentIndex, setVariant]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [cycle]);

  if (process.env.NODE_ENV === "production") {
    return null;
  }

  const jumpToQuickStart = () => {
    document
      .getElementById("quick-start")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div
      role="region"
      aria-label="UI Prototype Quick Start Variant Switcher"
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100vw-1.5rem)] max-w-2xl pointer-events-none"
    >
      <div className="pointer-events-auto rounded-2xl bg-slate-950/95 text-white border border-slate-700/90 shadow-2xl shadow-slate-950/50 backdrop-blur-md px-3.5 py-2.5 flex flex-col gap-1.5">
        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => cycle(-1)}
            aria-label="Previous Quick Start variant"
            className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-slate-200 border border-slate-700 transition-colors shrink-0"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 min-w-0 flex-1 justify-center">
            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-500/20 border border-blue-400/40 text-blue-300 font-mono text-[10px] font-bold uppercase tracking-wider shrink-0">
              <Boxes className="w-3 h-3" />
              PROTOTYPE
            </span>

            <div className="inline-flex items-center gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800 shrink-0">
              {PROTOTYPE_VARIANTS.map((item) => {
                const active = item.key === variant;
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setVariant(item.key)}
                    className={`px-2 py-0.5 rounded-md font-mono text-xs font-bold transition-all ${
                      active
                        ? "bg-blue-600 text-white shadow-xs"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {item.key}
                  </button>
                );
              })}
            </div>

            <span className="font-mono text-xs font-semibold text-slate-100 truncate">
              {currentMeta.key} ({currentMeta.name})
            </span>

            <button
              type="button"
              onClick={jumpToQuickStart}
              className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 font-mono text-[10px] shrink-0 transition-colors"
            >
              <span>#quick-start</span>
              <ArrowDown className="w-2.5 h-2.5" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => cycle(1)}
            aria-label="Next Quick Start variant"
            className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-slate-200 border border-slate-700 transition-colors shrink-0"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="text-[11px] font-mono text-slate-400 text-center truncate px-1">
          {currentMeta.summary}
        </div>
      </div>
    </div>
  );
}
