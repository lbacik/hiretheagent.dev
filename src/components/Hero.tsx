import { Check, Sparkles } from "lucide-react";
import { Articles } from "./Articles";
import { NewsletterForm } from "./NewsletterForm";
import { isAltchaConfigured } from "@/lib/altcha";
import { isNewsletterConfigured } from "@/lib/listmonk";
import { InteractiveWorkflow } from "./InteractiveWorkflow";
import { ChangeLog } from "./ChangeLog";
import { ActiveProjects } from "./ActiveProjects";
import { QuickStart } from "./QuickStart";
import { Roadmap } from "./Roadmap";

export function Hero() {
  return (
    <section className="max-w-6xl mx-auto px-6 pt-12 sm:pt-16 pb-16 sm:pb-24 text-center">
      {/* Pre-headline Pill Badge */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-mono font-medium mb-6 shadow-sm">
        <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
        Autonomous agent for software engineers &amp; dev teams
      </div>

      <div className="max-w-3xl mx-auto">
        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl font-extrabold font-display tracking-tight text-slate-950 leading-[1.12]">
          Hire an agent that{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500">
            resolves your GitHub Issues
          </span>{" "}
          autonomously.
        </h1>

        {/* Sub-headline / Explanation */}
        <p className="mt-6 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
          Just apply the{" "}
          <code className="bg-slate-100 text-slate-900 font-bold px-2 py-0.5 rounded border border-slate-300 font-mono text-sm">
            ready-for-agent
          </code>{" "}
          label. Agent Sid picks up the task, spins up an isolated Docker sandbox, runs test suites, writes the code, and delivers a verified Pull Request.
        </p>

        {/* Key Product Highlights */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs sm:text-sm font-mono text-slate-600">
          <span className="inline-flex items-center gap-1.5 bg-slate-100/90 border border-slate-200/90 px-3 py-1 rounded-lg">
            <Check className="w-3.5 h-3.5 text-emerald-500 stroke-[3]" /> Docker templates included
          </span>
          <span className="inline-flex items-center gap-1.5 bg-slate-100/90 border border-slate-200/90 px-3 py-1 rounded-lg">
            <Sparkles className="w-3.5 h-3.5 text-blue-500" /> Bring your own LLM
          </span>
        </div>

        {/* Lab Dispatch: in-flight initiatives */}
        <div className="mt-6 mx-auto max-w-2xl rounded-2xl border border-amber-300 bg-amber-50/70 p-3 sm:px-4 sm:py-3 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left">
          <div className="flex items-start sm:items-center gap-3 min-w-0">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0 mt-1 sm:mt-0" aria-hidden="true" />
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono font-bold uppercase tracking-wider text-amber-900 bg-amber-200/90 px-2 py-0.5 rounded text-[10px] leading-tight">
                  LAB DISPATCH
                </span>
                <span className="font-mono font-bold text-xs text-slate-900">
                  Active Development:
                </span>
              </div>
              <p className="mt-0.5 text-xs text-slate-600 font-sans leading-normal">
                Multi-agent project orchestration{" "}
                <span className="font-mono font-bold text-amber-900">(agent-forge)</span>{" "}
                &amp; real-time{" "}
                <span className="font-semibold text-slate-900">Agent Dashboard</span>.
              </p>
            </div>
          </div>
          <a
            href="#roadmap"
            className="inline-flex items-center justify-center gap-1 shrink-0 font-mono text-xs font-semibold text-amber-50 bg-amber-900 hover:bg-amber-950 active:bg-amber-950 px-4 py-1.5 rounded-xl transition-colors shadow-sm self-start sm:self-center"
          >
            Roadmap <span aria-hidden="true">↓</span>
          </a>
        </div>
      </div>

      {/* Articles row */}
      <Articles />

      {/* Separator between the hero and the workflow panel */}
      <div aria-hidden="true" className="my-10 sm:my-14 mx-auto w-full max-w-xs h-px bg-slate-300" />

      {/* Workflow Diagram Panel: default 0.5x, expands to 1.0x in-place */}
      <InteractiveWorkflow />

      {/* Quick Start Guide */}
      <QuickStart />

      {/* Roadmap: upcoming features, directly above the Newsletter form */}
      <Roadmap />

      {/* Newsletter Form (disabled "Coming soon" state unless listmonk and ALTCHA are configured) */}
      <NewsletterForm available={isNewsletterConfigured() && isAltchaConfigured()} />

      {/* Change log */}
      <ChangeLog />

      {/* Active Projects Panel */}
      <ActiveProjects />
    </section>
  );
}

