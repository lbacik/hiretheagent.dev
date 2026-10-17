import { ArrowUpRight } from "lucide-react";

import { getArticles } from "@/lib/articles";

// Medium's mark from Simple Icons 16.35.0 (icons/medium.svg,
// sourced from Medium's brand guidelines). Inlined to avoid a dependency
// for a single icon.
function MediumMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path d="M4.21 0A4.201 4.201 0 0 0 0 4.21v15.58A4.201 4.201 0 0 0 4.21 24h15.58A4.201 4.201 0 0 0 24 19.79v-1.093c-.137.013-.278.02-.422.02-2.577 0-4.027-2.146-4.09-4.832a7.592 7.592 0 0 1 .022-.708c.093-1.186.475-2.241 1.105-3.022a3.885 3.885 0 0 1 1.395-1.1c.468-.237 1.127-.367 1.664-.367h.023c.101 0 .202.004.303.01V4.211A4.201 4.201 0 0 0 19.79 0Zm.198 5.583h4.165l3.588 8.435 3.59-8.435h3.864v.146l-.019.004c-.705.16-1.063.397-1.063 1.254h-.003l.003 10.274c.06.676.424.885 1.063 1.03l.02.004v.145h-4.923v-.145l.019-.005c.639-.144.994-.353 1.054-1.03V7.267l-4.745 11.15h-.261L6.15 7.569v9.445c0 .857.358 1.094 1.063 1.253l.02.004v.147H4.405v-.147l.019-.004c.705-.16 1.065-.397 1.065-1.253V6.987c0-.857-.358-1.094-1.064-1.254l-.018-.004zm19.25 3.668c-1.086.023-1.733 1.323-1.813 3.124H24V9.298a1.378 1.378 0 0 0-.342-.047Zm-1.862 3.632c-.1 1.756.86 3.239 2.204 3.634v-3.634z" />
    </svg>
  );
}

export function Articles() {
  const articles = getArticles();
  if (articles.length === 0) return null;

  return (
    <section id="articles" className="scroll-mt-28">
      <div className="mt-12 sm:mt-16 mb-12 sm:mb-16">
        <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-500">
          Read on Medium
        </h2>
        <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs sm:text-sm">
          {articles.map((article) => (
            <a
              key={article.url}
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              data-umami-event="article-click"
              data-umami-event-title={article.title}
              className="group inline-flex items-center gap-2 pl-2 pr-3 py-1 rounded-full bg-white border border-slate-200 hover:border-slate-900 text-slate-700 hover:text-slate-950 shadow-sm transition-colors"
            >
              <MediumMark className="w-5 h-5 fill-slate-950" />
              {article.title}
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-900" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
