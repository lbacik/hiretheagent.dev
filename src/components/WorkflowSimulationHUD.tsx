"use client";

import { useState, useEffect, useRef } from "react";
import {
  Play,
  Pause,
  Square,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  X,
  Check,
} from "lucide-react";

export interface SimulationStepInfo {
  id: string;
  stepNumber: string;
  name: string;
  categoryLabel: string;
  deliverable: string;
  narrationEN: string;
  estimatedWords: number;
}

export const WORKFLOW_STAGES_NARRATION: SimulationStepInfo[] = [
  {
    id: "idea",
    stepNumber: "01",
    name: "Idea",
    categoryLabel: "Discovery",
    deliverable: "Clear intent + scope",
    narrationEN:
      "Welcome to the delivery workflow walkthrough. Over the next few steps, I will guide you through each stage from initial concept to verified production merge. Let's begin with Stage 1: Idea and Discovery. The human engineer explores the problem space and codebase architecture to define clear intent and boundary constraints. AI assists with research, while human ownership remains paramount.",
    estimatedWords: 64,
  },
  {
    id: "planning",
    stepNumber: "02",
    name: "Planning",
    categoryLabel: "Planning",
    deliverable: "Specified GitHub issues ready-for-agent",
    narrationEN:
      "Stage 2: Planning. The engineer and AI assistant break down the work into atomic tasks with strict acceptance criteria and test specs, creating ready-for-agent GitHub issues.",
    estimatedWords: 27,
  },
  {
    id: "implementation",
    stepNumber: "03",
    name: "Implementation",
    categoryLabel: "Autonomous Execution",
    deliverable: "Pull request + verified evidence",
    narrationEN:
      "Stage 3: Autonomous Implementation. Coding agent Sid spins up in an isolated Docker sandbox. It executes test-driven development, verifies the test suite, and delivers a verified Pull Request with evidence.",
    estimatedWords: 31,
  },
  {
    id: "review",
    stepNumber: "04",
    name: "PR review & merge",
    categoryLabel: "Release Gate",
    deliverable: "Checks pass + human approval",
    narrationEN:
      "Stage 4: PR Review and Release Gate. A human reviewer inspects the code diff and verification logs. They can approve and merge, or request targeted adjustments sending it back to Stage 3 for rework.",
    estimatedWords: 34,
  },
];

const INITIAL_STAGE1_PAUSE_MS = 2000; // 2 seconds intro pause on Stage 1 before speaking
const POST_SPEECH_PAUSE_MS = 5000; // 5 seconds pause after speech finishes

interface WorkflowSimulationHUDProps {
  isOpen: boolean;
  onClose: () => void;
  activeStep: number;
  onStepChange: (stepIndex: number) => void;
  isPlaying: boolean;
  onTogglePlay: (playing: boolean) => void;
  onRequestChangesRework?: () => void;
}

export function WorkflowSimulationHUD({
  isOpen,
  onClose,
  activeStep,
  onStepChange,
  isPlaying,
  onTogglePlay,
}: WorkflowSimulationHUDProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isWaitingInitialPause, setIsWaitingInitialPause] = useState(false);
  const [isWaitingPostPause, setIsWaitingPostPause] = useState(false);
  const [stepProgress, setStepProgress] = useState(0); // 0 to 100%

  const initialPauseTimerRef = useRef<NodeJS.Timeout | null>(null);
  const pauseTimerRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const currentStage = WORKFLOW_STAGES_NARRATION[activeStep] || WORKFLOW_STAGES_NARRATION[0];
  const isLastStage = activeStep === WORKFLOW_STAGES_NARRATION.length - 1;

  // Stop any ongoing speech and timers
  const clearTimersAndSpeech = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    if (initialPauseTimerRef.current) {
      clearTimeout(initialPauseTimerRef.current);
      initialPauseTimerRef.current = null;
    }
    if (pauseTimerRef.current) {
      clearTimeout(pauseTimerRef.current);
      pauseTimerRef.current = null;
    }
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  };

  // Main lifecycle effect for playing steps:
  // 1) On Stage 1: 2-second initial pause while screen scrolls into place
  // 2) Speaks the intro / narration without cut-off
  // 3) On speech end, enters a 5-second post-speech pause
  // 4) Dynamic progress bar:
  //    - initial pause: 0% -> 8%
  //    - speaking: 8% -> 70%
  //    - 5s pause: 70% -> 100%
  // 5) If Stage 4 finishes: NO LOOP. Ends simulation & closes popup.
  useEffect(() => {
    if (!isOpen || !isPlaying) {
      clearTimersAndSpeech();
      return;
    }

    clearTimersAndSpeech();

    const stage = WORKFLOW_STAGES_NARRATION[activeStep];
    if (!stage) return;

    const initialPauseMs = activeStep === 0 ? INITIAL_STAGE1_PAUSE_MS : 350;
    const estimatedSpeechMs = Math.max(5000, stage.estimatedWords * 380);

    const stageStartTime = Date.now();
    let speechStartTime = 0;
    let pauseStartTime = 0;
    let initialPauseDone = false;
    let speechFinished = false;

    // Advance to next stage or finish workflow when stage 4 is completed
    const handleStageCompleted = () => {
      setIsWaitingPostPause(false);
      setStepProgress(0);

      if (activeStep < WORKFLOW_STAGES_NARRATION.length - 1) {
        // Proceed to next stage
        onStepChange(activeStep + 1);
      } else {
        // Stage 4 completed: NO LOOP. Close popup and end simulation.
        onTogglePlay(false);
        onClose();
      }
    };

    // Trigger 5-second pause countdown after speech ends
    const startPostSpeechPause = () => {
      speechFinished = true;
      pauseStartTime = Date.now();
      setIsSpeaking(false);
      setIsWaitingPostPause(true);

      pauseTimerRef.current = setTimeout(() => {
        handleStageCompleted();
      }, POST_SPEECH_PAUSE_MS);
    };

    // Smooth progress tracker spanning all phases
    progressIntervalRef.current = setInterval(() => {
      const now = Date.now();
      if (!initialPauseDone) {
        // Initial pause phase (0% -> 8%)
        const elapsed = now - stageStartTime;
        const pct = Math.min(8, (elapsed / initialPauseMs) * 8);
        setStepProgress(pct);
      } else if (!speechFinished) {
        // Speaking phase (8% -> 70%)
        const elapsed = now - speechStartTime;
        const pct = Math.min(68, 8 + (elapsed / estimatedSpeechMs) * 60);
        setStepProgress(pct);
      } else {
        // 5s post-speech pause phase (70% -> 100%)
        const elapsed = now - pauseStartTime;
        const pct = Math.min(100, 70 + (elapsed / POST_SPEECH_PAUSE_MS) * 30);
        setStepProgress(pct);
      }
    }, 50);

    // Initial pause timer
    initialPauseTimerRef.current = setTimeout(() => {
      initialPauseDone = true;
      speechStartTime = Date.now();
      setIsWaitingInitialPause(false);

      // If muted or speechSynthesis unavailable: simulate speaking time
      if (isMuted || typeof window === "undefined" || !("speechSynthesis" in window)) {
        pauseTimerRef.current = setTimeout(() => {
          startPostSpeechPause();
        }, estimatedSpeechMs);
        return;
      }

      // Start Web Speech API utterance
      const utterance = new SpeechSynthesisUtterance(stage.narrationEN);
      utterance.lang = "en-US";
      utterance.rate = 1.02;
      utterance.pitch = 1.0;

      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        const enVoice =
          voices.find(
            (v) =>
              v.lang.startsWith("en") &&
              (v.name.includes("Natural") ||
                v.name.includes("Google") ||
                v.name.includes("Samantha") ||
                v.name.includes("Daniel") ||
                v.name.includes("Alex"))
          ) || voices.find((v) => v.lang.startsWith("en"));

        if (enVoice) {
          utterance.voice = enVoice;
        }
      }

      utterance.onstart = () => {
        setIsSpeaking(true);
      };

      utterance.onend = () => {
        startPostSpeechPause();
      };

      utterance.onerror = () => {
        startPostSpeechPause();
      };

      window.speechSynthesis.speak(utterance);
    }, initialPauseMs);

    return () => {
      clearTimersAndSpeech();
    };
  }, [activeStep, isPlaying, isOpen, isMuted, onStepChange, onTogglePlay, onClose]);

  // Handle Play/Pause
  const handlePlayPause = () => {
    const nextPlayState = !isPlaying;
    onTogglePlay(nextPlayState);
    if (!nextPlayState) {
      clearTimersAndSpeech();
      setIsSpeaking(false);
      setIsWaitingInitialPause(false);
      setIsWaitingPostPause(false);
    }
  };

  // Handle Stop completely: cancel, reset to start, close
  const handleStop = () => {
    onTogglePlay(false);
    clearTimersAndSpeech();
    setIsSpeaking(false);
    setIsWaitingInitialPause(false);
    setIsWaitingPostPause(false);
    setStepProgress(0);
    onStepChange(0);
  };

  // Handle Next step: if on last stage, finish and close
  const handleNextStep = () => {
    clearTimersAndSpeech();
    setIsSpeaking(false);
    setIsWaitingInitialPause(false);
    setIsWaitingPostPause(false);
    setStepProgress(0);

    if (activeStep < WORKFLOW_STAGES_NARRATION.length - 1) {
      onStepChange(activeStep + 1);
    } else {
      // Completed last stage: close simulation
      onTogglePlay(false);
      onClose();
    }
  };

  // Handle Prev step
  const handlePrevStep = () => {
    if (activeStep === 0) return;
    clearTimersAndSpeech();
    setIsSpeaking(false);
    setIsWaitingInitialPause(false);
    setIsWaitingPostPause(false);
    setStepProgress(0);
    onStepChange(activeStep - 1);
  };

  // Handle Mute toggle
  const handleToggleMute = () => {
    setIsMuted((prev) => {
      const next = !prev;
      if (next && typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      return next;
    });
  };

  if (!isOpen) return null;

  return (
    <aside
      aria-label="Workflow Simulation Controls"
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[270px] sm:w-[290px] pointer-events-auto transition-all duration-300"
    >
      <div className="bg-slate-950/95 backdrop-blur-xl border border-slate-700/80 rounded-2xl shadow-2xl text-white p-3 space-y-2.5 ring-1 ring-white/10 animate-in fade-in slide-in-from-bottom-3 duration-200">
        {/* Top Header Bar: Status + Quick Actions */}
        <div className="flex items-center justify-between gap-2">
          {/* Active Stage Indicator */}
          <div className="flex items-center gap-2 min-w-0">
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              {isPlaying && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              )}
              <span
                className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                  isPlaying ? "bg-emerald-500" : "bg-amber-500"
                }`}
              ></span>
            </span>

            <div className="flex items-center gap-1.5 min-w-0">
              <span className="font-mono text-xs font-bold text-slate-400">
                0{activeStep + 1}/04
              </span>
              <span className="font-display font-bold text-xs sm:text-sm text-white truncate">
                {currentStage.name}
              </span>
            </div>
          </div>

          {/* Action icons */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Status Phase Badge */}
            {isPlaying && (
              <>
                {isWaitingInitialPause ? (
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 font-semibold border border-blue-500/30">
                    2s intro
                  </span>
                ) : isSpeaking && !isMuted ? (
                  <div className="flex items-end gap-0.5 h-3.5 w-3.5" title="Narrating stage">
                    <span className="w-0.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:0ms] h-2.5"></span>
                    <span className="w-0.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:150ms] h-3.5"></span>
                    <span className="w-0.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:300ms] h-2"></span>
                  </div>
                ) : isWaitingPostPause ? (
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30">
                    5s pause
                  </span>
                ) : null}
              </>
            )}

            {/* Mute Button */}
            <button
              type="button"
              onClick={handleToggleMute}
              className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                isMuted
                  ? "bg-rose-950/60 border-rose-800 text-rose-300"
                  : "bg-slate-800 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700"
              }`}
              title={isMuted ? "Unmute narration" : "Mute narration"}
              aria-label={isMuted ? "Unmute voice" : "Mute voice"}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={() => {
                onTogglePlay(false);
                clearTimersAndSpeech();
                setIsSpeaking(false);
                setIsWaitingInitialPause(false);
                setIsWaitingPostPause(false);
                onClose();
              }}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors border border-slate-700 cursor-pointer"
              title="Close simulation controls"
              aria-label="Close"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Dynamic Progress Bar for Current Step */}
        <div className="w-full h-1.5 rounded-full overflow-hidden bg-slate-800/90">
          <div
            className={`h-full transition-all duration-75 ease-linear rounded-full ${
              isWaitingPostPause
                ? "bg-gradient-to-r from-amber-400 to-amber-300"
                : isWaitingInitialPause
                ? "bg-blue-400"
                : "bg-gradient-to-r from-blue-500 to-emerald-400"
            }`}
            style={{ width: `${stepProgress}%` }}
          ></div>
        </div>

        {/* Playback Controls Row: Prev, Play/Pause, Stop, Next */}
        <div className="flex items-center justify-between gap-2 pt-0.5">
          {/* Prev Step */}
          <button
            type="button"
            onClick={handlePrevStep}
            disabled={activeStep === 0}
            className={`p-2 rounded-xl border transition-colors cursor-pointer shadow-xs active:scale-95 ${
              activeStep === 0
                ? "bg-slate-900 border-slate-800 text-slate-600 cursor-not-allowed opacity-50"
                : "bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border-slate-700"
            }`}
            title="Previous stage"
            aria-label="Previous stage"
          >
            <SkipBack className="w-3.5 h-3.5" />
          </button>

          {/* Play / Pause Toggle Button */}
          <button
            type="button"
            onClick={handlePlayPause}
            className={`flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl font-mono text-xs font-extrabold transition-all shadow-md active:scale-95 cursor-pointer ${
              isPlaying
                ? "bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-amber-400/20"
                : "bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20"
            }`}
            title={isPlaying ? "Pause simulation" : "Play simulation"}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current stroke-[2.5]" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current stroke-[2.5]" />
                <span>Play</span>
              </>
            )}
          </button>

          {/* Stop Button */}
          <button
            type="button"
            onClick={handleStop}
            className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-rose-950/80 hover:bg-rose-900 border border-rose-800/90 text-rose-200 font-mono text-xs font-bold transition-colors cursor-pointer active:scale-95 shadow-xs"
            title="Stop simulation & reset"
          >
            <Square className="w-3 h-3 fill-current" />
            <span>Stop</span>
          </button>

          {/* Next Step / Finish Button */}
          <button
            type="button"
            onClick={handleNextStep}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700 cursor-pointer shadow-xs active:scale-95"
            title={isLastStage ? "Finish walkthrough" : "Next stage"}
            aria-label={isLastStage ? "Finish walkthrough" : "Next stage"}
          >
            {isLastStage ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <SkipForward className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </aside>
  );
}
