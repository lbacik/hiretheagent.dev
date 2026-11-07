"use client";

// Agent Dashboard (BETA) section based on layout C:
// - 3-pillar feature cards
// - Scroll-snap filmstrip screenshot carousel with 4 switchable container color themes (A, B, C, D)
// - Vertical Docker Compose setup steps matching the QuickStart timeline layout.

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Activity,
  BarChart3,
  Check,
  ChevronLeft,
  ChevronRight,
  Copy,
  ExternalLink,
  ShieldCheck,
  Sliders,
  X,
} from "lucide-react";
import {
  type PrototypeVariantKey,
  usePrototypeVariant,
} from "./PrototypeSwitcher";

const DASHBOARD_REPO_URL = "https://github.com/lbacik/agent-dashboard";

export interface DashboardSlide {
  id: string;
  code: string;
  title: string;
  shortTitle: string;
  src: string;
  width: number;
  height: number;
  caption: string;
}

export const DASHBOARD_SLIDES: DashboardSlide[] = [
  {
    id: "fleet-overview",
    code: "01 // FLEET OVERVIEW",
    title: "Fleet Overview & Cost Analytics",
    shortTitle: "Fleet Overview",
    src: "/assets/dashboard/fleet-overview.png",
    width: 2358,
    height: 1752,
    caption:
      "Collapsible /overview panel charting attempt outcomes (complete, incomplete, handoff, other) and USD cost per instance across 24h / 7d / 30d / 90d / All presets plus a 90-day activity strip.",
  },
  {
    id: "operations-matrix",
    code: "02 // OPERATIONS MATRIX",
    title: "Real-Time Operations Matrix",
    shortTitle: "Operations Matrix",
    src: "/assets/dashboard/operations-matrix.png",
    width: 2342,
    height: 1034,
    caption:
      "Automatic container discovery by image label with live telemetry polling via docker exec <container> agentctl telemetry --json. Filter instant tiles for Online Units, Operator Alerts, Active Executions, and Offline Units.",
  },
  {
    id: "unit-cockpit",
    code: "03 // UNIT COCKPIT",
    title: "Unit Cockpit & 2-Step Control Console",
    shortTitle: "Unit Cockpit",
    src: "/assets/dashboard/unit-cockpit.png",
    width: 2344,
    height: 1676,
    caption:
      "Per-instance drill-down pairing the 2-step Control Console (stop, stop --after N, resume, handoff now, next issue <n>) with live tool execution activity, intake status, and current/last attempt telemetry.",
  },
  {
    id: "attempt-progress",
    code: "04 // ATTEMPT PROGRESS",
    title: "Attempt Progress & Offline Evidence Log",
    shortTitle: "Attempt Progress",
    src: "/assets/dashboard/attempt-progress.png",
    width: 2338,
    height: 1340,
    caption:
      "Plots turns and token budget over elapsed time against the configured soft threshold, hard ceiling, and timeout — above a server-paged event stream with inline Evidence file previews and downloads.",
  },
];

const DOCKER_GID_CODE = `docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \\
  alpine stat -c %g /var/run/docker.sock`;

const DOCKER_QUICK_START_CODE = `git clone https://github.com/lbacik/agent-dashboard.git
cd agent-dashboard
cp .env.example .env   # edit: DOCKER_GID, DASHBOARD_BIND, AGENT_DASHBOARD_ALLOWED_HOSTS
docker compose build
docker compose up -d`;

const DOCKER_LAN_OVERLAY_CODE = `docker compose up -d
docker compose logs dashboard
docker compose exec dashboard agent-dashboard account add alice \\
  --role controller --url https://dashboard.example.lan`;

interface CarouselTheme {
  wrapper: string;
  pillActive: string;
  pillInactive: string;
  hintText: string;
  cardBase: string;
  cardActive: string;
  cardInactive: string;
  cardHeader: string;
  cardCode: string;
  cardTitle: string;
  imageStageBg: string;
  cardCaption: string;
}

const CAROUSEL_THEMES: Record<PrototypeVariantKey, CarouselTheme> = {
  // Variant A: Light Blueprint Card (native white/slate card matching QuickStart & Roadmap)
  A: {
    wrapper:
      "rounded-2xl bg-white/95 p-4 sm:p-6 border border-slate-200/90 shadow-lg shadow-slate-900/5",
    pillActive: "bg-blue-600 text-white font-bold shadow-xs",
    pillInactive:
      "bg-slate-100 text-slate-700 hover:bg-slate-200/80 border border-slate-200/80",
    hintText: "text-slate-500",
    cardBase: "bg-slate-50",
    cardActive: "border-blue-500 shadow-md ring-2 ring-blue-500/15",
    cardInactive: "border-slate-200/90 opacity-85 hover:opacity-100",
    cardHeader: "bg-slate-100/90 border-b border-slate-200/90",
    cardCode: "text-blue-700 font-bold",
    cardTitle: "text-slate-700",
    imageStageBg: "bg-white",
    cardCaption:
      "bg-white border-t border-slate-200/80 text-slate-600",
  },
  // Variant B: Soft Blue-Indigo Studio (blueprint tint with deep navy slide header)
  B: {
    wrapper:
      "rounded-2xl bg-gradient-to-br from-blue-50/90 via-indigo-50/60 to-slate-100/90 p-4 sm:p-6 border border-blue-200/90 shadow-lg shadow-blue-900/5",
    pillActive: "bg-blue-600 text-white font-bold shadow-xs",
    pillInactive:
      "bg-white/90 text-slate-700 hover:bg-white border border-blue-200/80",
    hintText: "text-blue-800/75",
    cardBase: "bg-white",
    cardActive:
      "border-blue-600 shadow-lg shadow-blue-600/10 ring-2 ring-blue-500/20",
    cardInactive: "border-blue-200/80 opacity-85 hover:opacity-100",
    cardHeader: "bg-blue-950 border-b border-blue-900",
    cardCode: "text-emerald-300 font-bold",
    cardTitle: "text-blue-100",
    imageStageBg: "bg-slate-50",
    cardCaption:
      "bg-white border-t border-blue-100 text-slate-600",
  },
  // Variant C: Emerald-Teal Beta Accent (matches the BETA READY emerald theme)
  C: {
    wrapper:
      "rounded-2xl bg-gradient-to-br from-emerald-50/85 via-teal-50/50 to-slate-100/80 p-4 sm:p-6 border border-emerald-200/90 shadow-lg shadow-emerald-900/5",
    pillActive: "bg-emerald-600 text-white font-bold shadow-xs",
    pillInactive:
      "bg-white/90 text-emerald-950 hover:bg-white border border-emerald-200/80",
    hintText: "text-emerald-800/80",
    cardBase: "bg-white",
    cardActive:
      "border-emerald-600 shadow-lg shadow-emerald-600/10 ring-2 ring-emerald-500/20",
    cardInactive: "border-emerald-200/80 opacity-85 hover:opacity-100",
    cardHeader: "bg-emerald-950 border-b border-emerald-900",
    cardCode: "text-emerald-300 font-bold",
    cardTitle: "text-emerald-50",
    imageStageBg: "bg-slate-50",
    cardCaption:
      "bg-white border-t border-emerald-100 text-slate-600",
  },
  // Variant D: Dark Slate-900 Contrast (original C dark container)
  D: {
    wrapper:
      "rounded-2xl bg-slate-900 p-4 sm:p-6 border border-slate-800 shadow-xl",
    pillActive: "bg-blue-600 text-white font-bold shadow-xs",
    pillInactive: "bg-slate-800 text-slate-300 hover:bg-slate-700",
    hintText: "text-slate-400",
    cardBase: "bg-slate-950",
    cardActive: "border-blue-500 shadow-lg",
    cardInactive: "border-slate-800 opacity-80 hover:opacity-100",
    cardHeader: "bg-slate-900 border-b border-slate-800",
    cardCode: "text-emerald-400 font-bold",
    cardTitle: "text-slate-300",
    imageStageBg: "bg-slate-100",
    cardCaption: "bg-slate-950 text-slate-300",
  },
};

function GithubIcon({
  className = "w-3.5 h-3.5 fill-current",
}: {
  className?: string;
}) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function InlineCode({ children }: { children: React.ReactNode }) {
  return (
    <code className="font-mono text-[0.9em] text-slate-900 bg-slate-100 px-1 py-px rounded border border-slate-200 break-all">
      {children}
    </code>
  );
}

function CodeBlock({
  code,
  tone = "dark",
}: {
  code: string;
  tone?: "dark" | "light";
}) {
  const [copied, setCopied] = useState(false);
  const dark = tone === "dark";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      const area = document.createElement("textarea");
      area.value = code;
      document.body.appendChild(area);
      area.select();
      document.execCommand("copy");
      document.body.removeChild(area);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div
      className={`relative rounded-xl border text-left ${
        dark
          ? "bg-slate-950 border-slate-800 text-slate-100"
          : "bg-amber-50/60 border-amber-200/70 text-slate-800"
      }`}
    >
      <pre className="overflow-x-auto px-4 py-3 pr-12 text-xs sm:text-[13px] leading-relaxed font-mono">
        <code className="whitespace-pre">{code}</code>
      </pre>
      <button
        type="button"
        onClick={handleCopy}
        aria-label={copied ? "Copied to clipboard" : "Copy to clipboard"}
        className={`absolute top-2 right-2 p-1.5 rounded-md border transition-colors ${
          dark
            ? "border-slate-700 bg-slate-900 text-slate-400 hover:text-white hover:border-slate-500"
            : "border-slate-200 bg-white text-slate-500 hover:text-blue-600 hover:border-blue-300"
        }`}
      >
        {copied ? (
          <Check className="w-3.5 h-3.5 text-emerald-500" />
        ) : (
          <Copy className="w-3.5 h-3.5" />
        )}
      </button>
    </div>
  );
}

function Step({
  number,
  title,
  explanation,
  commands,
}: {
  number: number;
  title: string;
  explanation: React.ReactNode;
  commands: React.ReactNode;
}) {
  return (
    <li className="relative pl-12 sm:pl-16 pb-10 last:pb-0">
      <span
        aria-hidden="true"
        className="absolute left-0 top-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-600 text-white font-mono font-bold text-sm flex items-center justify-center shadow-md shadow-blue-600/30"
      >
        {number}
      </span>
      <div className="grid gap-4 lg:grid-cols-2 lg:gap-8">
        <div className="min-w-0">
          <h3 className="font-display font-bold text-lg text-slate-950">
            {title}
          </h3>
          <div className="mt-2 text-sm text-slate-600 leading-relaxed space-y-2">
            {explanation}
          </div>
        </div>
        <div className="min-w-0 space-y-3">{commands}</div>
      </div>
    </li>
  );
}

function SlideLightbox({
  slide,
  onClose,
  onPrev,
  onNext,
}: {
  slide: DashboardSlide | null;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  useEffect(() => {
    if (!slide) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [slide, onClose]);

  if (!slide) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={slide.title}
      className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8"
      onClick={onClose}
    >
      <div
        className="relative max-w-6xl w-full bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-950 text-white">
          <div className="flex items-center gap-2 min-w-0">
            <span className="font-mono text-xs text-emerald-400 font-bold">
              {slide.code}
            </span>
            <span className="text-slate-600">·</span>
            <span className="font-display font-bold text-sm truncate">
              {slide.title}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={onPrev}
              aria-label="Previous screenshot"
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onNext}
              aria-label="Next screenshot"
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close preview"
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-600 text-slate-200 hover:text-white transition-colors ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="bg-slate-950 p-2 sm:p-4 max-h-[78vh] overflow-auto flex items-start justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={slide.src}
            alt={slide.title}
            width={slide.width}
            height={slide.height}
            className="w-full h-auto rounded-lg border border-slate-800"
          />
        </div>
        <div className="px-4 py-3 bg-slate-900 border-t border-slate-800 text-xs text-slate-300 font-sans text-left">
          {slide.caption}
        </div>
      </div>
    </div>
  );
}

export function AgentDashboardSection() {
  const { variant } = usePrototypeVariant();
  const theme = CAROUSEL_THEMES[variant] ?? CAROUSEL_THEMES.A;

  const [activeIdx, setActiveIdx] = useState(0);
  const [lightboxSlide, setLightboxSlide] = useState<DashboardSlide | null>(
    null
  );
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollToSlide = (idx: number) => {
    setActiveIdx(idx);
    const container = trackRef.current;
    if (!container) return;
    const child = container.children[idx] as HTMLElement | undefined;
    if (child) {
      child.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  };

  return (
    <section
      id="dashboard"
      className="mt-20 sm:mt-28 max-w-5xl mx-auto scroll-mt-28 text-left"
    >
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600 text-white text-xs font-mono font-bold mb-3 shadow-sm">
            <Activity className="w-3.5 h-3.5" />
            <span>NEW IN BETA • AGENT DASHBOARD</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold font-display tracking-tight text-slate-950">
            Observe &amp; command your agent fleet
          </h2>
        </div>
        <Link
          href={DASHBOARD_REPO_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-300 hover:border-blue-500 text-slate-900 hover:text-blue-600 font-mono text-xs font-bold shadow-xs transition-all self-start md:self-auto"
        >
          <GithubIcon className="w-4 h-4 fill-current" />
          <span>lbacik/agent-dashboard</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* 3-Pillar Bento Top Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="rounded-2xl bg-white border border-slate-200/90 p-5 shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center mb-3">
            <BarChart3 className="w-4 h-4" />
          </div>
          <h3 className="font-mono font-bold text-sm text-slate-900">
            1. Fleet Overview &amp; Costs
          </h3>
          <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
            Discovers containers by image label, polls{" "}
            <code className="font-mono text-[11px] bg-slate-100 px-1 rounded">
              agentctl telemetry --json
            </code>
            , and charts outcomes &amp; USD cost across{" "}
            <code className="font-mono text-[11px] bg-slate-100 px-1 rounded">
              24h–90d
            </code>{" "}
            ranges.
          </p>
        </div>

        <div className="rounded-2xl bg-white border border-slate-200/90 p-5 shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mb-3">
            <Sliders className="w-4 h-4" />
          </div>
          <h3 className="font-mono font-bold text-sm text-slate-900">
            2. Two-Step Control &amp; Audit
          </h3>
          <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
            Review &amp; confirm{" "}
            <code className="font-mono text-[11px] bg-slate-100 px-1 rounded">
              stop
            </code>
            ,{" "}
            <code className="font-mono text-[11px] bg-slate-100 px-1 rounded">
              resume
            </code>
            ,{" "}
            <code className="font-mono text-[11px] bg-slate-100 px-1 rounded">
              handoff now
            </code>
            , and{" "}
            <code className="font-mono text-[11px] bg-slate-100 px-1 rounded">
              next issue &lt;n&gt;
            </code>{" "}
            with idempotent request IDs and{" "}
            <code className="font-mono text-[11px] bg-slate-100 px-1 rounded">
              control-audit.jsonl
            </code>
            .
          </p>
        </div>

        <div className="rounded-2xl bg-white border border-slate-200/90 p-5 shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center mb-3">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <h3 className="font-mono font-bold text-sm text-slate-900">
            3. Stopped Logs &amp; LAN Mode
          </h3>
          <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
            Reads stopped container logs &amp; evidence via{" "}
            <code className="font-mono text-[11px] bg-slate-100 px-1 rounded">
              docker cp
            </code>
            . Optional LAN mode adds{" "}
            <code className="font-mono text-[11px] bg-slate-100 px-1 rounded">
              viewer
            </code>{" "}
            /{" "}
            <code className="font-mono text-[11px] bg-slate-100 px-1 rounded">
              controller
            </code>{" "}
            Operator accounts.
          </p>
        </div>
      </div>

      {/* Horizontal Scroll-Snap Filmstrip Carousel (Themed via ?variant=A|B|C|D) */}
      <div className={theme.wrapper}>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2 flex-wrap">
            {DASHBOARD_SLIDES.map((s, idx) => (
              <button
                key={s.id}
                type="button"
                onClick={() => scrollToSlide(idx)}
                className={`px-3 py-1 rounded-full font-mono text-xs transition-all ${
                  activeIdx === idx ? theme.pillActive : theme.pillInactive
                }`}
              >
                0{idx + 1}. {s.shortTitle}
              </button>
            ))}
          </div>
          <span className={`text-[11px] font-mono ${theme.hintText}`}>
            Click any screen to zoom
          </span>
        </div>

        <div
          ref={trackRef}
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-3 scrollbar-thin"
        >
          {DASHBOARD_SLIDES.map((s, idx) => (
            <div
              key={s.id}
              onClick={() => {
                setActiveIdx(idx);
                setLightboxSlide(s);
              }}
              className={`snap-center shrink-0 w-[88%] sm:w-[78%] rounded-xl overflow-hidden border transition-all cursor-zoom-in flex flex-col ${
                theme.cardBase
              } ${activeIdx === idx ? theme.cardActive : theme.cardInactive}`}
            >
              <div
                className={`px-3.5 py-2 flex items-center justify-between text-xs font-mono ${theme.cardHeader}`}
              >
                <span className={theme.cardCode}>{s.code}</span>
                <span className={`truncate ml-2 ${theme.cardTitle}`}>
                  {s.title}
                </span>
              </div>
              <div
                className={`aspect-[16/10] flex items-start justify-center overflow-hidden ${theme.imageStageBg}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={s.src}
                  alt={s.title}
                  width={s.width}
                  height={s.height}
                  className="w-full h-full object-contain object-top"
                />
              </div>
              <div
                className={`p-3.5 text-xs leading-relaxed ${theme.cardCaption}`}
              >
                {s.caption}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Vertical Docker Compose Steps (matching QuickStart layout) */}
      <div className="mt-12 sm:mt-16">
        <div className="mb-8 sm:mb-10">
          <h3 className="text-xl sm:text-2xl font-extrabold font-display tracking-tight text-slate-950">
            Run in Docker Compose in 3 steps
          </h3>
          <p className="mt-2 text-sm text-slate-600 leading-relaxed">
            Deploys as the fixed Compose project{" "}
            <InlineCode>fleet-dashboard</InlineCode> from{" "}
            <a
              href={DASHBOARD_REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline font-mono inline-flex items-center gap-1"
            >
              lbacik/agent-dashboard <ExternalLink className="w-3.5 h-3.5" />
            </a>{" "}
            so it never collides with co-located agent containers.
          </p>
        </div>

        <ol className="relative before:absolute before:left-4 sm:before:left-5 before:top-2 before:bottom-2 before:w-px before:bg-slate-300">
          <Step
            number={1}
            title="Find your Docker socket GID"
            explanation={
              <>
                <p>
                  The container mounts{" "}
                  <InlineCode>/var/run/docker.sock</InlineCode> and runs as a
                  non-root user. <InlineCode>DOCKER_GID</InlineCode> in{" "}
                  <InlineCode>.env</InlineCode> must match the group ID owning
                  the socket on the daemon host.
                </p>
                <p>
                  When deploying through a remote Docker context (e.g. from a
                  laptop to a Raspberry Pi), read the GID through that same
                  context.
                </p>
              </>
            }
            commands={<CodeBlock code={DOCKER_GID_CODE} />}
          />

          <Step
            number={2}
            title="Build and start fleet-dashboard"
            explanation={
              <>
                <p>
                  Copy <InlineCode>.env.example</InlineCode> to{" "}
                  <InlineCode>.env</InlineCode> and set{" "}
                  <InlineCode>DOCKER_GID</InlineCode>,{" "}
                  <InlineCode>DASHBOARD_BIND</InlineCode> (defaults to{" "}
                  <InlineCode>127.0.0.1</InlineCode>), and{" "}
                  <InlineCode>AGENT_DASHBOARD_ALLOWED_HOSTS</InlineCode>.
                </p>
                <p>
                  No shared Docker network or exposed agent ports are needed:
                  the dashboard reaches agents through the mounted host socket.
                </p>
              </>
            }
            commands={<CodeBlock code={DOCKER_QUICK_START_CODE} />}
          />

          <Step
            number={3}
            title="Optional: Enable LAN mode & Operator accounts"
            explanation={
              <>
                <p>
                  With <InlineCode>docker-compose.yml</InlineCode> alone, the
                  container provides a read-only view. To unlock 2-step{" "}
                  <strong>Control actions</strong> over the network, enable the{" "}
                  <InlineCode>docker-compose.lan.yml</InlineCode> overlay
                  (requires Docker Compose 2.24+) behind a TLS reverse proxy and
                  create a <InlineCode>controller</InlineCode> Operator account.
                </p>
              </>
            }
            commands={
              <>
                <CodeBlock
                  tone="light"
                  code={
                    "COMPOSE_FILE=docker-compose.yml:docker-compose.lan.yml\nPROXY_NETWORK=proxy\nVIRTUAL_HOST=dashboard.example.lan\nAGENT_DASHBOARD_ALLOWED_HOSTS=dashboard.example.lan\nAGENT_DASHBOARD_TRUSTED_PROXIES=172.18.0.0/16"
                  }
                />
                <CodeBlock code={DOCKER_LAN_OVERLAY_CODE} />
              </>
            }
          />
        </ol>
      </div>

      <SlideLightbox
        slide={lightboxSlide}
        onClose={() => setLightboxSlide(null)}
        onPrev={() => {
          const idx = DASHBOARD_SLIDES.findIndex(
            (s) => s.id === lightboxSlide?.id
          );
          const next =
            (idx - 1 + DASHBOARD_SLIDES.length) % DASHBOARD_SLIDES.length;
          setLightboxSlide(DASHBOARD_SLIDES[next]);
        }}
        onNext={() => {
          const idx = DASHBOARD_SLIDES.findIndex(
            (s) => s.id === lightboxSlide?.id
          );
          const next = (idx + 1) % DASHBOARD_SLIDES.length;
          setLightboxSlide(DASHBOARD_SLIDES[next]);
        }}
      />
    </section>
  );
}
