"use client";

import { useState, type FormEvent } from "react";
import { Check, CheckCircle2 } from "lucide-react";

export function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [submittedEmail, setSubmittedEmail] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;

    setStatus("loading");

    // Simulated subscription latency (can be linked to API route / Resend / Supabase in future sessions)
    setTimeout(() => {
      setSubmittedEmail(email);
      setStatus("success");
      setEmail("");
    }, 700);
  };

  return (
    <div id="newsletter" className="mt-16 sm:mt-24 max-w-md mx-auto scroll-mt-28">
      {/* Anchor alias for backward compatibility */}
      <span id="waitlist" className="scroll-mt-28 -top-28 relative block" />

      {/* Newsletter Section Header */}
      <div className="text-center mb-3">
        <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-500">
          Newsletter
        </h3>
        <p className="text-xs text-slate-500 font-mono mt-0.5">
          Sign up to receive updates on agent releases, benchmarks, and early access.
        </p>
      </div>

      {status === "success" ? (
        <div className="bg-emerald-50 border border-emerald-300/80 rounded-2xl p-5 text-center shadow-lg shadow-emerald-500/5 animate-in fade-in zoom-in-95 duration-200">
          <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center mb-3">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="font-display font-bold text-slate-900 text-base">
            You&apos;re subscribed to our newsletter!
          </h3>
          <p className="text-xs text-slate-600 mt-1 font-mono">
            We saved <span className="font-semibold text-slate-800">{submittedEmail}</span>. You&apos;ll receive updates on agent releases, benchmarks, and early access.
          </p>
          <button
            type="button"
            onClick={() => setStatus("idle")}
            className="mt-3 text-xs font-mono text-emerald-700 hover:text-emerald-800 underline underline-offset-4"
          >
            Register another email
          </button>
        </div>
      ) : (
        <>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-2 bg-white p-2 rounded-2xl border border-slate-300 shadow-xl shadow-slate-200/50 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all duration-200"
          >
            <div className="relative flex-1">
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <input
                id="newsletter-email"
                name="email"
                type="email"
                required
                autoComplete="email"
                inputMode="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your-email@dev.io"
                disabled
                className="w-full h-full bg-slate-50/50 px-4 py-2.5 text-sm text-slate-400 placeholder-slate-400 focus:outline-none disabled:cursor-not-allowed font-sans"
              />
            </div>
            <button
              type="button"
              disabled
              title="Newsletter is coming soon!"
              className="bg-slate-200 text-slate-400 border border-slate-300/70 font-mono text-xs font-bold px-5 py-3 rounded-xl transition-all flex items-center justify-center gap-2 shrink-0 cursor-not-allowed select-none"
            >
              <span>Newsletter: Coming Soon!</span>
            </button>
          </form>

          {/* Trust badge */}
          <div className="text-[11px] text-slate-500 font-mono mt-3 flex items-center justify-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-emerald-500 stroke-[3]" />
            <span>Zero spam • Updates on releases &amp; benchmarks</span>
          </div>
        </>
      )}
    </div>
  );
}
