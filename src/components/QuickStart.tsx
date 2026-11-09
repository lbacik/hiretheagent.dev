"use client";

import { useState } from "react";
import {
  AlertTriangle,
  Check,
  Copy,
  ExternalLink,
  Layers,
  Terminal,
  Wand2,
} from "lucide-react";

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
      // Clipboard API unavailable (e.g. insecure context); still show feedback.
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

function PrefixLine({ prefix }: { prefix: string }) {
  const { copied, copy } = useCopy();

  return (
    <div className="flex items-start gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5">
      <code className="font-mono text-xs text-slate-600 break-all flex-1">
        <span className="text-slate-400">prefix: </span>
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
    description:
      "Follow the startup logs (pass a service name for one Worker).",
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
    command:
      ".agents/skills/debug-agent/scripts/pool-status.sh --github repository",
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
    command:
      "docker compose exec -u agent agent-2 /usr/local/bin/agentctl stop",
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

export function QuickStart() {
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
          From zero to a running, controllable agent instance — or a
          multi-Worker Pool — in six steps with{" "}
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
                You can also perform these actions (<InlineCode>stop</InlineCode>
                , <InlineCode>resume</InlineCode>,{" "}
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
                code={`${AGENTCTL_PREFIX} status\n${AGENTCTL_POOL_PREFIX.replace("<service>", "agent-2")} next issue 42`}
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
