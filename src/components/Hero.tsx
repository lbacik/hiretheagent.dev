import { WaitlistForm } from "./WaitlistForm";

export function Hero() {
  return (
    <section className="max-w-6xl mx-auto px-6 pt-16 sm:pt-24 pb-16 sm:pb-24 text-center">
      <div className="max-w-3xl mx-auto">
        {/* Pre-headline Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-mono font-medium mb-8 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
          Autonomous agent for software engineers &amp; dev teams
        </div>

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

        {/* Mailing & Waitlist Form */}
        <WaitlistForm />
      </div>
    </section>
  );
}
