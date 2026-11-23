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

function formatPublishedDate(iso: string): string {
  const [year, month, day] = iso.split("-").map(Number);
  const date = new Date(Date.UTC(year, (month || 1) - 1, day || 1));
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

export function Articles() {
  const articles = getArticles();
  if (articles.length === 0) return null;

  return (
    <section id="articles" className="scroll-mt-28">
      <div className="mt-12 sm:mt-16 mb-12 sm:mb-16 max-w-5xl lg:max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-5 text-left">
          <div>
            <h2 className="inline-flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-slate-500">
              <MediumMark className="w-4 h-4 fill-slate-900" />
              <span>Read on Medium</span>
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-600 font-sans">
              Engineering write-ups on building, securing, and operating autonomous coding agents.
            </p>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            lbacik.medium.com · {articles.length} articles
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 text-left">
          {articles.map((article) => (
            <a
              key={article.url}
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              data-umami-event="article-click"
              data-umami-event-title={article.title}
              className="group rounded-2xl bg-white/95 hover:bg-white border border-slate-200/90 hover:border-blue-400 p-5 sm:p-6 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-200 flex flex-col justify-between min-h-[290px]"
            >
              <article className="flex flex-col flex-1 justify-between">
                <div>
                  {/* Top Meta Row: Medium badge + date & read time */}
                  <div className="flex items-center justify-between gap-2 mb-3.5">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 group-hover:bg-slate-900 text-slate-800 group-hover:text-white text-[11px] font-mono font-semibold transition-colors">
                      <MediumMark className="w-3.5 h-3.5 fill-current" />
                      <span>Medium</span>
                    </span>
                    <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
                      <span>{formatPublishedDate(article.publishedAt)}</span>
                      <span>•</span>
                      <span>{article.readingTime}</span>
                    </div>
                  </div>

                  {/* Title & Subtitle */}
                  <h3 className="font-display font-bold text-lg text-slate-950 group-hover:text-blue-600 transition-colors leading-snug">
                    {article.title}
                  </h3>
                  <p className="mt-1 text-xs font-mono font-semibold text-blue-700">
                    {article.subtitle}
                  </p>

                  {/* Context Description */}
                  <p className="mt-3 text-xs sm:text-[13px] text-slate-600 leading-relaxed font-sans">
                    {article.description}
                  </p>
                </div>

                {/* Footer: Topic Tags + CTA */}
                <footer className="mt-5 pt-4 border-t border-slate-100 space-y-3">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {article.tags.map((tag) => (
                      <span
                        key={tag}
                        className="font-mono text-[10px] text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-200/80"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                    <span>Read full article</span>
                    <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </footer>
              </article>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
