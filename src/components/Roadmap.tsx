"use client";

import Link from "next/link";
import { BellRing, Boxes, Check, Radar } from "lucide-react";

// Upcoming initiatives showcased directly above the Newsletter form. Each
// card ends in a "Get launch alert" CTA that scrolls to `#newsletter`,
// focuses the email input, and briefly pulses the form's ring.
export function Roadmap() {
  return (
    <section id="roadmap" className="mt-16 sm:mt-24 max-w-5xl mx-auto scroll-mt-28 text-left">
      {/* Anchor alias for backward compatibility */}
      <span id="soon" className="scroll-mt-28 -top-28 relative block" aria-hidden="true" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        {/* Card 1: Multi-Worker Repository Pools (agent-forge#17) */}
        <article className="group relative bg-white/90 hover:bg-white border border-slate-200/90 hover:border-blue-400 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-200 flex flex-col">
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
              In Active Dev
            </span>
            <Link
              href="https://github.com/lbacik/agent-forge"
              target="_blank"
              rel="noopener noreferrer"
              title="agent-forge repository"
              className="font-mono text-[11px] font-semibold px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200 hover:text-blue-600 hover:border-blue-300 transition-colors"
            >
              agent-forge
            </Link>
          </div>

          <h3 className="font-mono font-bold text-base text-slate-900 flex items-center gap-1.5">
            <Boxes className="w-4 h-4 text-slate-400 group-hover:text-blue-500 shrink-0 transition-colors" />
            <span>Multi-Worker Repository Pools</span>
          </h3>

          <p className="mt-2.5 text-xs sm:text-[13px] text-slate-600 leading-relaxed font-sans">
            A pool of identical autonomous Workers running against a single GitHub repository — scaling one
            repo&apos;s issue throughput. Grounded in{" "}
            <Link
              href="https://github.com/lbacik/agent-forge/issues/17"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono font-semibold text-blue-600 hover:text-blue-700 underline underline-offset-2 decoration-blue-200 hover:decoration-blue-400 transition-colors"
            >
              lbacik/agent-forge#17
            </Link>
            .
          </p>

          <ul className="mt-4 space-y-2 text-xs sm:text-[13px] text-slate-600 leading-relaxed font-sans">
            <li className="flex items-start gap-2">
              <Check className="w-3.5 h-3.5 mt-0.5 text-emerald-500 stroke-[3] shrink-0" />
              <span>Shared Queue feeds issues to the whole pool — Workers pull, never duplicate.</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-3.5 h-3.5 mt-0.5 text-emerald-500 stroke-[3] shrink-0" />
              <span>
                Independent Compose services (
                <code className="font-mono text-[11px] sm:text-xs bg-slate-100 border border-slate-200 px-1.5 py-px rounded text-slate-800">
                  worker-1..N
                </code>
                ), each with a dedicated{" "}
                <code className="font-mono text-[11px] sm:text-xs bg-slate-100 border border-slate-200 px-1.5 py-px rounded text-slate-800">
                  /data
                </code>{" "}
                volume.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-3.5 h-3.5 mt-0.5 text-emerald-500 stroke-[3] shrink-0" />
              <span>
                Machine-account coordination via{" "}
                <code className="font-mono text-[11px] sm:text-xs bg-slate-100 border border-slate-200 px-1.5 py-px rounded text-slate-800">
                  claimed-by:&lt;worker-id&gt;
                </code>{" "}
                claim markers prevents race conditions.
              </span>
            </li>
          </ul>

          <div className="mt-auto pt-5">
            <button
              type="button"
              onClick={requestLaunchAlert}
              className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50 hover:bg-blue-100 hover:border-blue-300 active:bg-blue-200/70 px-4 py-2.5 font-mono text-xs font-bold text-blue-700 transition-all active:scale-[0.99]"
            >
              <BellRing className="w-3.5 h-3.5" aria-hidden="true" />
              <span>
                Get launch alert <span aria-hidden="true">↓</span>
              </span>
            </button>
          </div>
        </article>

        {/* Card 2: Real-Time Fleet HUD (Agent Dashboard) */}
        <article className="group relative bg-white/90 hover:bg-white border border-slate-200/90 hover:border-blue-400 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-200 flex flex-col">
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
              In Active Dev
            </span>
            <Link
              href="https://github.com/lbacik/agent-dashboard"
              target="_blank"
              rel="noopener noreferrer"
              title="agent-dashboard repository"
              className="font-mono text-[11px] font-semibold px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200 hover:text-blue-600 hover:border-blue-300 transition-colors"
            >
              agent-dashboard
            </Link>
          </div>

          <h3 className="font-mono font-bold text-base text-slate-900 flex items-center gap-1.5">
            <Radar className="w-4 h-4 text-slate-400 group-hover:text-blue-500 shrink-0 transition-colors" />
            <span>Real-Time Fleet HUD</span>
          </h3>

          <p className="mt-2.5 text-xs sm:text-[13px] text-slate-600 leading-relaxed font-sans">
            A dedicated read-only web dashboard monitoring{" "}
            <code className="font-mono text-[11px] sm:text-xs bg-slate-100 border border-slate-200 px-1.5 py-px rounded text-slate-800">
              simple-coding-agent
            </code>{" "}
            containers on a Docker host — the Agent Dashboard.
          </p>

          <ul className="mt-4 space-y-2 text-xs sm:text-[13px] text-slate-600 leading-relaxed font-sans">
            <li className="flex items-start gap-2">
              <Check className="w-3.5 h-3.5 mt-0.5 text-emerald-500 stroke-[3] shrink-0" />
              <span>Automatic container discovery by label — no manual registration.</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-3.5 h-3.5 mt-0.5 text-emerald-500 stroke-[3] shrink-0" />
              <span>
                Live telemetry polling via{" "}
                <code className="font-mono text-[11px] sm:text-xs bg-slate-100 border border-slate-200 px-1.5 py-px rounded text-slate-800">
                  agentctl telemetry --json
                </code>
                .
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-3.5 h-3.5 mt-0.5 text-emerald-500 stroke-[3] shrink-0" />
              <span>Fleet overview of outcomes &amp; costs (24h–90d) plus per-attempt event log.</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-3.5 h-3.5 mt-0.5 text-emerald-500 stroke-[3] shrink-0" />
              <span>
                Evidence inspection for every attempt — including stopped containers via{" "}
                <code className="font-mono text-[11px] sm:text-xs bg-slate-100 border border-slate-200 px-1.5 py-px rounded text-slate-800">
                  docker cp
                </code>
                .
              </span>
            </li>
          </ul>

          <div className="mt-auto pt-5">
            <button
              type="button"
              onClick={requestLaunchAlert}
              className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50 hover:bg-blue-100 hover:border-blue-300 active:bg-blue-200/70 px-4 py-2.5 font-mono text-xs font-bold text-blue-700 transition-all active:scale-[0.99]"
            >
              <BellRing className="w-3.5 h-3.5" aria-hidden="true" />
              <span>
                Get launch alert <span aria-hidden="true">↓</span>
              </span>
            </button>
          </div>
        </article>
      </div>
    </section>
  );
}

// Scrolls to the Newsletter form, focuses its email input, and briefly
// pulses the form's ring so visitors land exactly where they sign up.
function requestLaunchAlert() {
  const newsletter = document.getElementById("newsletter");
  const email = document.getElementById("newsletter-email");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  newsletter?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
  window.setTimeout(() => {
    (email as HTMLElement | null)?.focus({ preventScroll: true });
  }, reduceMotion ? 0 : 450);

  const form = newsletter?.querySelector("form");
  if (!form) return;
  form.classList.remove("roadmap-alert-ring");
  // Force a reflow so repeated clicks re-trigger the pulse animation.
  void form.offsetWidth;
  form.classList.add("roadmap-alert-ring");
  window.setTimeout(() => form.classList.remove("roadmap-alert-ring"), 1800);
}
