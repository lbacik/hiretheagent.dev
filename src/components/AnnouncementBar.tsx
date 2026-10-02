import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function AnnouncementBar() {
  return (
    <div className="bg-slate-900 text-slate-200 px-4 py-2.5 text-xs font-mono text-center flex flex-wrap items-center justify-center gap-2 border-b border-slate-800">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
      </span>
      <span className="text-amber-300 font-bold">Agent Sid v0.9:</span>
      <span>Autonomous engineer for implementation tasks in an isolated Docker sandbox.</span>
      <Link
        href="https://github.com/lbacik/simple-coding-agent"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center text-blue-400 hover:text-blue-300 font-semibold underline underline-offset-2 ml-1"
      >
        GitHub Repo
        <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
      </Link>
    </div>
  );
}
