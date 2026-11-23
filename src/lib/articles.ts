// Hand-maintained list of Articles (Medium posts by the page's author that
// are directly about simple-coding-agent or this page). Adding an Article
// means appending to ARTICLES below and cutting a Release of this page.
//
// The list sits behind getArticles() so swapping the source later (RSS,
// API, …) is a local change. We deliberately do not use Medium's RSS feed:
// it returns only the 10 latest posts, has no per-user tag filter, and tags
// cannot tell Articles apart from other posts about agents.

export type Article = {
  title: string;
  url: string;
  /** ISO date (YYYY-MM-DD). */
  publishedAt: string;
  /** Short editorial subtitle / angle of the post. */
  subtitle: string;
  /** 2-3 sentence summary providing concrete article context on the card. */
  description: string;
  /** Topic tags displayed in the card footer. */
  tags: string[];
  /** Estimated reading time label on Medium. */
  readingTime: string;
};

const ARTICLES: Article[] = [
  {
    title: "Agents on Autopilot",
    url: "https://lbacik.medium.com/agents-on-autopilot-e5f17554553e",
    publishedAt: "2026-10-20",
    subtitle: "From interactive copilots to unattended containerised workers",
    description:
      "What it takes to move coding agents from supervised chat sessions to autonomous background execution: isolated Docker sandboxes, repository profiles, deterministic test gates, and operator control loops.",
    tags: ["Unattended Ops", "Docker Sandbox", "Workflow"],
    readingTime: "7 min read",
  },
  {
    title: "The trust boundary behind ready-for-agent",
    url: "https://lbacik.medium.com/the-trust-boundary-behind-ready-for-agent-24b3d7e7ca9a",
    publishedAt: "2026-10-16",
    subtitle: "Coding agents in a public GitHub environment",
    description:
      "Why applying a maintainer-only GitHub label is not a complete security boundary on public repositories: external issue authors can still edit descriptions or post comments that act as indirect prompt injection.",
    tags: ["Security", "Prompt Injection", "Trust Boundary"],
    readingTime: "5 min read",
  },
  {
    title: "Coding Agent — Attempt 1",
    url: "https://lbacik.medium.com/coding-agent-attempt-1-6156f86c2afc",
    publishedAt: "2026-10-10",
    subtitle: "First architecture & cutting API costs with LiteLLM",
    description:
      "Hands-on engineering log from building the first working prototype of simple-coding-agent on Anthropic's Claude Agent SDK — plus how routing through a LiteLLM gateway lets you benchmark and reduce model API spend.",
    tags: ["Claude Agent SDK", "LiteLLM", "Architecture"],
    readingTime: "6 min read",
  },
];

/**
 * Returns all Articles sorted by publishedAt, oldest first. This is the only
 * function the UI reads from.
 */
export function getArticles(): Article[] {
  return [...ARTICLES].sort((a, b) => a.publishedAt.localeCompare(b.publishedAt));
}
