"use client";

// THROWAWAY PROTOTYPE: Three structural variants of the "Tools Landscape" tab
// inside the Delivery Workflow section (#workflow), illustrating how:
//   - Agent Forge (lbacik/agent-forge) & Agent Dashboard (lbacik/agent-dashboard)
//     consume `agentfleet` (defined in lbacik/agent-operator-contract)
//   - simple-coding-agent "Sid" (lbacik/simple-coding-agent) & coding-agent "Rex"
//     (lbacik/coding-agent) implement the contract.

import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Bot,
  Boxes,
  CheckCircle2,
  ExternalLink,
  GitBranch,
  Maximize2,
  ShieldCheck,
  Wrench,
} from "lucide-react";

function GithubIcon({ className = "w-3.5 h-3.5 fill-current" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

export interface EcosystemToolNode {
  id:
    | "agent-forge"
    | "agent-dashboard"
    | "agent-operator-contract"
    | "simple-coding-agent"
    | "coding-agent";
  name: string;
  codename?: string;
  repoSlug: string;
  repoUrl: string;
  side: "consumer" | "contract" | "producer";
  relationLabel: string;
  statusBadge: string;
  statusTone: "blue" | "sky" | "indigo" | "emerald" | "amber";
  tagline: string;
  description: string;
  capabilities: string[];
  contractSnippet: string;
}

export const ECOSYSTEM_NODES: EcosystemToolNode[] = [
  {
    id: "agent-forge",
    name: "Agent Forge",
    repoSlug: "lbacik/agent-forge",
    repoUrl: "https://github.com/lbacik/agent-forge",
    side: "consumer",
    relationLabel: "uses agentfleet",
    statusBadge: "CLI & Skills",
    statusTone: "blue",
    tagline: "Provision, scale & operate dedicated instances",
    description:
      "Scaffolds per-repository Docker instances (create-agent), scales Worker Pools (manage-pool), issues runtime Operator Commands via agentfleet (operate-agent), diagnoses runs (debug-agent), and deploys dashboards (deploy-dashboard).",
    capabilities: [
      "create-agent",
      "manage-pool",
      "operate-agent",
      "debug-agent",
      "deploy-dashboard",
    ],
    contractSnippet:
      "# operate-agent & debug-agent skills invoke agentfleet over Docker:\nagentfleet status <instance>\nagentfleet stop <instance> --after 1\nagentfleet next-issue <instance> 42",
  },
  {
    id: "agent-dashboard",
    name: "Agent Dashboard",
    repoSlug: "lbacik/agent-dashboard",
    repoUrl: "https://github.com/lbacik/agent-dashboard",
    side: "consumer",
    relationLabel: "uses agentfleet",
    statusBadge: "Web UI · BETA",
    statusTone: "sky",
    tagline: "Observe & command your agent fleet",
    description:
      "Web control plane deployed per Docker context. Uses agentfleet / agent-operator-contract to discover labelled containers, poll live Status Snapshots, perform throwaway Offline Reads on stopped volumes, and issue 2-Step Control commands.",
    capabilities: [
      "Fleet Overview",
      "Operations Matrix",
      "Unit Cockpit",
      "2-Step Control",
      "Offline Read",
    ],
    contractSnippet:
      "# Discovers labelled fleet containers & queries contract v1:\nfrom agent_operator_contract import client, status\ninstances = client.discover(docker)\nenvelope = client.interpret(client.invoke(docker, inst, [\"status\"]))",
  },
  {
    id: "agent-operator-contract",
    name: "agentfleet",
    codename: "agent-operator-contract",
    repoSlug: "lbacik/agent-operator-contract",
    repoUrl: "https://github.com/lbacik/agent-operator-contract",
    side: "contract",
    relationLabel: "Neutral Contract v1.x",
    statusBadge: "Contract & Host Client",
    statusTone: "indigo",
    tagline: "Versioned operator contract for interchangeable coding agents",
    description:
      "Owns the normative specification, JSON Schemas, producer/consumer conformance suites, shared envelope helpers, and the host-side agentfleet CLI & Python client. Has zero dependencies on any engine or consumer tool.",
    capabilities: [
      "agentfleet CLI",
      "JSON Schemas v1.x",
      "Status Snapshot",
      "Operator Commands",
      "Conformance Suites",
    ],
    contractSnippet:
      "# Host-side client (consumed by Forge & Dashboard) -> Engine CLI (Sid & Rex):\nagentfleet ls | status | stop | resume | handoff | attempts\n  └──► docker exec -u <user> <container> /usr/local/bin/agentctl --contract 1 <op>",
  },
  {
    id: "simple-coding-agent",
    name: "simple-coding-agent",
    codename: "Sid",
    repoSlug: "lbacik/simple-coding-agent",
    repoUrl: "https://github.com/lbacik/simple-coding-agent",
    side: "producer",
    relationLabel: "implements contract",
    statusBadge: "Sid · Production",
    statusTone: "emerald",
    tagline: "Unattended autonomous coding agent (Claude Agent SDK)",
    description:
      "Production coding agent engine built on Anthropic's Claude Agent SDK. Claims ready-for-agent GitHub issues, runs TDD and code review in isolated Docker sandboxes, ships verified PRs, and implements agentctl --contract 1.",
    capabilities: [
      "Claude Agent SDK",
      "Worker Pools",
      "Docker Sandbox",
      "agentctl --contract 1",
    ],
    contractSnippet:
      "# Producer side inside simple-coding-agent (Sid) container:\nLABEL io.github.lbacik.agent-operator.contract=\"1\"\n/usr/local/bin/agentctl --contract 1 status | stop | resume | handoff | attempts",
  },
  {
    id: "coding-agent",
    name: "coding-agent",
    codename: "Rex",
    repoSlug: "lbacik/coding-agent",
    repoUrl: "https://github.com/lbacik/coding-agent",
    side: "producer",
    relationLabel: "implements contract",
    statusBadge: "Rex · Experimental",
    statusTone: "amber",
    tagline: "Declarative step-workflow coding agent (LangGraph)",
    description:
      "Next-generation containerised coding agent driven by LangGraph and declarative YAML step workflows (version: 3). Implements the same agent-operator-contract so Agent Forge and Agent Dashboard can operate it interchangeably.",
    capabilities: [
      "LangGraph",
      "YAML Step Workflows",
      "Skill Bundle Policy",
      "agentctl --contract 1",
    ],
    contractSnippet:
      "# Producer side inside coding-agent (Rex) container:\nLABEL io.github.lbacik.agent-operator.contract=\"1\"\n/usr/local/bin/agentctl --contract 1 status | stop | resume | attempts",
  },
];

interface LandscapeVariantProps {
  onOpenDiagram: (diag: { src: string; title: string; desc?: string }) => void;
}

/* =========================================================================
   VARIANT A: Crisp Vector Blueprint SVG Diagram + 5-Repo Quick-Jump Strip
   (Tab Name: "Ecosystem & Contract")
   ========================================================================= */
export function LandscapeVariantA({ onOpenDiagram }: LandscapeVariantProps) {
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
            <pattern id="vA-grid" width="28" height="28" patternUnits="userSpaceOnUse">
              <circle cx="1.5" cy="1.5" r="1.2" fill="#dbe2eb" />
            </pattern>
            <linearGradient id="vA-contractBg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#eff6ff" />
              <stop offset="100%" stopColor="#eef2ff" />
            </linearGradient>
            <linearGradient id="vA-contractAccent" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#2563eb" />
              <stop offset="50%" stopColor="#4f46e5" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
            <marker
              id="vA-arrowBlue"
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
              id="vA-arrowEmerald"
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
              id="vA-arrowAmber"
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
          <rect y="136" width="1680" height="630" fill="url(#vA-grid)" opacity="0.65" />

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
              fill="url(#vA-contractBg)"
              stroke="#6366f1"
              strokeWidth="2.5"
            />
            <path
              d="M654 260 H1026"
              stroke="url(#vA-contractAccent)"
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
            markerEnd="url(#vA-arrowBlue)"
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
            markerEnd="url(#vA-arrowBlue)"
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
            markerEnd="url(#vA-arrowEmerald)"
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
            markerEnd="url(#vA-arrowAmber)"
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
          {ECOSYSTEM_NODES.map((node) => (
            <a
              key={node.id}
              href={node.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/80 hover:bg-white text-slate-700 hover:text-blue-600 border border-slate-300/70 transition-colors"
            >
              <GithubIcon className="w-3 h-3" />
              <span>{node.codename ? `${node.name} (${node.codename})` : node.name}</span>
            </a>
          ))}
        </div>
      </div>
    </>
  );
}

/* =========================================================================
   VARIANT B: Interactive 5-Node Topology Explorer + Live Contract Inspector
   (Tab Name: "Tools Landscape")
   ========================================================================= */
export function LandscapeVariantB() {
  const [selectedId, setSelectedId] = useState<EcosystemToolNode["id"]>(
    "agent-operator-contract",
  );

  const selectedNode =
    ECOSYSTEM_NODES.find((n) => n.id === selectedId) ?? ECOSYSTEM_NODES[2];

  const consumers = ECOSYSTEM_NODES.filter((n) => n.side === "consumer");
  const contractNode = ECOSYSTEM_NODES.find((n) => n.side === "contract")!;
  const producers = ECOSYSTEM_NODES.filter((n) => n.side === "producer");

  const isEdgeHighlighted = (nodeId: EcosystemToolNode["id"]) =>
    selectedId === "agent-operator-contract" || selectedId === nodeId;

  return (
    <div className="rounded-2xl bg-[#f6f8fb] ring-1 ring-slate-900/5 p-4 sm:p-6 space-y-5 animate-in fade-in duration-200">
      {/* Top Zone Legend Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 text-center font-mono text-[11px] font-bold uppercase tracking-wider">
        <div className="lg:col-span-4 rounded-xl bg-blue-100/80 text-blue-800 border border-blue-200/80 py-2 px-3 flex items-center justify-center gap-2">
          <Wrench className="w-3.5 h-3.5 text-blue-600" />
          <span>01 · Operator Tools (Consumers)</span>
        </div>
        <div className="lg:col-span-4 rounded-xl bg-indigo-100/90 text-indigo-900 border border-indigo-300/80 py-2 px-3 flex items-center justify-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
          <span>02 · Operator Contract (agentfleet)</span>
        </div>
        <div className="lg:col-span-4 rounded-xl bg-emerald-100/80 text-emerald-900 border border-emerald-200/80 py-2 px-3 flex items-center justify-center gap-2">
          <Bot className="w-3.5 h-3.5 text-emerald-600" />
          <span>03 · Coding Agents (Implementations)</span>
        </div>
      </div>

      {/* Main 3-Column Topology Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        {/* LEFT COLUMN: Agent Forge & Agent Dashboard */}
        <div className="lg:col-span-4 flex flex-col justify-between gap-4">
          {consumers.map((node) => {
            const active = selectedId === node.id;
            const connected = isEdgeHighlighted(node.id);
            return (
              <div
                key={node.id}
                onClick={() => setSelectedId(node.id)}
                className={`group relative rounded-2xl bg-white p-4 sm:p-5 border transition-all cursor-pointer flex-1 flex flex-col justify-between ${
                  active
                    ? "border-blue-600 ring-2 ring-blue-500/20 shadow-md"
                    : connected
                    ? "border-blue-300 hover:border-blue-500 shadow-xs"
                    : "border-slate-200/90 opacity-75 hover:opacity-100"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <span className="font-mono text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                      {node.statusBadge}
                    </span>
                    <a
                      href={node.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1 font-mono text-[11px] text-slate-500 hover:text-blue-600 transition-colors"
                    >
                      <GithubIcon className="w-3.5 h-3.5" />
                      <span>{node.repoSlug}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  <h3 className="font-display font-bold text-lg text-slate-950 flex items-center justify-between">
                    <span>{node.name}</span>
                  </h3>
                  <p className="mt-1 text-xs text-slate-600 font-sans leading-relaxed">
                    {node.tagline}
                  </p>
                </div>

                <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex flex-wrap gap-1">
                    {node.capabilities.slice(0, 3).map((cap) => (
                      <span
                        key={cap}
                        className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-700"
                      >
                        {cap}
                      </span>
                    ))}
                  </div>
                  <span className="inline-flex items-center gap-1 font-mono text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200 shrink-0">
                    <span>uses agentfleet</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* CENTER COLUMN: agent-operator-contract / agentfleet */}
        <div className="lg:col-span-4 flex flex-col">
          <div
            onClick={() => setSelectedId(contractNode.id)}
            className={`relative rounded-3xl p-5 sm:p-6 border-2 transition-all cursor-pointer flex-1 flex flex-col justify-between bg-gradient-to-b from-indigo-50/90 via-white to-blue-50/90 ${
              selectedId === contractNode.id
                ? "border-indigo-600 ring-4 ring-indigo-500/15 shadow-lg"
                : "border-indigo-400 hover:border-indigo-600 shadow-md"
            }`}
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-indigo-600 text-white shadow-2xs">
                  CONTRACT v1.x
                </span>
                <a
                  href={contractNode.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1 font-mono text-[11px] font-semibold text-indigo-700 hover:text-indigo-950 transition-colors"
                >
                  <GithubIcon className="w-3.5 h-3.5" />
                  <span>agent-operator-contract</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <h3 className="font-display font-extrabold text-2xl text-slate-950 tracking-tight">
                agentfleet
              </h3>
              <div className="font-mono text-xs font-semibold text-indigo-700 mt-0.5">
                lbacik/agent-operator-contract
              </div>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                {contractNode.tagline}. Decouples operator tooling from containerised coding-agent engines.
              </p>

              {/* Two Contract Sides */}
              <div className="mt-4 space-y-2.5">
                <div className="rounded-xl bg-white p-3 border border-blue-200 shadow-2xs">
                  <div className="flex items-center justify-between text-[10px] font-mono font-bold uppercase tracking-wider text-blue-700">
                    <span>◄── Consumer Side (Left)</span>
                    <span>Host Client</span>
                  </div>
                  <div className="mt-1 font-mono text-xs font-bold text-slate-900">
                    agentfleet CLI &amp; client library
                  </div>
                  <div className="mt-0.5 text-[11px] font-mono text-slate-500">
                    discover · status · stop · resume · handoff · attempts
                  </div>
                </div>

                <div className="rounded-xl bg-white p-3 border border-emerald-200 shadow-2xs">
                  <div className="flex items-center justify-between text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-700">
                    <span>Producer Side (Right) ──►</span>
                    <span>Engine Boundary</span>
                  </div>
                  <div className="mt-1 font-mono text-xs font-bold text-slate-900">
                    agentctl --contract 1 &amp; Schemas
                  </div>
                  <div className="mt-0.5 text-[11px] font-mono text-slate-500">
                    Status Snapshot · Operator Commands · Conformance
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-indigo-100 text-center">
              <span className="inline-flex items-center gap-1.5 font-mono text-[11px] font-semibold text-indigo-900 bg-indigo-100/80 px-3 py-1 rounded-full">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
                <span>Zero dependencies on engines or tools</span>
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: simple-coding-agent (Sid) & coding-agent (Rex) */}
        <div className="lg:col-span-4 flex flex-col justify-between gap-4">
          {producers.map((node) => {
            const active = selectedId === node.id;
            const connected = isEdgeHighlighted(node.id);
            const isSid = node.id === "simple-coding-agent";
            return (
              <div
                key={node.id}
                onClick={() => setSelectedId(node.id)}
                className={`group relative rounded-2xl bg-white p-4 sm:p-5 border transition-all cursor-pointer flex-1 flex flex-col justify-between ${
                  active
                    ? isSid
                      ? "border-emerald-600 ring-2 ring-emerald-500/20 shadow-md"
                      : "border-amber-600 ring-2 ring-amber-500/20 shadow-md"
                    : connected
                    ? isSid
                      ? "border-emerald-300 hover:border-emerald-500 shadow-xs"
                      : "border-amber-300 hover:border-amber-500 shadow-xs"
                    : "border-slate-200/90 opacity-75 hover:opacity-100"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <span
                      className={`font-mono text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${
                        isSid
                          ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                          : "bg-amber-50 text-amber-800 border-amber-200"
                      }`}
                    >
                      {node.statusBadge}
                    </span>
                    <a
                      href={node.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1 font-mono text-[11px] text-slate-500 hover:text-blue-600 transition-colors"
                    >
                      <GithubIcon className="w-3.5 h-3.5" />
                      <span>{node.repoSlug}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  <h3 className="font-display font-bold text-lg text-slate-950 flex items-center gap-2">
                    <span>{node.name}</span>
                    {node.codename && (
                      <span className="font-mono text-xs text-slate-500 font-normal">
                        ({node.codename})
                      </span>
                    )}
                  </h3>
                  <p className="mt-1 text-xs text-slate-600 font-sans leading-relaxed">
                    {node.tagline}
                  </p>
                </div>

                <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <span
                    className={`inline-flex items-center gap-1 font-mono text-[11px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${
                      isSid
                        ? "text-emerald-800 bg-emerald-50 border-emerald-200"
                        : "text-amber-800 bg-amber-50 border-amber-200"
                    }`}
                  >
                    <ArrowLeft className="w-3 h-3" />
                    <span>implements</span>
                  </span>
                  <div className="flex flex-wrap justify-end gap-1">
                    {node.capabilities.slice(0, 2).map((cap) => (
                      <span
                        key={cap}
                        className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-700"
                      >
                        {cap}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Inspector Drawer for Selected Component */}
      <div className="rounded-2xl bg-slate-900 text-slate-100 p-4 sm:p-5 border border-slate-800 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-400/30">
                Selected Component · {selectedNode.relationLabel}
              </span>
              <a
                href={selectedNode.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-white hover:text-blue-300 underline underline-offset-2"
              >
                <GithubIcon className="w-3.5 h-3.5" />
                <span>https://github.com/{selectedNode.repoSlug}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <p className="text-xs sm:text-[13px] text-slate-300 font-sans leading-relaxed">
              {selectedNode.description}
            </p>
          </div>

          {/* Quick Selector Pills */}
          <div className="flex flex-wrap items-center gap-1.5 shrink-0">
            {ECOSYSTEM_NODES.map((n) => (
              <button
                key={n.id}
                type="button"
                onClick={() => setSelectedId(n.id)}
                className={`px-2.5 py-1 rounded-lg font-mono text-[11px] transition-colors cursor-pointer ${
                  selectedId === n.id
                    ? "bg-blue-600 text-white font-bold"
                    : "bg-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                {n.codename ? `${n.codename}` : n.name}
              </button>
            ))}
          </div>
        </div>

        <pre className="mt-3.5 rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 font-mono text-[11px] sm:text-xs text-emerald-300 overflow-x-auto">
          <code>{selectedNode.contractSnippet}</code>
        </pre>
      </div>
    </div>
  );
}

/* =========================================================================
   VARIANT C: High-Contrast System Blueprint + 5-Repository Contract Matrix
   (Tab Name: "Fleet Architecture")
   ========================================================================= */
export function LandscapeVariantC({ onOpenDiagram }: LandscapeVariantProps) {
  return (
    <div className="rounded-2xl bg-[#f6f8fb] ring-1 ring-slate-900/5 p-4 sm:p-6 space-y-6 animate-in fade-in duration-200">
      {/* Dark Architectural Schematic Board */}
      <div className="rounded-2xl bg-slate-950 text-white p-5 sm:p-7 border border-slate-800 shadow-lg relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-6 border-b border-slate-800">
          <div>
            <div className="text-[11px] font-mono uppercase tracking-widest text-blue-400 font-bold">
              System Topology · Decoupled Fleet Architecture
            </div>
            <h3 className="font-display font-bold text-lg sm:text-xl text-white mt-0.5">
              Operator Tools ──► agentfleet (agent-operator-contract) ◄── Coding Agent Engines
            </h3>
          </div>
          <button
            type="button"
            onClick={() =>
              onOpenDiagram({
                src: "/charts/tools-landscape-en.svg",
                title: "Fleet Architecture — Vector Blueprint SVG",
                desc: "Full vector SVG diagram of the 5 repositories and contract boundaries.",
              })
            }
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 font-mono text-xs transition-colors cursor-pointer"
          >
            <Maximize2 className="w-3.5 h-3.5 text-blue-400" />
            <span>Open Vector SVG</span>
          </button>
        </div>

        {/* 3-Column Schematic with Explicit Arrows */}
        <div className="grid grid-cols-1 lg:grid-cols-11 gap-4 items-center">
          {/* Col 1: Consumers (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <div className="text-[10px] font-mono uppercase tracking-wider text-blue-400 font-bold px-1">
              Consumers (Operator Tools)
            </div>
            {ECOSYSTEM_NODES.filter((n) => n.side === "consumer").map((node) => (
              <a
                key={node.id}
                href={node.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-xl bg-slate-900/90 hover:bg-slate-900 border border-blue-500/40 hover:border-blue-400 p-4 transition-all group"
              >
                <div className="flex items-center justify-between text-[11px] font-mono text-blue-300 mb-1">
                  <span>{node.statusBadge}</span>
                  <span className="inline-flex items-center gap-1 text-slate-400 group-hover:text-blue-300">
                    <GithubIcon className="w-3 h-3" />
                    <ExternalLink className="w-3 h-3" />
                  </span>
                </div>
                <div className="font-display font-bold text-base text-white group-hover:text-blue-300 transition-colors">
                  {node.name}
                </div>
                <div className="font-mono text-[11px] text-slate-400 mt-0.5">
                  {node.repoSlug}
                </div>
              </a>
            ))}
          </div>

          {/* Connector 1: uses agentfleet (1 col) */}
          <div className="lg:col-span-1 flex flex-col items-center justify-center py-2">
            <div className="px-2 py-1 rounded-md bg-blue-500/20 border border-blue-400/40 text-blue-300 font-mono text-[10px] font-bold whitespace-nowrap">
              uses agentfleet
            </div>
            <div className="hidden lg:flex items-center w-full mt-1.5">
              <div className="h-0.5 flex-1 bg-blue-500"></div>
              <ArrowRight className="w-4 h-4 text-blue-400 -ml-1" />
            </div>
          </div>

          {/* Col 2: Central Contract Hub (3 cols) */}
          <div className="lg:col-span-3">
            <a
              href="https://github.com/lbacik/agent-operator-contract"
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-2xl bg-gradient-to-b from-indigo-950 to-slate-900 border-2 border-indigo-400 hover:border-indigo-300 p-5 shadow-xl transition-all group"
            >
              <div className="flex items-center justify-between text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-300 mb-2">
                <span className="px-2 py-0.5 rounded bg-indigo-500/30 border border-indigo-400/40">
                  Contract v1.x
                </span>
                <span className="inline-flex items-center gap-1">
                  <GithubIcon className="w-3.5 h-3.5" />
                  <ExternalLink className="w-3 h-3" />
                </span>
              </div>
              <div className="font-display font-extrabold text-xl text-white group-hover:text-indigo-200">
                agentfleet
              </div>
              <div className="font-mono text-xs text-indigo-300 mt-0.5">
                lbacik/agent-operator-contract
              </div>
              <div className="mt-3 pt-3 border-t border-indigo-800/70 space-y-1.5 text-[11px] font-mono text-slate-300">
                <div className="flex items-center justify-between">
                  <span className="text-blue-300">Host client:</span>
                  <span>agentfleet CLI</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-emerald-300">Engine CLI:</span>
                  <span>agentctl --contract 1</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-indigo-300">Validation:</span>
                  <span>JSON Schemas &amp; Suites</span>
                </div>
              </div>
            </a>
          </div>

          {/* Connector 2: implements contract (1 col) */}
          <div className="lg:col-span-1 flex flex-col items-center justify-center py-2">
            <div className="px-2 py-1 rounded-md bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-mono text-[10px] font-bold whitespace-nowrap">
              implements
            </div>
            <div className="hidden lg:flex items-center w-full mt-1.5">
              <ArrowLeft className="w-4 h-4 text-emerald-400 -mr-1" />
              <div className="h-0.5 flex-1 border-b-2 border-dashed border-emerald-400"></div>
            </div>
          </div>

          {/* Col 3: Producers / Engines (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <div className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold px-1">
              Producers (Coding Agents)
            </div>
            {ECOSYSTEM_NODES.filter((n) => n.side === "producer").map((node) => {
              const isSid = node.id === "simple-coding-agent";
              return (
                <a
                  key={node.id}
                  href={node.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`block rounded-xl bg-slate-900/90 hover:bg-slate-900 border p-4 transition-all group ${
                    isSid
                      ? "border-emerald-500/40 hover:border-emerald-400"
                      : "border-amber-500/40 hover:border-amber-400"
                  }`}
                >
                  <div
                    className={`flex items-center justify-between text-[11px] font-mono mb-1 ${
                      isSid ? "text-emerald-300" : "text-amber-300"
                    }`}
                  >
                    <span>{node.statusBadge}</span>
                    <span className="inline-flex items-center gap-1 text-slate-400 group-hover:text-white">
                      <GithubIcon className="w-3 h-3" />
                      <ExternalLink className="w-3 h-3" />
                    </span>
                  </div>
                  <div className="font-display font-bold text-base text-white">
                    {node.name}{" "}
                    <span className="font-mono text-xs text-slate-400">
                      ({node.codename})
                    </span>
                  </div>
                  <div className="font-mono text-[11px] text-slate-400 mt-0.5">
                    {node.repoSlug}
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </div>

      {/* 5-Repository Architectural Contract Matrix Table */}
      <div className="rounded-2xl bg-white border border-slate-200/90 overflow-hidden shadow-2xs">
        <div className="px-4 py-2.5 bg-slate-100/80 border-b border-slate-200 flex items-center justify-between text-xs font-mono font-bold text-slate-700">
          <span className="flex items-center gap-2">
            <Boxes className="w-3.5 h-3.5 text-blue-600" />
            <span>Repository &amp; Contract Dependency Matrix</span>
          </span>
          <span className="text-[11px] text-slate-500 font-normal">5 active repositories</span>
        </div>
        <div className="divide-y divide-slate-100 text-xs">
          {ECOSYSTEM_NODES.map((node) => (
            <div
              key={node.id}
              className="px-4 py-3 grid grid-cols-1 md:grid-cols-12 gap-2 items-center hover:bg-slate-50/80 transition-colors"
            >
              <div className="md:col-span-3 font-mono font-bold text-slate-950 flex items-center gap-2">
                <a
                  href={node.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-600 inline-flex items-center gap-1.5"
                >
                  <GitBranch className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>
                    {node.name}
                    {node.codename && node.side === "producer" ? ` (${node.codename})` : ""}
                  </span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </div>
              <div className="md:col-span-3 font-mono text-[11px]">
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-md border font-semibold ${
                    node.side === "consumer"
                      ? "bg-blue-50 text-blue-700 border-blue-200"
                      : node.side === "contract"
                      ? "bg-indigo-50 text-indigo-800 border-indigo-200"
                      : node.id === "simple-coding-agent"
                      ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                      : "bg-amber-50 text-amber-800 border-amber-200"
                  }`}
                >
                  {node.relationLabel}
                </span>
              </div>
              <div className="md:col-span-6 text-slate-600 font-sans">
                {node.tagline}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
