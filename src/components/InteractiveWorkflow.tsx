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
  GitMerge,
  AlertCircle,
  ExternalLink,
  RefreshCw,
  ListTodo,
  Maximize2,
  Minimize2,
  Layers,
  User,
  Bot,
  Copy,
  Check,
  X,
  AlertTriangle,
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
    owner: "Human",
    tool: "None (Human-driven)",
    modelBadge: "High-capability model (research)",
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
    tool: "Autonomous implementation",
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
  // Default mode is Architecture Diagram ("blueprint") as requested
  const [viewMode, setViewMode] = useState<"blueprint" | "interactive">("blueprint");
  const [diagramScale, setDiagramScale] = useState<"0.5x" | "1x">("0.5x");
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [feedbackFlash, setFeedbackFlash] = useState(false);
  const [mergeApproved, setMergeApproved] = useState(false);
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [zoomedDiagram, setZoomedDiagram] = useState<{
    src: string;
    title: string;
    desc?: string;
  } | null>(null);

  // Close zoomed diagram on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setZoomedDiagram(null);
      }
    };
    if (zoomedDiagram) {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [zoomedDiagram]);

  // Auto-play simulation cycle
  useEffect(() => {
    if (isPlaying && viewMode === "interactive") {
      autoPlayTimerRef.current = setTimeout(() => {
        setActiveStep((prev) => {
          if (prev === STEPS.length - 1) {
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
  }, [isPlaying, activeStep, viewMode]);

  const handleTriggerFeedbackLoop = () => {
    setFeedbackFlash(true);
    setActiveStep(2); // Jump back to Stage 03: Implementation
    setTimeout(() => {
      setFeedbackFlash(false);
    }, 1500);
  };

  const currentStep = STEPS[activeStep];
  const isExpandedWidth =
    viewMode === "interactive" || (viewMode === "blueprint" && diagramScale === "1x");

  return (
    <div
      id="workflow"
      className={`w-full mx-auto my-6 sm:my-8 transition-all duration-300 ease-in-out text-left ${
        isExpandedWidth ? "max-w-5xl lg:max-w-6xl" : "max-w-xl sm:max-w-2xl"
      }`}
    >
      {/* Top Header / Mode Switcher Toolbar */}
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-slate-200/90 shadow-sm p-3 sm:p-4 mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-slate-900 text-xs sm:text-sm">
                Delivery Workflow
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 uppercase font-semibold">
                {viewMode === "interactive"
                  ? "Interactive Mode (1.0x)"
                  : diagramScale === "1x"
                  ? "Architecture Diagram (1.0x)"
                  : "Architecture Diagram (0.5x)"}
              </span>
            </div>
            <p className="text-[11px] font-mono text-slate-500 hidden sm:block">
              {viewMode === "interactive"
                ? "Click stages to inspect details or simulate the autonomous feedback loop."
                : "From idea to merged change · Human-led planning, agent execution, human approval."}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 text-xs font-mono ml-auto">
          {viewMode === "interactive" ? (
            <>
              <button
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono font-semibold transition-all shadow-sm cursor-pointer ${
                  isPlaying
                    ? "bg-amber-50 border-amber-300 text-amber-800 hover:bg-amber-100"
                    : "bg-white border-slate-300 text-slate-700 hover:bg-slate-50"
                }`}
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-3.5 h-3.5 fill-current" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Simulate</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setViewMode("blueprint");
                  setIsPlaying(false);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 font-semibold transition-colors cursor-pointer"
                title="Collapse to compact diagram (0.5x size)"
              >
                <Minimize2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Compact Diagram</span>
                <span className="sm:hidden">0.5x</span>
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setViewMode("interactive")}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-sm hover:shadow hover:shadow-blue-600/20 active:scale-95 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Switch to Interactive Mode</span>
                <ChevronRight className="w-3 h-3 ml-0.5 opacity-80" />
              </button>

              {/* x1 Button to enlarge the diagram itself */}
              <button
                type="button"
                onClick={() => setDiagramScale((prev) => (prev === "0.5x" ? "1x" : "0.5x"))}
                className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border text-xs font-mono font-bold transition-all shadow-sm cursor-pointer ${
                  diagramScale === "1x"
                    ? "bg-slate-900 text-white border-slate-900 hover:bg-slate-800"
                    : "bg-white hover:bg-slate-50 text-slate-700 border-slate-300 hover:border-slate-400"
                }`}
                title={diagramScale === "1x" ? "Scale down diagram (0.5x)" : "Enlarge diagram (1x)"}
              >
                {diagramScale === "1x" ? (
                  <>
                    <Minimize2 className="w-3.5 h-3.5 text-slate-300" />
                    <span>x0.5</span>
                  </>
                ) : (
                  <>
                    <Maximize2 className="w-3.5 h-3.5 text-blue-600" />
                    <span>x1</span>
                  </>
                )}
              </button>
            </>
          )}

          <a
            href="/charts/workflow-en.svg"
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 text-slate-400 hover:text-blue-600 transition-colors hidden sm:inline-flex"
            title="Open raw vector SVG in new tab"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Main Panel Content */}
      {viewMode === "blueprint" ? (
        /* =========================================================================
           ARCHITECTURE DIAGRAM (COMPACT 0.5X OR EXPANDED 1.0X)
           ========================================================================= */
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-soft p-3 sm:p-5 overflow-hidden animate-in fade-in duration-200">
          {/* Clickable Diagram Container */}
          <div
            onClick={() => setViewMode("interactive")}
            className="group relative rounded-xl border border-slate-200/80 overflow-hidden bg-[#f6f8fb] shadow-inner p-2 cursor-pointer transition-all hover:border-blue-400 hover:shadow-md"
            title="Click to switch to interactive mode and step through pipeline"
          >
            <Image
              src="/charts/workflow-en.svg"
              alt="Workflow — from idea to merged change"
              width={1680}
              height={850}
              className="w-full h-auto rounded-lg shadow-sm transition-transform duration-200 group-hover:scale-[1.005]"
              priority
            />

            {/* Subtle Hover Action Pill */}
            <div className="absolute inset-0 bg-blue-950/0 group-hover:bg-blue-950/10 transition-colors flex items-center justify-center pointer-events-none">
              <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900/90 backdrop-blur-sm text-white text-xs font-mono font-bold px-3.5 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 duration-200">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                Click to explore interactive mode
                <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
              </span>
            </div>
          </div>

          {/* Quick Caption Strip */}
          <div className="mt-3 px-1 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] font-mono text-slate-500 gap-1.5">
            <span>
              Dashed line: feedback path (<code className="text-amber-700 bg-amber-50 px-1 py-0.5 rounded">Requested changes → rework</code>).
            </span>
            <button
              type="button"
              onClick={() => setViewMode("interactive")}
              className="text-blue-600 hover:text-blue-700 font-semibold underline underline-offset-2 text-left sm:text-right cursor-pointer"
            >
              Explore 4 stages interactively →
            </button>
          </div>
        </div>
      ) : (
        /* =========================================================================
           EXPANDED INTERACTIVE PIPELINE (ORIGINAL FULL SIZE)
           ========================================================================= */
        <div className="space-y-6 animate-in fade-in zoom-in-[0.99] duration-300">
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

          {/* Feedback loop alert banner when triggered */}
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
                  {activeStep === 0 ? (
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                      <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider font-semibold">
                        Responsible Actor
                      </div>
                      <div className="mt-2.5 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-blue-100 border border-blue-200 text-blue-700 flex items-center justify-center shrink-0 shadow-sm">
                          <User className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-display font-extrabold text-slate-950 text-base leading-tight">
                            Human
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : activeStep === 1 ? (
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                      <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider font-semibold">
                        Responsible Actor &amp; Tooling
                      </div>
                      <div className="mt-1 flex items-center justify-between">
                        <div className="font-semibold text-slate-900 text-sm">
                          {currentStep.owner}
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-slate-600 font-mono">
                        <span className="text-slate-500 font-medium">Proposed Tools:</span>
                        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                          <a
                            href="https://www.aihero.dev/skills-wayfinder"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white border border-slate-200 text-blue-600 hover:text-blue-700 hover:border-blue-300 font-semibold transition-colors shadow-xs"
                            title="Matt Pocock's /wayfinder skill"
                          >
                            <span>/wayfinder</span>
                            <ExternalLink className="w-2.5 h-2.5 opacity-70" />
                          </a>
                          <a
                            href="https://www.aihero.dev/skills-triage"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white border border-slate-200 text-blue-600 hover:text-blue-700 hover:border-blue-300 font-semibold transition-colors shadow-xs"
                            title="Matt Pocock's /triage skill"
                          >
                            <span>/triage</span>
                            <ExternalLink className="w-2.5 h-2.5 opacity-70" />
                          </a>
                          <a
                            href="https://www.aihero.dev/skills-to-tickets"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white border border-slate-200 text-blue-600 hover:text-blue-700 hover:border-blue-300 font-semibold transition-colors shadow-xs"
                            title="Matt Pocock's /to-tickets skill"
                          >
                            <span>/to-tickets</span>
                            <ExternalLink className="w-2.5 h-2.5 opacity-70" />
                          </a>
                        </div>
                      </div>
                      <p className="mt-2 text-[11px] text-slate-500 font-sans leading-relaxed">
                        Currently in testing, skills from Matt Pocock&apos;s workflow are being used; focus is currently on preparing the agent rather than the entire workflow.
                      </p>
                    </div>
                  ) : activeStep === 2 ? (
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                      <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider font-semibold">
                        Responsible Actor &amp; Tooling
                      </div>
                      <div className="mt-1 flex items-center justify-between">
                        <div className="font-semibold text-slate-900 text-sm">
                          {currentStep.owner}
                        </div>
                      </div>
                      <div className="mt-1.5 text-xs text-slate-600 font-mono flex flex-wrap items-center gap-1.5">
                        <span>Tool: Autonomous implementation</span>
                        <span className="inline-flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 text-emerald-800 font-semibold text-[11px]">
                          <span>Agent</span>
                          <Bot className="w-3 h-3 text-emerald-600" />
                        </span>
                      </div>
                    </div>
                  ) : (
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
                  )}

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
                </div>
              </div>

              {/* Right Column: Realistic Interactive Mock Simulation */}
              <div className="lg:col-span-7">
                {activeStep === 0 && <IdeaMockSimulation />}
                {activeStep === 1 && <PlanningMockSimulation />}
                {activeStep === 2 && (
                  <ImplementationMockSimulation onOpenDiagram={(diag) => setZoomedDiagram(diag)} />
                )}
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

            {/* Bottom Context Strip */}
            <div className="bg-slate-50 border-t border-slate-200/80 px-6 py-3.5 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-slate-500 gap-3">
              {activeStep === 0 && (
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  <span className="font-semibold text-slate-800">Human Discovery:</span>
                  <span>Formulate intent &amp; desired outcome before entering workflow.</span>
                </div>
              )}
              {activeStep === 1 && (
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  <span className="font-semibold text-slate-800">Agent Handoff:</span>
                  <span>Specified issue with <code className="text-blue-700 bg-blue-50 px-1 rounded">ready-for-agent</code> label dispatches to Agent.</span>
                </div>
              )}
              {activeStep === 2 && (
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span className="font-semibold text-slate-800">Docker Sandbox:</span>
                  <span>Agent executes in isolation, verifies test suites, and creates PR.</span>
                </div>
              )}
              {activeStep === 3 && (
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                  <span className="font-semibold text-amber-900">Feedback Loop:</span>
                  <span className="text-amber-800">Requested changes return to implementation (Stage 03) for rework.</span>
                </div>
              )}
              {/* Chain: Idea (Human) ➔ Planning (Human) ➔ Agent (AI) ➔ Review (Human) */}
              <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-mono">
                <span className="inline-flex items-center gap-1 bg-white px-2 py-0.5 rounded-md border border-slate-200 text-slate-700">
                  <span>Idea</span>
                  <User className="w-3 h-3 text-blue-600" />
                </span>
                <span className="text-slate-400">➔</span>
                <span className="inline-flex items-center gap-1 bg-white px-2 py-0.5 rounded-md border border-slate-200 text-slate-700">
                  <span>Planning</span>
                  <User className="w-3 h-3 text-blue-600" />
                </span>
                <span className="text-slate-400">➔</span>
                <span className="inline-flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 text-emerald-800 font-semibold">
                  <span>Agent</span>
                  <Bot className="w-3 h-3 text-emerald-600" />
                </span>
                <span className="text-slate-400">➔</span>
                <span className="inline-flex items-center gap-1 bg-white px-2 py-0.5 rounded-md border border-slate-200 text-slate-700">
                  <span>Review</span>
                  <User className="w-3 h-3 text-amber-600" />
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox / Zoom Modal for Architecture Diagrams */}
      {zoomedDiagram && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setZoomedDiagram(null)}
        >
          <div
            className="relative max-w-6xl w-full max-h-[92vh] bg-slate-900 rounded-2xl shadow-2xl border border-slate-700 overflow-hidden flex flex-col animate-in zoom-in-[0.98] duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Top Bar */}
            <div className="flex items-center justify-between px-5 py-3.5 bg-slate-950 text-white border-b border-slate-800">
              <div className="min-w-0 pr-3">
                <div className="font-display font-bold text-sm sm:text-base text-white truncate">
                  {zoomedDiagram.title}
                </div>
                {zoomedDiagram.desc && (
                  <p className="text-[11px] font-mono text-slate-400 truncate mt-0.5">
                    {zoomedDiagram.desc}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={zoomedDiagram.src}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                  title="Open raw vector SVG in new tab"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
                <button
                  type="button"
                  onClick={() => setZoomedDiagram(null)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                  title="Close (Esc)"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            {/* Modal Image View */}
            <div className="p-3 sm:p-5 overflow-auto flex-1 flex items-center justify-center bg-slate-950/60 min-h-[300px]">
              <img
                src={zoomedDiagram.src}
                alt={zoomedDiagram.title}
                className="max-w-full max-h-[78vh] object-contain rounded-lg shadow-md"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================================================================
   INTERACTIVE MOCK PREVIEWS FOR EACH STEP
   ========================================================================= */

function IdeaMockSimulation() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col h-full font-mono text-xs">
      {/* Top Header Bar */}
      <div className="bg-slate-100/90 border-b border-slate-200 px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-400"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
          </div>
          <User className="w-3.5 h-3.5 text-blue-600 ml-1" />
          <span className="text-[11px] text-slate-700 font-semibold">
            Stage 01 · Human Ideation &amp; Problem Discovery
          </span>
        </div>
        <span className="text-[10px] bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
          High-capability model (research)
        </span>
      </div>

      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4 bg-white">
        {/* Whiteboard / Architecture Flow Draft Canvas */}
        <div className="relative h-44 sm:h-48 rounded-2xl border border-slate-200/90 overflow-hidden bg-white shadow-inner group">
          {/* Subtle blueprint dot grid on whiteboard */}
          <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px] opacity-40 z-0"></div>

          {/* Authentic technical flow diagram fragment (slightly blurred & faded to convey freeform draft, not a rigid schema) */}
          <div className="absolute inset-0 overflow-hidden z-0">
            <Image
              src="/charts/agent-lifecycle-en.svg"
              alt="Whiteboard architecture flow draft"
              width={1600}
              height={1540}
              className="w-full h-full object-cover object-[center_20%] opacity-40 filter blur-[0.8px] group-hover:opacity-50 transition-opacity duration-300 select-none pointer-events-none"
              priority
            />
            {/* Subtle soft gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-white/70 via-transparent to-white/40 pointer-events-none"></div>
          </div>

          {/* Single clean sticky note in the upper-right corner: Discovery */}
          <div className="absolute top-3 right-3 z-10 pointer-events-none">
            <div className="bg-amber-100/95 border border-amber-300 text-amber-950 px-3 py-1 rounded-lg shadow-sm font-mono text-xs font-bold rotate-[1deg] backdrop-blur-xs flex items-center gap-1.5">
              <span>📌</span>
              <span>Discovery</span>
            </div>
          </div>
        </div>

        {/* Clear Explanatory Message Box */}
        <div className="p-4 rounded-xl bg-slate-900 text-white space-y-2.5">
          <div className="flex items-center gap-2 text-amber-300 font-bold text-xs font-mono">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span>This workflow begins only when you already have an idea</span>
          </div>

          <p className="text-slate-300 text-xs font-sans leading-relaxed">
            High-capability models can freely assist your research, exploration, and problem analysis. However, the automated delivery workflow leaves problem formulation and ownership <strong className="text-white">entirely in human hands</strong> — no automated agents intervene until you enter Planning.
          </p>

          <div className="pt-2 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-sans">
            <div className="text-slate-300">
              <span className="text-blue-400 font-bold font-mono">✦ AI for Research:</span> Freely use high-capability LLMs for exploratory analysis and brainstorms.
            </div>
            <div className="text-slate-300">
              <span className="text-emerald-400 font-bold font-mono">✦ Human Prerequisite:</span> You bring a formulated intent to enter Stage 02 (Planning).
            </div>
          </div>
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

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="p-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 border border-slate-200/80 transition-colors cursor-pointer shrink-0"
      title="Copy to clipboard"
      aria-label="Copy command"
    >
      {copied ? (
        <Check className="w-3.5 h-3.5 text-emerald-600" />
      ) : (
        <Copy className="w-3.5 h-3.5 opacity-70" />
      )}
    </button>
  );
}

function ImplementationMockSimulation({
  onOpenDiagram,
}: {
  onOpenDiagram: (diag: { src: string; title: string; desc?: string }) => void;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col h-full font-mono text-xs text-slate-800">
      {/* Top Header Bar */}
      <div className="bg-slate-100/90 border-b border-slate-200 px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bot className="w-3.5 h-3.5 text-emerald-600" />
          <span className="text-[11px] text-slate-700 font-semibold">
            Stage 03 · Autonomous Coding Agents
          </span>
        </div>
        <span className="text-[10px] bg-white text-slate-600 border border-slate-200 px-2 py-0.5 rounded font-mono font-medium shadow-2xs">
          Sid (Production) vs Rex (Experimental)
        </span>
      </div>

      {/* 2-Column Split: Agent Sid & Agent Rex */}
      <div className="p-5 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 flex-1 bg-white">
        {/* Column 1: Agent Sid */}
        <div className="md:col-span-7 flex flex-col space-y-4">
          {/* Sid Header */}
          <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-slate-950 text-base">Sid</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 font-semibold">
                  Production
                </span>
              </div>
              <div className="mt-1 flex items-center gap-1.5 text-xs font-mono text-slate-500">
                <span>Repo:</span>
                <a
                  href="https://github.com/lbacik/simple-coding-agent"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 hover:underline inline-flex items-center gap-0.5 font-medium"
                >
                  <span>simple-coding-agent</span>
                  <ExternalLink className="w-3 h-3 opacity-70" />
                </a>
              </div>
            </div>
            <div className="w-8 h-8 rounded-xl bg-emerald-100 border border-emerald-200 text-emerald-700 flex items-center justify-center shrink-0 shadow-2xs">
              <Bot className="w-4 h-4" />
            </div>
          </div>

          {/* 1. Built on Agent SDK */}
          <div className="space-y-2.5">
            <div className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
              <span className="text-emerald-600 font-mono font-bold">1.</span>
              <span>Built on</span>
              <a
                href="https://code.claude.com/docs/en/agent-sdk/overview"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 hover:underline inline-flex items-center gap-1 font-mono font-bold"
              >
                <span>Agent SDK</span>
                <ExternalLink className="w-3 h-3 opacity-70" />
              </a>
            </div>

            {/* Stack Diagram Preview */}
            <div
              onClick={() =>
                onOpenDiagram({
                  src: "/charts/agent-stack-en.svg",
                  title: "Agent Execution Stack (simple-coding-agent)",
                  desc: "Dependency direction: Python agent → Claude Agent SDK → Claude Code runtime & execution loop",
                })
              }
              className="group relative rounded-xl border border-slate-200 overflow-hidden bg-white cursor-pointer hover:border-emerald-500 transition-all shadow-2xs"
              title="Click to enlarge Execution Stack diagram"
            >
              <Image
                src="/charts/agent-stack-en.svg"
                alt="Agent execution stack diagram"
                width={1440}
                height={650}
                className="w-full h-auto object-contain transition-transform duration-200 group-hover:scale-[1.01]"
              />
              <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/10 transition-colors flex items-center justify-center">
                <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900/90 text-white text-[10px] font-mono px-2.5 py-1 rounded-md shadow border border-slate-700 flex items-center gap-1">
                  <Maximize2 className="w-3 h-3 text-emerald-400" />
                  <span>Click to enlarge</span>
                </span>
              </div>
            </div>

            {/* Details: agent-lifecycle-en.svg thumbnail */}
            <button
              type="button"
              onClick={() =>
                onOpenDiagram({
                  src: "/charts/agent-lifecycle-en.svg",
                  title: "Agent Work Cycle: simple-coding-agent",
                  desc: "Detailed lifecycle state machine: Startup, Polling, Claimed, Model Running (TDD, implement, code-review), Push & Outcomes",
                })
              }
              className="group w-full flex items-center gap-2.5 p-2 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-emerald-400 hover:shadow-sm transition-all text-left cursor-pointer"
            >
              <div className="w-14 h-10 rounded-lg overflow-hidden border border-slate-200 bg-white shrink-0 relative shadow-2xs">
                <Image
                  src="/charts/agent-lifecycle-en.svg"
                  alt="Agent lifecycle diagram thumbnail"
                  width={1600}
                  height={1540}
                  className="w-full h-full object-cover object-top opacity-90 group-hover:opacity-100 transition-opacity"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-800 group-hover:text-emerald-700 transition-colors">
                  <span>Details: Work cycle &amp; lifecycle</span>
                  <Maximize2 className="w-3 h-3 opacity-70 text-slate-400" />
                </div>
                <p className="text-[10px] text-slate-500 truncate">
                  Click to view full lifecycle state machine
                </p>
              </div>
            </button>
          </div>

          {/* 2. Managed by Agent Forge skills */}
          <div className="space-y-2.5 pt-3 border-t border-slate-200">
            <div className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
              <span className="text-emerald-600 font-mono font-bold">2.</span>
              <span>Managed by</span>
              <a
                href="https://github.com/lbacik/agent-forge"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 hover:underline inline-flex items-center gap-1 font-mono font-bold"
              >
                <span>Agent Forge</span>
                <ExternalLink className="w-3 h-3 opacity-70" />
              </a>
              <span>skills</span>
            </div>

            {/* Agent Forge diagram thumbnail */}
            <button
              type="button"
              onClick={() =>
                onOpenDiagram({
                  src: "/charts/agent-forge-en.svg",
                  title: "Agent Forge — Prepare, Build and Operate Agent",
                  desc: "Architecture: create-agent, generate Dockerfile & Compose, run agent container with persistent volume",
                })
              }
              className="group w-full flex items-center gap-2.5 p-2 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-blue-400 hover:shadow-sm transition-all text-left cursor-pointer"
            >
              <div className="w-14 h-10 rounded-lg overflow-hidden border border-slate-200 bg-white shrink-0 relative shadow-2xs">
                <Image
                  src="/charts/agent-forge-en.svg"
                  alt="Agent Forge diagram thumbnail"
                  width={1600}
                  height={1060}
                  className="w-full h-full object-cover object-top opacity-90 group-hover:opacity-100 transition-opacity"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-800 group-hover:text-blue-700 transition-colors">
                  <span>Agent Forge Architecture</span>
                  <Maximize2 className="w-3 h-3 opacity-70 text-slate-400" />
                </div>
                <p className="text-[10px] text-slate-500 truncate">
                  Click to enlarge Agent Forge diagram
                </p>
              </div>
            </button>

            {/* Operations a, b, c */}
            <div className="space-y-2 pt-1 text-[11px] font-mono">
              {/* a. Create agent (skill) */}
              <div className="bg-slate-50/70 rounded-xl p-2.5 border border-slate-200 shadow-2xs">
                <div className="text-[10px] text-slate-500 font-sans font-semibold mb-0.5">
                  a. Create agent:
                </div>
                <div className="text-slate-900 flex items-center justify-between gap-1">
                  <code className="text-[10.5px] truncate select-all">
                    <span className="text-blue-600 font-bold">/create-agent</span>{" "}
                    <span className="text-amber-800 font-semibold">&#123;target-repo&#125;</span>
                  </code>
                  <CopyButton text="/create-agent {target-repository}" />
                </div>
                <p className="text-[9.5px] text-slate-500 font-sans mt-0.5 leading-tight">
                  &#123;target application repository the agent will work on&#125;
                </p>
              </div>

              {/* b. Launch (CLI) */}
              <div className="bg-slate-50/70 rounded-xl p-2.5 border border-slate-200 shadow-2xs">
                <div className="text-[10px] text-slate-500 font-sans font-semibold mb-0.5">
                  b. Launch:
                </div>
                <div className="text-slate-900 flex items-center justify-between gap-1">
                  <code className="text-[10.5px] truncate select-all">
                    <span className="text-slate-400 font-semibold">$</span>{" "}
                    <span className="text-emerald-700 font-bold">docker compose up --build -d</span>
                  </code>
                  <CopyButton text="docker compose up --build -d" />
                </div>
              </div>

              {/* c. Debug (skill) */}
              <div className="bg-slate-50/70 rounded-xl p-2.5 border border-slate-200 shadow-2xs">
                <div className="text-[10px] text-slate-500 font-sans font-semibold mb-0.5">
                  c. Debug (troubleshooting: &ldquo;what happened?&rdquo;):
                </div>
                <div className="text-slate-900 flex items-center justify-between gap-1">
                  <code className="text-[10.5px] truncate select-all">
                    <span className="text-blue-600 font-bold">/debug-agent</span>{" "}
                    <span className="text-amber-800 font-semibold">link-to-gh-issue</span>
                  </code>
                  <CopyButton text="/debug-agent link-to-gh-issue" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Column 2: Agent Rex */}
        <div className="md:col-span-5 flex flex-col justify-between space-y-4 pt-6 border-t border-slate-200 md:border-t-0 md:pt-0 relative">
          {/* Rex Header */}
          <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-slate-950 text-base">Rex</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 font-semibold">
                  Experimental
                </span>
              </div>
              <div className="mt-1 flex items-center gap-1.5 text-xs font-mono text-slate-500">
                <span>Repo:</span>
                <a
                  href="https://github.com/lbacik/coding-agent"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 hover:underline inline-flex items-center gap-0.5 font-medium"
                >
                  <span>coding-agent</span>
                  <ExternalLink className="w-3 h-3 opacity-70" />
                </a>
              </div>
            </div>
            <div className="w-8 h-8 rounded-xl bg-amber-100 border border-amber-200 text-amber-700 flex items-center justify-center shrink-0 shadow-2xs">
              <Bot className="w-4 h-4" />
            </div>
          </div>

          {/* Centered Warning / Early Development Block with Localized Divider Line */}
          <div className="relative my-auto py-2">
            {/* Subtle vertical divider between Sid and Rex, only alongside this block */}
            <div
              className="hidden md:block absolute -left-3 lg:-left-4 -top-6 -bottom-6 w-px bg-gradient-to-b from-transparent via-slate-300 to-transparent"
              aria-hidden="true"
            />

            <div className="py-8 px-4 rounded-xl bg-amber-50/90 border border-amber-200 text-amber-950 text-center flex flex-col items-center justify-center space-y-3.5 shadow-2xs">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700 shadow-xs">
                <AlertTriangle className="w-5 h-5" />
              </div>

              <div className="space-y-1">
                <div className="font-display font-bold text-amber-950 text-sm">
                  Still in early development
                </div>
                <p className="text-xs text-amber-900 leading-relaxed font-sans max-w-xs mx-auto">
                  Uses{" "}
                  <a
                    href="https://www.langchain.com/langgraph"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-950 font-bold underline underline-offset-2 hover:text-amber-800 inline-flex items-center gap-0.5"
                  >
                    <span>LangChain / LangGraph</span>
                    <ExternalLink className="w-3 h-3 opacity-70" />
                  </a>{" "}
                  — under active initial development.
                </p>
              </div>

              <div className="pt-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-red-700 uppercase tracking-wide bg-red-100 border border-red-200 px-3.5 py-1.5 rounded-lg shadow-2xs">
                  <span>⚠️ Do not use!</span>
                </span>
              </div>
            </div>
          </div>
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
