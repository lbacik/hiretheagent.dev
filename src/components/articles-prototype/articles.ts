// PROTOTYPE: stub Articles mirroring the two real Medium posts about simple-coding-agent.

export type Article = {
  title: string;
  url: string;
  publishedAt: string; // ISO date
  description: string;
};

export const ARTICLES: Article[] = [
  {
    title: "The trust boundary behind ready-for-agent",
    url: "https://lbacik.medium.com/the-trust-boundary-behind-ready-for-agent-24b3d7e7ca9a",
    publishedAt: "2026-10-16",
    description: "Coding agents in a public environment.",
  },
  {
    title: "Coding Agent — Attempt 1",
    url: "https://lbacik.medium.com/coding-agent-attempt-1-6156f86c2afc",
    publishedAt: "2026-10-10",
    description:
      "Also: how LiteLLM can cut your API costs when running Anthropic's Agent SDK with non-Anthropic models.",
  },
];

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export const linkProps = (article: Article) => ({
  href: article.url,
  target: "_blank",
  rel: "noopener noreferrer",
  "data-umami-event": "article-click",
  "data-umami-event-title": article.title,
});
