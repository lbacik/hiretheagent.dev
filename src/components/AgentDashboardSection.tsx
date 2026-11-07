"use client";

// Agent Dashboard (BETA) section:
// - Scroll-snap filmstrip screenshot carousel (Delivery Workflow blue-tinted panel theme)
// - Vertical Docker Compose setup steps matching the QuickStart timeline layout.

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Activity,
  Check,
  Copy,
  ExternalLink,
  Pause,
  Play,
} from "lucide-react";

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

const DOCKER_LAN_ENV_CODE = `COMPOSE_FILE=docker-compose.yml:docker-compose.lan.yml
PROXY_NETWORK=proxy
VIRTUAL_HOST=dashboard.example.lan
AGENT_DASHBOARD_ALLOWED_HOSTS=dashboard.example.lan
AGENT_DASHBOARD_TRUSTED_PROXIES=172.18.0.0/16`;

const DOCKER_LAN_OVERLAY_CODE = `docker compose up -d
docker compose logs dashboard
docker compose exec dashboard agent-dashboard account add alice \\
  --role controller --url https://dashboard.example.lan`;

// Blue-tinted carousel theme matching the Delivery Workflow panel.
const THEME = {
  wrapper:
    "rounded-3xl bg-blue-100/70 ring-1 ring-blue-200 shadow-soft p-4 sm:p-6",
  pillActive: "bg-blue-600 text-white font-bold shadow-xs",
  pillInactive:
    "bg-white/80 text-slate-700 hover:bg-white border border-blue-200/80",
  cardBase: "bg-white",
  cardActive: "border-slate-200/90 shadow-sm",
  cardInactive: "border-slate-200/90 opacity-85 hover:opacity-100",
  cardHeader: "bg-slate-100/90 border-b border-slate-200",
  cardCode: "text-blue-700 font-bold",
  cardTitle: "text-slate-700",
  imageStageBg: "bg-[#f6f8fb]",
  cardCaption: "bg-white border-t border-slate-200/80 text-slate-600",
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

export function AgentDashboardSection() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollTrackTo = (idx: number) => {
    const container = trackRef.current;
    if (!container) return;
    const child = container.children[idx] as HTMLElement | undefined;
    if (!child) return;
    const targetLeft =
      child.offsetLeft - (container.clientWidth - child.clientWidth) / 2;
    container.scrollTo({
      left: Math.max(0, targetLeft),
      behavior: "smooth",
    });
  };

  const scrollToSlide = (idx: number) => {
    setActiveIdx(idx);
    scrollTrackTo(idx);
  };

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setTimeout(() => {
      const nextIdx = (activeIdx + 1) % DASHBOARD_SLIDES.length;
      setActiveIdx(nextIdx);
      scrollTrackTo(nextIdx);
    }, 5000);
    return () => clearTimeout(timer);
  }, [activeIdx, isPlaying]);

  return (
    <section
      id="dashboard"
      className="mt-20 sm:mt-28 max-w-5xl mx-auto scroll-mt-28 text-left rounded-3xl border border-slate-200/90 bg-white/60 p-6 sm:p-10 shadow-xs"
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

      {/* Horizontal Scroll-Snap Filmstrip Carousel */}
      <div className={THEME.wrapper}>
        <div className="relative flex items-center justify-center gap-2 flex-wrap mb-4">
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {DASHBOARD_SLIDES.map((s, idx) => (
              <button
                key={s.id}
                type="button"
                onClick={() => scrollToSlide(idx)}
                className={`px-3 py-1 rounded-full font-mono text-xs transition-all cursor-pointer ${
                  activeIdx === idx ? THEME.pillActive : THEME.pillInactive
                }`}
              >
                0{idx + 1}. {s.shortTitle}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setIsPlaying((prev) => !prev)}
            aria-label={isPlaying ? "Pause carousel" : "Play carousel"}
            title={isPlaying ? "Pause auto-play (5s)" : "Resume auto-play (5s)"}
            className="lg:absolute lg:right-0 inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-mono text-xs font-semibold transition-all cursor-pointer bg-white/80 text-slate-700 hover:bg-white border border-blue-200/80 shadow-2xs"
          >
            {isPlaying ? (
              <>
                <Pause className="w-3 h-3 fill-current text-blue-600" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3 h-3 fill-current text-emerald-600" />
                <span>Play</span>
              </>
            )}
          </button>
        </div>

        <div
          ref={trackRef}
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-3 scrollbar-thin"
        >
          {DASHBOARD_SLIDES.map((s, idx) => (
            <div
              key={s.id}
              onClick={() => scrollToSlide(idx)}
              className={`snap-center shrink-0 w-[88%] sm:w-[78%] rounded-xl overflow-hidden border transition-all cursor-pointer flex flex-col ${
                THEME.cardBase
              } ${activeIdx === idx ? THEME.cardActive : THEME.cardInactive}`}
            >
              <div
                className={`px-3.5 py-2 flex items-center justify-between text-xs font-mono ${THEME.cardHeader}`}
              >
                <span className={THEME.cardCode}>{s.code}</span>
                <span className={`truncate ml-2 ${THEME.cardTitle}`}>
                  {s.title}
                </span>
              </div>
              <div
                className={`aspect-[16/10] flex items-start justify-center overflow-hidden ${THEME.imageStageBg}`}
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
                className={`p-3.5 text-xs leading-relaxed ${THEME.cardCaption}`}
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
                <CodeBlock tone="light" code={DOCKER_LAN_ENV_CODE} />
                <CodeBlock code={DOCKER_LAN_OVERLAY_CODE} />
              </>
            }
          />
        </ol>
      </div>
    </section>
  );
}
