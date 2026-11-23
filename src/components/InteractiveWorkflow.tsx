"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  Sparkles,
  GitPullRequest,
  CheckCircle2,
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
  Layers,
  Network,
  User,
  Bot,
  Copy,
  Check,
  X,
  AlertTriangle,
} from "lucide-react";
import { WorkflowSimulationHUD } from "./WorkflowSimulationHUD";

const ECOSYSTEM_REPOS = [
  {
    name: "Agent Forge",
    url: "https://github.com/lbacik/agent-forge",
  },
  {
    name: "Agent Dashboard",
    url: "https://github.com/lbacik/agent-dashboard",
  },
  {
    name: "agentfleet (agent-operator-contract)",
    url: "https://github.com/lbacik/agent-operator-contract",
  },
  {
    name: "simple-coding-agent (Sid)",
    url: "https://github.com/lbacik/simple-coding-agent",
  },
  {
    name: "coding-agent (Rex)",
    url: "https://github.com/lbacik/coding-agent",
  },
] as const;

function GithubIcon({ className = "w-3 h-3 fill-current" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

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
  const [activePrimaryTab, setActivePrimaryTab] = useState<"workflow" | "ecosystem">(
    "workflow",
  );
  // Default mode is Architecture Diagram ("blueprint") as requested
  const [viewMode, setViewMode] = useState<"blueprint" | "interactive">("blueprint");
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSimulationHUDOpen, setIsSimulationHUDOpen] = useState(false);
  const [feedbackFlash, setFeedbackFlash] = useState(false);
  const [mergeApproved, setMergeApproved] = useState(false);
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);
  const workflowContainerRef = useRef<HTMLDivElement>(null);
  const stagesSectionRef = useRef<HTMLDivElement>(null);
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

  const scrollToWorkflow = () => {
    const target = workflowContainerRef.current || stagesSectionRef.current;
    if (target) {
      const headerOffset = 124; // sticky header + version bar + margin
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: Math.max(0, offsetPosition),
        behavior: "smooth",
      });
    }
  };

  const handleStartSimulation = () => {
    setActivePrimaryTab("workflow");
    setViewMode("interactive");
    setActiveStep(0);
    setIsPlaying(true);
    setIsSimulationHUDOpen(true);
    // Allow DOM update before scrolling smoothly to the workflow top
    setTimeout(() => {
      scrollToWorkflow();
    }, 60);
  };

  const handleToggleSimulation = () => {
    if (viewMode !== "interactive") {
      handleStartSimulation();
      return;
    }
    const nextState = !isPlaying;
    setIsPlaying(nextState);
    if (nextState) {
      setIsSimulationHUDOpen(true);
      scrollToWorkflow();
    }
  };

  // Fallback auto-play cycle only when simulation HUD is closed (no loop)
  useEffect(() => {
    if (isPlaying && viewMode === "interactive" && !isSimulationHUDOpen) {
      autoPlayTimerRef.current = setTimeout(() => {
        setActiveStep((prev) => {
          if (prev === STEPS.length - 1) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 5000);
    } else if (autoPlayTimerRef.current) {
      clearTimeout(autoPlayTimerRef.current);
    }
    return () => {
      if (autoPlayTimerRef.current) clearTimeout(autoPlayTimerRef.current);
    };
  }, [isPlaying, activeStep, viewMode, isSimulationHUDOpen]);

  const handleTriggerFeedbackLoop = () => {
    setFeedbackFlash(true);
    setActiveStep(2); // Jump back to Stage 03: Implementation
    setTimeout(() => {
      setFeedbackFlash(false);
    }, 1500);
  };

  const currentStep = STEPS[activeStep];

  return (
    <div
      ref={workflowContainerRef}
      id="workflow"
      className="w-full mx-auto scroll-mt-32 transition-all duration-300 ease-in-out text-left max-w-5xl lg:max-w-6xl"
    >
      {/* Frame: toolbar and content panel share one tinted surface */}
      <div className="rounded-3xl bg-blue-100/70 ring-1 ring-blue-200 shadow-soft p-2 sm:p-2.5">
        {/* Top Header / Primary Tab & Mode Switcher Toolbar */}
        <div className="px-2.5 py-2 sm:px-3 sm:py-2.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            {/* Primary Section Tabs: Delivery Workflow vs. Ecosystem & Contract */}
            <div
              role="tablist"
              aria-label="Workflow and ecosystem views"
              className="inline-flex rounded-xl bg-white/75 p-1 border border-blue-200/90 shadow-2xs"
            >
              <button
                type="button"
                role="tab"
                id="workflow-primary-tab-delivery"
                aria-selected={activePrimaryTab === "workflow"}
                onClick={() => setActivePrimaryTab("workflow")}
                className="relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-display text-xs sm:text-sm font-bold transition-all cursor-pointer text-slate-600 hover:text-slate-900 aria-selected:bg-white aria-selected:text-slate-950 aria-selected:shadow-xs aria-selected:after:content-[''] aria-selected:after:absolute aria-selected:after:inset-x-2.5 aria-selected:after:bottom-0.5 aria-selected:after:border-b-2 aria-selected:after:border-blue-600"
              >
                <Layers className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>Delivery Workflow</span>
              </button>
              <button
                type="button"
                role="tab"
                id="workflow-primary-tab-ecosystem"
                aria-selected={activePrimaryTab === "ecosystem"}
                onClick={() => {
                  setActivePrimaryTab("ecosystem");
                  setIsPlaying(false);
                  setIsSimulationHUDOpen(false);
                }}
                className="relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-display text-xs sm:text-sm font-bold transition-all cursor-pointer text-slate-600 hover:text-slate-900 aria-selected:bg-white aria-selected:text-slate-950 aria-selected:shadow-xs aria-selected:after:content-[''] aria-selected:after:absolute aria-selected:after:inset-x-2.5 aria-selected:after:bottom-0.5 aria-selected:after:border-b-2 aria-selected:after:border-blue-600"
              >
                <Network className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                <span>Ecosystem &amp; Contract</span>
              </button>
            </div>

            <div className="hidden md:block">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/80 text-slate-600 border border-slate-300/70 uppercase font-semibold">
                  {activePrimaryTab === "ecosystem"
                    ? "agentfleet Operator Contract"
                    : viewMode === "interactive"
                    ? "Interactive Mode"
                    : "Architecture Diagram"}
                </span>
              </div>
              <p className="text-[11px] font-mono text-slate-600 mt-0.5">
                {activePrimaryTab === "ecosystem"
                  ? "Agent Forge & Agent Dashboard consume agentfleet, implemented by Sid & Rex."
                  : viewMode === "interactive"
                  ? "Click stages to inspect details or simulate the autonomous feedback loop."
                  : "From idea to merged change · Human-led planning, agent execution, human approval."}
              </p>
            </div>
          </div>

          {/* Action Controls */}
          <div className="flex items-center gap-2 text-xs font-mono ml-auto">
            {activePrimaryTab === "ecosystem" ? (
              <>
                <button
                  type="button"
                  onClick={() =>
                    setZoomedDiagram({
                      src: "/charts/tools-landscape-en.svg",
                      title: "Ecosystem & Contract — Operator Tools, agentfleet, and Coding Agents",
                      desc: "Agent Forge & Agent Dashboard use agentfleet (lbacik/agent-operator-contract), implemented by simple-coding-agent (Sid) and coding-agent (Rex).",
                    })
                  }
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 hover:border-slate-400 font-semibold transition-colors cursor-pointer"
                  title="Zoom architecture diagram"
                >
                  <Maximize2 className="w-3.5 h-3.5 text-blue-600" />
                  <span className="hidden sm:inline">Zoom Diagram</span>
                </button>
                <a
                  href="/charts/tools-landscape-en.svg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 text-slate-500 hover:text-blue-600 transition-colors hidden sm:inline-flex"
                  title="Open raw vector SVG in new tab"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </>
            ) : viewMode === "interactive" ? (
              <>
                <button
                  type="button"
                  onClick={handleToggleSimulation}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono font-bold transition-all shadow-sm cursor-pointer ${
                    isPlaying
                      ? "bg-amber-50 border-amber-300 text-amber-800 hover:bg-amber-100 ring-2 ring-amber-400/20"
                      : "bg-emerald-600 hover:bg-emerald-700 text-white border-transparent shadow-emerald-600/20 shadow-md"
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

                {!isSimulationHUDOpen && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsSimulationHUDOpen(true);
                      scrollToWorkflow();
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 font-semibold transition-colors cursor-pointer text-xs font-mono"
                    title="Otwórz panel lektora i animacji (Simulation Player)"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                    <span className="hidden sm:inline">Voice &amp; HUD</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setViewMode("blueprint");
                    setIsPlaying(false);
                    setIsSimulationHUDOpen(false);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 hover:border-slate-400 font-semibold transition-colors cursor-pointer"
                  title="Switch to Architecture Diagram"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Architecture Diagram</span>
                  <span className="sm:hidden">Diagram</span>
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleStartSimulation}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-mono text-xs font-bold transition-all shadow-md hover:shadow-emerald-600/20 active:scale-95 cursor-pointer"
                  title="Start pipeline simulation with voice narration & animations"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Simulate</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setViewMode("interactive");
                    setTimeout(() => scrollToWorkflow(), 60);
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-sm hover:shadow hover:shadow-blue-600/20 active:scale-95 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Interactive Mode</span>
                  <span className="sm:hidden">Interactive</span>
                  <ChevronRight className="w-3 h-3 ml-0.5 opacity-80" />
                </button>
              </>
            )}

            {activePrimaryTab === "workflow" && (
              <a
                href="/charts/workflow-en.svg"
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 text-slate-500 hover:text-blue-600 transition-colors hidden sm:inline-flex"
                title="Open raw vector SVG in new tab"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>

        {/* Main Panel Content */}
        {activePrimaryTab === "ecosystem" ? (
          <div role="tabpanel" aria-labelledby="workflow-primary-tab-ecosystem">
            <EcosystemContractDiagram
              onOpenDiagram={(diag) => setZoomedDiagram(diag)}
            />
          </div>
        ) : viewMode === "blueprint" ? (
          /* =========================================================================
             ARCHITECTURE DIAGRAM (COMPACT 0.5X OR EXPANDED 1.0X)
             ========================================================================= */
          <>
            {/* Diagram Container */}
            <div className="rounded-2xl bg-[#f6f8fb] ring-1 ring-slate-900/5 p-2 sm:p-3 animate-in fade-in duration-200">
              <Image
                src="/charts/workflow-en.svg"
                alt="Workflow — from idea to merged change"
                width={1680}
                height={850}
                className="w-full h-auto rounded-lg shadow-sm"
                priority
              />
            </div>

            {/* Quick Caption Strip */}
            <div className="px-2.5 sm:px-3 pt-2.5 pb-1.5 text-[11px] font-mono text-slate-600">
              Dashed line: feedback path (<code className="text-amber-700 bg-amber-50 px-1 py-0.5 rounded">Requested changes → rework</code>).
            </div>
          </>
        ) : (
          /* =========================================================================
             EXPANDED INTERACTIVE PIPELINE (ORIGINAL FULL SIZE)
             ========================================================================= */
          <div
            ref={stagesSectionRef}
            className="rounded-2xl bg-[#f6f8fb] ring-1 ring-slate-900/5 p-3 sm:p-4 space-y-6 animate-in fade-in zoom-in-[0.99] duration-300 scroll-mt-24"
          >
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
      </div>

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
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={zoomedDiagram.src}
                alt={zoomedDiagram.title}
                className="max-w-full max-h-[78vh] object-contain rounded-lg shadow-md"
              />
            </div>
          </div>
        </div>
      )}

      {/* Voice & Animated Stage Illustration Simulation Controller */}
      <WorkflowSimulationHUD
        isOpen={isSimulationHUDOpen}
        onClose={() => {
          setIsSimulationHUDOpen(false);
          setIsPlaying(false);
        }}
        activeStep={activeStep}
        onStepChange={(stepIdx) => setActiveStep(stepIdx)}
        isPlaying={isPlaying}
        onTogglePlay={(playing) => setIsPlaying(playing)}
        onRequestChangesRework={handleTriggerFeedbackLoop}
      />
    </div>
  );
}

/* =========================================================================
   ECOSYSTEM & CONTRACT DIAGRAM ("TOOLS LANDSCAPE" TAB)
   ========================================================================= */

function EcosystemContractDiagram({
  onOpenDiagram,
}: {
  onOpenDiagram: (diag: { src: string; title: string; desc?: string }) => void;
}) {
  return (
    <>
      <div className="relative rounded-2xl bg-[#f6f8fb] ring-1 ring-slate-900/5 p-2 sm:p-3 animate-in fade-in duration-200">
        {/* Enlarge button in top-right corner */}
        <button
          type="button"
          onClick={() =>
            onOpenDiagram({
              src: "/charts/tools-landscape-en.svg",
              title: "Tools & Agent Ecosystem — agentfleet Operator Contract",
              desc: "Agent Forge & Agent Dashboard use agentfleet (lbacik/agent-operator-contract), implemented by simple-coding-agent (Sid) and coding-agent (Rex).",
            })
          }
          className="absolute top-4 right-4 z-10 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/90 hover:bg-white text-slate-700 hover:text-blue-600 border border-slate-200/90 shadow-2xs text-[11px] font-mono font-semibold transition-all cursor-pointer"
          title="Click to enlarge diagram"
        >
          <Maximize2 className="w-3.5 h-3.5 text-blue-600" />
          <span className="hidden sm:inline">Enlarge</span>
        </button>

        {/* Inline Interactive Vector SVG */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1680 850"
          role="img"
          aria-labelledby="landscape-svg-title landscape-svg-desc"
          className="w-full h-auto rounded-lg shadow-sm bg-[#f6f8fb]"
        >
          <title id="landscape-svg-title">
            Tools &amp; Agent Ecosystem — Operator Tools, agentfleet Contract, and Coding Agent Engines
          </title>
          <desc id="landscape-svg-desc">
            Agent Forge and Agent Dashboard consume the agentfleet client defined in agent-operator-contract, which is implemented by simple-coding-agent (Sid) and coding-agent (Rex).
          </desc>
          <defs>
            <pattern id="eco-grid" width="28" height="28" patternUnits="userSpaceOnUse">
              <circle cx="1.5" cy="1.5" r="1.2" fill="#dbe2eb" />
            </pattern>
            <linearGradient id="eco-contractBg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#eff6ff" />
              <stop offset="100%" stopColor="#eef2ff" />
            </linearGradient>
            <linearGradient id="eco-contractAccent" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#2563eb" />
              <stop offset="50%" stopColor="#4f46e5" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
            <marker
              id="eco-arrowBlue"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto"
            >
              <path d="M0 0 L10 5 L0 10 Z" fill="#2563eb" />
            </marker>
            <marker
              id="eco-arrowEmerald"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto"
            >
              <path d="M0 0 L10 5 L0 10 Z" fill="#059669" />
            </marker>
            <marker
              id="eco-arrowAmber"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto"
            >
              <path d="M0 0 L10 5 L0 10 Z" fill="#d97706" />
            </marker>
          </defs>

          <rect width="1680" height="850" fill="#f6f8fb" />
          <rect y="136" width="1680" height="630" fill="url(#eco-grid)" opacity="0.65" />

          {/* Header */}
          <text
            x="64"
            y="66"
            fill="#0f172a"
            fontSize="34"
            fontWeight="700"
            fontFamily="var(--font-display), sans-serif"
          >
            Tools &amp; Agent Ecosystem
          </text>
          <text x="64" y="101" fill="#64748b" fontSize="18">
            Operator tools and interchangeable coding agents connected through the neutral agentfleet contract
          </text>
          <path d="M64 132 H1616" stroke="#dbe2eb" strokeWidth="1.5" />

          {/* Column Zone Headers */}
          <rect x="64" y="156" width="430" height="36" rx="10" fill="#dbeafe" fillOpacity="0.8" />
          <text
            x="279"
            y="179"
            textAnchor="middle"
            fill="#1d4ed8"
            fontSize="13"
            fontWeight="700"
            letterSpacing="1.4"
          >
            01 · OPERATOR TOOLS (CONSUMERS)
          </text>

          <rect x="625" y="156" width="430" height="36" rx="10" fill="#e0e7ff" fillOpacity="0.95" />
          <text
            x="840"
            y="179"
            textAnchor="middle"
            fill="#3730a3"
            fontSize="13"
            fontWeight="700"
            letterSpacing="1.4"
          >
            02 · OPERATOR CONTRACT &amp; CLIENT
          </text>

          <rect x="1186" y="156" width="430" height="36" rx="10" fill="#d1fae5" fillOpacity="0.85" />
          <text
            x="1401"
            y="179"
            textAnchor="middle"
            fill="#065f46"
            fontSize="13"
            fontWeight="700"
            letterSpacing="1.4"
          >
            03 · CODING AGENT ENGINES (PRODUCERS)
          </text>

          {/* LEFT 1: Agent Forge */}
          <a href="https://github.com/lbacik/agent-forge" target="_blank" rel="noopener noreferrer">
            <rect
              x="64"
              y="216"
              width="430"
              height="236"
              rx="20"
              fill="#ffffff"
              stroke="#cbd5e1"
              strokeWidth="1.5"
            />
            <path d="M86 216 H472" stroke="#2563eb" strokeWidth="4" strokeLinecap="round" />
            <rect x="92" y="242" width="128" height="26" rx="8" fill="#eff6ff" stroke="#bfdbfe" />
            <text
              x="156"
              y="259"
              textAnchor="middle"
              fill="#1d4ed8"
              fontSize="13"
              fontWeight="600"
              fontFamily="var(--font-mono), monospace"
            >
              CLI &amp; Skills
            </text>
            <text
              x="466"
              y="260"
              textAnchor="end"
              fill="#2563eb"
              fontSize="14"
              fontWeight="600"
              fontFamily="var(--font-mono), monospace"
            >
              lbacik/agent-forge ↗
            </text>
            <text x="92" y="302" fill="#0f172a" fontSize="25" fontWeight="700">
              Agent Forge
            </text>
            <text x="92" y="330" fill="#475569" fontSize="16">
              Provision, scale &amp; operate dedicated instances
            </text>
            <path d="M92 350 H466" stroke="#e2e8f0" />
            <rect x="92" y="366" width="112" height="26" rx="6" fill="#f8fafc" stroke="#e2e8f0" />
            <text
              x="148"
              y="383"
              textAnchor="middle"
              fill="#334155"
              fontSize="13"
              fontWeight="600"
              fontFamily="var(--font-mono), monospace"
            >
              create-agent
            </text>
            <rect x="212" y="366" width="112" height="26" rx="6" fill="#f8fafc" stroke="#e2e8f0" />
            <text
              x="268"
              y="383"
              textAnchor="middle"
              fill="#334155"
              fontSize="13"
              fontWeight="600"
              fontFamily="var(--font-mono), monospace"
            >
              manage-pool
            </text>
            <rect x="332" y="366" width="124" height="26" rx="6" fill="#eff6ff" stroke="#bfdbfe" />
            <text
              x="394"
              y="383"
              textAnchor="middle"
              fill="#1d4ed8"
              fontSize="13"
              fontWeight="600"
              fontFamily="var(--font-mono), monospace"
            >
              operate-agent
            </text>
            <text x="92" y="424" fill="#64748b" fontSize="14">
              Also ships debug-agent &amp; deploy-dashboard skills
            </text>
          </a>

          {/* LEFT 2: Agent Dashboard */}
          <a
            href="https://github.com/lbacik/agent-dashboard"
            target="_blank"
            rel="noopener noreferrer"
          >
            <rect
              x="64"
              y="492"
              width="430"
              height="236"
              rx="20"
              fill="#ffffff"
              stroke="#cbd5e1"
              strokeWidth="1.5"
            />
            <path d="M86 492 H472" stroke="#0284c7" strokeWidth="4" strokeLinecap="round" />
            <rect x="92" y="518" width="138" height="26" rx="8" fill="#e0f2fe" stroke="#bae6fd" />
            <text
              x="161"
              y="535"
              textAnchor="middle"
              fill="#0369a1"
              fontSize="13"
              fontWeight="600"
              fontFamily="var(--font-mono), monospace"
            >
              Web UI · BETA
            </text>
            <text
              x="466"
              y="536"
              textAnchor="end"
              fill="#2563eb"
              fontSize="14"
              fontWeight="600"
              fontFamily="var(--font-mono), monospace"
            >
              lbacik/agent-dashboard ↗
            </text>
            <text x="92" y="578" fill="#0f172a" fontSize="25" fontWeight="700">
              Agent Dashboard
            </text>
            <text x="92" y="606" fill="#475569" fontSize="16">
              Observe &amp; command your container fleet
            </text>
            <path d="M92 626 H466" stroke="#e2e8f0" />
            <rect x="92" y="642" width="122" height="26" rx="6" fill="#f8fafc" stroke="#e2e8f0" />
            <text
              x="153"
              y="659"
              textAnchor="middle"
              fill="#334155"
              fontSize="13"
              fontWeight="600"
              fontFamily="var(--font-mono), monospace"
            >
              Fleet Overview
            </text>
            <rect x="222" y="642" width="110" height="26" rx="6" fill="#f8fafc" stroke="#e2e8f0" />
            <text
              x="277"
              y="659"
              textAnchor="middle"
              fill="#334155"
              fontSize="13"
              fontWeight="600"
              fontFamily="var(--font-mono), monospace"
            >
              Unit Cockpit
            </text>
            <rect x="340" y="642" width="126" height="26" rx="6" fill="#e0f2fe" stroke="#bae6fd" />
            <text
              x="403"
              y="659"
              textAnchor="middle"
              fill="#0369a1"
              fontSize="13"
              fontWeight="600"
              fontFamily="var(--font-mono), monospace"
            >
              2-Step Control
            </text>
            <text x="92" y="700" fill="#64748b" fontSize="14">
              Live status polling, cost charts &amp; offline volume reads
            </text>
          </a>

          {/* CENTER: agent-operator-contract (agentfleet) */}
          <rect
            x="615"
            y="246"
            width="450"
            height="452"
            rx="28"
            fill="#e0e7ff"
            fillOpacity="0.45"
            stroke="#a5b4fc"
            strokeWidth="1.5"
            strokeDasharray="6 5"
          />
          <a
            href="https://github.com/lbacik/agent-operator-contract"
            target="_blank"
            rel="noopener noreferrer"
          >
            <rect
              x="629"
              y="260"
              width="422"
              height="424"
              rx="22"
              fill="url(#eco-contractBg)"
              stroke="#6366f1"
              strokeWidth="2.5"
            />
            <path
              d="M654 260 H1026"
              stroke="url(#eco-contractAccent)"
              strokeWidth="5"
              strokeLinecap="round"
            />
            <rect x="657" y="288" width="166" height="28" rx="9" fill="#4f46e5" />
            <text
              x="740"
              y="307"
              textAnchor="middle"
              fill="#ffffff"
              fontSize="13"
              fontWeight="600"
              fontFamily="var(--font-mono), monospace"
            >
              CONTRACT v1.x
            </text>
            <text
              x="1023"
              y="307"
              textAnchor="end"
              fill="#4338ca"
              fontSize="13.5"
              fontWeight="600"
              fontFamily="var(--font-mono), monospace"
            >
              agent-operator-contract ↗
            </text>

            <text x="657" y="352" fill="#0f172a" fontSize="28" fontWeight="700">
              agentfleet
            </text>
            <text
              x="657"
              y="379"
              fill="#3730a3"
              fontSize="15.5"
              fontWeight="600"
              fontFamily="var(--font-mono), monospace"
            >
              lbacik/agent-operator-contract
            </text>
            <text x="657" y="405" fill="#475569" fontSize="15">
              Neutral specification, JSON Schemas &amp; host-side client
            </text>

            {/* Consumer API Sub-box */}
            <rect
              x="657"
              y="426"
              width="366"
              height="84"
              rx="14"
              fill="#ffffff"
              stroke="#bfdbfe"
              strokeWidth="1.5"
            />
            <text
              x="677"
              y="451"
              fill="#1d4ed8"
              fontSize="11.5"
              fontWeight="700"
              letterSpacing="1.2"
            >
              HOST CLIENT &amp; CONSUMER API
            </text>
            <text
              x="677"
              y="476"
              fill="#0f172a"
              fontSize="15"
              fontWeight="700"
              fontFamily="var(--font-mono), monospace"
            >
              agentfleet CLI · client library
            </text>
            <text x="677" y="497" fill="#475569" fontSize="13.5">
              discover · status · stop · resume · handoff · attempts
            </text>

            {/* Producer API Sub-box */}
            <rect
              x="657"
              y="524"
              width="366"
              height="84"
              rx="14"
              fill="#ffffff"
              stroke="#a7f3d0"
              strokeWidth="1.5"
            />
            <text
              x="677"
              y="549"
              fill="#047857"
              fontSize="11.5"
              fontWeight="700"
              letterSpacing="1.2"
            >
              ENGINE PRODUCER INTERFACE
            </text>
            <text
              x="677"
              y="574"
              fill="#0f172a"
              fontSize="15"
              fontWeight="700"
              fontFamily="var(--font-mono), monospace"
            >
              agentctl --contract 1 · JSON Schemas
            </text>
            <text x="677" y="595" fill="#475569" fontSize="13.5">
              Status Snapshot · Operator Commands · Offline Read
            </text>

            <rect x="657" y="624" width="366" height="36" rx="10" fill="#eef2ff" stroke="#c7d2fe" />
            <text
              x="840"
              y="647"
              textAnchor="middle"
              fill="#3730a3"
              fontSize="13"
              fontWeight="600"
              fontFamily="var(--font-mono), monospace"
            >
              Zero dependencies on engines or operator tools
            </text>
          </a>

          {/* RIGHT 1: simple-coding-agent (Sid) */}
          <a
            href="https://github.com/lbacik/simple-coding-agent"
            target="_blank"
            rel="noopener noreferrer"
          >
            <rect
              x="1186"
              y="216"
              width="430"
              height="236"
              rx="20"
              fill="#ffffff"
              stroke="#cbd5e1"
              strokeWidth="1.5"
            />
            <path d="M1208 216 H1594" stroke="#059669" strokeWidth="4" strokeLinecap="round" />
            <rect x="1214" y="242" width="142" height="26" rx="8" fill="#d1fae5" stroke="#6ee7b7" />
            <text
              x="1285"
              y="259"
              textAnchor="middle"
              fill="#065f46"
              fontSize="13"
              fontWeight="600"
              fontFamily="var(--font-mono), monospace"
            >
              Sid · Production
            </text>
            <text
              x="1588"
              y="260"
              textAnchor="end"
              fill="#2563eb"
              fontSize="14"
              fontWeight="600"
              fontFamily="var(--font-mono), monospace"
            >
              lbacik/simple-coding-agent ↗
            </text>
            <text x="1214" y="302" fill="#0f172a" fontSize="25" fontWeight="700">
              simple-coding-agent
            </text>
            <text x="1214" y="330" fill="#475569" fontSize="16">
              Unattended autonomous coding agent (&ldquo;Sid&rdquo;)
            </text>
            <path d="M1214 350 H1588" stroke="#e2e8f0" />
            <rect x="1214" y="366" width="136" height="26" rx="6" fill="#ecfdf5" stroke="#a7f3d0" />
            <text
              x="1282"
              y="383"
              textAnchor="middle"
              fill="#065f46"
              fontSize="13"
              fontWeight="600"
              fontFamily="var(--font-mono), monospace"
            >
              Claude Agent SDK
            </text>
            <rect x="1358" y="366" width="114" height="26" rx="6" fill="#f8fafc" stroke="#e2e8f0" />
            <text
              x="1415"
              y="383"
              textAnchor="middle"
              fill="#334155"
              fontSize="13"
              fontWeight="600"
              fontFamily="var(--font-mono), monospace"
            >
              Worker Pools
            </text>
            <rect x="1480" y="366" width="108" height="26" rx="6" fill="#f8fafc" stroke="#e2e8f0" />
            <text
              x="1534"
              y="383"
              textAnchor="middle"
              fill="#334155"
              fontSize="13"
              fontWeight="600"
              fontFamily="var(--font-mono), monospace"
            >
              agentctl v1
            </text>
            <text x="1214" y="424" fill="#64748b" fontSize="14">
              Claims ready-for-agent issues &amp; ships verified PRs
            </text>
          </a>

          {/* RIGHT 2: coding-agent (Rex) */}
          <a href="https://github.com/lbacik/coding-agent" target="_blank" rel="noopener noreferrer">
            <rect
              x="1186"
              y="492"
              width="430"
              height="236"
              rx="20"
              fill="#ffffff"
              stroke="#cbd5e1"
              strokeWidth="1.5"
            />
            <path d="M1208 492 H1594" stroke="#d97706" strokeWidth="4" strokeLinecap="round" />
            <rect x="1214" y="518" width="156" height="26" rx="8" fill="#fef3c7" stroke="#fcd34d" />
            <text
              x="1292"
              y="535"
              textAnchor="middle"
              fill="#92400e"
              fontSize="13"
              fontWeight="600"
              fontFamily="var(--font-mono), monospace"
            >
              Rex · Experimental
            </text>
            <text
              x="1588"
              y="536"
              textAnchor="end"
              fill="#2563eb"
              fontSize="14"
              fontWeight="600"
              fontFamily="var(--font-mono), monospace"
            >
              lbacik/coding-agent ↗
            </text>
            <text x="1214" y="578" fill="#0f172a" fontSize="25" fontWeight="700">
              coding-agent
            </text>
            <text x="1214" y="606" fill="#475569" fontSize="16">
              Declarative step-workflow coding agent (&ldquo;Rex&rdquo;)
            </text>
            <path d="M1214 626 H1588" stroke="#e2e8f0" />
            <rect x="1214" y="642" width="104" height="26" rx="6" fill="#fffbeb" stroke="#fde68a" />
            <text
              x="1266"
              y="659"
              textAnchor="middle"
              fill="#92400e"
              fontSize="13"
              fontWeight="600"
              fontFamily="var(--font-mono), monospace"
            >
              LangGraph
            </text>
            <rect x="1326" y="642" width="136" height="26" rx="6" fill="#f8fafc" stroke="#e2e8f0" />
            <text
              x="1394"
              y="659"
              textAnchor="middle"
              fill="#334155"
              fontSize="13"
              fontWeight="600"
              fontFamily="var(--font-mono), monospace"
            >
              YAML Workflows
            </text>
            <rect x="1470" y="642" width="118" height="26" rx="6" fill="#f8fafc" stroke="#e2e8f0" />
            <text
              x="1529"
              y="659"
              textAnchor="middle"
              fill="#334155"
              fontSize="13"
              fontWeight="600"
              fontFamily="var(--font-mono), monospace"
            >
              Run Ledger
            </text>
            <text x="1214" y="700" fill="#64748b" fontSize="14">
              Graph-driven step execution &amp; skill bundle policies
            </text>
          </a>

          {/* Connectors Left -> Center */}
          <path
            d="M494 334 C555 334, 560 452, 621 452"
            fill="none"
            stroke="#2563eb"
            strokeWidth="2.5"
            markerEnd="url(#eco-arrowBlue)"
          />
          <rect x="500" y="366" width="118" height="26" rx="8" fill="#eff6ff" stroke="#93c5fd" />
          <text
            x="559"
            y="383"
            textAnchor="middle"
            fill="#1d4ed8"
            fontSize="12.5"
            fontWeight="700"
            fontFamily="var(--font-mono), monospace"
          >
            uses agentfleet
          </text>

          <path
            d="M494 610 C555 610, 560 482, 621 482"
            fill="none"
            stroke="#2563eb"
            strokeWidth="2.5"
            markerEnd="url(#eco-arrowBlue)"
          />
          <rect x="500" y="544" width="118" height="26" rx="8" fill="#eff6ff" stroke="#93c5fd" />
          <text
            x="559"
            y="561"
            textAnchor="middle"
            fill="#1d4ed8"
            fontSize="12.5"
            fontWeight="700"
            fontFamily="var(--font-mono), monospace"
          >
            uses agentfleet
          </text>

          {/* Connectors Right -> Center */}
          <path
            d="M1186 334 C1125 334, 1120 550, 1059 550"
            fill="none"
            stroke="#059669"
            strokeWidth="2.5"
            strokeDasharray="7 4"
            markerEnd="url(#eco-arrowEmerald)"
          />
          <rect x="1064" y="366" width="114" height="26" rx="8" fill="#ecfdf5" stroke="#6ee7b7" />
          <text
            x="1121"
            y="383"
            textAnchor="middle"
            fill="#047857"
            fontSize="12.5"
            fontWeight="700"
            fontFamily="var(--font-mono), monospace"
          >
            implements
          </text>

          <path
            d="M1186 610 C1125 610, 1120 580, 1059 580"
            fill="none"
            stroke="#d97706"
            strokeWidth="2.5"
            strokeDasharray="7 4"
            markerEnd="url(#eco-arrowAmber)"
          />
          <rect x="1064" y="544" width="114" height="26" rx="8" fill="#fffbeb" stroke="#fcd34d" />
          <text
            x="1121"
            y="561"
            textAnchor="middle"
            fill="#b45309"
            fontSize="12.5"
            fontWeight="700"
            fontFamily="var(--font-mono), monospace"
          >
            implements
          </text>

          {/* Bottom note */}
          <path d="M64 766 H1616" stroke="#dbe2eb" strokeWidth="1.5" />
          <text x="64" y="802" fill="#334155" fontSize="16" fontWeight="600">
            Dependency inversion across the fleet:
          </text>
          <text x="365" y="802" fill="#64748b" fontSize="16">
            Operator tools consume agentfleet; coding agents (Sid &amp; Rex) implement agent-operator-contract (agentctl).
          </text>
        </svg>
      </div>

      {/* Quick Repository Strip */}
      <div className="px-2.5 sm:px-3 pt-2.5 pb-1.5 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-slate-600">
        <span>
          Solid blue arrows: <code className="text-blue-700 bg-blue-50 px-1 py-0.5 rounded">uses agentfleet</code> · Dashed arrows:{" "}
          <code className="text-emerald-700 bg-emerald-50 px-1 py-0.5 rounded">implements agent-operator-contract</code>
        </span>
        <div className="flex flex-wrap items-center gap-1.5">
          {ECOSYSTEM_REPOS.map((repo) => (
            <a
              key={repo.url}
              href={repo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/80 hover:bg-white text-slate-700 hover:text-blue-600 border border-slate-300/70 transition-colors"
            >
              <GithubIcon className="w-3 h-3" />
              <span>{repo.name}</span>
            </a>
          ))}
        </div>
      </div>
    </>
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
