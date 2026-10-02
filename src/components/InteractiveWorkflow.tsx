"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  Sparkles,
  GitPullRequest,
  CheckCircle2,
  Terminal,
  Play,
  Pause,
  RotateCcw,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  Layers,
  GitMerge,
  AlertCircle,
  ExternalLink,
  RefreshCw,
  ListTodo,
} from "lucide-react";

interface StepData {
  id: string;
  stepNumber: string;
  name: string;
  category: string;
  categoryLabel: string;
  owner: string;
  tool: string;
  modelBadge: string;
  bullets: string[];
  deliverableType: "DELIVERABLE" | "MERGE GATE";
  deliverable: string;
  accentColor: {
    badgeBg: string;
    badgeText: string;
    border: string;
    bgHover: string;
    activeBorder: string;
    activeRing: string;
    pillBg: string;
    pillText: string;
  };
}

const STEPS: StepData[] = [
  {
    id: "idea",
    stepNumber: "01",
    name: "Idea",
    category: "Human-led discovery & planning",
    categoryLabel: "Discovery",
    owner: "Developer + coding agent",
    tool: "Claude Code / Codex",
    modelBadge: "High-capability model",
    bullets: [
      "Explore the problem space & existing codebase architecture",
      "Define the desired outcome and boundary constraints",
    ],
    deliverableType: "DELIVERABLE",
    deliverable: "Clear intent + scope",
    accentColor: {
      badgeBg: "bg-blue-100",
      badgeText: "text-blue-700",
      border: "border-blue-200",
      bgHover: "hover:bg-blue-50/60",
      activeBorder: "border-blue-600",
      activeRing: "ring-blue-500/20",
      pillBg: "bg-blue-50",
      pillText: "text-blue-700",
    },
  },
  {
    id: "planning",
    stepNumber: "02",
    name: "Planning",
    category: "Human-led discovery & planning",
    categoryLabel: "Planning",
    owner: "Developer + coding agent",
    tool: "Claude Code / Codex",
    modelBadge: "High-capability model",
    bullets: [
      "Break down the work into discrete, atomic changes",
      "Define strict acceptance criteria and automated test specs",
    ],
    deliverableType: "DELIVERABLE",
    deliverable: "Specified GitHub issues ready-for-agent",
    accentColor: {
      badgeBg: "bg-blue-100",
      badgeText: "text-blue-700",
      border: "border-blue-200",
      bgHover: "hover:bg-blue-50/60",
      activeBorder: "border-blue-600",
      activeRing: "ring-blue-500/20",
      pillBg: "bg-blue-50",
      pillText: "text-blue-700",
    },
  },
  {
    id: "implementation",
    stepNumber: "03",
    name: "Implementation",
    category: "Agent execution",
    categoryLabel: "Autonomous Execution",
    owner: "Coding Agent",
    tool: "Autonomous implementation (Agent Sid)",
    modelBadge: "Isolated Docker Sandbox",
    bullets: [
      "Implement · test · review in isolated container",
      "Commit verified code + publish branch changes",
    ],
    deliverableType: "DELIVERABLE",
    deliverable: "Pull request + evidence",
    accentColor: {
      badgeBg: "bg-emerald-100",
      badgeText: "text-emerald-700",
      border: "border-emerald-200",
      bgHover: "hover:bg-emerald-50/60",
      activeBorder: "border-emerald-600",
      activeRing: "ring-emerald-500/20",
      pillBg: "bg-emerald-50",
      pillText: "text-emerald-700",
    },
  },
  {
    id: "review",
    stepNumber: "04",
    name: "PR review & merge",
    category: "Human release decision",
    categoryLabel: "Release Gate",
    owner: "Human reviewer",
    tool: "Approval + merge",
    modelBadge: "Human-in-the-loop",
    bullets: [
      "Review the proposed code diff and test evidence",
      "Approve + merge or request targeted adjustments",
    ],
    deliverableType: "MERGE GATE",
    deliverable: "Acceptance criteria met · Checks pass + human approval",
    accentColor: {
      badgeBg: "bg-amber-100",
      badgeText: "text-amber-800",
      border: "border-amber-200",
      bgHover: "hover:bg-amber-50/60",
      activeBorder: "border-amber-600",
      activeRing: "ring-amber-500/20",
      pillBg: "bg-amber-50",
      pillText: "text-amber-800",
    },
  },
];

export function InteractiveWorkflow() {
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [viewMode, setViewMode] = useState<"interactive" | "blueprint">("interactive");
  const [feedbackFlash, setFeedbackFlash] = useState(false);
  const [mergeApproved, setMergeApproved] = useState(false);
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-play simulation cycle
  useEffect(() => {
    if (isPlaying) {
      autoPlayTimerRef.current = setTimeout(() => {
        setActiveStep((prev) => {
          if (prev === STEPS.length - 1) {
            // Loop back to beginning or stop
            return 0;
          }
          return prev + 1;
        });
      }, 4200);
    } else if (autoPlayTimerRef.current) {
      clearTimeout(autoPlayTimerRef.current);
    }
    return () => {
      if (autoPlayTimerRef.current) clearTimeout(autoPlayTimerRef.current);
    };
  }, [isPlaying, activeStep]);

  const handleTriggerFeedbackLoop = () => {
    setFeedbackFlash(true);
    setActiveStep(2); // Jump back to Stage 03: Implementation
    setTimeout(() => {
      setFeedbackFlash(false);
    }, 1500);
  };

  const currentStep = STEPS[activeStep];

  return (
    <section id="workflow" className="w-full max-w-6xl mx-auto px-6 py-16 scroll-mt-24">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-300 text-slate-700 text-xs font-mono font-medium mb-4">
          <Layers className="w-3.5 h-3.5 text-blue-600" />
          <span>Interactive Architecture &amp; Delivery Workflow</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold font-display tracking-tight text-slate-950">
          From idea to merged change
        </h2>
        <p className="mt-4 text-slate-600 text-sm sm:text-base leading-relaxed">
          A disciplined human-in-the-loop lifecycle. High-capability LLMs assist developer planning,
          autonomous coding agents execute in isolated Docker sandboxes, and human engineers retain full control of the merge gate.
        </p>

        {/* View Mode & Simulation Bar */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <div className="bg-slate-100 p-1 rounded-xl border border-slate-200 inline-flex text-xs font-mono">
            <button
              type="button"
              onClick={() => setViewMode("interactive")}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                viewMode === "interactive"
                  ? "bg-white text-slate-900 shadow-sm font-semibold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Interactive Pipeline
            </button>
            <button
              type="button"
              onClick={() => setViewMode("blueprint")}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                viewMode === "blueprint"
                  ? "bg-white text-slate-900 shadow-sm font-semibold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Architecture Diagram
            </button>
          </div>

          {viewMode === "interactive" && (
            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border text-xs font-mono font-semibold transition-all shadow-sm ${
                isPlaying
                  ? "bg-amber-50 border-amber-300 text-amber-800 hover:bg-amber-100"
                  : "bg-white border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400"
              }`}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5 fill-current" />
                  <span>Pause Simulation</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Simulate Workflow</span>
                </>
              )}
            </button>
          )}

          <a
            href="/charts/workflow-en.svg"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-mono text-slate-500 hover:text-blue-600 px-2 py-1 transition-colors"
          >
            <span>Raw SVG</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {viewMode === "blueprint" ? (
        /* Vector Architecture Blueprint View */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-soft p-4 sm:p-8 overflow-hidden animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 mb-6 gap-3">
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-slate-500 font-semibold">
                Vector Architecture View
              </div>
              <h3 className="text-base font-bold text-slate-900 font-display">
                Original Delivery Flow Spec (charts/workflow-en.svg)
              </h3>
            </div>
            <div className="flex items-center gap-3">
              <a
                href="/charts/workflow-en.svg"
                download="workflow-en.svg"
                className="text-xs font-mono bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg border border-slate-200 transition-colors"
              >
                Download SVG
              </a>
              <button
                type="button"
                onClick={() => setViewMode("interactive")}
                className="text-xs font-mono bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg font-semibold transition-colors"
              >
                Switch to Interactive Mode
              </button>
            </div>
          </div>

          <div className="relative rounded-xl border border-slate-200 overflow-hidden bg-[#f6f8fb] shadow-inner p-2 sm:p-4">
            <Image
              src="/charts/workflow-en.svg"
              alt="Workflow — from idea to merged change"
              width={1680}
              height={850}
              className="w-full h-auto rounded-lg shadow-sm"
              loading="lazy"
            />
          </div>

          <div className="mt-4 text-xs font-mono text-slate-500 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span>Dashed arrow: proposed feedback loop (requested changes return to implementation).</span>
            <span className="text-slate-400">hiretheagent.dev architecture reference</span>
          </div>
        </div>
      ) : (
        /* Interactive Step-by-Step Pipeline View */
        <div className="space-y-6">
          {/* 4-Stage Stepper Ribbon */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 relative">
            {STEPS.map((step, idx) => {
              const isSelected = activeStep === idx;
              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => {
                    setActiveStep(idx);
                    setIsPlaying(false);
                  }}
                  className={`text-left p-4 rounded-2xl border transition-all duration-200 relative group cursor-pointer ${
                    isSelected
                      ? `bg-white ${step.accentColor.activeBorder} shadow-md ring-2 ${step.accentColor.activeRing}`
                      : `bg-white/80 border-slate-200 hover:border-slate-300 hover:bg-white`
                  }`}
                  aria-selected={isSelected}
                  role="tab"
                >
                  {/* Step Top Bar */}
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`text-xs font-mono font-bold px-2 py-0.5 rounded-lg ${
                        isSelected
                          ? `${step.accentColor.badgeBg} ${step.accentColor.badgeText}`
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {step.stepNumber}
                    </span>
                    <span className="text-[10px] font-mono font-medium text-slate-400 uppercase tracking-wider">
                      {step.categoryLabel}
                    </span>
                  </div>

                  {/* Title & Owner */}
                  <h3 className="font-display font-bold text-slate-900 text-base group-hover:text-blue-600 transition-colors">
                    {step.name}
                  </h3>
                  <div className="text-xs text-slate-600 font-mono mt-1 truncate">
                    {step.owner}
                  </div>

                  {/* Deliverable snippet */}
                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono">
                    <span className="text-slate-400 uppercase text-[9px] tracking-wider font-semibold">
                      {step.deliverableType}
                    </span>
                    <span
                      className={`font-semibold truncate max-w-[130px] ${
                        isSelected ? step.accentColor.badgeText : "text-slate-700"
                      }`}
                      title={step.deliverable}
                    >
                      {step.deliverable}
                    </span>
                  </div>

                  {/* Active Step Indicator Pill */}
                  {isSelected && (
                    <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[9px] font-mono uppercase font-bold tracking-wider px-2 py-0.5 rounded-full shadow-sm">
                      Active
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Feedback loop alert banner when highlighted */}
          {feedbackFlash && (
            <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl text-xs font-mono text-amber-900 flex items-center justify-between animate-pulse">
              <span className="flex items-center gap-2 font-bold">
                <RefreshCw className="w-4 h-4 text-amber-600 animate-spin" />
                Feedback path activated: PR review requested changes → returning to Stage 03 (Coding Agent implementation)
              </span>
              <span className="text-amber-700 text-[11px]">Rework in sandbox</span>
            </div>
          )}

          {/* Active Step Deep-Dive Pane */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-soft overflow-hidden">
            {/* Stage Summary Banner */}
            <div className="bg-slate-900 text-white p-5 sm:p-6 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center font-display font-extrabold text-lg text-white shadow-md ${
                    activeStep < 2
                      ? "bg-blue-600"
                      : activeStep === 2
                      ? "bg-emerald-600"
                      : "bg-amber-600"
                  }`}
                >
                  {currentStep.stepNumber}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-slate-400 uppercase tracking-widest font-semibold">
                      {currentStep.category}
                    </span>
                    <span className="text-slate-600">•</span>
                    <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-slate-800 text-blue-300 border border-slate-700">
                      {currentStep.modelBadge}
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold font-display tracking-tight text-white mt-0.5">
                    Stage {currentStep.stepNumber}: {currentStep.name}
                  </h3>
                </div>
              </div>

              {/* Navigation Arrows */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setActiveStep((prev) => (prev > 0 ? prev - 1 : STEPS.length - 1));
                    setIsPlaying(false);
                  }}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700 cursor-pointer"
                  title="Previous Step"
                  aria-label="Previous Step"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <span className="text-xs font-mono text-slate-400 px-1">
                  {activeStep + 1} / {STEPS.length}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setActiveStep((prev) => (prev < STEPS.length - 1 ? prev + 1 : 0));
                    setIsPlaying(false);
                  }}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700 cursor-pointer"
                  title="Next Step"
                  aria-label="Next Step"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Split Content: Details on Left, Interactive Simulation on Right */}
            <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: Context, Owner, Bullets, Deliverable */}
              <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
                <div className="space-y-5">
                  {/* Responsible Actor Card */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider font-semibold">
                      Responsible Actor &amp; Tooling
                    </div>
                    <div className="mt-1 flex items-center justify-between">
                      <div className="font-semibold text-slate-900 text-sm">
                        {currentStep.owner}
                      </div>
                    </div>
                    <div className="mt-1 text-xs text-slate-600 font-mono">
                      Tool: {currentStep.tool}
                    </div>
                  </div>

                  {/* Actions / Process Checklist */}
                  <div>
                    <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold mb-3">
                      Core Operations
                    </h4>
                    <ul className="space-y-2.5">
                      {currentStep.bullets.map((bullet, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700">
                          <CheckCircle2
                            className={`w-4 h-4 shrink-0 mt-0.5 ${
                              activeStep < 2
                                ? "text-blue-600"
                                : activeStep === 2
                                ? "text-emerald-600"
                                : "text-amber-600"
                            }`}
                          />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Deliverable or Gate */}
                  <div
                    className={`p-4 rounded-2xl border ${
                      currentStep.deliverableType === "MERGE GATE"
                        ? "bg-amber-50/70 border-amber-200 text-amber-900"
                        : activeStep === 2
                        ? "bg-emerald-50/70 border-emerald-200 text-emerald-900"
                        : "bg-blue-50/70 border-blue-200 text-blue-900"
                    }`}
                  >
                    <div className="text-[10px] font-mono uppercase tracking-widest font-bold opacity-75">
                      {currentStep.deliverableType}
                    </div>
                    <div className="mt-1 font-display font-bold text-base">
                      {currentStep.deliverable}
                    </div>
                    <div className="mt-1 text-xs opacity-80 font-mono">
                      {activeStep === 0 && "Defines clear boundary and architectural scope."}
                      {activeStep === 1 && "Creates ready-for-agent GitHub issues with acceptance criteria."}
                      {activeStep === 2 && "Automated test runs, git commit, and Pull Request with logs."}
                      {activeStep === 3 && "Merge requires human sign-off; changes trigger rework loop."}
                    </div>
                  </div>
                </div>

                {/* Bottom Quick-Action Buttons */}
                <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-3">
                  {activeStep < 3 ? (
                    <button
                      type="button"
                      onClick={() => {
                        setActiveStep((prev) => prev + 1);
                        setIsPlaying(false);
                      }}
                      className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-mono text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer"
                    >
                      <span>Proceed to {STEPS[activeStep + 1].name}</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={handleTriggerFeedbackLoop}
                        className="inline-flex items-center gap-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 font-mono text-xs font-bold px-3.5 py-2.5 rounded-xl border border-amber-300 transition-all cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Simulate: Request changes → rework</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setMergeApproved(true);
                          setTimeout(() => setMergeApproved(false), 2500);
                        }}
                        className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-mono text-xs font-bold px-3.5 py-2.5 rounded-xl transition-all cursor-pointer shadow-sm"
                      >
                        <GitMerge className="w-3.5 h-3.5" />
                        <span>Approve &amp; Merge</span>
                      </button>
                    </div>
                  )}

                  {activeStep === 2 && (
                    <button
                      type="button"
                      onClick={() => {
                        setActiveStep(3);
                        setIsPlaying(false);
                      }}
                      className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-700 hover:text-emerald-800 underline underline-offset-4"
                    >
                      Send PR to Human Review
                    </button>
                  )}
                </div>
              </div>

              {/* Right Column: Realistic Interactive Mock Simulation */}
              <div className="lg:col-span-7">
                {activeStep === 0 && <IdeaMockSimulation />}
                {activeStep === 1 && <PlanningMockSimulation />}
                {activeStep === 2 && <ImplementationMockSimulation />}
                {activeStep === 3 && (
                  <ReviewMockSimulation
                    mergeApproved={mergeApproved}
                    onRequestChanges={handleTriggerFeedbackLoop}
                    onApprove={() => {
                      setMergeApproved(true);
                      setTimeout(() => setMergeApproved(false), 2500);
                    }}
                  />
                )}
              </div>
            </div>

            {/* Bottom Loopback Strip */}
            <div className="bg-slate-50 border-t border-slate-200/80 px-6 py-3.5 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-slate-500 gap-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                <span className="font-semibold text-slate-700">Feedback Loop:</span>
                <span>Requested changes return to implementation (Stage 03).</span>
              </div>
              <div className="text-[11px] text-slate-400">
                Claude Code / Codex ➔ ready-for-agent ➔ Agent Sid (Docker) ➔ Human Review
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

/* =========================================================================
   INTERACTIVE MOCK PREVIEWS FOR EACH STEP
   ========================================================================= */

function IdeaMockSimulation() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col h-full font-mono text-xs">
      <div className="bg-slate-100/90 border-b border-slate-200 px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-400"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
          </div>
          <span className="text-[11px] text-slate-600 font-semibold ml-1">
            claude-code / codex — discovery session
          </span>
        </div>
        <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-bold">
          High-capability model
        </span>
      </div>

      <div className="p-4 sm:p-5 space-y-4 flex-1 bg-slate-900 text-slate-200">
        <div>
          <div className="text-emerald-400 font-semibold flex items-center gap-1.5">
            <span>&gt; engineer:</span>
          </div>
          <p className="mt-1 text-slate-300 text-[11px] leading-relaxed">
            &quot;Our token refresh middleware occasionally drops headers when requests fail under high concurrency. Let&apos;s define root cause hypothesis and scope the fix before creating any tickets.&quot;
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-800/90 border border-slate-700 space-y-2">
          <div className="text-blue-400 font-semibold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>High-Capability Model Analysis:</span>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            Identified race condition in <code className="text-amber-300 bg-slate-950 px-1 py-0.5 rounded">auth/token-refresh.ts</code>. Mutual exclusion lock is required during in-flight refresh.
          </p>
          <div className="mt-2 pt-2 border-t border-slate-700/80 text-[10px] text-slate-400">
            <strong className="text-slate-200">DELIVERABLE:</strong> Clear Intent &amp; Scope defined. Ready to decompose into verifiable tasks.
          </div>
        </div>

        <div className="bg-emerald-950/40 border border-emerald-800/60 rounded-xl p-3 text-[11px] text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Scope finalized: No breaking API changes, lock scoped to single session client.</span>
        </div>
      </div>
    </div>
  );
}

function PlanningMockSimulation() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col h-full font-mono text-xs">
      <div className="bg-slate-100/90 border-b border-slate-200 px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ListTodo className="w-3.5 h-3.5 text-blue-600" />
          <span className="text-[11px] text-slate-700 font-semibold">
            GitHub Issue #142 (ready-for-agent)
          </span>
        </div>
        <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded text-[10px] font-bold">
          Open
        </span>
      </div>

      <div className="p-4 sm:p-5 space-y-4 flex-1">
        <div>
          <h5 className="font-display font-bold text-slate-950 text-sm leading-snug">
            Fix token refresh mutex lock during concurrent HTTP 401 re-auth
          </h5>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <span className="bg-blue-600 text-white font-bold px-2 py-0.5 rounded text-[10px] shadow-sm">
              ready-for-agent
            </span>
            <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px] border border-slate-200">
              backend
            </span>
            <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded text-[10px] border border-purple-200">
              docker-sandbox
            </span>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
          <div className="text-[11px] font-bold text-slate-800 uppercase tracking-wider">
            Acceptance Criteria (DoD)
          </div>
          <ul className="space-y-1.5 text-slate-700 text-[11px]">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
              Add unit test simulating 5 simultaneous 401 refresh requests.
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
              Ensure refresh endpoint is invoked exactly once.
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
              All existing middleware unit &amp; integration tests pass.
            </li>
          </ul>
        </div>

        <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 text-[11px] flex items-center justify-between">
          <span>DELIVERABLE: Ready for autonomous agent dispatch.</span>
          <span className="text-[10px] font-bold text-blue-700">Webhook Active</span>
        </div>
      </div>
    </div>
  );
}

function ImplementationMockSimulation() {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950 shadow-sm overflow-hidden flex flex-col h-full font-mono text-xs text-slate-200">
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-[11px] text-slate-300 font-semibold">
            agent-sid@docker-sandbox: ~/workspace
          </span>
        </div>
        <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-700 px-2 py-0.5 rounded font-bold animate-pulse">
          Sandbox Running
        </span>
      </div>

      <div className="p-4 sm:p-5 space-y-2 flex-1 text-[11px]">
        <div className="text-slate-400">
          <span className="text-emerald-400 font-bold">$</span> agent-sid pickup --issue 142
        </div>
        <div className="text-slate-300 pl-3 border-l-2 border-slate-800 space-y-1">
          <p className="text-blue-400">➔ Spun up isolated Docker container (alpine-node:20)</p>
          <p className="text-slate-300">➔ Cloned repository &amp; checked out branch <code className="text-amber-300">fix/token-refresh-mutex</code></p>
          <p className="text-slate-300">➔ Created reproduction test in <code className="text-amber-300">tests/auth.test.ts</code></p>
          <p className="text-emerald-400">➔ Applied mutex queue in middleware</p>
          <p className="text-slate-300">➔ Running test suite: <span className="text-emerald-300 font-bold">14 passed, 0 failed</span></p>
          <p className="text-slate-300">➔ Pushed commits &amp; created Pull Request #287</p>
        </div>

        <div className="mt-4 p-3 bg-emerald-900/30 border border-emerald-700/60 rounded-xl text-emerald-300 flex items-center justify-between">
          <span>DELIVERABLE: PR #287 + Test Evidence Ready</span>
          <span className="text-[10px] font-bold bg-emerald-800/60 px-2 py-0.5 rounded text-emerald-200">
            Verified in Container
          </span>
        </div>
      </div>
    </div>
  );
}

function ReviewMockSimulation({
  mergeApproved,
  onRequestChanges,
  onApprove,
}: {
  mergeApproved: boolean;
  onRequestChanges: () => void;
  onApprove: () => void;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col h-full font-mono text-xs">
      <div className="bg-slate-100/90 border-b border-slate-200 px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <GitPullRequest className="w-3.5 h-3.5 text-purple-600" />
          <span className="text-[11px] text-slate-800 font-semibold">
            PR #287: Fix token refresh mutex lock
          </span>
        </div>
        <span className="bg-purple-100 text-purple-800 border border-purple-200 px-2 py-0.5 rounded text-[10px] font-bold">
          Review Pending
        </span>
      </div>

      <div className="p-4 sm:p-5 space-y-4 flex-1">
        {/* Verification Check List */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Merge Gate Checks
          </div>
          <div className="space-y-1.5 text-[11px]">
            <div className="flex items-center justify-between text-emerald-700 font-semibold">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> Acceptance criteria met
              </span>
              <span>Passed</span>
            </div>
            <div className="flex items-center justify-between text-emerald-700 font-semibold">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> Docker sandbox tests
              </span>
              <span>14/14 Passed</span>
            </div>
            <div className="flex items-center justify-between text-amber-700 font-semibold">
              <span className="flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" /> Human reviewer sign-off
              </span>
              <span>{mergeApproved ? "Approved ✓" : "Awaiting Decision"}</span>
            </div>
          </div>
        </div>

        {/* Action Panel */}
        {mergeApproved ? (
          <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-4 text-center animate-in fade-in zoom-in-95">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center mb-1">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div className="font-display font-bold text-slate-900 text-sm">
              Pull Request Merged into main!
            </div>
            <div className="text-[11px] text-slate-600 mt-0.5">
              Isolated sandbox cleaned up. Issue #142 closed automatically.
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="text-[11px] text-slate-600">
              As a human tech lead, evaluate the code diff and either approve the PR or request adjustments:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={onRequestChanges}
                className="p-2.5 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold transition-all text-center cursor-pointer flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-700" />
                <span>Request Changes (Rework)</span>
              </button>
              <button
                type="button"
                onClick={onApprove}
                className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all text-center cursor-pointer shadow-sm flex items-center justify-center gap-1.5"
              >
                <GitMerge className="w-3.5 h-3.5" />
                <span>Approve &amp; Merge PR</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
