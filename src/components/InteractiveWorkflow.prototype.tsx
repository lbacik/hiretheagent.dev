"use client";

// PROTOTYPE (throwaway): variants of the Articles → Workflow separation and of
// the compact workflow frame (toolbar + diagram + caption as one unit).
// Switch with `?variant=` on `/`. A is the current production look.
// Round 2: the switcher cycles A, D and lighter D frame tones (D1–D4) only;
// B, C and E still work by URL.

import type { ReactNode } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import {
  ChevronRight,
  ExternalLink,
  Layers,
  Maximize2,
  Minimize2,
  Pause,
  Play,
  Sparkles,
} from "lucide-react";
import { PrototypeSwitcher } from "./PrototypeSwitcher";

export const WORKFLOW_VARIANTS = [
  { key: "A", name: "Current" },
  { key: "B", name: "Single card + labelled rule" },
  { key: "C", name: "Section heading + app window" },
  { key: "D", name: "Dark frame + ornament rule" },
  { key: "E", name: "Edge-attached tab & dock" },
  { key: "D1", name: "D · mist gray frame" },
  { key: "D2", name: "D · blue tint frame" },
  { key: "D3", name: "D · gradient frame" },
  { key: "D4", name: "D · mid slate frame" },
] as const;

export type WorkflowVariantKey = (typeof WORKFLOW_VARIANTS)[number]["key"];

const SWITCHER_KEYS: WorkflowVariantKey[] = ["A", "D", "D1", "D2", "D3", "D4"];

type Tone = "light" | "mid" | "dark";
type ToneFrameKey = "D" | "D1" | "D2" | "D3" | "D4";

// Outer frame per D tone; the inner panel stays #f6f8fb in all of them.
const FRAME_TONES: Record<ToneFrameKey, { tone: Tone; frame: string }> = {
  D: { tone: "dark", frame: "bg-slate-900 shadow-xl shadow-slate-900/15 ring-1 ring-slate-900/5" },
  D1: { tone: "light", frame: "bg-slate-200/90 shadow-soft ring-1 ring-slate-300/70" },
  D2: { tone: "light", frame: "bg-blue-100/70 shadow-soft ring-1 ring-blue-200" },
  D3: {
    tone: "light",
    frame: "bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 shadow-soft ring-1 ring-indigo-200/70",
  },
  D4: { tone: "mid", frame: "bg-slate-500 shadow-xl shadow-slate-900/10 ring-1 ring-slate-600/20" },
};

function isToneFrame(variant: WorkflowVariantKey): variant is ToneFrameKey {
  return variant in FRAME_TONES;
}

export function useWorkflowVariant(): WorkflowVariantKey {
  const value = useSearchParams().get("variant");
  if (process.env.NODE_ENV === "production") return "A";
  return WORKFLOW_VARIANTS.find((v) => v.key === value)?.key ?? "A";
}

export function WorkflowPrototypeSwitcher() {
  return <PrototypeSwitcher variants={WORKFLOW_VARIANTS.filter((v) => SWITCHER_KEYS.includes(v.key))} />;
}

/* ---------------------------------------------------------------------------
   Separator between the Articles row and the workflow panel
   --------------------------------------------------------------------------- */

export function WorkflowSeparator() {
  const variant = useWorkflowVariant();

  if (variant === "B") {
    return (
      <div className="my-6 sm:my-10 flex items-center gap-4" aria-hidden="true">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent to-slate-300" />
        <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-400">
          How it works
        </span>
        <div className="flex-1 h-px bg-gradient-to-l from-transparent to-slate-300" />
      </div>
    );
  }

  if (variant === "C") {
    return (
      <div className="pt-14 sm:pt-16 mb-8 sm:mb-10 border-t border-slate-200">
        <p className="text-xs font-mono font-semibold uppercase tracking-wider text-blue-600">
          Delivery workflow
        </p>
        <h2 className="mt-2 text-2xl sm:text-4xl font-extrabold font-display tracking-tight text-slate-950">
          From idea to merged change
        </h2>
        <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-xl mx-auto">
          Human-led planning, agent execution, human approval.
        </p>
      </div>
    );
  }

  if (isToneFrame(variant)) {
    return (
      <div className="my-10 sm:my-14 mx-auto w-full max-w-xs h-px bg-slate-300" aria-hidden="true" />
    );
  }

  if (variant === "E") {
    return <div className="my-10 sm:my-14 border-t-2 border-dashed border-slate-300" aria-hidden="true" />;
  }

  return null;
}

/* ---------------------------------------------------------------------------
   Compact (blueprint) workflow frame
   --------------------------------------------------------------------------- */

interface FrameProps {
  variant: Exclude<WorkflowVariantKey, "A">;
  diagramScale: "0.5x" | "1x";
  onSimulate: () => void;
  onInteractive: () => void;
  onToggleScale: () => void;
}

export function BlueprintFrame(props: FrameProps) {
  switch (props.variant) {
    case "B":
      return <SingleCard {...props} />;
    case "C":
      return <AppWindow {...props} />;
    case "E":
      return <EdgeAttached {...props} />;
    default:
      return <ToneFrame {...props} variant={props.variant} />;
  }
}

function scaleBadge(scale: "0.5x" | "1x") {
  return scale === "1x" ? "1.0x" : "0.5x";
}

function Diagram() {
  return (
    <Image
      src="/charts/workflow-en.svg"
      alt="Workflow — from idea to merged change"
      width={1680}
      height={850}
      className="w-full h-auto rounded-lg shadow-sm"
      priority
    />
  );
}

function Caption({ tone = "light" }: { tone?: Tone }) {
  return (
    <span
      className={`text-[11px] font-mono ${
        { dark: "text-slate-400", mid: "text-slate-100", light: "text-slate-600" }[tone]
      }`}
    >
      Dashed line: feedback path (
      <code
        className={`px-1 py-0.5 rounded ${
          {
            dark: "text-amber-300 bg-amber-400/10",
            mid: "text-amber-100 bg-amber-300/20",
            light: "text-amber-700 bg-amber-50",
          }[tone]
        }`}
      >
        Requested changes → rework
      </code>
      ).
    </span>
  );
}

function Title({
  tone = "light",
  tinted,
  badge,
  subtitle = "Human-led planning, agent execution, human approval.",
}: {
  tone?: Tone;
  tinted?: boolean; // light text on a coloured (non-white) frame
  badge: string;
  subtitle?: string;
}) {
  return (
    <div className="flex items-center gap-2.5 min-w-0">
      <div
        className={`w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 ${
          {
            dark: "bg-blue-500/15 border-blue-400/30 text-blue-300",
            mid: "bg-white/15 border-white/25 text-white",
            light: tinted ? "bg-white border-blue-200 text-blue-600" : "bg-blue-50 border-blue-200 text-blue-600",
          }[tone]
        }`}
      >
        <Layers className="w-4 h-4" />
      </div>
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <span
            className={`font-display font-bold text-xs sm:text-sm ${tone === "light" ? "text-slate-900" : "text-white"}`}
          >
            Delivery Workflow
          </span>
          <span
            className={`text-[10px] font-mono px-2 py-0.5 rounded-full border uppercase font-semibold ${
              {
                dark: "bg-slate-800 text-slate-400 border-slate-700",
                mid: "bg-white/15 text-white border-white/25",
                light: tinted
                  ? "bg-white/80 text-slate-600 border-slate-300/70"
                  : "bg-slate-100 text-slate-600 border-slate-200",
              }[tone]
            }`}
          >
            {badge}
          </span>
        </div>
        <p
          className={`text-[11px] font-mono hidden sm:block ${
            { dark: "text-slate-400", mid: "text-slate-100", light: tinted ? "text-slate-600" : "text-slate-500" }[tone]
          }`}
        >
          {subtitle}
        </p>
      </div>
    </div>
  );
}

function Actions({
  tone = "light",
  showExternal = true,
  diagramScale,
  onSimulate,
  onInteractive,
  onToggleScale,
}: Omit<FrameProps, "variant"> & { tone?: Tone; showExternal?: boolean }) {
  return (
    <div className="flex items-center gap-2 text-xs font-mono">
      <button
        type="button"
        onClick={onSimulate}
        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold shadow-md active:scale-95 cursor-pointer whitespace-nowrap"
      >
        <Play className="w-3.5 h-3.5 fill-current" />
        <span>Simulate</span>
      </button>
      <button
        type="button"
        onClick={onInteractive}
        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-sm active:scale-95 cursor-pointer whitespace-nowrap"
      >
        <Sparkles className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Interactive Mode</span>
        <span className="sm:hidden">Interactive</span>
        <ChevronRight className="w-3 h-3 ml-0.5 opacity-80" />
      </button>
      <button
        type="button"
        onClick={onToggleScale}
        className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border font-bold shadow-sm cursor-pointer ${
          tone === "dark"
            ? "bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700"
            : tone === "mid"
            ? "bg-white/15 hover:bg-white/25 text-white border-white/25"
            : diagramScale === "1x"
            ? "bg-slate-900 text-white border-slate-900 hover:bg-slate-800"
            : "bg-white hover:bg-slate-50 text-slate-700 border-slate-300 hover:border-slate-400"
        }`}
        title={diagramScale === "1x" ? "Scale down diagram (0.5x)" : "Enlarge diagram (1x)"}
      >
        {diagramScale === "1x" ? (
          <>
            <Minimize2 className="w-3.5 h-3.5 opacity-70" />
            <span>x0.5</span>
          </>
        ) : (
          <>
            <Maximize2
              className={`w-3.5 h-3.5 ${{ dark: "text-blue-300", mid: "text-blue-100", light: "text-blue-600" }[tone]}`}
            />
            <span>x1</span>
          </>
        )}
      </button>
      {showExternal && (
        <a
          href="/charts/workflow-en.svg"
          target="_blank"
          rel="noopener noreferrer"
          className={`p-1.5 transition-colors hidden sm:inline-flex ${
            {
              dark: "text-slate-500 hover:text-blue-300",
              mid: "text-slate-200 hover:text-white",
              light: "text-slate-500 hover:text-blue-600",
            }[tone]
          }`}
          title="Open raw vector SVG in new tab"
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      )}
    </div>
  );
}

/* B: one card, three bands (header / diagram / caption) separated by hairlines. */
function SingleCard(props: FrameProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-soft overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-5 sm:py-4">
        <Title badge={scaleBadge(props.diagramScale)} />
        <div className="ml-auto">
          <Actions {...props} />
        </div>
      </div>
      <div className="bg-[#f6f8fb] border-y border-slate-200/80 p-3 sm:p-4">
        <Diagram />
      </div>
      <div className="px-4 sm:px-5 py-2.5 bg-white">
        <Caption />
      </div>
    </div>
  );
}

/* C: title lives in a real section heading above; the panel is an app window
   (same chrome as the stage mock-ups in Interactive Mode), actions in its footer. */
function AppWindow(props: FrameProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-soft overflow-hidden">
      <div className="flex items-center gap-3 px-4 py-2.5 bg-slate-100/90 border-b border-slate-200">
        <div className="flex gap-1.5 shrink-0">
          <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
        </div>
        <span className="flex-1 text-center text-[11px] font-mono font-semibold text-slate-600 truncate">
          workflow-en.svg · architecture diagram ({props.diagramScale === "1x" ? "1.0x" : "0.5x"})
        </span>
        <a
          href="/charts/workflow-en.svg"
          target="_blank"
          rel="noopener noreferrer"
          className="text-slate-400 hover:text-blue-600 transition-colors"
          title="Open raw vector SVG in new tab"
        >
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
      <div className="bg-[#f6f8fb] p-3 sm:p-4">
        <Diagram />
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3 border-t border-slate-200 bg-white">
        <Caption />
        <Actions {...props} showExternal={false} />
      </div>
    </div>
  );
}

/* D family: everything sits on one coloured surface; the diagram is an inset
   light screen. FRAME_TONES decides the surface colour. */
function ToneFrame(props: FrameProps & { variant: ToneFrameKey }) {
  const { tone, frame } = FRAME_TONES[props.variant];
  return (
    <div className={`rounded-3xl p-2 sm:p-2.5 ${frame}`}>
      <div className="flex flex-wrap items-center justify-between gap-3 px-2.5 py-2 sm:px-3 sm:py-2.5">
        <Title tone={tone} tinted badge={scaleBadge(props.diagramScale)} />
        <div className="ml-auto">
          <Actions tone={tone} {...props} />
        </div>
      </div>
      <div className="rounded-2xl bg-[#f6f8fb] ring-1 ring-slate-900/5 p-2 sm:p-3">
        <Diagram />
      </div>
      <div className="px-2.5 sm:px-3 pt-2.5 pb-1.5">
        <Caption tone={tone} />
      </div>
    </div>
  );
}

/* E: the diagram card is the only box; title is a tab on its top edge and the
   actions are a dock straddling its bottom edge. */
function EdgeAttached(props: FrameProps) {
  return (
    <div className="pt-4 pb-6">
      <div className="relative bg-white rounded-2xl border border-slate-200/90 shadow-soft px-3 sm:px-4 pt-9 pb-10">
        <div className="absolute -top-4 left-4 sm:left-5 inline-flex items-center gap-2 bg-white border border-slate-200 rounded-full pl-1.5 pr-3 py-1 shadow-sm">
          <span className="w-6 h-6 rounded-full bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center">
            <Layers className="w-3.5 h-3.5" />
          </span>
          <span className="font-display font-bold text-slate-900 text-xs sm:text-sm">Delivery Workflow</span>
          <span className="text-[10px] font-mono text-slate-500 hidden sm:inline">
            · idea → merged change
          </span>
        </div>
        <div className="rounded-xl bg-[#f6f8fb] p-2">
          <Diagram />
        </div>
        <div className="mt-2.5 px-1">
          <Caption />
        </div>
        <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 bg-white border border-slate-200 rounded-2xl p-1.5 shadow-md">
          <Actions {...props} showExternal={false} />
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------------
   Interactive (1.0x) workflow frame: same chrome per variant, wrapping the
   existing stepper + deep-dive pane passed as children.
   --------------------------------------------------------------------------- */

interface InteractiveFrameProps {
  variant: WorkflowVariantKey;
  isPlaying: boolean;
  isHUDOpen: boolean;
  onToggleSimulation: () => void;
  onOpenHUD: () => void;
  onCompact: () => void;
  children: ReactNode;
}

const INTERACTIVE_SUBTITLE = "Click stages to inspect details or simulate the autonomous feedback loop.";

export function InteractiveFrame({ variant, children, ...props }: InteractiveFrameProps) {
  switch (variant) {
    case "A":
      return <>{children}</>;
    case "B":
      return (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-soft overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-5 sm:py-4">
            <Title badge="Interactive · 1.0x" subtitle={INTERACTIVE_SUBTITLE} />
            <div className="ml-auto">
              <InteractiveActions {...props} />
            </div>
          </div>
          <div className="bg-[#f6f8fb] border-t border-slate-200/80 p-3 sm:p-5">{children}</div>
        </div>
      );
    case "C":
      return (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-soft overflow-hidden">
          <div className="flex flex-wrap items-center gap-3 px-4 py-2 bg-slate-100/90 border-b border-slate-200">
            <div className="flex gap-1.5 shrink-0">
              <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            </div>
            <span className="flex-1 text-[11px] font-mono font-semibold text-slate-600 truncate">
              delivery-workflow · interactive mode (1.0x)
            </span>
            <InteractiveActions {...props} />
          </div>
          <div className="bg-[#f6f8fb] p-3 sm:p-5">{children}</div>
        </div>
      );
    case "D":
    case "D1":
    case "D2":
    case "D3":
    case "D4": {
      const { tone, frame } = FRAME_TONES[variant];
      return (
        <div className={`rounded-3xl p-2 sm:p-2.5 ${frame}`}>
          <div className="flex flex-wrap items-center justify-between gap-3 px-2.5 py-2 sm:px-3 sm:py-2.5">
            <Title tone={tone} tinted badge="Interactive · 1.0x" subtitle={INTERACTIVE_SUBTITLE} />
            <div className="ml-auto">
              <InteractiveActions tone={tone} {...props} />
            </div>
          </div>
          <div className="rounded-2xl bg-[#f6f8fb] ring-1 ring-slate-900/5 p-3 sm:p-4">{children}</div>
        </div>
      );
    }
    case "E":
      // Pane is tall, so the dock sits on the top edge (right) instead of the bottom.
      return (
        <div className="pt-5">
          <div className="relative bg-white rounded-2xl border border-slate-200/90 shadow-soft px-3 sm:px-4 pt-12 pb-4">
            <div className="absolute -top-4 left-4 sm:left-5 inline-flex items-center gap-2 bg-white border border-slate-200 rounded-full pl-1.5 pr-3 py-1 shadow-sm">
              <span className="w-6 h-6 rounded-full bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center">
                <Layers className="w-3.5 h-3.5" />
              </span>
              <span className="font-display font-bold text-slate-900 text-sm hidden sm:inline">Delivery Workflow</span>
              <span className="text-[10px] font-mono text-slate-500 hidden sm:inline">· interactive</span>
            </div>
            <div className="absolute -top-5 right-4 sm:right-5 bg-white border border-slate-200 rounded-2xl p-1.5 shadow-md">
              <InteractiveActions {...props} />
            </div>
            {children}
          </div>
        </div>
      );
  }
}

function InteractiveActions({
  tone = "light",
  isPlaying,
  isHUDOpen,
  onToggleSimulation,
  onOpenHUD,
  onCompact,
}: Omit<InteractiveFrameProps, "variant" | "children"> & { tone?: Tone }) {
  return (
    <div className="flex items-center gap-2 text-xs font-mono">
      <button
        type="button"
        onClick={onToggleSimulation}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-bold shadow-sm cursor-pointer whitespace-nowrap ${
          isPlaying
            ? tone === "light"
              ? "bg-amber-50 border-amber-300 text-amber-800 hover:bg-amber-100"
              : "bg-amber-400/20 border-amber-300/50 text-amber-100 hover:bg-amber-400/30"
            : "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white border-transparent shadow-md"
        }`}
      >
        {isPlaying ? (
          <>
            <Pause className="w-3.5 h-3.5 fill-current" />
            <span>Pause</span>
          </>
        ) : (
          <>
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Simulate</span>
          </>
        )}
      </button>
      {!isHUDOpen && (
        <button
          type="button"
          onClick={onOpenHUD}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-semibold cursor-pointer whitespace-nowrap ${
            {
              dark: "bg-blue-500/15 border-blue-400/30 text-blue-200 hover:bg-blue-500/25",
              mid: "bg-white/15 border-white/25 text-white hover:bg-white/25",
              light: "bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200",
            }[tone]
          }`}
          title="Open narration & animation player"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Voice &amp; HUD</span>
        </button>
      )}
      <button
        type="button"
        onClick={onCompact}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-semibold cursor-pointer whitespace-nowrap ${
          {
            dark: "bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700",
            mid: "bg-white/15 hover:bg-white/25 text-white border-white/25",
            light: "bg-white hover:bg-slate-50 text-slate-700 border-slate-300 hover:border-slate-400",
          }[tone]
        }`}
        title="Collapse to compact diagram (0.5x size)"
      >
        <Minimize2 className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Compact Diagram</span>
        <span className="sm:hidden">0.5x</span>
      </button>
    </div>
  );
}
