"use client";

// PROTOTYPE: Four structural variants of the Quick Start section presenting
// agent-forge v0.4.0 Worker Pools and scaling commands, switchable via `?variant=A|B|C|D`.

import { useState } from "react";
import {
  Activity,
  AlertTriangle,
  Boxes,
  Check,
  Copy,
  ExternalLink,
  Layers,
  Minus,
  PauseCircle,
  Plus,
  Terminal,
  UserCheck,
  Wand2,
} from "lucide-react";
import { usePrototypeVariant } from "./PrototypeSwitcher";

const AGENT_FORGE_URL = "https://github.com/lbacik/agent-forge";
const AGENTCTL_PREFIX =
  "docker compose exec --user agent agent /usr/local/bin/agentctl";
const AGENTCTL_POOL_PREFIX =
  "docker compose exec --user agent <service> /usr/local/bin/agentctl";

function useCopy() {
  const [copied, setCopied] = useState(false);

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const area = document.createElement("textarea");
      area.value = text;
      document.body.appendChild(area);
      area.select();
      document.execCommand("copy");
      document.body.removeChild(area);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return { copied, copy };
}

function CopyButton({ text, dark }: { text: string; dark: boolean }) {
  const { copied, copy } = useCopy();

  return (
    <button
      type="button"
      onClick={() => copy(text)}
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
  );
}

function CodeBlock({
  code,
  tone = "dark",
}: {
  code: string;
  tone?: "dark" | "light";
}) {
  const dark = tone === "dark";
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
      <CopyButton text={code} dark={dark} />
    </div>
  );
}

interface CommandRow {
  command: string;
  description: React.ReactNode;
  destructive?: boolean;
}

function CommandTable({ rows }: { rows: CommandRow[] }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden divide-y divide-slate-100 text-left">
      {rows.map((row) => (
        <div
          key={row.command}
          className={`grid gap-1 px-4 py-2.5 sm:grid-cols-2 sm:gap-4 ${
            row.destructive ? "bg-red-50/70" : ""
          }`}
        >
          <code
            className={`font-mono text-xs break-all ${
              row.destructive ? "text-red-700 font-semibold" : "text-slate-900"
            }`}
          >
            {row.command}
          </code>
          <p
            className={`text-xs leading-relaxed ${
              row.destructive ? "text-red-700" : "text-slate-600"
            }`}
          >
            {row.description}
          </p>
        </div>
      ))}
    </div>
  );
}

function PrefixLine({ prefix, label = "prefix" }: { prefix: string; label?: string }) {
  const { copied, copy } = useCopy();

  return (
    <div className="flex items-start gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5">
      <code className="font-mono text-xs text-slate-600 break-all flex-1">
        <span className="text-slate-400">{label}: </span>
        {prefix}
      </code>
      <button
        type="button"
        onClick={() => copy(prefix)}
        aria-label={copied ? "Copied to clipboard" : "Copy prefix to clipboard"}
        className="p-1 rounded-md text-slate-400 hover:text-blue-600 hover:bg-white border border-transparent hover:border-slate-200 transition-colors shrink-0"
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

function InlineCode({ children }: { children: React.ReactNode }) {
  return (
    <code className="font-mono text-[0.9em] text-slate-900 bg-slate-100 px-1 py-px rounded border border-slate-200 break-all">
      {children}
    </code>
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
            <h3 className="font-display font-bold text-lg text-slate-950">
              {title}
            </h3>
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

const COMPOSE_COMMANDS: CommandRow[] = [
  {
    command: "cd agent-instances/agent-repository",
    description: "Every Compose command runs from the instance directory.",
  },
  {
    command: "docker compose config -q",
    description: "Validate the generated configuration.",
  },
  {
    command: "docker compose build",
    description:
      "Build the shared image once (via the primary agent service). Rebuild after profile or Dockerfile changes.",
  },
  {
    command: "docker compose up -d",
    description:
      "Start the instance (or all Workers in the Pool). Run again after a rebuild to apply the new image.",
  },
  {
    command: "docker compose ps",
    description: "Check that all Worker containers are running.",
  },
  {
    command: "docker compose logs --tail=100 -f",
    description: "Follow the startup logs (pass a service name for one Worker).",
  },
  {
    command: "docker compose down",
    description: (
      <>
        Stop all Workers. Named volumes (<InlineCode>agent_data</InlineCode>,{" "}
        <InlineCode>data_2..N</InlineCode>) are kept.
      </>
    ),
  },
  {
    command: "docker compose down -v",
    description: (
      <>
        Deletes <InlineCode>agent_data</InlineCode> and{" "}
        <InlineCode>data_2..N</InlineCode> for every Worker: repository
        checkouts, state and attempt logs.
      </>
    ),
    destructive: true,
  },
];

const MANAGE_POOL_SKILL_COMMANDS: CommandRow[] = [
  {
    command: 'claude "/manage-pool add a worker to agent-repository"',
    description: (
      <>
        Add <InlineCode>agent-&lt;n&gt;</InlineCode> with its own{" "}
        <InlineCode>data_&lt;n&gt;</InlineCode> volume and{" "}
        <InlineCode>WORKER_ID</InlineCode>, then start only the new container.
      </>
    ),
  },
  {
    command: 'claude "/manage-pool remove worker 2 from agent-repository"',
    description: (
      <>
        Drain <InlineCode>agent-2</InlineCode>, verify it holds no active{" "}
        <InlineCode>claimed-by:*</InlineCode> Claim, then stop and remove it.
      </>
    ),
  },
  {
    command: 'claude "/manage-pool stop agent-repository"',
    description:
      "Drain active attempts and stop issue intake across the whole Pool (or a single named Worker).",
  },
  {
    command: 'claude "/manage-pool resume agent-repository"',
    description:
      "Bring stopped Worker containers back up and resume issue intake.",
  },
];

const MANAGE_POOL_CLI_COMMANDS: CommandRow[] = [
  {
    command: ".agents/skills/debug-agent/scripts/pool-status.sh --github repository",
    description: (
      <>
        Read-only overview of every Worker: container state, intake, active
        issue, and live <InlineCode>claimed-by:&lt;worker-id&gt;</InlineCode>{" "}
        labels.
      </>
    ),
  },
  {
    command: "docker compose up -d agent-2",
    description: (
      <>
        Start only the newly added Worker <InlineCode>agent-2</InlineCode>{" "}
        without interrupting running Workers.
      </>
    ),
  },
  {
    command: "docker compose exec -u agent agent-2 /usr/local/bin/agentctl stop",
    description: (
      <>
        Drain <InlineCode>agent-2</InlineCode>: lets its active attempt finish
        and stops new issue intake.
      </>
    ),
  },
  {
    command: "docker compose stop agent-2 && docker compose rm -f agent-2",
    description: (
      <>
        Stop and remove a drained Worker container once its{" "}
        <InlineCode>status</InlineCode> shows{" "}
        <InlineCode>active_attempt: none</InlineCode>.
      </>
    ),
  },
];

const AGENTCTL_COMMANDS: CommandRow[] = [
  {
    command: "status",
    description: (
      <>
        Read-only. The first line names <InlineCode>TARGET_REPO</InlineCode>.
      </>
    ),
  },
  {
    command: "stop",
    description: "Stop picking up new issues (drains the Worker cleanly).",
  },
  {
    command: "resume",
    description: "Resume issue intake.",
  },
  {
    command: "handoff now",
    description: "Ask the active attempt to hand off to you.",
  },
  {
    command: "next issue <issue-number>",
    description: (
      <>
        Make this issue the next one this Worker claims. Pass the issue{" "}
        <strong>number</strong> (e.g. <InlineCode>42</InlineCode>), not the URL.
      </>
    ),
  },
  {
    command: "command <id>",
    description: "Look up a submitted request by its ID.",
  },
];

const AGENTCTL_WARNINGS = [
  "Always use the absolute path /usr/local/bin/agentctl. A bare agentctl may resolve to the target repository's package.",
  "Never use docker compose run to issue commands. Only the live Worker in its own container accepts them.",
];

// ============================================================================
// VARIANT A: 6-Step Linear Timeline (inserts Step 4: Scale the Worker Pool)
// ============================================================================
function VariantA() {
  return (
    <section
      id="quick-start"
      className="mt-20 sm:mt-28 max-w-5xl mx-auto scroll-mt-28 text-left"
    >
      <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono font-semibold mb-3">
          <Boxes className="w-3.5 h-3.5 text-emerald-600" />
          <span>NEW IN AGENT-FORGE v0.4.0 • MULTI-WORKER POOLS</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold font-display tracking-tight text-slate-950">
          Quick start
        </h2>
        <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
          From zero to a running, scalable agent Instance or multi-Worker Pool in
          six steps, with{" "}
          <a
            href={AGENT_FORGE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline font-mono inline-flex items-center gap-1"
          >
            agent-forge <ExternalLink className="w-3.5 h-3.5" />
          </a>
          .
        </p>
      </div>

      <ol className="relative before:absolute before:left-4 sm:before:left-5 before:top-2 before:bottom-2 before:w-px before:bg-slate-300">
        <Step
          number={1}
          title="Get ready"
          explanation={
            <>
              <p>You need:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Docker with Compose v2.17+</li>
                <li>A coding assistant (e.g. Claude Code)</li>
                <li>
                  A GitHub token with read/write access to the target
                  repo&apos;s contents, issues and pull requests
                </li>
                <li>Model API credentials</li>
              </ul>
            </>
          }
          commands={
            <CodeBlock
              code={
                "git clone https://github.com/lbacik/agent-forge.git\ncd agent-forge"
              }
            />
          }
        />

        <Step
          number={2}
          title="Create an instance (or Pool) with create-agent"
          explanation={
            <>
              <p>
                Ask your coding assistant to use the{" "}
                <InlineCode>create-agent</InlineCode> skill from{" "}
                <a
                  href={AGENT_FORGE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline font-mono"
                >
                  agent-forge
                </a>
                . It inspects the repository&apos;s stack and CI and generates
                the Instance: Dockerfile, <InlineCode>compose.yaml</InlineCode>,
                profile and <InlineCode>.env</InlineCode>.
              </p>
              <p>
                An Instance runs <strong>1 Worker</strong> by default (
                <InlineCode>agent</InlineCode>). Ask{" "}
                <InlineCode>create-agent</InlineCode> for{" "}
                <strong>N Workers</strong> to scaffold a Pool (
                <InlineCode>agent</InlineCode>,{" "}
                <InlineCode>agent-2..N</InlineCode>) pulling issues from the
                same Queue with distinct <InlineCode>WORKER_ID</InlineCode>s.
              </p>
            </>
          }
          commands={
            <>
              <CodeBlock
                tone="light"
                code={
                  "Use create-agent to create an agent for https://github.com/owner/repository in agent-instances/agent-repository/ (with 2 Workers)."
                }
              />
              <p className="text-xs font-mono text-slate-500">
                With Claude Code:
              </p>
              <CodeBlock
                code={
                  'cd agent-forge\nclaude "/create-agent https://<github-project-url>"'
                }
              />
            </>
          }
        />

        <Step
          number={3}
          title="Build and run with Docker Compose"
          explanation={
            <>
              <p>Run every command from the instance directory.</p>
              <p>
                The first Worker is <InlineCode>agent</InlineCode> with volume{" "}
                <InlineCode>agent_data</InlineCode>; further Workers are{" "}
                <InlineCode>agent-2..N</InlineCode> with volumes{" "}
                <InlineCode>data_2..N</InlineCode>. They share one image built
                once by <InlineCode>agent</InlineCode>. Only{" "}
                <InlineCode>down -v</InlineCode> deletes the volumes.
              </p>
            </>
          }
          commands={<CommandTable rows={COMPOSE_COMMANDS} />}
        />

        <Step
          number={4}
          title="Scale the Worker Pool with manage-pool"
          badge={
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200 font-mono text-[11px] font-bold">
              v0.4.0
            </span>
          }
          explanation={
            <>
              <p>
                Use the <InlineCode>manage-pool</InlineCode> skill to add,
                remove, drain or resume Workers on a live Instance. Because each
                Worker has its own persistent <InlineCode>/data</InlineCode>{" "}
                volume and <InlineCode>WORKER_ID</InlineCode> (
                <InlineCode>&lt;short-name&gt;-&lt;n&gt;</InlineCode>), Pools do{" "}
                <strong>not</strong> use{" "}
                <InlineCode>docker compose --scale</InlineCode>.
              </p>
              <p>
                Adding a Worker starts only the new{" "}
                <InlineCode>agent-&lt;n&gt;</InlineCode> container while other
                Workers keep running. Removing a Worker always drains it first
                and verifies no open issue holds its{" "}
                <InlineCode>claimed-by:&lt;worker-id&gt;</InlineCode> Claim.
              </p>
            </>
          }
          commands={
            <>
              <CodeBlock
                tone="light"
                code={
                  "Use manage-pool to add a Worker to agent-instances/agent-repository."
                }
              />
              <p className="text-xs font-mono text-slate-500">
                With Claude Code (<InlineCode>/manage-pool</InlineCode>):
              </p>
              <CommandTable rows={MANAGE_POOL_SKILL_COMMANDS} />
              <p className="text-xs font-mono text-slate-500">
                Direct Pool CLI commands:
              </p>
              <CommandTable rows={MANAGE_POOL_CLI_COMMANDS} />
            </>
          }
        />

        <Step
          number={5}
          title="Control Workers with agentctl"
          explanation={
            <>
              <p>
                <InlineCode>agentctl</InlineCode> runs inside each live Worker
                container (<InlineCode>&lt;service&gt;</InlineCode> is{" "}
                <InlineCode>agent</InlineCode> or{" "}
                <InlineCode>agent-2..N</InlineCode>). Start with{" "}
                <InlineCode>status</InlineCode>: its first line names{" "}
                <InlineCode>TARGET_REPO</InlineCode>, so check it before any
                mutating command.
              </p>
              <ul className="space-y-1.5">
                {AGENTCTL_WARNINGS.map((warning) => (
                  <li key={warning} className="flex gap-2 text-amber-800">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span className="text-[13px]">{warning}</span>
                  </li>
                ))}
              </ul>
            </>
          }
          commands={
            <>
              <PrefixLine prefix={AGENTCTL_POOL_PREFIX} />
              <CommandTable rows={AGENTCTL_COMMANDS} />
              <p className="text-xs font-mono text-slate-500">
                Example (target <InlineCode>agent</InlineCode> or{" "}
                <InlineCode>agent-2</InlineCode>):
              </p>
              <CodeBlock
                code={`${AGENTCTL_PREFIX} status\ndocker compose exec --user agent agent-2 /usr/local/bin/agentctl next issue 42`}
              />
            </>
          }
        />

        <Step
          number={6}
          title="Debug with debug-agent"
          explanation={
            <p>
              Ask your coding assistant to use the{" "}
              <InlineCode>debug-agent</InlineCode> skill. It inspects startup
              logs, persisted state, attempt events and validation output across
              any Worker in the Pool (<InlineCode>--worker 2</InlineCode> or{" "}
              <InlineCode>pool-status.sh</InlineCode>).
            </p>
          }
          commands={
            <>
              <CodeBlock
                tone="light"
                code={
                  "Use debug-agent to investigate agent-instances/agent-repository. Check the latest run for issue #42."
                }
              />
              <p className="text-xs font-mono text-slate-500">
                With Claude Code &amp; helper scripts:
              </p>
              <CodeBlock
                code={
                  'claude "/debug-agent <github-project-issue> [context:docker-context]"\n.agents/skills/debug-agent/scripts/locate-agent.sh --worker 2 repository 42'
                }
              />
            </>
          }
        />
      </ol>
    </section>
  );
}

// ============================================================================
// VARIANT B: Interactive Mode Switcher (Single Worker vs. Worker Pool N=2..4)
// ============================================================================
function VariantB() {
  const [mode, setMode] = useState<"single" | "pool">("pool");
  const [poolSize, setPoolSize] = useState<number>(3);
  const [selectedService, setSelectedService] = useState<string>("agent-2");

  const services =
    mode === "single"
      ? ["agent"]
      : Array.from({ length: poolSize }, (_, i) =>
          i === 0 ? "agent" : `agent-${i + 1}`
        );

  const activeService =
    mode === "single"
      ? "agent"
      : services.includes(selectedService)
      ? selectedService
      : "agent-2";

  const dynamicPrefix = `docker compose exec --user agent ${activeService} /usr/local/bin/agentctl`;

  return (
    <section
      id="quick-start"
      className="mt-20 sm:mt-28 max-w-5xl mx-auto scroll-mt-28 text-left"
    >
      <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
        <h2 className="text-2xl sm:text-4xl font-extrabold font-display tracking-tight text-slate-950">
          Quick start
        </h2>
        <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
          From zero to a running, controllable agent deployment in five steps
          with{" "}
          <a
            href={AGENT_FORGE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline font-mono inline-flex items-center gap-1"
          >
            agent-forge <ExternalLink className="w-3.5 h-3.5" />
          </a>
          . Choose your deployment topology below to tailor every command:
        </p>

        {/* Interactive Mode Switcher Bar */}
        <div className="mt-6 inline-flex flex-col sm:flex-row items-center gap-3 p-2 rounded-2xl bg-slate-100 border border-slate-200/90 shadow-xs">
          <div className="inline-flex items-center rounded-xl bg-white p-1 border border-slate-200/80 shadow-2xs">
            <button
              type="button"
              onClick={() => setMode("single")}
              className={`px-3.5 py-1.5 rounded-lg font-mono text-xs font-bold transition-all ${
                mode === "single"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              1 Worker (Default)
            </button>
            <button
              type="button"
              onClick={() => setMode("pool")}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-mono text-xs font-bold transition-all ${
                mode === "pool"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Boxes className="w-3.5 h-3.5" />
              <span>Worker Pool (v0.4.0)</span>
            </button>
          </div>

          {mode === "pool" && (
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-blue-50/90 border border-blue-200 text-xs font-mono text-blue-900">
              <span className="font-semibold">Workers (N):</span>
              {[2, 3, 4].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setPoolSize(n)}
                  className={`w-6 h-6 rounded-md font-bold transition-colors ${
                    poolSize === n
                      ? "bg-blue-600 text-white"
                      : "bg-white text-blue-700 border border-blue-200 hover:bg-blue-100"
                  }`}
                >
                  {n}
                </button>
              ))}
              <span className="hidden md:inline text-[11px] text-blue-700 pl-1">
                ({services.join(", ")})
              </span>
            </div>
          )}
        </div>
      </div>

      <ol className="relative before:absolute before:left-4 sm:before:left-5 before:top-2 before:bottom-2 before:w-px before:bg-slate-300">
        <Step
          number={1}
          title="Get ready"
          explanation={
            <>
              <p>You need:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Docker with Compose v2.17+</li>
                <li>A coding assistant (e.g. Claude Code)</li>
                <li>
                  A GitHub token with read/write access to the target
                  repo&apos;s contents, issues and pull requests
                </li>
                <li>Model API credentials</li>
              </ul>
            </>
          }
          commands={
            <CodeBlock
              code={
                "git clone https://github.com/lbacik/agent-forge.git\ncd agent-forge"
              }
            />
          }
        />

        <Step
          number={2}
          title={
            mode === "pool"
              ? `Create a Pool of ${poolSize} Workers with create-agent`
              : "Create an agent with create-agent"
          }
          explanation={
            mode === "pool" ? (
              <>
                <p>
                  Ask <InlineCode>create-agent</InlineCode> for{" "}
                  <strong>{poolSize} Workers</strong>. It scaffolds one Compose
                  project with services{" "}
                  <InlineCode>{services.join(", ")}</InlineCode> and dedicated
                  volumes (<InlineCode>agent_data</InlineCode>,{" "}
                  <InlineCode>
                    {poolSize === 2 ? "data_2" : `data_2..${poolSize}`}
                  </InlineCode>
                  ).
                </p>
                <p>
                  Workers sharing one GitHub login get unique{" "}
                  <InlineCode>WORKER_ID</InlineCode>s (
                  <InlineCode>
                    repository-1..{poolSize}
                  </InlineCode>
                  ) and coordinate via{" "}
                  <InlineCode>claimed-by:&lt;worker-id&gt;</InlineCode> labels
                  (requires <InlineCode>simple-coding-agent</InlineCode>{" "}
                  v0.9.0+).
                </p>
              </>
            ) : (
              <>
                <p>
                  Ask your coding assistant to use the{" "}
                  <InlineCode>create-agent</InlineCode> skill from{" "}
                  <a
                    href={AGENT_FORGE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline font-mono"
                  >
                    agent-forge
                  </a>
                  . It inspects the repository&apos;s stack and CI and generates
                  the instance: Dockerfile, compose file, profile and{" "}
                  <InlineCode>.env</InlineCode>.
                </p>
                <p>
                  Review <InlineCode>.env</InlineCode> and fill in missing
                  credentials before you start.
                </p>
              </>
            )
          }
          commands={
            <>
              <CodeBlock
                tone="light"
                code={
                  mode === "pool"
                    ? `Use create-agent to create an agent with ${poolSize} Workers for https://github.com/owner/repository in agent-instances/agent-repository/.`
                    : "Use create-agent to create an agent for https://github.com/owner/repository in agent-instances/agent-repository/."
                }
              />
              <p className="text-xs font-mono text-slate-500">
                With Claude Code:
              </p>
              <CodeBlock
                code={
                  mode === "pool"
                    ? `cd agent-forge\nclaude "/create-agent https://<github-project-url> with ${poolSize} workers"`
                    : 'cd agent-forge\nclaude "/create-agent https://<github-project-url>"'
                }
              />
            </>
          }
        />

        <Step
          number={3}
          title={
            mode === "pool"
              ? "Build, run & scale the Pool (Compose + manage-pool)"
              : "Build and run with Docker Compose"
          }
          explanation={
            mode === "pool" ? (
              <>
                <p>
                  <InlineCode>docker compose build</InlineCode> builds the image
                  once on <InlineCode>agent</InlineCode>;{" "}
                  <InlineCode>
                    agent-2{poolSize > 2 ? `..${poolSize}` : ""}
                  </InlineCode>{" "}
                  reuse it (<InlineCode>pull_policy: never</InlineCode>).
                </p>
                <p>
                  To add or remove Workers later without interrupting active
                  runs, use the <InlineCode>manage-pool</InlineCode> skill. It
                  Assigns the next monotonically increasing{" "}
                  <InlineCode>WORKER_ID</InlineCode> on scale-up, and drains +
                  verifies Claims before scale-down.
                </p>
              </>
            ) : (
              <>
                <p>Run every command from the instance directory.</p>
                <p>
                  The <InlineCode>agent_data</InlineCode> volume keeps the
                  repository checkout, state and attempt logs across restarts
                  and rebuilds. Only <InlineCode>down -v</InlineCode> deletes
                  it.
                </p>
              </>
            )
          }
          commands={
            <>
              <CommandTable rows={COMPOSE_COMMANDS} />
              {mode === "pool" && (
                <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-3.5 space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs font-bold text-blue-950 flex items-center gap-1.5">
                      <Boxes className="w-3.5 h-3.5 text-blue-600" />
                      Scaling live Workers with manage-pool
                    </span>
                    <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-semibold">
                      No --scale flag
                    </span>
                  </div>
                  <CommandTable
                    rows={[
                      {
                        command: `claude "/manage-pool add a worker to agent-repository"`,
                        description: (
                          <>
                            Adds <InlineCode>agent-{poolSize + 1}</InlineCode>{" "}
                            (<InlineCode>data_{poolSize + 1}</InlineCode>) and
                            runs{" "}
                            <InlineCode>
                              docker compose up -d agent-{poolSize + 1}
                            </InlineCode>
                            .
                          </>
                        ),
                      },
                      {
                        command: `claude "/manage-pool remove worker ${poolSize} from agent-repository"`,
                        description: (
                          <>
                            Drains <InlineCode>agent-{poolSize}</InlineCode>,
                            checks <InlineCode>claimed-by:*</InlineCode>, then
                            stops &amp; removes the service.
                          </>
                        ),
                      },
                      {
                        command: `claude "/manage-pool stop agent-repository"`,
                        description:
                          "Drains and pauses intake across the whole Pool (or a single Worker).",
                      },
                    ]}
                  />
                </div>
              )}
            </>
          }
        />

        <Step
          number={4}
          title="Control it with agentctl"
          explanation={
            <>
              <p>
                <InlineCode>agentctl</InlineCode> runs inside the live Worker
                container. Start with <InlineCode>status</InlineCode>: its first
                line names <InlineCode>TARGET_REPO</InlineCode>, so check it
                before any command that changes what the Worker does.
              </p>
              {mode === "pool" && (
                <p>
                  In a Pool, each <InlineCode>agentctl</InlineCode> command
                  targets one Worker service. Select a Worker on the right to
                  update the command prefix, or run{" "}
                  <InlineCode>pool-status.sh</InlineCode> to inspect all{" "}
                  {poolSize} Workers at once.
                </p>
              )}
              <ul className="space-y-1.5">
                {AGENTCTL_WARNINGS.map((warning) => (
                  <li key={warning} className="flex gap-2 text-amber-800">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span className="text-[13px]">{warning}</span>
                  </li>
                ))}
              </ul>
            </>
          }
          commands={
            <>
              {mode === "pool" && (
                <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
                  <span className="text-slate-500 mr-1">Target Worker:</span>
                  {services.map((svc, idx) => (
                    <button
                      key={svc}
                      type="button"
                      onClick={() => setSelectedService(svc)}
                      className={`px-2.5 py-1 rounded-lg border transition-colors ${
                        activeService === svc
                          ? "bg-slate-900 text-white border-slate-900 font-bold"
                          : "bg-white text-slate-700 border-slate-200 hover:border-blue-300"
                      }`}
                    >
                      {svc}{" "}
                      <span className="opacity-70 text-[10px]">
                        (repo-{idx + 1})
                      </span>
                    </button>
                  ))}
                </div>
              )}
              <PrefixLine prefix={dynamicPrefix} />
              <CommandTable rows={AGENTCTL_COMMANDS} />
              <p className="text-xs font-mono text-slate-500">Example:</p>
              <CodeBlock
                code={
                  mode === "pool"
                    ? `.agents/skills/debug-agent/scripts/pool-status.sh --github repository\n${dynamicPrefix} status\n${dynamicPrefix} next issue 42`
                    : `${AGENTCTL_PREFIX} status\n${AGENTCTL_PREFIX} next issue 42`
                }
              />
            </>
          }
        />

        <Step
          number={5}
          title="Debug with debug-agent"
          explanation={
            <p>
              Ask your coding assistant to use the{" "}
              <InlineCode>debug-agent</InlineCode> skill. It reads startup logs,
              persisted state, attempt events and validation output{" "}
              {mode === "pool" ? (
                <>
                  for any Worker in the Pool (pass{" "}
                  <InlineCode>--worker &lt;n|worker-id&gt;</InlineCode> to
                  target a specific Worker).
                </>
              ) : (
                "to tell whether the problem is in the target repository, the instance configuration or the upstream agent."
              )}
            </p>
          }
          commands={
            <>
              <CodeBlock
                tone="light"
                code={
                  "Use debug-agent to investigate agent-instances/agent-repository. Check the latest run for issue #42."
                }
              />
              <p className="text-xs font-mono text-slate-500">
                With Claude Code:
              </p>
              <CodeBlock
                code={
                  mode === "pool"
                    ? 'claude "/debug-agent <github-project-issue> [context:docker-context]"\n.agents/skills/debug-agent/scripts/locate-agent.sh --worker 2 repository 42'
                    : 'claude "/debug-agent <github-project-issue> [context:docker-context]"'
                }
              />
            </>
          }
        />
      </ol>
    </section>
  );
}

// ============================================================================
// VARIANT C: 5 Steps + Dedicated Worker Pool Scaling Console Card
// ============================================================================
type PoolOpTab = "add" | "remove" | "pause" | "status";

function VariantC() {
  const [activeTab, setActiveTab] = useState<PoolOpTab>("add");

  const OP_CONTENT: Record<
    PoolOpTab,
    {
      title: string;
      badge: string;
      summary: React.ReactNode;
      assistantCmd: string;
      cliCmd: string;
    }
  > = {
    add: {
      title: "Add a Worker to the Pool",
      badge: "Zero-downtime scale-up",
      summary: (
        <>
          Assigns the next monotonic number <InlineCode>n</InlineCode> (never
          reused), adds <InlineCode>agent-&lt;n&gt;</InlineCode> with{" "}
          <InlineCode>WORKER_ID: &lt;short-name&gt;-&lt;n&gt;</InlineCode> and
          volume <InlineCode>data_&lt;n&gt;:/data</InlineCode> to{" "}
          <InlineCode>compose.yaml</InlineCode>, and starts{" "}
          <strong>only</strong> the new Worker container.
        </>
      ),
      assistantCmd:
        '# Natural prompt or Claude Code skill:\nUse manage-pool to add a Worker to agent-instances/agent-repository.\n\nclaude "/manage-pool add a worker to agent-repository"',
      cliCmd:
        "# Validate updated compose.yaml and start only the new Worker:\ncd agent-instances/agent-repository\ndocker compose config -q\ndocker compose up -d agent-2",
    },
    remove: {
      title: "Drain & Remove a Worker",
      badge: "Claim-safe scale-down",
      summary: (
        <>
          Drains <InlineCode>agent-&lt;n&gt;</InlineCode> first (
          <InlineCode>agentctl stop</InlineCode>), refuses removal while an
          attempt is active or an open issue carries{" "}
          <InlineCode>claimed-by:&lt;worker-id&gt;</InlineCode>, then stops and
          removes the service while preserving its volume until you delete it.
        </>
      ),
      assistantCmd:
        '# Natural prompt or Claude Code skill:\nUse manage-pool to remove Worker 2 from agent-instances/agent-repository.\n\nclaude "/manage-pool remove worker 2 from agent-repository"',
      cliCmd:
        "# 1. Drain Worker 2 and verify no active attempt:\ndocker compose exec -u agent agent-2 /usr/local/bin/agentctl stop\ndocker compose exec -u agent agent-2 /usr/local/bin/agentctl status\n\n# 2. Stop & remove container (after removing stanza from compose.yaml):\ndocker compose stop agent-2 && docker compose rm -f agent-2",
    },
    pause: {
      title: "Stop, Drain or Resume Intake",
      badge: "Per-Worker or whole Pool",
      summary: (
        <>
          <InlineCode>agentctl stop</InlineCode> lets the current attempt finish
          and persists the paused intake state on <InlineCode>/data</InlineCode>{" "}
          across restarts. <InlineCode>agentctl resume</InlineCode> re-enables
          issue intake on one Worker or across the entire Pool.
        </>
      ),
      assistantCmd:
        '# Pause or resume one Worker or the entire Pool:\nclaude "/manage-pool stop agent-repository"\nclaude "/manage-pool resume agent-repository"\nclaude "/manage-pool let a worker take #42 next in agent-repository"',
      cliCmd:
        "# Stop or resume a specific Worker (agent, agent-2..N):\ndocker compose exec -u agent agent-2 /usr/local/bin/agentctl stop\ndocker compose exec -u agent agent-2 /usr/local/bin/agentctl resume\n\n# Prioritise issue #42 on an idle Worker:\ndocker compose exec -u agent agent-2 /usr/local/bin/agentctl next issue 42",
    },
    status: {
      title: "Inspect Live Pool & Claims",
      badge: "Read-only diagnostics",
      summary: (
        <>
          <InlineCode>pool-status.sh</InlineCode> queries every Worker in the
          Instance in one pass — printing container state, intake status, active
          issue, <InlineCode>pending_next_issue</InlineCode>, and cross-checking
          GitHub <InlineCode>claimed-by:&lt;worker-id&gt;</InlineCode> labels.
        </>
      ),
      assistantCmd:
        '# Ask debug-agent to inspect a specific Worker or issue:\nclaude "/debug-agent repository #42"\nUse debug-agent to check Worker 2 in agent-instances/agent-repository.',
      cliCmd:
        "# Overview of all Workers + GitHub Claim marker verification:\n.agents/skills/debug-agent/scripts/pool-status.sh --github repository\n\n# Inspect a specific Worker's runs and logs:\n.agents/skills/debug-agent/scripts/locate-agent.sh --worker 2 repository 42",
    },
  };

  const currentOp = OP_CONTENT[activeTab];

  return (
    <section
      id="quick-start"
      className="mt-20 sm:mt-28 max-w-5xl mx-auto scroll-mt-28 text-left"
    >
      <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
        <h2 className="text-2xl sm:text-4xl font-extrabold font-display tracking-tight text-slate-950">
          Quick start
        </h2>
        <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
          From zero to a running, controllable agent instance in five steps,
          with{" "}
          <a
            href={AGENT_FORGE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline font-mono inline-flex items-center gap-1"
          >
            agent-forge <ExternalLink className="w-3.5 h-3.5" />
          </a>{" "}
          — plus multi-Worker Pool scaling right below.
        </p>
      </div>

      <ol className="relative before:absolute before:left-4 sm:before:left-5 before:top-2 before:bottom-2 before:w-px before:bg-slate-300">
        <Step
          number={1}
          title="Get ready"
          explanation={
            <>
              <p>You need:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Docker with Compose v2.17+</li>
                <li>A coding assistant (e.g. Claude Code)</li>
                <li>
                  A GitHub token with read/write access to the target
                  repo&apos;s contents, issues and pull requests
                </li>
                <li>Model API credentials</li>
              </ul>
            </>
          }
          commands={
            <CodeBlock
              code={
                "git clone https://github.com/lbacik/agent-forge.git\ncd agent-forge"
              }
            />
          }
        />

        <Step
          number={2}
          title="Create an agent with create-agent"
          explanation={
            <>
              <p>
                Ask your coding assistant to use the{" "}
                <InlineCode>create-agent</InlineCode> skill from{" "}
                <a
                  href={AGENT_FORGE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline font-mono"
                >
                  agent-forge
                </a>
                . It inspects the repository&apos;s stack and CI and generates
                the instance: Dockerfile, compose file, profile and{" "}
                <InlineCode>.env</InlineCode>.
              </p>
              <p>
                An instance starts with 1 Worker by default, or ask{" "}
                <InlineCode>create-agent</InlineCode> for{" "}
                <strong>N Workers</strong> to scaffold a Pool immediately.
              </p>
            </>
          }
          commands={
            <>
              <CodeBlock
                tone="light"
                code={
                  "Use create-agent to create an agent for https://github.com/owner/repository in agent-instances/agent-repository/."
                }
              />
              <p className="text-xs font-mono text-slate-500">
                With Claude Code:
              </p>
              <CodeBlock
                code={
                  'cd agent-forge\nclaude "/create-agent https://<github-project-url>"'
                }
              />
            </>
          }
        />

        <Step
          number={3}
          title="Build and run with Docker Compose"
          explanation={
            <>
              <p>Run every command from the instance directory.</p>
              <p>
                The <InlineCode>agent_data</InlineCode> volume (and{" "}
                <InlineCode>data_2..N</InlineCode> in a Pool) keeps the
                repository checkout, state and attempt logs across restarts and
                rebuilds. Only <InlineCode>down -v</InlineCode> deletes it.
              </p>
            </>
          }
          commands={<CommandTable rows={COMPOSE_COMMANDS} />}
        />

        <Step
          number={4}
          title="Control it with agentctl"
          explanation={
            <>
              <p>
                <InlineCode>agentctl</InlineCode> runs inside the live
                container (<InlineCode>agent</InlineCode> or{" "}
                <InlineCode>agent-2..N</InlineCode>). Start with{" "}
                <InlineCode>status</InlineCode>: its first line names{" "}
                <InlineCode>TARGET_REPO</InlineCode>, so check it before any
                command that changes what the agent does.
              </p>
              <ul className="space-y-1.5">
                {AGENTCTL_WARNINGS.map((warning) => (
                  <li key={warning} className="flex gap-2 text-amber-800">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span className="text-[13px]">{warning}</span>
                  </li>
                ))}
              </ul>
            </>
          }
          commands={
            <>
              <PrefixLine prefix={AGENTCTL_PREFIX} />
              <CommandTable rows={AGENTCTL_COMMANDS} />
              <p className="text-xs font-mono text-slate-500">Example:</p>
              <CodeBlock
                code={`${AGENTCTL_PREFIX} status\n${AGENTCTL_PREFIX} next issue 42`}
              />
            </>
          }
        />

        <Step
          number={5}
          title="Debug with debug-agent"
          explanation={
            <p>
              Ask your coding assistant to use the{" "}
              <InlineCode>debug-agent</InlineCode> skill. It reads startup logs,
              persisted state, attempt events and validation output to tell
              whether the problem is in the target repository, the instance
              configuration or the upstream agent.
            </p>
          }
          commands={
            <>
              <CodeBlock
                tone="light"
                code={
                  "Use debug-agent to investigate agent-instances/agent-repository. Check the latest run for issue #42."
                }
              />
              <p className="text-xs font-mono text-slate-500">
                With Claude Code:
              </p>
              <CodeBlock
                code={
                  'claude "/debug-agent <github-project-issue> [context:docker-context]"'
                }
              />
            </>
          }
        />
      </ol>

      {/* Dedicated v0.4.0 Multi-Worker Pool Scaling Console */}
      <div className="mt-14 rounded-3xl border border-slate-200/90 bg-white shadow-lg shadow-slate-900/5 overflow-hidden">
        <div className="bg-slate-950 text-white px-6 py-5 sm:px-8 sm:py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 rounded-md mb-2">
              <Boxes className="w-3.5 h-3.5" />
              <span>Scale Out • agent-forge v0.4.0+</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-display font-extrabold tracking-tight text-white">
              Multi-Worker Repository Pools (<code className="font-mono text-blue-400">manage-pool</code>)
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-slate-300 max-w-2xl">
              Run multiple concurrent Workers against one GitHub repository Queue.
              Each Worker is an isolated Compose service with its own{" "}
              <code className="font-mono text-slate-100">/data</code> volume and{" "}
              <code className="font-mono text-slate-100">WORKER_ID</code>.
            </p>
          </div>
          <a
            href={AGENT_FORGE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-slate-200 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700 px-3.5 py-2 rounded-xl shrink-0 self-start sm:self-center transition-colors"
          >
            <span>agent-forge v0.4.0</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="grid lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
          {/* Left Column: Pool Topology & Architecture */}
          <div className="lg:col-span-5 p-6 sm:p-7 bg-slate-50/70 flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              <div className="font-mono text-xs font-bold uppercase tracking-wider text-slate-500">
                Pool Architecture (1 Instance → N Workers)
              </div>

              <div className="space-y-2.5 font-mono text-xs">
                <div className="rounded-xl border border-blue-200 bg-white p-3 shadow-2xs">
                  <div className="flex items-center justify-between text-slate-900 font-bold">
                    <span>service: agent</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                      builds image
                    </span>
                  </div>
                  <div className="mt-1 text-[11px] text-slate-500 flex flex-wrap gap-x-3">
                    <span>vol: agent_data:/data</span>
                    <span>id: repo-1</span>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-2xs">
                  <div className="flex items-center justify-between text-slate-900 font-bold">
                    <span>service: agent-2</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                      pull_policy: never
                    </span>
                  </div>
                  <div className="mt-1 text-[11px] text-slate-500 flex flex-wrap gap-x-3">
                    <span>vol: data_2:/data</span>
                    <span>id: repo-2</span>
                  </div>
                </div>

                <div className="rounded-xl border border-dashed border-slate-300 bg-white/70 p-3">
                  <div className="flex items-center justify-between text-slate-700 font-bold">
                    <span>service: agent-3..N</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                      + manage-pool
                    </span>
                  </div>
                  <div className="mt-1 text-[11px] text-slate-500 flex flex-wrap gap-x-3">
                    <span>vol: data_3..N:/data</span>
                    <span>id: repo-3..N</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-3.5 text-xs text-slate-600 space-y-1.5">
              <div className="font-mono font-bold text-slate-900 flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                <span>Claim coordination &amp; limits</span>
              </div>
              <p className="leading-relaxed">
                Workers sharing a GitHub token coordinate with{" "}
                <InlineCode>claimed-by:&lt;worker-id&gt;</InlineCode> labels and
                author commits as{" "}
                <InlineCode>Claude Code (&lt;worker-id&gt;)</InlineCode>. Default
                per-Worker limits (<InlineCode>1.5 CPUs</InlineCode>,{" "}
                <InlineCode>3g</InlineCode> RAM) are configurable in{" "}
                <InlineCode>.env</InlineCode>.
              </p>
            </div>
          </div>

          {/* Right Column: Interactive Scaling Playbook */}
          <div className="lg:col-span-7 p-6 sm:p-7 space-y-5">
            <div className="flex flex-wrap gap-1.5 p-1 rounded-xl bg-slate-100 border border-slate-200">
              <button
                type="button"
                onClick={() => setActiveTab("add")}
                className={`flex-1 min-w-[120px] inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg font-mono text-xs font-bold transition-all ${
                  activeTab === "add"
                    ? "bg-white text-blue-700 shadow-xs border border-slate-200/80"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Scale Up (+1)</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("remove")}
                className={`flex-1 min-w-[120px] inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg font-mono text-xs font-bold transition-all ${
                  activeTab === "remove"
                    ? "bg-white text-blue-700 shadow-xs border border-slate-200/80"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Minus className="w-3.5 h-3.5" />
                <span>Scale Down (-1)</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("pause")}
                className={`flex-1 min-w-[120px] inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg font-mono text-xs font-bold transition-all ${
                  activeTab === "pause"
                    ? "bg-white text-blue-700 shadow-xs border border-slate-200/80"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <PauseCircle className="w-3.5 h-3.5" />
                <span>Stop / Resume</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("status")}
                className={`flex-1 min-w-[120px] inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg font-mono text-xs font-bold transition-all ${
                  activeTab === "status"
                    ? "bg-white text-blue-700 shadow-xs border border-slate-200/80"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Activity className="w-3.5 h-3.5" />
                <span>Pool Status</span>
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="font-display font-bold text-base text-slate-950">
                  {currentOp.title}
                </h4>
                <span className="font-mono text-[11px] font-semibold px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                  {currentOp.badge}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {currentOp.summary}
              </p>

              <div className="space-y-2">
                <div className="text-xs font-mono font-semibold text-slate-700 flex items-center gap-1.5">
                  <Wand2 className="w-3.5 h-3.5 text-amber-600" />
                  <span>With Coding Assistant (manage-pool skill):</span>
                </div>
                <CodeBlock tone="light" code={currentOp.assistantCmd} />
              </div>

              <div className="space-y-2">
                <div className="text-xs font-mono font-semibold text-slate-700 flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-blue-600" />
                  <span>Direct CLI / Docker Compose commands:</span>
                </div>
                <CodeBlock code={currentOp.cliCmd} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// VARIANT D: 6-Step Timeline + Visual Pool Strip & Dual-Tab Step 4
// ============================================================================
function VariantD() {
  const [step4Tab, setStep4Tab] = useState<"skill" | "cli">("skill");

  return (
    <section
      id="quick-start"
      className="mt-20 sm:mt-28 max-w-5xl mx-auto scroll-mt-28 text-left"
    >
      <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
        <h2 className="text-2xl sm:text-4xl font-extrabold font-display tracking-tight text-slate-950">
          Quick start
        </h2>
        <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
          From zero to a running, controllable agent instance — or a multi-Worker
          Pool — in six steps with{" "}
          <a
            href={AGENT_FORGE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline font-mono inline-flex items-center gap-1"
          >
            agent-forge v0.4.0 <ExternalLink className="w-3.5 h-3.5" />
          </a>
          .
        </p>
      </div>

      <ol className="relative before:absolute before:left-4 sm:before:left-5 before:top-2 before:bottom-2 before:w-px before:bg-slate-300">
        <Step
          number={1}
          title="Get ready"
          explanation={
            <>
              <p>You need:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Docker with Compose v2.17+</li>
                <li>A coding assistant (e.g. Claude Code)</li>
                <li>
                  A GitHub token with read/write access to the target
                  repo&apos;s contents, issues and pull requests
                </li>
                <li>Model API credentials</li>
              </ul>
            </>
          }
          commands={
            <CodeBlock
              code={
                "git clone https://github.com/lbacik/agent-forge.git\ncd agent-forge"
              }
            />
          }
        />

        <Step
          number={2}
          title="Create an agent (or Pool) with create-agent"
          explanation={
            <>
              <p>
                Ask your coding assistant to use the{" "}
                <InlineCode>create-agent</InlineCode> skill from{" "}
                <a
                  href={AGENT_FORGE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline font-mono"
                >
                  agent-forge
                </a>
                . It inspects the repository&apos;s stack and CI and generates
                the instance: Dockerfile, compose file, profile and{" "}
                <InlineCode>.env</InlineCode>.
              </p>
              <p>
                An instance runs 1 Worker by default; ask{" "}
                <InlineCode>create-agent</InlineCode> for{" "}
                <strong>N Workers</strong> to generate a Pool taking issues from
                the same Queue.
              </p>
            </>
          }
          commands={
            <>
              <CodeBlock
                tone="light"
                code={
                  "Use create-agent to create an agent for https://github.com/owner/repository in agent-instances/agent-repository/ (with 2 Workers)."
                }
              />
              <p className="text-xs font-mono text-slate-500">
                With Claude Code:
              </p>
              <CodeBlock
                code={
                  'cd agent-forge\nclaude "/create-agent https://<github-project-url>"'
                }
              />
            </>
          }
        />

        <Step
          number={3}
          title="Build and run with Docker Compose"
          explanation={
            <>
              <p>Run every command from the instance directory.</p>
              <p>
                The <InlineCode>agent_data</InlineCode> volume (plus{" "}
                <InlineCode>data_2..N</InlineCode> for additional Workers) keeps
                the repository checkout, state and attempt logs across restarts
                and rebuilds. Only <InlineCode>down -v</InlineCode> deletes
                them.
              </p>
            </>
          }
          commands={<CommandTable rows={COMPOSE_COMMANDS} />}
        />

        <Step
          number={4}
          title="Scale the Worker Pool with manage-pool"
          badge={
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 font-mono text-[11px] font-semibold">
              <Layers className="w-3 h-3" />
              Pool Scaling
            </span>
          }
          explanation={
            <>
              <p>
                Add, remove, stop or resume Workers with{" "}
                <InlineCode>manage-pool</InlineCode>. Each Worker has its own
                volume and <InlineCode>WORKER_ID</InlineCode> (
                <InlineCode>&lt;short-name&gt;-&lt;n&gt;</InlineCode>), so
                scaling edits <InlineCode>compose.yaml</InlineCode> rather than
                using <InlineCode>docker compose --scale</InlineCode>.
              </p>

              {/* Compact Visual Topology Strip */}
              <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-3 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
                  <span>INSTANCE POOL TOPOLOGY</span>
                  <span className="text-emerald-700 font-semibold">
                    claimed-by:&lt;worker-id&gt;
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-1.5 font-mono text-[11px]">
                  <div className="rounded-lg bg-white border border-slate-200 p-2">
                    <div className="font-bold text-slate-900">agent</div>
                    <div className="text-slate-500 text-[10px]">agent_data</div>
                    <div className="text-blue-600 text-[10px]">id: repo-1</div>
                  </div>
                  <div className="rounded-lg bg-white border border-slate-200 p-2">
                    <div className="font-bold text-slate-900">agent-2</div>
                    <div className="text-slate-500 text-[10px]">data_2</div>
                    <div className="text-blue-600 text-[10px]">id: repo-2</div>
                  </div>
                  <div className="rounded-lg bg-emerald-50/70 border border-dashed border-emerald-300 p-2">
                    <div className="font-bold text-emerald-900">agent-N</div>
                    <div className="text-emerald-700 text-[10px]">data_N</div>
                    <div className="text-emerald-700 text-[10px]">+ scale</div>
                  </div>
                </div>
              </div>
            </>
          }
          commands={
            <>
              <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200">
                <button
                  type="button"
                  onClick={() => setStep4Tab("skill")}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-xs font-bold transition-all ${
                    step4Tab === "skill"
                      ? "bg-white text-slate-900 shadow-2xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Wand2 className="w-3.5 h-3.5 text-amber-600" />
                  <span>manage-pool Skill</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStep4Tab("cli")}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-xs font-bold transition-all ${
                    step4Tab === "cli"
                      ? "bg-white text-slate-900 shadow-2xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Terminal className="w-3.5 h-3.5 text-blue-600" />
                  <span>Docker Compose &amp; CLI</span>
                </button>
              </div>

              {step4Tab === "skill" ? (
                <>
                  <CodeBlock
                    tone="light"
                    code={
                      "Use manage-pool to add a Worker to agent-instances/agent-repository."
                    }
                  />
                  <CommandTable rows={MANAGE_POOL_SKILL_COMMANDS} />
                </>
              ) : (
                <>
                  <CommandTable rows={MANAGE_POOL_CLI_COMMANDS} />
                  <CodeBlock
                    code={
                      "# Start only the newly added Worker:\ndocker compose up -d agent-2\n\n# Check all Workers and GitHub Claim markers:\n.agents/skills/debug-agent/scripts/pool-status.sh --github repository"
                    }
                  />
                </>
              )}
            </>
          }
        />

        <Step
          number={5}
          title="Control Workers with agentctl"
          explanation={
            <>
              <p>
                <InlineCode>agentctl</InlineCode> runs inside the live Worker
                container (<InlineCode>agent</InlineCode> or{" "}
                <InlineCode>agent-2..N</InlineCode>). Start with{" "}
                <InlineCode>status</InlineCode>: its first line names{" "}
                <InlineCode>TARGET_REPO</InlineCode>, so check it before any
                command that changes what the Worker does.
              </p>
              <p>
                You can also perform these actions (<InlineCode>stop</InlineCode>,{" "}
                <InlineCode>resume</InlineCode>,{" "}
                <InlineCode>handoff now</InlineCode>,{" "}
                <InlineCode>next issue</InlineCode>) from the browser via the{" "}
                <a
                  href="#dashboard"
                  className="text-blue-600 hover:underline font-semibold"
                >
                  Agent Dashboard ↓
                </a>{" "}
                control console.
              </p>
              <ul className="space-y-1.5">
                {AGENTCTL_WARNINGS.map((warning) => (
                  <li key={warning} className="flex gap-2 text-amber-800">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span className="text-[13px]">{warning}</span>
                  </li>
                ))}
              </ul>
            </>
          }
          commands={
            <>
              <PrefixLine prefix={AGENTCTL_POOL_PREFIX} />
              <CommandTable rows={AGENTCTL_COMMANDS} />
              <p className="text-xs font-mono text-slate-500">Example:</p>
              <CodeBlock
                code={`${AGENTCTL_PREFIX} status\ndocker compose exec --user agent agent-2 /usr/local/bin/agentctl next issue 42`}
              />
            </>
          }
        />

        <Step
          number={6}
          title="Debug with debug-agent"
          explanation={
            <p>
              Ask your coding assistant to use the{" "}
              <InlineCode>debug-agent</InlineCode> skill. It reads startup logs,
              persisted state, attempt events and validation output across any
              Worker in the Pool (<InlineCode>--worker 2</InlineCode> or{" "}
              <InlineCode>pool-status.sh</InlineCode>).
            </p>
          }
          commands={
            <>
              <CodeBlock
                tone="light"
                code={
                  "Use debug-agent to investigate agent-instances/agent-repository. Check the latest run for issue #42."
                }
              />
              <p className="text-xs font-mono text-slate-500">
                With Claude Code:
              </p>
              <CodeBlock
                code={
                  'claude "/debug-agent <github-project-issue> [context:docker-context]"'
                }
              />
            </>
          }
        />
      </ol>
    </section>
  );
}

export function QuickStart() {
  const { variant } = usePrototypeVariant();

  if (variant === "B") return <VariantB />;
  if (variant === "C") return <VariantC />;
  if (variant === "D") return <VariantD />;
  return <VariantA />;
}
