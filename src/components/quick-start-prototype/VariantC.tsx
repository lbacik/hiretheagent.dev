// PROTOTYPE (issue #3), variant C: horizontal pipeline overview, then a dense command cheat sheet.

import { AlertTriangle, ArrowRight, Bug, Hammer, Play, Sparkles, SlidersHorizontal } from "lucide-react";
import { CodeBlock } from "./CodeBlock";
import {
  AGENT_FORGE_URL,
  AGENTCTL,
  AGENTCTL_COMMANDS,
  AGENTCTL_WARNINGS,
  COMPOSE_COMMANDS,
  CREATE_CLAUDE,
  CREATE_PROMPT,
  DEBUG_CLAUDE,
  DEBUG_PROMPT,
  PREREQUISITES,
} from "./content";

export const name = "Pipeline + cheat sheet";

const PIPELINE = [
  { icon: Sparkles, label: "create-agent", sub: "skill" },
  { icon: Hammer, label: "build", sub: "docker compose" },
  { icon: Play, label: "up -d", sub: "docker compose" },
  { icon: SlidersHorizontal, label: "agentctl", sub: "docker compose exec" },
  { icon: Bug, label: "debug-agent", sub: "skill" },
];

export function Table({ rows, prefix }: { rows: { cmd: string; what: string; danger?: boolean }[]; prefix?: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden divide-y divide-slate-100">
      {rows.map((r) => (
        <div key={r.cmd} className="grid sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-1 sm:gap-4 px-4 py-2.5">
          <code className={`font-mono text-xs break-all ${r.danger ? "text-red-600" : "text-slate-900"}`}>
            {prefix && <span className="text-slate-400">{prefix} </span>}
            {r.cmd}
          </code>
          <span className={`text-xs ${r.danger ? "text-red-600" : "text-slate-600"}`}>{r.what}</span>
        </div>
      ))}
    </div>
  );
}

export function VariantC() {
  return (
    <section id="quick-start" className="mt-20 sm:mt-28 max-w-5xl mx-auto scroll-mt-28 text-left">
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-4xl font-extrabold font-display tracking-tight text-slate-950">Quick start</h2>
        <p className="mt-3 text-sm sm:text-base text-slate-600">
          The whole lifecycle of an agent instance built with{" "}
          <a href={AGENT_FORGE_URL} className="text-blue-600 hover:underline font-mono">
            agent-forge
          </a>
          .
        </p>
      </div>

      {/* Pipeline */}
      <div className="flex flex-col sm:flex-row sm:items-stretch gap-2 sm:gap-0">
        {PIPELINE.map((s, i) => (
          <div key={s.label} className="flex flex-col sm:flex-row items-center sm:flex-1">
            <div className="w-full sm:flex-1 bg-white border border-slate-200 rounded-xl px-3 py-4 text-center shadow-sm">
              <s.icon className="w-5 h-5 mx-auto text-blue-600" />
              <div className="mt-2 font-mono font-semibold text-sm text-slate-900">{s.label}</div>
              <div className="text-[11px] font-mono text-slate-500">{s.sub}</div>
            </div>
            {i < PIPELINE.length - 1 && (
              <ArrowRight className="w-4 h-4 text-slate-400 shrink-0 rotate-90 sm:rotate-0 sm:mx-1 my-1 sm:my-0" />
            )}
          </div>
        ))}
      </div>

      <p className="mt-4 text-center text-xs font-mono text-slate-500">Needs: {PREREQUISITES.join(" · ")}</p>

      {/* Cheat sheet */}
      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <div className="space-y-6">
          <div>
            <h3 className="font-display font-bold text-slate-950 mb-1">Create</h3>
            <p className="text-sm text-slate-600 mb-3">
              In the agent-forge checkout, ask your coding assistant to use <code className="font-mono">create-agent</code>.
              It generates the instance from your repository&apos;s stack and CI. Review <code className="font-mono">.env</code>{" "}
              before you start.
            </p>
            <CodeBlock code={CREATE_PROMPT} prompt="" tone="light" />
            <p className="mt-3 mb-2 text-xs font-mono text-slate-500">With Claude Code:</p>
            <CodeBlock code={CREATE_CLAUDE} />
          </div>
          <div>
            <h3 className="font-display font-bold text-slate-950 mb-1">Debug</h3>
            <p className="text-sm text-slate-600 mb-3">
              <code className="font-mono">debug-agent</code> reads logs, state, attempt events and validation output to
              find whether the problem is the repository, the instance or the agent.
            </p>
            <CodeBlock code={DEBUG_PROMPT} prompt="" tone="light" />
            <p className="mt-3 mb-2 text-xs font-mono text-slate-500">With Claude Code:</p>
            <CodeBlock code={DEBUG_CLAUDE} />
          </div>
        </div>

        <div className="space-y-6 min-w-0">
          <div>
            <h3 className="font-display font-bold text-slate-950 mb-3">Run · docker compose</h3>
            <Table rows={COMPOSE_COMMANDS} />
          </div>
          <div>
            <h3 className="font-display font-bold text-slate-950 mb-1">Control · agentctl</h3>
            <p className="text-xs font-mono text-slate-500 mb-3 break-all">prefix: {AGENTCTL}</p>
            <Table rows={AGENTCTL_COMMANDS} prefix="…" />
            <ul className="mt-3 space-y-1.5">
              {AGENTCTL_WARNINGS.map((w) => (
                <li key={w} className="flex gap-2 text-xs text-amber-800">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
