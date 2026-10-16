"use client";

// PROTOTYPE (issue #3), variant B: one terminal window, tabs per phase; prerequisites as chips above.

import { useState } from "react";
import { AlertTriangle, Terminal } from "lucide-react";
import { CodeBlock } from "./CodeBlock";
import {
  AGENT_FORGE_URL,
  AGENTCTL,
  AGENTCTL_COMMANDS,
  AGENTCTL_WARNINGS,
  CLONE,
  COMPOSE_COMMANDS,
  CREATE_CLAUDE,
  CREATE_PROMPT,
  DEBUG_CLAUDE,
  DEBUG_PROMPT,
  PREREQUISITES,
} from "./content";

export const name = "Terminal tabs";

const TABS = ["1 · Create", "2 · Run", "3 · Control", "4 · Debug"] as const;

function Comment({ children }: { children: React.ReactNode }) {
  return <p className="font-mono text-xs text-slate-400 leading-relaxed"># {children}</p>;
}

function Warn({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-xs text-amber-300 flex gap-2 leading-relaxed">
      <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
      <span>{children}</span>
    </p>
  );
}

export function VariantB() {
  const [tab, setTab] = useState(0);

  return (
    <section id="quick-start" className="mt-20 sm:mt-28 max-w-4xl mx-auto scroll-mt-28 text-left">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-5">
        <div>
          <h2 className="text-2xl sm:text-4xl font-extrabold font-display tracking-tight text-slate-950">Quick start</h2>
          <p className="mt-2 text-sm text-slate-600">
            Spin up your own agent with{" "}
            <a href={AGENT_FORGE_URL} className="text-blue-600 hover:underline font-mono">
              agent-forge
            </a>
            .
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {PREREQUISITES.map((p) => (
            <span key={p} className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-600">
              {p}
            </span>
          ))}
        </div>
      </div>

      <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl shadow-slate-900/20">
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-slate-800 bg-slate-900">
          <span className="w-3 h-3 rounded-full bg-red-400/80" />
          <span className="w-3 h-3 rounded-full bg-amber-400/80" />
          <span className="w-3 h-3 rounded-full bg-emerald-400/80" />
          <Terminal className="w-4 h-4 text-slate-500 ml-3" />
          <span className="text-xs font-mono text-slate-500 truncate">~/agent-forge</span>
        </div>

        <div role="tablist" className="flex overflow-x-auto border-b border-slate-800">
          {TABS.map((t, i) => (
            <button
              key={t}
              role="tab"
              aria-selected={tab === i}
              onClick={() => setTab(i)}
              className={`shrink-0 px-4 py-2.5 text-xs font-mono border-b-2 transition-colors ${
                tab === i ? "border-blue-500 text-white" : "border-transparent text-slate-500 hover:text-slate-300"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="p-4 sm:p-6 space-y-4 min-h-[22rem]">
          {tab === 0 && (
            <>
              <Comment>Clone agent-forge, then ask your coding assistant to use the create-agent skill.</Comment>
              <CodeBlock code={CLONE} />
              <CodeBlock code={CREATE_PROMPT} prompt="›" />
              <Comment>With Claude Code:</Comment>
              <CodeBlock code={CREATE_CLAUDE} />
              <Comment>
                It inspects your repository&apos;s stack and CI and writes the instance: Dockerfile, compose.yaml,
                profile and .env. Review .env and fill in missing credentials.
              </Comment>
            </>
          )}

          {tab === 1 && (
            <div className="space-y-3">
              {COMPOSE_COMMANDS.map((c) => (
                <div key={c.cmd} className="space-y-1">
                  {c.danger ? <Warn>{c.what}</Warn> : <Comment>{c.what}</Comment>}
                  <CodeBlock code={c.cmd} />
                </div>
              ))}
            </div>
          )}

          {tab === 2 && (
            <>
              <Comment>agentctl runs inside the live container. Start with status and check TARGET_REPO.</Comment>
              <CodeBlock code={`${AGENTCTL} status`} />
              <div className="grid sm:grid-cols-2 gap-x-6 gap-y-2">
                {AGENTCTL_COMMANDS.slice(1).map((c) => (
                  <div key={c.cmd} className="font-mono text-xs">
                    <span className="text-emerald-400">{c.cmd}</span>
                    <span className="text-slate-400"> · {c.what}</span>
                  </div>
                ))}
              </div>
              {AGENTCTL_WARNINGS.map((w) => (
                <Warn key={w}>{w}</Warn>
              ))}
            </>
          )}

          {tab === 3 && (
            <>
              <Comment>Something off? Ask your coding assistant to use the debug-agent skill.</Comment>
              <CodeBlock code={DEBUG_PROMPT} prompt="›" />
              <Comment>With Claude Code:</Comment>
              <CodeBlock code={DEBUG_CLAUDE} />
              <Comment>
                It reads startup logs, persisted state, attempt events and validation output to tell whether the
                problem is in the target repository, the instance configuration or the upstream agent.
              </Comment>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
