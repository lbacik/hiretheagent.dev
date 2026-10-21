"use client";

import { useState, type FormEvent } from "react";
import { Check, CheckCircle2 } from "lucide-react";
import { subscribeNewsletter } from "@/lib/newsletter-actions";

// Formerly WaitlistForm: the Newsletter sign-up. The `#waitlist` anchor is
// kept as an alias so old links keep working.
export function NewsletterForm({ available }: { available: boolean }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error" | "throttled">("idle");
  const [submittedEmail, setSubmittedEmail] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;

    setStatus("loading");
    let result: Awaited<ReturnType<typeof subscribeNewsletter>> | null = null;
    try {
      result = await subscribeNewsletter(email);
    } catch {
      result = null;
    }
    if (result?.ok) {
      setSubmittedEmail(email);
      setEmail("");
      setStatus("success");
    } else if (result?.throttled) {
      setStatus("throttled");
    } else {
      setStatus("error");
    }
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
            Almost done: check your inbox and click the confirmation link
          </h3>
          <p className="text-xs text-slate-600 mt-1 font-mono">
            We sent a confirmation link to <span className="font-semibold text-slate-800">{submittedEmail}</span>.
            You&apos;ll receive updates on agent releases, benchmarks, and early access once you confirm.
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
                disabled={!available || status === "loading"}
                className="w-full h-full bg-slate-50/50 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none disabled:cursor-not-allowed disabled:text-slate-400 font-sans"
              />
            </div>
            <button
              type="submit"
              disabled={!available || status === "loading"}
              title={available ? "Subscribe to the newsletter" : "Newsletter is coming soon!"}
              className={
                available
                  ? "bg-blue-600 hover:bg-blue-700 text-white font-mono text-xs font-bold px-5 py-3 rounded-xl transition-all flex items-center justify-center gap-2 shrink-0 disabled:opacity-70 disabled:cursor-wait"
                  : "bg-slate-200 text-slate-400 border border-slate-300/70 font-mono text-xs font-bold px-5 py-3 rounded-xl transition-all flex items-center justify-center gap-2 shrink-0 cursor-not-allowed select-none"
              }
            >
              <span>{available ? (status === "loading" ? "Subscribing…" : "Subscribe") : "Newsletter: Coming Soon!"}</span>
            </button>
          </form>

          {(status === "error" || status === "throttled") && (
            <p role="alert" className="text-xs font-mono text-center text-red-600 mt-3">
              {status === "throttled"
                ? "Too many attempts, please try again later."
                : "Something went wrong, please try again later."}
            </p>
          )}

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
