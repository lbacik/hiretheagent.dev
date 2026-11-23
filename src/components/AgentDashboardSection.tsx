"use client";

// Agent Dashboard (BETA) section:
// - Scroll-snap filmstrip screenshot carousel (Delivery Workflow blue-tinted panel theme)
// - Segmented tabs switching between the `deploy-dashboard` skill workflow
//   (agent-forge v0.5.0+) and "Under the Hood & Docker Compose" direct setup.

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Activity,
  Check,
  Copy,
  ExternalLink,
  Pause,
  Play,
  Terminal,
  Wand2,
  Wrench,
} from "lucide-react";

const DASHBOARD_REPO_URL = "https://github.com/lbacik/agent-dashboard";
const AGENT_FORGE_RELEASE_URL =
  "https://github.com/lbacik/agent-forge/releases/tag/v0.5.0";

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
    src: "/assets/dashboard/fleet-overview.webp",
    width: 1600,
    height: 1189,
    caption:
      "Collapsible /overview panel charting attempt outcomes (complete, incomplete, handoff, other) and USD cost per instance across 24h / 7d / 30d / 90d / All presets plus a 90-day activity strip.",
  },
  {
    id: "operations-matrix",
    code: "02 // OPERATIONS MATRIX",
    title: "Real-Time Operations Matrix",
    shortTitle: "Operations Matrix",
    src: "/assets/dashboard/operations-matrix.webp",
    width: 1600,
    height: 707,
    caption:
      "Automatic container discovery by image label with live telemetry polling via docker exec <container> agentctl telemetry --json. Filter instant tiles for Online Units, Operator Alerts, Active Executions, and Offline Units.",
  },
  {
    id: "unit-cockpit",
    code: "03 // UNIT COCKPIT",
    title: "Unit Cockpit & 2-Step Control Console",
    shortTitle: "Unit Cockpit",
    src: "/assets/dashboard/unit-cockpit.webp",
    width: 1600,
    height: 1145,
    caption:
      "Per-instance drill-down pairing the 2-step Control Console (stop, stop --after N, resume, handoff now, next issue <n>) with live tool execution activity, intake status, and current/last attempt telemetry.",
  },
  {
    id: "attempt-progress",
    code: "04 // ATTEMPT PROGRESS",
    title: "Attempt Progress & Offline Evidence Log",
    shortTitle: "Attempt Progress",
    src: "/assets/dashboard/attempt-progress.webp",
    width: 1600,
    height: 918,
    caption:
      "Plots turns and token budget over elapsed time against the configured soft threshold, hard ceiling, and timeout — above a server-paged event stream with inline Evidence file previews and downloads.",
  },
];

const SKILL_PROMPT_DEPLOY =
  "Use deploy-dashboard to deploy the dashboard on the rpi5 context.";

const SKILL_CLAUDE_DEPLOY = `cd agent-forge
claude "/deploy-dashboard deploy on the rpi5 context"`;

const SKILL_HELPER_FLOW = `h=.agents/skills/deploy-dashboard/scripts/dashboard.sh
$h --context rpi5 init --ref v0.5.0       # tunnel profile off orbstack, local on it
$h --context rpi5 up                      # config -q, then up -d --build --wait
$h --context rpi5 account add alice --role controller
$h --context rpi5 tunnel                  # prints ssh -L <port>:127.0.0.1:<port> <host>`;

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

interface AccessProfileRow {
  name: "local" | "tunnel" | "lan" | "readonly";
  target: string;
  authControl: string;
  url: string;
}

const ACCESS_PROFILES: AccessProfileRow[] = [
  {
    name: "local",
    target: "Local workstation daemon (default on orbstack)",
    authControl: "Sign-in ON • 2-Step Control ON",
    url: "http://localhost:<port>",
  },
  {
    name: "tunnel",
    target: "Remote host without TLS proxy (default off orbstack)",
    authControl: "Sign-in ON • 2-Step Control ON (via SSH)",
    url: "http://localhost:<local-port> (over ssh -L)",
  },
  {
    name: "lan",
    target: "Other LAN devices behind an existing TLS reverse proxy network",
    authControl: "Sign-in ON • 2-Step Control ON (via HTTPS)",
    url: "https://<virtual-host>",
  },
  {
    name: "readonly",
    target: "Trusted, isolated network (--bind <lan-ip> --host <names>)",
    authControl: "No sign-in • Control OFF",
    url: "http://<lan-ip>:<port>",
  },
];

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
  label,
}: {
  code: string;
  tone?: "dark" | "light";
  label?: string;
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
      {label && (
        <div
          className={`px-3.5 py-1.5 text-[11px] font-mono border-b flex items-center justify-between ${
            dark
              ? "border-slate-800 bg-slate-900/80 text-slate-400"
              : "border-amber-200/60 bg-amber-100/40 text-amber-900"
          }`}
        >
          <span>{label}</span>
        </div>
      )}
      <pre className="overflow-x-auto px-4 py-3 pr-12 text-xs sm:text-[13px] leading-relaxed font-mono">
        <code className="whitespace-pre">{code}</code>
      </pre>
      <button
        type="button"
        onClick={handleCopy}
        aria-label={copied ? "Copied to clipboard" : "Copy to clipboard"}
        className={`absolute ${label ? "top-8" : "top-2"} right-2 p-1.5 rounded-md border transition-colors cursor-pointer ${
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

interface CommandRow {
  command: string;
  description: React.ReactNode;
}

function CommandTable({ rows }: { rows: CommandRow[] }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden divide-y divide-slate-100 text-left">
      {rows.map((row) => (
        <div
          key={row.command}
          className="grid gap-1 px-4 py-2.5 sm:grid-cols-2 sm:gap-4"
        >
          <code className="font-mono text-xs break-all text-slate-900">
            {row.command}
          </code>
          <p className="text-xs leading-relaxed text-slate-600">
            {row.description}
          </p>
        </div>
      ))}
    </div>
  );
}

const SKILL_LIFECYCLE_ROWS: CommandRow[] = [
  {
    command: 'claude "/deploy-dashboard add a controller account alice on rpi5"',
    description: (
      <>
        Runs <InlineCode>account add alice --role controller</InlineCode> and
        prints a one-time Set-password link to your terminal.
      </>
    ),
  },
  {
    command: 'claude "/deploy-dashboard check dashboard status on rpi5"',
    description: (
      <>
        Verifies <InlineCode>/healthz</InlineCode>, Docker socket access,
        Operator accounts, and lists unlabelled legacy containers.
      </>
    ),
  },
  {
    command: 'claude "/deploy-dashboard upgrade rpi5 dashboard to v0.6.0"',
    description: (
      <>
        Updates <InlineCode>DASHBOARD_REF</InlineCode> and rebuilds while
        keeping <InlineCode>.env</InlineCode> and the{" "}
        <InlineCode>state</InlineCode> volume (accounts &amp; Control audit).
      </>
    ),
  },
  {
    command: 'claude "/deploy-dashboard how do I open the rpi5 dashboard?"',
    description: (
      <>
        Prints the operator URL and, for the <InlineCode>tunnel</InlineCode>{" "}
        profile, the exact <InlineCode>ssh -L</InlineCode> port-forwarding
        command.
      </>
    ),
  },
];

function Step({
  number,
  title,
  badge,
  explanation,
  commands,
}: {
  number: number;
  title: string;
  badge?: React.ReactNode;
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
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="font-display font-bold text-lg text-slate-950">
              {title}
            </h4>
            {badge}
          </div>
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
  const [activeTab, setActiveTab] = useState<"skill" | "details">("skill");
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollTrackTo = (idx: number) => {
    const container = trackRef.current;
    if (!container) return;
    const child = container.children[idx] as HTMLElement | undefined;
    if (!child) return;
    // Measure the slide against the track itself: offsetLeft is relative
    // to the nearest positioned ancestor (here <body>), which overshoots
    // and lets snap-mandatory land on the next slide.
    const childLeft =
      child.getBoundingClientRect().left -
      container.getBoundingClientRect().left -
      container.clientLeft +
      container.scrollLeft;
    const targetLeft =
      childLeft - (container.clientWidth - child.clientWidth) / 2;
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
                  loading={idx === 0 ? "eager" : "lazy"}
                  decoding="async"
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

      {/* Deployment & Management Section (Variant A: Timeline + Segmented Mode Tabs) */}
      <div id="dashboard-deploy" className="mt-12 sm:mt-16 scroll-mt-24">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-8 sm:mb-10 pb-6 border-b border-slate-200/90">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 font-mono text-[11px] font-semibold mb-2">
              <Wand2 className="w-3 h-3 text-amber-600" />
              <span>NEW IN AGENT-FORGE v0.5.0</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold font-display tracking-tight text-slate-950">
              Deploy &amp; manage per Docker context
            </h3>
            <p className="mt-1.5 text-sm text-slate-600 leading-relaxed max-w-2xl">
              Manage one <InlineCode>fleet-dashboard</InlineCode> per Docker
              context in <InlineCode>dashboards/&lt;context&gt;/</InlineCode>{" "}
              with the <InlineCode>deploy-dashboard</InlineCode> skill from{" "}
              <a
                href={AGENT_FORGE_RELEASE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline font-mono inline-flex items-center gap-1"
              >
                agent-forge v0.5.0+ <ExternalLink className="w-3 h-3" />
              </a>
              , or inspect the raw Docker Compose setup.
            </p>
          </div>

          <div
            role="tablist"
            aria-label="Dashboard deployment method"
            className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200 self-start lg:self-auto shrink-0"
          >
            <button
              type="button"
              role="tab"
              id="dashboard-tab-skill"
              aria-selected={activeTab === "skill"}
              onClick={() => setActiveTab("skill")}
              className="relative inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-mono text-xs font-bold transition-all cursor-pointer text-slate-600 hover:text-slate-900 aria-selected:bg-white aria-selected:text-slate-950 aria-selected:shadow-2xs aria-selected:after:content-[''] aria-selected:after:absolute aria-selected:after:inset-x-2.5 aria-selected:after:bottom-0.5 aria-selected:after:border-b-2 aria-selected:after:border-blue-600"
            >
              <Wand2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>deploy-dashboard Skill</span>
            </button>
            <button
              type="button"
              role="tab"
              id="dashboard-tab-details"
              aria-selected={activeTab === "details"}
              onClick={() => setActiveTab("details")}
              className="relative inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-mono text-xs font-bold transition-all cursor-pointer text-slate-600 hover:text-slate-900 aria-selected:bg-white aria-selected:text-slate-950 aria-selected:shadow-2xs aria-selected:after:content-[''] aria-selected:after:absolute aria-selected:after:inset-x-2.5 aria-selected:after:bottom-0.5 aria-selected:after:border-b-2 aria-selected:after:border-blue-600"
            >
              <Terminal className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>Under the Hood &amp; Docker Compose</span>
            </button>
          </div>
        </div>

        {/* Panel 1: deploy-dashboard Skill */}
        <div
          role="tabpanel"
          aria-labelledby="dashboard-tab-skill"
          hidden={activeTab !== "skill"}
        >
          <ol className="relative before:absolute before:left-4 sm:before:left-5 before:top-2 before:bottom-2 before:w-px before:bg-slate-300">
            <Step
              number={1}
              title="Ask deploy-dashboard to set up a Docker context"
              badge={
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono text-[11px] font-semibold">
                  Recommended
                </span>
              }
              explanation={
                <>
                  <p>
                    One dashboard deployment serves one Docker context (default{" "}
                    <InlineCode>orbstack</InlineCode>, or a remote host like{" "}
                    <InlineCode>rpi5</InlineCode>) and discovers all labelled
                    Managed Instances on that daemon.
                  </p>
                  <p>
                    The skill automatically detects{" "}
                    <InlineCode>DOCKER_GID</InlineCode> on the target host,
                    fetches the upstream compose files at a pinned{" "}
                    <InlineCode>--ref</InlineCode> (release tag or full 40-char
                    commit SHA), writes{" "}
                    <InlineCode>dashboards/&lt;context&gt;/.env</InlineCode>,
                    and starts <InlineCode>fleet-dashboard</InlineCode>.
                  </p>
                </>
              }
              commands={
                <>
                  <CodeBlock tone="light" code={SKILL_PROMPT_DEPLOY} />
                  <p className="text-xs font-mono text-slate-500">
                    With Claude Code:
                  </p>
                  <CodeBlock code={SKILL_CLAUDE_DEPLOY} />
                </>
              }
            />

            <Step
              number={2}
              title="Pick an access profile for your host"
              explanation={
                <>
                  <p>
                    <InlineCode>deploy-dashboard</InlineCode> configures the
                    right Compose overlay and host checks for how operators
                    reach the dashboard. Passwords are accepted only from a
                    secure browser context (
                    <InlineCode>http://localhost</InlineCode> or{" "}
                    <InlineCode>https://</InlineCode>).
                  </p>
                  <p>
                    In <InlineCode>local</InlineCode>,{" "}
                    <InlineCode>tunnel</InlineCode>, and{" "}
                    <InlineCode>lan</InlineCode> profiles, sign-in and 2-step{" "}
                    <strong>Control actions</strong> are enabled out of the box.
                  </p>
                </>
              }
              commands={
                <div className="rounded-xl border border-slate-200 bg-white overflow-hidden divide-y divide-slate-100">
                  {ACCESS_PROFILES.map((p) => (
                    <div key={p.name} className="p-3 text-xs space-y-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="font-mono font-bold text-slate-950 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                          --profile {p.name}
                        </span>
                        <span className="font-mono text-[11px] text-blue-700 font-semibold">
                          {p.authControl}
                        </span>
                      </div>
                      <p className="text-slate-600">{p.target}</p>
                      <p className="font-mono text-[11px] text-slate-500">
                        Open: <span className="text-slate-800">{p.url}</span>
                      </p>
                    </div>
                  ))}
                </div>
              }
            />

            <Step
              number={3}
              title="Manage Operator accounts, SSH tunnels & upgrades"
              explanation={
                <>
                  <p>
                    Ask the skill to add <InlineCode>controller</InlineCode> or{" "}
                    <InlineCode>viewer</InlineCode> accounts, print the{" "}
                    <InlineCode>ssh -L</InlineCode> command for a remote{" "}
                    <InlineCode>tunnel</InlineCode> deployment, or upgrade to a
                    new <InlineCode>agent-dashboard</InlineCode> release tag.
                  </p>
                  <p>
                    The <InlineCode>state</InlineCode> volume holds Operator
                    accounts and the Control audit log — both{" "}
                    <InlineCode>upgrade --ref</InlineCode> and{" "}
                    <InlineCode>down</InlineCode> preserve it automatically.
                  </p>
                </>
              }
              commands={<CommandTable rows={SKILL_LIFECYCLE_ROWS} />}
            />
          </ol>
        </div>

        {/* Panel 2: Under the Hood & Docker Compose */}
        <div
          role="tabpanel"
          aria-labelledby="dashboard-tab-details"
          hidden={activeTab !== "details"}
        >
          <div className="space-y-10">
            <div className="rounded-2xl border border-blue-200/80 bg-blue-50/40 p-5 sm:p-6">
              <div className="grid gap-6 lg:grid-cols-2">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-blue-700 mb-2">
                    <Wrench className="w-3.5 h-3.5" />
                    <span>HOW DEPLOY-DASHBOARD WORKS UNDER THE HOOD</span>
                  </div>
                  <h4 className="font-display font-bold text-base text-slate-950">
                    Pinned upstream refs &amp; context-isolated directories
                  </h4>
                  <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                    In <InlineCode>agent-forge</InlineCode>, dashboard
                    deployments live in{" "}
                    <InlineCode>dashboards/&lt;context&gt;/</InlineCode> (never
                    under <InlineCode>agent-instances/</InlineCode>). The
                    bundled <InlineCode>dashboard.sh</InlineCode> helper fetches
                    upstream compose files at the pinned tag/SHA and layers{" "}
                    <InlineCode>docker-compose.forge.yml</InlineCode> so the
                    image builds directly on the target Docker daemon from{" "}
                    <InlineCode>DASHBOARD_REF</InlineCode>.
                  </p>
                </div>
                <div className="space-y-3">
                  <CodeBlock
                    code={SKILL_HELPER_FLOW}
                    label="dashboard.sh helper CLI (driven by deploy-dashboard)"
                  />
                </div>
              </div>
            </div>

            <div>
              <div className="mb-6">
                <h4 className="text-lg sm:text-xl font-extrabold font-display tracking-tight text-slate-950">
                  Standalone Docker Compose setup (without agent-forge)
                </h4>
                <p className="mt-1 text-sm text-slate-600">
                  Deploys as the fixed Compose project{" "}
                  <InlineCode>fleet-dashboard</InlineCode> directly from{" "}
                  <a
                    href={DASHBOARD_REPO_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline font-mono inline-flex items-center gap-1"
                  >
                    lbacik/agent-dashboard{" "}
                    <ExternalLink className="w-3.5 h-3.5" />
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
                        <InlineCode>/var/run/docker.sock</InlineCode> and runs
                        as a non-root user. <InlineCode>DOCKER_GID</InlineCode>{" "}
                        in <InlineCode>.env</InlineCode> must match the group ID
                        owning the socket on the daemon host.
                      </p>
                      <p>
                        When deploying through a remote Docker context (e.g.
                        from a laptop to a Raspberry Pi), read the GID through
                        that same context.
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
                        No shared Docker network or exposed agent ports are
                        needed: the dashboard reaches agents through the mounted
                        host socket.
                      </p>
                    </>
                  }
                  commands={<CodeBlock code={DOCKER_QUICK_START_CODE} />}
                />

                <Step
                  number={3}
                  title="Optional: Enable LAN mode & Operator accounts"
                  explanation={
                    <p>
                      With <InlineCode>docker-compose.yml</InlineCode> alone,
                      the container provides a read-only view. To unlock 2-step{" "}
                      <strong>Control actions</strong> over the network, enable
                      the <InlineCode>docker-compose.lan.yml</InlineCode>{" "}
                      overlay (requires Docker Compose 2.24+) behind a TLS
                      reverse proxy and create a{" "}
                      <InlineCode>controller</InlineCode> Operator account.
                    </p>
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
          </div>
        </div>
      </div>
    </section>
  );
}
