"use client";

// PROTOTYPE: Three variants of the Agent Dashboard deployment section, switchable via ?variant= (A, B, C), on the existing / route.
//
// Background: Since agent-forge v0.5.0, deploying and configuring agent-dashboard
// is managed via the `deploy-dashboard` skill (one dashboard per Docker context
// under `dashboards/<context>/`). Direct Docker Compose operations and under-the-hood
// mechanics move to a secondary tab.

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Activity,
  Check,
  Copy,
  ExternalLink,
  FolderGit2,
  Globe,
  KeyRound,
  Laptop,
  Lock,
  Pause,
  Play,
  RefreshCw,
  Server,
  ShieldCheck,
  Sparkles,
  Terminal,
  Wand2,
  Wrench,
} from "lucide-react";
import {
  PrototypeSwitcher,
  type PrototypeVariantMeta,
} from "./PrototypeSwitcher";

const DASHBOARD_REPO_URL = "https://github.com/lbacik/agent-dashboard";
const AGENT_FORGE_URL = "https://github.com/lbacik/agent-forge";
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

// --- Code snippets & domain data from agent-forge v0.5.0 -------------------

const SKILL_PROMPT_DEPLOY =
  "Use deploy-dashboard to deploy the dashboard on the rpi5 context.";

const SKILL_CLAUDE_DEPLOY = `cd agent-forge
claude "/deploy-dashboard deploy on the rpi5 context"`;

const SKILL_HELPER_FLOW = `h=.agents/skills/deploy-dashboard/scripts/dashboard.sh
$h --context rpi5 init --ref v0.5.0       # tunnel profile off orbstack, local on it
$h --context rpi5 up                      # config -q, then up -d --build --wait
$h --context rpi5 account add alice --role controller
$h --context rpi5 tunnel                  # prints ssh -L <port>:127.0.0.1:<port> <host>`;

const FORGE_DASHBOARD_LAYOUT = `agent-forge/
└── dashboards/               # Local dashboard deployments; ignored by Git
    └── <docker-context>/
        ├── docker-compose.yml       # Fetched from agent-dashboard at pinned ref
        ├── docker-compose.lan.yml   # Fetched; enabled for local / tunnel / lan
        ├── docker-compose.forge.yml # Forge overlay: builds from upstream git at DASHBOARD_REF
        ├── .upstream-ref            # Ref the compose files were fetched at
        └── .env                     # COMPOSE_FILE, DASHBOARD_REF, DOCKER_GID, profile`;

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

interface AccessProfileInfo {
  id: "local" | "tunnel" | "lan" | "readonly";
  name: string;
  badge: string;
  target: string;
  authControl: string;
  url: string;
  prompt: string;
  cliInit: string;
  notes: string;
}

const ACCESS_PROFILES: AccessProfileInfo[] = [
  {
    id: "local",
    name: "local",
    badge: "Default on orbstack",
    target: "Local workstation daemon",
    authControl: "Sign-in ON • 2-Step Control ON",
    url: "http://localhost:8080",
    prompt:
      "Use deploy-dashboard to deploy the dashboard on orbstack with the local profile.",
    cliInit: `$h --context orbstack init --ref v0.5.0 --profile local
$h --context orbstack up
$h --context orbstack account add alice --role controller`,
    notes:
      "Binds to 127.0.0.1 with the LAN overlay enabled so you can sign in and run 2-step Control actions locally.",
  },
  {
    id: "tunnel",
    name: "tunnel",
    badge: "Default on remote hosts",
    target: "Remote host without TLS proxy (e.g. rpi5, VPS)",
    authControl: "Sign-in ON • 2-Step Control ON (via SSH)",
    url: "http://localhost:<local-port> (over ssh -L)",
    prompt:
      "Use deploy-dashboard to deploy the dashboard on the rpi5 context and print the SSH tunnel.",
    cliInit: `$h --context rpi5 init --ref v0.5.0 --profile tunnel
$h --context rpi5 up
$h --context rpi5 account add alice --role controller
$h --context rpi5 tunnel`,
    notes:
      "Passwords require a secure browser context: operators forward the remote loopback port over SSH and sign in at http://localhost.",
  },
  {
    id: "lan",
    name: "lan",
    badge: "TLS Reverse Proxy",
    target: "Shared LAN / team host behind an existing HTTPS proxy network",
    authControl: "Sign-in ON • 2-Step Control ON (via HTTPS)",
    url: "https://dashboard.example.lan",
    prompt:
      "Use deploy-dashboard to deploy on rpi5 with the lan profile on proxy network 'proxy' and virtual host dashboard.example.lan.",
    cliInit: `$h --context rpi5 init --ref v0.5.0 --profile lan \\
  --proxy-network proxy --virtual-host dashboard.example.lan
$h --context rpi5 up
$h --context rpi5 account add alice --role controller`,
    notes:
      "Verifies the proxy Docker network exists before starting and configures VIRTUAL_HOST and AGENT_DASHBOARD_ALLOWED_HOSTS.",
  },
  {
    id: "readonly",
    name: "readonly",
    badge: "Observation only",
    target: "Trusted, isolated network without operator sign-in",
    authControl: "No sign-in • Control OFF",
    url: "http://<lan-ip>:8080",
    prompt:
      "Use deploy-dashboard to deploy a readonly dashboard on rpi5 bound to 192.168.1.50.",
    cliInit: `$h --context rpi5 init --ref v0.5.0 --profile readonly \\
  --bind 192.168.1.50 --host 192.168.1.50,rpi5.lan
$h --context rpi5 up`,
    notes:
      "Anyone who can reach the port sees the fleet status. Unauthenticated Control is permanently disabled.",
  },
];

interface CommandRow {
  command: string;
  description: React.ReactNode;
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

const PROTOTYPE_VARIANTS: PrototypeVariantMeta[] = [
  {
    key: "A",
    name: "Timeline + Segmented Tabs",
    secondTabTitle: "Under the Hood & Docker Compose",
    summary:
      "Matches QuickStart's 1-2-3 numbered vertical timeline; segmented pill tabs switch between the deploy-dashboard Skill and Under the Hood & Docker Compose.",
  },
  {
    key: "B",
    name: "Interactive Profile Deck + Underline Tabs",
    secondTabTitle: "Implementation Details & Direct CLI",
    summary:
      "Bento workbench with an interactive 4-profile selector (local / tunnel / lan / readonly) and an architectural underline tab bar.",
  },
  {
    key: "C",
    name: "3-Phase Horizontal Cards + Split Switcher",
    secondTabTitle: "Standalone Docker Compose & Internals",
    summary:
      "3-column phase cards comparing Skill prompts, helper automation, and standalone Docker Compose internals.",
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

// ============================================================================
// VARIANT A: Timeline + Segmented Mode Tabs (Matches QuickStart pattern)
// Proposed 2nd tab name: "Under the Hood & Docker Compose"
// ============================================================================
export function VariantA({
  activeTab,
  onTabChange,
}: {
  activeTab: "skill" | "details";
  onTabChange: (tab: "skill" | "details") => void;
}) {
  return (
    <div id="dashboard-deploy" className="mt-12 sm:mt-16 scroll-mt-24">
      {/* Header + Segmented Tablist */}
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
            context in <InlineCode>dashboards/&lt;context&gt;/</InlineCode> with
            the <InlineCode>deploy-dashboard</InlineCode> skill from{" "}
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

        {/* Accessible Tablist with non-color underline shape indicator */}
        <div
          role="tablist"
          aria-label="Dashboard deployment method"
          className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200 self-start lg:self-auto shrink-0"
        >
          <button
            type="button"
            role="tab"
            id="va-tab-skill"
            aria-selected={activeTab === "skill"}
            onClick={() => onTabChange("skill")}
            className="relative inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-mono text-xs font-bold transition-all cursor-pointer text-slate-600 hover:text-slate-900 aria-selected:bg-white aria-selected:text-slate-950 aria-selected:shadow-2xs aria-selected:after:content-[''] aria-selected:after:absolute aria-selected:after:inset-x-2.5 aria-selected:after:bottom-0.5 aria-selected:after:border-b-2 aria-selected:after:border-blue-600"
          >
            <Wand2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>deploy-dashboard Skill</span>
          </button>
          <button
            type="button"
            role="tab"
            id="va-tab-details"
            aria-selected={activeTab === "details"}
            onClick={() => onTabChange("details")}
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
        aria-labelledby="va-tab-skill"
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
                  <InlineCode>DOCKER_GID</InlineCode> on the target host, fetches
                  the upstream compose files at a pinned{" "}
                  <InlineCode>--ref</InlineCode> (release tag or full 40-char
                  commit SHA), writes{" "}
                  <InlineCode>dashboards/&lt;context&gt;/.env</InlineCode>, and
                  starts <InlineCode>fleet-dashboard</InlineCode>.
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
                  <InlineCode>deploy-dashboard</InlineCode> configures the right
                  Compose overlay and host checks for how operators reach the
                  dashboard. Passwords are accepted only from a secure browser
                  context (<InlineCode>http://localhost</InlineCode> or{" "}
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
                  <div key={p.id} className="p-3 text-xs space-y-1">
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
                  <InlineCode>tunnel</InlineCode> deployment, or upgrade to a new{" "}
                  <InlineCode>agent-dashboard</InlineCode> release tag.
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
        aria-labelledby="va-tab-details"
        hidden={activeTab !== "details"}
      >
        <div className="space-y-10">
          {/* Sub-box: How agent-forge wires it under the hood */}
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
                  In <InlineCode>agent-forge</InlineCode>, dashboard deployments
                  live in <InlineCode>dashboards/&lt;context&gt;/</InlineCode>{" "}
                  (never under <InlineCode>agent-instances/</InlineCode>). The
                  bundled <InlineCode>dashboard.sh</InlineCode> helper fetches
                  upstream compose files at the pinned tag/SHA and layers{" "}
                  <InlineCode>docker-compose.forge.yml</InlineCode> so the image
                  builds directly on the target Docker daemon from{" "}
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

          {/* Standalone Docker Compose 3-Step Timeline */}
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
                      <InlineCode>.env</InlineCode> must match the group ID
                      owning the socket on the daemon host.
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
                      the dashboard reaches agents through the mounted host
                      socket.
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
                    With <InlineCode>docker-compose.yml</InlineCode> alone, the
                    container provides a read-only view. To unlock 2-step{" "}
                    <strong>Control actions</strong> over the network, enable the{" "}
                    <InlineCode>docker-compose.lan.yml</InlineCode> overlay
                    (requires Docker Compose 2.24+) behind a TLS reverse proxy
                    and create a <InlineCode>controller</InlineCode> Operator
                    account.
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
  );
}

// ============================================================================
// VARIANT B: Interactive Profile Workbench + Architectural Underline Tabs
// Proposed 2nd tab name: "Implementation Details & Direct CLI"
// ============================================================================
export function VariantB({
  activeTab,
  onTabChange,
}: {
  activeTab: "skill" | "details";
  onTabChange: (tab: "skill" | "details") => void;
}) {
  const [selectedProfileId, setSelectedProfileId] =
    useState<AccessProfileInfo["id"]>("tunnel");

  const activeProfile =
    ACCESS_PROFILES.find((p) => p.id === selectedProfileId) ??
    ACCESS_PROFILES[0]!;

  return (
    <div id="dashboard-deploy" className="mt-12 sm:mt-16 scroll-mt-24">
      {/* Header + Underline Tab Bar */}
      <div className="mb-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-md mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              agent-forge v0.5.0+ • Context-Aware Dashboard Management
            </span>
            <h3 className="text-xl sm:text-2xl font-extrabold font-display tracking-tight text-slate-950">
              Manage with the <InlineCode>deploy-dashboard</InlineCode> skill
            </h3>
          </div>
          <a
            href={AGENT_FORGE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-slate-700 hover:text-blue-600 bg-slate-100 hover:bg-blue-50 px-3 py-1.5 rounded-xl border border-slate-200 transition-colors"
          >
            <FolderGit2 className="w-3.5 h-3.5" />
            <span>lbacik/agent-forge</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Modern Web Guidance Underline Tablist (3px bottom border indicator) */}
        <div
          role="tablist"
          aria-label="Dashboard configuration views"
          className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto"
        >
          <button
            type="button"
            role="tab"
            id="vb-tab-skill"
            aria-selected={activeTab === "skill"}
            onClick={() => onTabChange("skill")}
            className="relative inline-flex items-center gap-2 px-4 py-3 font-mono text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-900 cursor-pointer whitespace-nowrap aria-selected:text-blue-700 aria-selected:after:content-[''] aria-selected:after:absolute aria-selected:after:inset-x-0 aria-selected:after:bottom-0 aria-selected:after:border-b-[3px] aria-selected:after:border-blue-600"
          >
            <Wand2 className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Managed via deploy-dashboard Skill</span>
            <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 text-[10px]">
              v0.5.0+
            </span>
          </button>

          <button
            type="button"
            role="tab"
            id="vb-tab-details"
            aria-selected={activeTab === "details"}
            onClick={() => onTabChange("details")}
            className="relative inline-flex items-center gap-2 px-4 py-3 font-mono text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-900 cursor-pointer whitespace-nowrap aria-selected:text-blue-700 aria-selected:after:content-[''] aria-selected:after:absolute aria-selected:after:inset-x-0 aria-selected:after:bottom-0 aria-selected:after:border-b-[3px] aria-selected:after:border-blue-600"
          >
            <Wrench className="w-4 h-4 text-slate-500 shrink-0" />
            <span>Implementation Details &amp; Direct CLI</span>
          </button>
        </div>
      </div>

      {/* Panel 1: Interactive Skill Control Deck */}
      <div
        role="tabpanel"
        aria-labelledby="vb-tab-skill"
        hidden={activeTab !== "skill"}
      >
        <div className="space-y-6">
          {/* Top Prompt Banner */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-5">
            <div className="grid gap-5 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-5 space-y-2">
                <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">
                  Zero-friction deployment
                </div>
                <h4 className="font-display font-bold text-lg text-slate-950">
                  One dashboard per Docker context
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Tell your coding assistant which Docker context to target (
                  <InlineCode>orbstack</InlineCode>,{" "}
                  <InlineCode>rpi5</InlineCode>, etc.). The skill probes{" "}
                  <InlineCode>DOCKER_GID</InlineCode>, pins an upstream{" "}
                  <InlineCode>agent-dashboard</InlineCode> release tag, waits for{" "}
                  <InlineCode>/healthz</InlineCode>, and issues your first{" "}
                  <InlineCode>controller</InlineCode> Set-password link.
                </p>
              </div>
              <div className="lg:col-span-7 space-y-2.5">
                <CodeBlock
                  tone="light"
                  code={SKILL_PROMPT_DEPLOY}
                  label="Ask your coding assistant (Claude Code / Codex)"
                />
                <CodeBlock code={SKILL_CLAUDE_DEPLOY} />
              </div>
            </div>
          </div>

          {/* Interactive Access Profile Explorer */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
              <div>
                <h4 className="font-display font-bold text-base sm:text-lg text-slate-950">
                  Interactive Access Profile Explorer
                </h4>
                <p className="text-xs text-slate-600">
                  Select a profile to inspect how{" "}
                  <InlineCode>deploy-dashboard</InlineCode> configures sign-in,
                  2-step Control, and network binding:
                </p>
              </div>
              <span className="font-mono text-[11px] text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 self-start sm:self-auto">
                dashboards/&lt;context&gt;/.env
              </span>
            </div>

            <div className="grid gap-5 lg:grid-cols-12">
              {/* Left: 4 Profile Selector Buttons */}
              <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5">
                {ACCESS_PROFILES.map((p) => {
                  const selected = p.id === activeProfile.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setSelectedProfileId(p.id)}
                      className={`text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                        selected
                          ? "bg-blue-50/70 border-blue-500 ring-1 ring-blue-500 shadow-xs"
                          : "bg-slate-50/70 hover:bg-white border-slate-200"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono font-bold text-sm text-slate-950">
                          {p.name}
                        </span>
                        <span
                          className={`font-mono text-[10px] px-2 py-0.5 rounded font-semibold ${
                            selected
                              ? "bg-blue-600 text-white"
                              : "bg-slate-200/80 text-slate-700"
                          }`}
                        >
                          {p.badge}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-slate-600 line-clamp-2">
                        {p.target}
                      </p>
                    </button>
                  );
                })}
              </div>

              {/* Right: Live Profile Inspector */}
              <div className="lg:col-span-7 rounded-xl border border-slate-200 bg-slate-50/60 p-4 sm:p-5 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span className="font-mono font-bold text-sm text-slate-950">
                        Profile: {activeProfile.name}
                      </span>
                    </div>
                    <span className="font-mono text-xs font-semibold text-emerald-800 bg-emerald-100/80 border border-emerald-200 px-2.5 py-0.5 rounded-md">
                      {activeProfile.authControl}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {activeProfile.notes}
                  </p>

                  <div className="flex flex-wrap items-center gap-2 text-xs font-mono bg-white px-3 py-2 rounded-lg border border-slate-200">
                    <Globe className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span className="text-slate-500">Operator URL:</span>
                    <span className="text-slate-900 font-bold">
                      {activeProfile.url}
                    </span>
                  </div>
                </div>

                <div className="space-y-2.5">
                  <CodeBlock
                    tone="light"
                    code={activeProfile.prompt}
                    label={`Assistant Prompt (${activeProfile.name} profile)`}
                  />
                  <CodeBlock
                    code={activeProfile.cliInit}
                    label="What deploy-dashboard runs via dashboard.sh"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Day-2 Operations Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="rounded-xl border border-slate-200 bg-white p-3.5">
              <div className="flex items-center gap-2 font-mono text-xs font-bold text-slate-900">
                <KeyRound className="w-3.5 h-3.5 text-amber-600" />
                <span>account add / reset</span>
              </div>
              <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                Creates <InlineCode>controller</InlineCode> or{" "}
                <InlineCode>viewer</InlineCode> accounts and outputs a one-time
                Set-password link to your terminal.
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-3.5">
              <div className="flex items-center gap-2 font-mono text-xs font-bold text-slate-900">
                <Server className="w-3.5 h-3.5 text-blue-600" />
                <span>tunnel</span>
              </div>
              <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                Prints the <InlineCode>ssh -L</InlineCode> forwarder for remote
                contexts so sign-in happens on a secure{" "}
                <InlineCode>localhost</InlineCode> origin.
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-3.5">
              <div className="flex items-center gap-2 font-mono text-xs font-bold text-slate-900">
                <RefreshCw className="w-3.5 h-3.5 text-emerald-600" />
                <span>upgrade --ref</span>
              </div>
              <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                Moves to a new release tag while keeping{" "}
                <InlineCode>.env</InlineCode> and the{" "}
                <InlineCode>state</InlineCode> volume (accounts &amp; Control
                audit).
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-3.5">
              <div className="flex items-center gap-2 font-mono text-xs font-bold text-slate-900">
                <Activity className="w-3.5 h-3.5 text-indigo-600" />
                <span>status &amp; down</span>
              </div>
              <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                Checks <InlineCode>/healthz</InlineCode>, socket permissions,
                and unlabelled legacy containers. <InlineCode>down</InlineCode>{" "}
                never deletes volumes.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Panel 2: Implementation Details & Direct CLI */}
      <div
        role="tabpanel"
        aria-labelledby="vb-tab-details"
        hidden={activeTab !== "details"}
      >
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left Column: agent-forge Architecture & Helper CLI */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4">
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-xs font-bold uppercase text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
                Agent Forge Internals
              </span>
              <span className="font-mono text-xs text-slate-500">
                dashboards/&lt;context&gt;/
              </span>
            </div>
            <h4 className="font-display font-bold text-lg text-slate-950">
              How <InlineCode>deploy-dashboard</InlineCode> structures the
              deployment
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Each Docker context gets an isolated directory under{" "}
              <InlineCode>dashboards/&lt;context&gt;/</InlineCode>. The helper{" "}
              <InlineCode>
                .agents/skills/deploy-dashboard/scripts/dashboard.sh
              </InlineCode>{" "}
              fetches upstream compose files at a verified tag or 40-char SHA,
              records <InlineCode>.upstream-ref</InlineCode>, and refuses to
              build if <InlineCode>.upstream-ref</InlineCode> and{" "}
              <InlineCode>DASHBOARD_REF</InlineCode> drift apart.
            </p>
            <CodeBlock
              code={FORGE_DASHBOARD_LAYOUT}
              label="Directory layout in agent-forge v0.5.0+"
            />
            <CodeBlock
              code={SKILL_HELPER_FLOW}
              label="Direct dashboard.sh invocation"
            />
          </div>

          {/* Right Column: Standalone Docker Compose (without agent-forge) */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4">
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-xs font-bold uppercase text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded border border-slate-200">
                Standalone Docker Compose
              </span>
              <span className="font-mono text-xs text-slate-500">
                project: fleet-dashboard
              </span>
            </div>
            <h4 className="font-display font-bold text-lg text-slate-950">
              Manual deployment from <InlineCode>agent-dashboard</InlineCode>
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              When running outside <InlineCode>agent-forge</InlineCode>, probe
              the host socket&apos;s <InlineCode>DOCKER_GID</InlineCode>, clone{" "}
              <InlineCode>lbacik/agent-dashboard</InlineCode>, and layer{" "}
              <InlineCode>docker-compose.lan.yml</InlineCode> to enable
              authenticated 2-step Control actions:
            </p>
            <CodeBlock
              code={DOCKER_GID_CODE}
              label="1. Probe host Docker socket GID"
            />
            <CodeBlock
              code={DOCKER_QUICK_START_CODE}
              label="2. Clone, configure .env & start fleet-dashboard"
            />
            <CodeBlock
              tone="light"
              code={DOCKER_LAN_ENV_CODE}
              label="3a. Optional LAN mode .env overlay"
            />
            <CodeBlock
              code={DOCKER_LAN_OVERLAY_CODE}
              label="3b. Start LAN overlay & create controller account"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// VARIANT C: 3-Phase Horizontal Cards + Split Header Switcher
// Proposed 2nd tab name: "Standalone Docker Compose & Internals"
// ============================================================================
export function VariantC({
  activeTab,
  onTabChange,
}: {
  activeTab: "skill" | "details";
  onTabChange: (tab: "skill" | "details") => void;
}) {
  return (
    <div id="dashboard-deploy" className="mt-12 sm:mt-16 scroll-mt-24">
      {/* Split Card Banner with High-Contrast Tab Switcher */}
      <div className="rounded-2xl border border-slate-200 bg-slate-100/80 p-4 sm:p-5 mb-8 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-blue-600 text-white font-mono text-[10px] font-bold uppercase tracking-wider">
              agent-forge v0.5.0
            </span>
            <span className="font-mono text-xs text-slate-600 font-semibold">
              SKILL-FIRST FLEET DEPLOYMENT
            </span>
          </div>
          <h3 className="text-lg sm:text-2xl font-extrabold font-display tracking-tight text-slate-950">
            Deploy &amp; configure Agent Dashboard
          </h3>
        </div>

        <div
          role="tablist"
          aria-label="Deployment mode"
          className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-white p-1.5 rounded-xl border border-slate-200/90 shadow-2xs shrink-0"
        >
          <button
            type="button"
            role="tab"
            id="vc-tab-skill"
            aria-selected={activeTab === "skill"}
            onClick={() => onTabChange("skill")}
            className="relative flex items-center gap-2.5 px-3.5 py-2 rounded-lg text-left transition-all cursor-pointer text-slate-600 hover:text-slate-950 aria-selected:bg-blue-50/90 aria-selected:text-blue-950 aria-selected:ring-2 aria-selected:ring-blue-600"
          >
            <Wand2 className="w-4 h-4 text-amber-600 shrink-0" />
            <div>
              <div className="font-mono text-xs font-bold leading-tight">
                deploy-dashboard Skill
              </div>
              <div className="font-sans text-[11px] text-slate-500">
                Recommended • Per Docker context
              </div>
            </div>
          </button>

          <button
            type="button"
            role="tab"
            id="vc-tab-details"
            aria-selected={activeTab === "details"}
            onClick={() => onTabChange("details")}
            className="relative flex items-center gap-2.5 px-3.5 py-2 rounded-lg text-left transition-all cursor-pointer text-slate-600 hover:text-slate-950 aria-selected:bg-blue-50/90 aria-selected:text-blue-950 aria-selected:ring-2 aria-selected:ring-blue-600"
          >
            <Terminal className="w-4 h-4 text-blue-600 shrink-0" />
            <div>
              <div className="font-mono text-xs font-bold leading-tight">
                Standalone Docker Compose &amp; Internals
              </div>
              <div className="font-sans text-[11px] text-slate-500">
                Manual setup &amp; Forge overlay details
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Panel 1: 3-Column Horizontal Skill Workflow Grid */}
      <div
        role="tabpanel"
        aria-labelledby="vc-tab-skill"
        hidden={activeTab !== "skill"}
      >
        <div className="space-y-6">
          <div className="grid gap-5 lg:grid-cols-3">
            {/* Phase 1 Card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
                    01 // CONTEXT &amp; PROFILE
                  </span>
                  <Laptop className="w-4 h-4 text-slate-400" />
                </div>
                <h4 className="font-display font-bold text-base text-slate-950">
                  Target any Docker context
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Ask your assistant to run{" "}
                  <InlineCode>deploy-dashboard</InlineCode>. It confirms the
                  Docker context (<InlineCode>orbstack</InlineCode>,{" "}
                  <InlineCode>rpi5</InlineCode>, etc.), probes{" "}
                  <InlineCode>DOCKER_GID</InlineCode> on that daemon, and
                  initializes <InlineCode>dashboards/&lt;ctx&gt;/</InlineCode>{" "}
                  at a pinned release tag.
                </p>
                <div className="grid grid-cols-2 gap-1.5 pt-1 font-mono text-[11px]">
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
                    <div className="font-bold text-slate-900">local</div>
                    <div className="text-[10px] text-slate-500">
                      localhost • Control ON
                    </div>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
                    <div className="font-bold text-slate-900">tunnel</div>
                    <div className="text-[10px] text-slate-500">
                      SSH -L • Control ON
                    </div>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
                    <div className="font-bold text-slate-900">lan</div>
                    <div className="text-[10px] text-slate-500">
                      TLS proxy • Control ON
                    </div>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
                    <div className="font-bold text-slate-900">readonly</div>
                    <div className="text-[10px] text-slate-500">
                      No auth • Control OFF
                    </div>
                  </div>
                </div>
              </div>
              <CodeBlock tone="light" code={SKILL_PROMPT_DEPLOY} />
            </div>

            {/* Phase 2 Card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
                    02 // ACCOUNTS &amp; TUNNEL
                  </span>
                  <Lock className="w-4 h-4 text-slate-400" />
                </div>
                <h4 className="font-display font-bold text-base text-slate-950">
                  One-time Set-password links
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  For <InlineCode>local</InlineCode>,{" "}
                  <InlineCode>tunnel</InlineCode>, and{" "}
                  <InlineCode>lan</InlineCode> profiles, the skill creates your
                  first <InlineCode>controller</InlineCode> account and prints a
                  one-time Set-password URL directly to your terminal (never
                  stored in reports or commits).
                </p>
                <p className="text-xs text-slate-600 leading-relaxed">
                  On remote hosts without HTTPS (<InlineCode>tunnel</InlineCode>
                  ), it prints the exact <InlineCode>ssh -L</InlineCode>{" "}
                  command so sign-in runs over{" "}
                  <InlineCode>http://localhost</InlineCode>.
                </p>
              </div>
              <CodeBlock
                code={`claude "/deploy-dashboard add a controller account alice on rpi5"\nclaude "/deploy-dashboard how do I open the rpi5 dashboard?"`}
              />
            </div>

            {/* Phase 3 Card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
                    03 // UPGRADE &amp; STATUS
                  </span>
                  <RefreshCw className="w-4 h-4 text-slate-400" />
                </div>
                <h4 className="font-display font-bold text-base text-slate-950">
                  State-preserving upgrades
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Upgrading to a newer <InlineCode>agent-dashboard</InlineCode>{" "}
                  tag updates <InlineCode>DASHBOARD_REF</InlineCode>, reports
                  added/removed <InlineCode>.env</InlineCode> variables, and
                  rebuilds while preserving the <InlineCode>state</InlineCode>{" "}
                  volume (Operator accounts &amp; Control audit).
                </p>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Running <InlineCode>status</InlineCode> checks container
                  health, socket permissions, and flags unlabelled legacy agent
                  containers.
                </p>
              </div>
              <CodeBlock
                code={`claude "/deploy-dashboard upgrade rpi5 dashboard to v0.6.0"\nclaude "/deploy-dashboard check status on rpi5"`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Panel 2: 3-Column Standalone Docker Compose & Internals Grid */}
      <div
        role="tabpanel"
        aria-labelledby="vc-tab-details"
        hidden={activeTab !== "details"}
      >
        <div className="space-y-6">
          <div className="grid gap-5 lg:grid-cols-3">
            {/* Direct Card 1 */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs flex flex-col justify-between space-y-4">
              <div className="space-y-2.5">
                <span className="inline-block font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded border border-slate-200">
                  STEP 01 // DOCKER SOCKET GID
                </span>
                <h4 className="font-display font-bold text-base text-slate-950">
                  Probe <InlineCode>/var/run/docker.sock</InlineCode>
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  The container runs as a non-root user and talks to agents
                  through the mounted Docker socket.{" "}
                  <InlineCode>DOCKER_GID</InlineCode> in{" "}
                  <InlineCode>.env</InlineCode> must match the socket group ID
                  on the target daemon host.
                </p>
              </div>
              <CodeBlock code={DOCKER_GID_CODE} />
            </div>

            {/* Direct Card 2 */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs flex flex-col justify-between space-y-4">
              <div className="space-y-2.5">
                <span className="inline-block font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded border border-slate-200">
                  STEP 02 // BUILD FLEET-DASHBOARD
                </span>
                <h4 className="font-display font-bold text-base text-slate-950">
                  Standalone Compose vs Forge Overlay
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Standalone deployments clone{" "}
                  <InlineCode>lbacik/agent-dashboard</InlineCode> directly.
                  Inside <InlineCode>agent-forge</InlineCode>,{" "}
                  <InlineCode>dashboard.sh</InlineCode> instead fetches the
                  compose files into <InlineCode>dashboards/&lt;ctx&gt;/</InlineCode>{" "}
                  and layers <InlineCode>docker-compose.forge.yml</InlineCode>.
                </p>
              </div>
              <CodeBlock code={DOCKER_QUICK_START_CODE} />
            </div>

            {/* Direct Card 3 */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs flex flex-col justify-between space-y-4">
              <div className="space-y-2.5">
                <span className="inline-block font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded border border-slate-200">
                  STEP 03 // LAN OVERLAY &amp; CLI AUTH
                </span>
                <h4 className="font-display font-bold text-base text-slate-950">
                  Enable 2-step Control &amp; accounts
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Layer <InlineCode>docker-compose.lan.yml</InlineCode> (Compose
                  2.24+) to unlock authenticated 2-step Control actions and run{" "}
                  <InlineCode>agent-dashboard account add</InlineCode> inside
                  the running container.
                </p>
              </div>
              <div className="space-y-2">
                <CodeBlock tone="light" code={DOCKER_LAN_ENV_CODE} />
                <CodeBlock code={DOCKER_LAN_OVERLAY_CODE} />
              </div>
            </div>
          </div>

          {/* Bottom strip: dashboard.sh helper commands */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
            <div className="grid gap-4 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-5 space-y-1">
                <div className="font-mono text-xs font-bold text-blue-700">
                  AGENT-FORGE HELPER SCRIPT
                </div>
                <h5 className="font-display font-bold text-sm text-slate-950">
                  Direct <InlineCode>dashboard.sh</InlineCode> CLI sequence
                </h5>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Under the hood, the <InlineCode>deploy-dashboard</InlineCode>{" "}
                  skill drives this POSIX helper in{" "}
                  <InlineCode>.agents/skills/deploy-dashboard/scripts/</InlineCode>:
                </p>
              </div>
              <div className="lg:col-span-7">
                <CodeBlock code={SKILL_HELPER_FLOW} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Switcher wrapper reading ?variant=A|B|C and ?tab=skill|details
// ============================================================================
function DashboardDeploymentPrototype() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const rawVariant = (searchParams.get("variant") ?? "A").toUpperCase();
  const variant = ["A", "B", "C"].includes(rawVariant) ? rawVariant : "A";

  const rawTab = searchParams.get("tab");
  const activeTab: "skill" | "details" =
    rawTab === "details" ? "details" : "skill";

  const handleTabChange = (nextTab: "skill" | "details") => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", nextTab);
    if (!params.get("variant")) {
      params.set("variant", variant);
    }
    router.replace(`${pathname}?${params.toString()}#dashboard-deploy`, {
      scroll: false,
    });
  };

  return (
    <>
      {variant === "A" && (
        <VariantA activeTab={activeTab} onTabChange={handleTabChange} />
      )}
      {variant === "B" && (
        <VariantB activeTab={activeTab} onTabChange={handleTabChange} />
      )}
      {variant === "C" && (
        <VariantC activeTab={activeTab} onTabChange={handleTabChange} />
      )}
      <PrototypeSwitcher
        variants={PROTOTYPE_VARIANTS}
        current={variant}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />
    </>
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

      {/* Prototype Variants (A, B, C) switchable via ?variant= */}
      <Suspense
        fallback={
          <VariantA
            activeTab="skill"
            onTabChange={() => {
              /* hydrated by Suspense */
            }}
          />
        }
      >
        <DashboardDeploymentPrototype />
      </Suspense>
    </section>
  );
}
