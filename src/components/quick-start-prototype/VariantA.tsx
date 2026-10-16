// PROTOTYPE (issue #3), variant A: numbered vertical timeline, prose left, commands right.

import { AlertTriangle, ExternalLink } from "lucide-react";
import { CodeBlock } from "./CodeBlock";
import {
  AGENT_FORGE_URL,
  AGENTCTL,
  AGENTCTL_WARNINGS,
  CLONE,
  CREATE_CLAUDE,
  CREATE_PROMPT,
  DEBUG_CLAUDE,
  DEBUG_PROMPT,
  PREREQUISITES,
} from "./content";

export const name = "Timeline";

function Step({
  n,
  title,
  children,
  code,
}: {
  n: number;
  title: string;
  children: React.ReactNode;
  code: React.ReactNode;
}) {
  return (
    <li className="relative pl-12 sm:pl-14 pb-10 last:pb-0">
      <span className="absolute left-0 top-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-blue-600 text-white font-mono font-bold text-sm flex items-center justify-center shadow-md shadow-blue-600/30">
        {n}
      </span>
      <div className="grid gap-4 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-8">
        <div className="min-w-0">
          <h3 className="font-display font-bold text-lg text-slate-950">{title}</h3>
          <div className="mt-2 text-sm text-slate-600 leading-relaxed space-y-2">{children}</div>
        </div>
        <div className="min-w-0 space-y-2">{code}</div>
      </div>
    </li>
  );
}

export function VariantA() {
  return (
    <section id="quick-start" className="mt-20 sm:mt-28 max-w-5xl mx-auto scroll-mt-28 text-left">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h2 className="text-2xl sm:text-4xl font-extrabold font-display tracking-tight text-slate-950">
          Quick start
        </h2>
        <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
          From zero to an agent working on your repository in five steps, with{" "}
          <a href={AGENT_FORGE_URL} className="text-blue-600 hover:underline font-mono inline-flex items-center gap-1">
            agent-forge <ExternalLink className="w-3.5 h-3.5" />
          </a>
          .
        </p>
      </div>

      <ol className="relative before:absolute before:left-4 sm:before:left-[18px] before:top-2 before:bottom-2 before:w-px before:bg-slate-300">
        <Step
          n={1}
          title="Get ready"
          code={<CodeBlock code={CLONE} />}
        >
          <p>You need:</p>
          <ul className="list-disc pl-5 space-y-1">
            {PREREQUISITES.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </Step>

        <Step
          n={2}
          title="Create an agent with create-agent"
          code={
            <>
              <CodeBlock code={CREATE_PROMPT} prompt="" tone="light" />
              <p className="text-xs font-mono text-slate-500">With Claude Code:</p>
              <CodeBlock code={CREATE_CLAUDE} />
            </>
          }
        >
          <p>
            Ask your coding assistant to use the <code className="font-mono text-slate-900">create-agent</code> skill.
            It inspects the repository&apos;s stack and CI and generates the instance: Dockerfile, compose file,
            profile and <code className="font-mono">.env</code>.
          </p>
          <p>Review <code className="font-mono">.env</code> and fill in missing credentials before you start.</p>
        </Step>

        <Step
          n={3}
          title="Build and run with Docker Compose"
          code={
            <>
              <CodeBlock
                code={"cd agent-instances/agent-repository\ndocker compose config -q\ndocker compose build\ndocker compose up -d"}
              />
              <CodeBlock code={"docker compose ps\ndocker compose logs --tail=100 -f"} />
              <CodeBlock code={"docker compose down"} />
            </>
          }
        >
          <p>Run every command from the instance directory.</p>
          <p>
            The <code className="font-mono">agent_data</code> volume keeps the repository checkout, state and attempt
            logs across restarts. After changing the profile or Dockerfile, rebuild and run{" "}
            <code className="font-mono">up -d</code> again.
          </p>
          <p className="flex gap-2 text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>
              <code className="font-mono">docker compose down -v</code> deletes that volume.
            </span>
          </p>
        </Step>

        <Step
          n={4}
          title="Control it with agentctl"
          code={
            <>
              <CodeBlock code={`${AGENTCTL} status`} />
              <CodeBlock code={`${AGENTCTL} stop\n${AGENTCTL} resume\n${AGENTCTL} next issue\n${AGENTCTL} handoff now`} />
            </>
          }
        >
          <p>
            <code className="font-mono">agentctl</code> runs inside the live container. Start with{" "}
            <code className="font-mono">status</code>: its first line names <code className="font-mono">TARGET_REPO</code>;
            check it before any command that changes what the agent does.
          </p>
          <ul className="space-y-1.5">
            {AGENTCTL_WARNINGS.map((w) => (
              <li key={w} className="flex gap-2 text-amber-800">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{w}</span>
              </li>
            ))}
          </ul>
        </Step>

        <Step
          n={5}
          title="Debug with debug-agent"
          code={
            <>
              <CodeBlock code={DEBUG_PROMPT} prompt="" tone="light" />
              <p className="text-xs font-mono text-slate-500">With Claude Code:</p>
              <CodeBlock code={DEBUG_CLAUDE} />
            </>
          }
        >
          <p>
            Something off? Ask your coding assistant to use the <code className="font-mono">debug-agent</code> skill.
            It reads startup logs, persisted state, attempt events and validation output to tell whether the problem
            is in the target repository, the instance configuration or the upstream agent.
          </p>
        </Step>
      </ol>
    </section>
  );
}
