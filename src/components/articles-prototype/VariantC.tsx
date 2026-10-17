// PROTOTYPE variant C: no section at all, just a one-line strip of pill links under the hero highlights.

import { ArrowUpRight } from "lucide-react";
import { ARTICLES, linkProps } from "./articles";

export const name = "Inline pill strip";

export function VariantC() {
  return (
    <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs sm:text-sm">
      <span className="font-mono text-slate-500">Read on Medium:</span>
      {ARTICLES.map((article) => (
        <a
          key={article.url}
          {...linkProps(article)}
          title={article.description}
          className="group inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white border border-slate-200 hover:border-blue-400 text-slate-700 hover:text-blue-700 shadow-sm transition-colors"
        >
          {article.title}
          <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600" />
        </a>
      ))}
    </div>
  );
}
