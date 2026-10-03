import Link from "next/link";
import { Mail, Bot } from "lucide-react";

function GithubIcon({ className = "w-3.5 h-3.5 fill-current" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-slate-200/80 bg-white/60 backdrop-blur-sm py-12 px-6 mt-auto">
      <div className="max-w-6xl mx-auto flex flex-col items-center justify-center text-center text-xs font-mono text-slate-500 gap-4">
        {/* Brand line */}
        <div className="flex items-center gap-2 text-slate-700 font-semibold">
          <Bot className="w-4 h-4 text-blue-600" />
          <span>hiretheagent.dev</span>
          <span className="text-slate-300">•</span>
          <span className="text-slate-500 font-normal">Autonomous AI agents for software engineering teams</span>
        </div>

        {/* Contact Email */}
        <div className="flex flex-wrap items-center justify-center text-slate-600">
          <a
            href="mailto:contact@hiretheagent.dev"
            className="inline-flex items-center gap-1.5 hover:text-blue-600 transition-colors"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>contact@hiretheagent.dev</span>
          </a>
        </div>

        {/* GitHub Repositories */}
        <div className="flex flex-wrap items-center justify-center gap-5 sm:gap-6 text-slate-600">
          <Link
            href="https://github.com/lbacik/agent-forge"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 hover:text-blue-600 transition-colors"
          >
            <GithubIcon className="w-3.5 h-3.5 fill-current" />
            <span>agent-forge</span>
          </Link>
          <Link
            href="https://github.com/lbacik/simple-coding-agent"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 hover:text-blue-600 transition-colors"
          >
            <GithubIcon className="w-3.5 h-3.5 fill-current" />
            <span>simple-coding-agent</span>
          </Link>
          <Link
            href="https://github.com/lbacik/coding-agent"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 hover:text-blue-600 transition-colors"
          >
            <GithubIcon className="w-3.5 h-3.5 fill-current" />
            <span>coding-agent</span>
          </Link>
        </div>

        {/* Copyright */}
        <div className="text-[11px] text-slate-400 mt-2">
          © {new Date().getFullYear()} hiretheagent.dev. Built for autonomous development workflows.
        </div>
      </div>
    </footer>
  );
}
