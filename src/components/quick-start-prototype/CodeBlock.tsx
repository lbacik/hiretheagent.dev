"use client";

// PROTOTYPE (issue #3): copyable code block shared by the throwaway variants.

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export function CodeBlock({
  code,
  prompt = "$",
  tone = "dark",
}: {
  code: string;
  prompt?: string;
  tone?: "dark" | "light";
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {}
  };

  const dark = tone === "dark";

  return (
    <div
      className={`group relative rounded-xl border text-left ${
        dark ? "bg-slate-950 border-slate-800 text-slate-100" : "bg-slate-50 border-slate-200 text-slate-800"
      }`}
    >
      <pre className="overflow-x-auto px-4 py-3 pr-12 text-xs sm:text-[13px] leading-relaxed font-mono">
        {code.split("\n").map((line, i) => (
          <div key={i} className="whitespace-pre">
            {prompt && <span className={dark ? "text-emerald-400 select-none" : "text-blue-600 select-none"}>{prompt} </span>}
            {line}
          </div>
        ))}
      </pre>
      <button
        type="button"
        onClick={copy}
        aria-label="Copy to clipboard"
        className={`absolute top-2 right-2 p-1.5 rounded-md border transition-colors ${
          dark
            ? "border-slate-700 bg-slate-900 text-slate-400 hover:text-white"
            : "border-slate-200 bg-white text-slate-500 hover:text-blue-600"
        }`}
      >
        {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
      </button>
    </div>
  );
}
