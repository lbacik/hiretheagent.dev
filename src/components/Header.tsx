import Link from "next/link";
import { Zap } from "lucide-react";

export function Header() {
  return (
    <header className="border-b border-slate-200/90 bg-white/90 backdrop-blur-md sticky top-0 z-30 transition-all">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-600/30 group-hover:scale-105 transition-transform duration-200">
            <Zap className="w-5 h-5 fill-current" />
          </div>
          <div className="flex items-center">
            <span className="font-display font-bold text-lg tracking-tight text-slate-950">
              hiretheagent<span className="text-blue-600">.dev</span>
            </span>
            <span className="text-[10px] font-mono ml-2.5 px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 uppercase tracking-wider font-semibold">
              Preview
            </span>
          </div>
        </Link>

        {/* Navigation & Actions */}
        <div className="flex items-center gap-4 text-xs font-mono">
          <Link
            href="https://github.com/lbacik/simple-coding-agent"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-600 hover:text-blue-600 hidden sm:inline-flex items-center gap-1.5 transition-colors"
          >
            <span>GitHub</span>
          </Link>
          <a
            href="#waitlist"
            className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold px-4 py-2 rounded-xl transition-all shadow-sm hover:shadow-md hover:shadow-blue-600/20 active:scale-95"
          >
            Join Waitlist
          </a>
        </div>
      </div>
    </header>
  );
}
