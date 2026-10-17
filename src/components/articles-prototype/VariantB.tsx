// PROTOTYPE variant B: one compact panel, Articles as rows (date | title | arrow), no section heading.

import { ArrowUpRight, Newspaper } from "lucide-react";
import { ARTICLES, formatDate, linkProps } from "./articles";

export const name = "Reading-list panel";

export function VariantB() {
  return (
    <div className="mt-10 sm:mt-12 max-w-3xl mx-auto text-left bg-white/95 rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
      <div className="flex items-center gap-2 px-4 sm:px-5 py-2.5 border-b border-slate-100 bg-slate-50/80">
        <Newspaper className="w-4 h-4 text-blue-600" />
        <span className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-600">From the build log</span>
        <span className="ml-auto text-[10px] font-mono text-slate-400">on Medium</span>
      </div>
      <ul className="divide-y divide-slate-100">
        {ARTICLES.map((article) => (
          <li key={article.url}>
            <a {...linkProps(article)} className="group flex items-baseline gap-3 sm:gap-4 px-4 sm:px-5 py-3 hover:bg-blue-50/50 transition-colors">
              <span className="shrink-0 w-24 text-[11px] font-mono text-slate-500">{formatDate(article.publishedAt)}</span>
              <span className="flex-1 min-w-0">
                <span className="block font-semibold text-sm text-slate-900 group-hover:text-blue-700">{article.title}</span>
                <span className="block text-xs text-slate-500 truncate">{article.description}</span>
              </span>
              <ArrowUpRight className="shrink-0 w-4 h-4 text-slate-400 group-hover:text-blue-600 self-center" />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
