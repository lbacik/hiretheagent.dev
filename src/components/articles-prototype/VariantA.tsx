// PROTOTYPE variant A: headed section with a two-column grid of text tiles.

import { ArrowUpRight, BookOpen } from "lucide-react";
import { ARTICLES, formatDate, linkProps } from "./articles";

export const name = "Tile grid";

export function VariantA() {
  return (
    <div className="mt-14 sm:mt-20 max-w-4xl mx-auto text-left">
      <div className="text-center mb-6">
        <h2 className="text-xl sm:text-2xl font-extrabold font-display tracking-tight text-slate-950">
          Read about how it&apos;s built
        </h2>
        <p className="mt-1.5 text-sm text-slate-600">Write-ups on Medium about simple-coding-agent.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ARTICLES.map((article) => (
          <a
            key={article.url}
            {...linkProps(article)}
            className="group bg-white/90 hover:bg-white border border-slate-200/90 hover:border-blue-400 rounded-2xl p-5 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-200 flex flex-col"
          >
            <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-slate-500">
              <BookOpen className="w-3.5 h-3.5" /> {formatDate(article.publishedAt)}
            </span>
            <h3 className="mt-2 font-display font-bold text-base sm:text-lg text-slate-900 group-hover:text-blue-700 transition-colors">
              {article.title}
            </h3>
            <p className="mt-1.5 text-sm text-slate-600 leading-relaxed flex-1">{article.description}</p>
            <span className="mt-4 inline-flex items-center gap-1 text-xs font-mono font-semibold text-blue-600">
              Read on Medium <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
