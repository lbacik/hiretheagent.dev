"use client";

import { useState } from "react";
import { AlertTriangle, Check, Copy, ExternalLink } from "lucide-react";

const AGENT_FORGE_URL = "https://github.com/lbacik/agent-forge";
const AGENTCTL_PREFIX =
  "docker compose exec --user agent agent /usr/local/bin/agentctl";

function CopyButton({ text, dark }: { text: string; dark: boolean }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
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

  return (
    <button
      type="button"
      onClick={copy}
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
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(prefix);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <div className="flex items-start gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5">
      <code className="font-mono text-xs text-slate-600 break-all flex-1">
        <span className="text-slate-400">prefix: </span>
        {prefix}
      </code>
      <button
        type="button"
        onClick={copy}
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
    description: "Build the image. Rebuild after profile or Dockerfile changes.",
  },
  {
    command: "docker compose up -d",
    description:
      "Start the agent. Run it again after a rebuild to apply the new image.",
  },
  {
    command: "docker compose ps",
    description: "Check that the container is running.",
  },
  {
    command: "docker compose logs --tail=100 -f",
    description: "Follow the startup logs.",
  },
  {
    command: "docker compose down",
    description: (
      <>
        Stop the agent. The <InlineCode>agent_data</InlineCode> volume is kept.
      </>
    ),
  },
  {
    command: "docker compose down -v",
    description: (
      <>
        Also deletes <InlineCode>agent_data</InlineCode>: the repository
        checkout, state and attempt logs.
      </>
    ),
    destructive: true,
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
    description: "Stop picking up new issues.",
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
        Make this issue the next one the agent claims. It takes the issue{" "}
        <strong>number</strong>, not the URL: for{" "}
        <InlineCode>&lt;github-issue-url&gt;</InlineCode> ending in{" "}
        <InlineCode>/issues/42</InlineCode>, pass <InlineCode>42</InlineCode>.{" "}
        (<InlineCode>agentctl</InlineCode> rejects anything that isn&apos;t a
        positive integer.)
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
  "Never use docker compose run to issue commands. Only the live agent in its own container accepts them.",
];

export function QuickStart() {
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
                Review <InlineCode>.env</InlineCode> and fill in missing
                credentials before you start.
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
                The <InlineCode>agent_data</InlineCode> volume keeps the
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
                container. Start with <InlineCode>status</InlineCode>: its
                first line names <InlineCode>TARGET_REPO</InlineCode>, so check
                it before any command that changes what the agent does.
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
    </section>
  );
}
