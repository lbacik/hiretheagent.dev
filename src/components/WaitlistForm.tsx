"use client";

import { useState, type FormEvent } from "react";
import { Check, CheckCircle2, Loader2, Sparkles } from "lucide-react";

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
    <div id="waitlist" className="mt-8 max-w-md mx-auto scroll-mt-28">
      {status === "success" ? (
        <div className="bg-emerald-50 border border-emerald-300/80 rounded-2xl p-5 text-center shadow-lg shadow-emerald-500/5 animate-in fade-in zoom-in-95 duration-200">
          <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center mb-3">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="font-display font-bold text-slate-900 text-base">
            You&apos;re on the early access list!
          </h3>
          <p className="text-xs text-slate-600 mt-1 font-mono">
            We saved <span className="font-semibold text-slate-800">{submittedEmail}</span>. You&apos;ll be among the first to get access when invitations roll out.
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
              <label htmlFor="waitlist-email" className="sr-only">
                Email address
              </label>
              <input
                id="waitlist-email"
                name="email"
                type="email"
                required
                autoComplete="email"
                inputMode="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your-email@dev.io"
                disabled={status === "loading"}
                className="w-full h-full bg-transparent px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none disabled:opacity-60 font-sans"
              />
            </div>
            <button
              type="submit"
              disabled={status === "loading"}
              className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:bg-blue-400 text-white font-mono text-xs font-bold px-5 py-3 rounded-xl transition-all shadow hover:shadow-md flex items-center justify-center gap-2 shrink-0 cursor-pointer disabled:cursor-not-allowed"
            >
              {status === "loading" ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Joining...</span>
                </>
              ) : (
                <>
                  <span>Join the Waitlist</span>
                  <span aria-hidden="true">→</span>
                </>
              )}
            </button>
          </form>

          {/* Trust badges */}
          <div className="text-[11px] text-slate-500 font-mono mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
            <span className="flex items-center gap-1">
              <Check className="w-3.5 h-3.5 text-emerald-500 stroke-[3]" /> Zero spam
            </span>
            <span className="flex items-center gap-1">
              <Check className="w-3.5 h-3.5 text-emerald-500 stroke-[3]" /> Docker templates included
            </span>
            <span className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-blue-500" /> Bring your own LLM
            </span>
          </div>
        </>
      )}
    </div>
  );
}
