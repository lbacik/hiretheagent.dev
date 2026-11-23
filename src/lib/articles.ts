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
  /** Key takeaway or quote highlighted in technical card layouts. */
  takeaway: string;
  /** Bullet points of specific topics covered inside the article. */
  bullets: string[];
  /** Topic tags displayed in the card footer. */
  tags: string[];
  /** Estimated reading time label on Medium. */
  readingTime: string;
  /** Dispatch code / category badge for technical card layouts. */
  categoryCode: string;
};

const ARTICLES: Article[] = [
  {
    title: "Agents on Autopilot",
    url: "https://lbacik.medium.com/agents-on-autopilot-e5f17554553e",
    publishedAt: "2026-10-20",
    subtitle: "From interactive copilots to unattended containerised workers",
    description:
      "What it takes to move coding agents from supervised chat sessions to autonomous background execution: isolated Docker sandboxes, repository profiles, deterministic test gates, and operator control loops.",
    takeaway:
      "Autopilot shifts human effort from babysitting prompts to defining clear acceptance criteria and reviewing verified Pull Requests.",
    bullets: [
      "Unattended issue-to-PR lifecycle inside isolated Docker containers",
      "Operator visibility & safe runtime control over long-running attempts",
    ],
    tags: ["Unattended Ops", "Docker Sandbox", "Workflow"],
    readingTime: "7 min read",
    categoryCode: "03 // AUTOPILOT OPS",
  },
  {
    title: "The trust boundary behind ready-for-agent",
    url: "https://lbacik.medium.com/the-trust-boundary-behind-ready-for-agent-24b3d7e7ca9a",
    publishedAt: "2026-10-16",
    subtitle: "Coding agents in a public GitHub environment",
    description:
      "Why applying a maintainer-only GitHub label is not a complete security boundary on public repositories: external issue authors can still edit descriptions or post comments that act as indirect prompt injection.",
    takeaway:
      "Never label untrusted external issues directly — re-create a self-contained implementation ticket under a trusted account first.",
    bullets: [
      "Anatomy of indirect prompt injection via mutable GitHub issue threads",
      "Mitigating public-repo risks with the triage-to-owned workflow",
    ],
    tags: ["Security", "Prompt Injection", "Trust Boundary"],
    readingTime: "5 min read",
    categoryCode: "02 // SECURITY BOUNDARY",
  },
  {
    title: "Coding Agent — Attempt 1",
    url: "https://lbacik.medium.com/coding-agent-attempt-1-6156f86c2afc",
    publishedAt: "2026-10-10",
    subtitle: "First architecture & cutting API costs with LiteLLM",
    description:
      "Hands-on engineering log from building the first working prototype of simple-coding-agent on Anthropic's Claude Agent SDK — plus how routing through a LiteLLM gateway lets you benchmark and reduce model API spend.",
    takeaway:
      "Pairing the Claude Agent SDK execution loop with a LiteLLM proxy unlocks flexible model routing and predictable per-issue costs.",
    bullets: [
      "Wiring the Python orchestrator to Claude Agent SDK & Claude Code runtime",
      "Routing agent turns through LiteLLM to optimize token spend",
    ],
    tags: ["Claude Agent SDK", "LiteLLM", "Architecture"],
    readingTime: "6 min read",
    categoryCode: "01 // ARCHITECTURE & COST",
  },
];

/**
 * Returns all Articles sorted by publishedAt, oldest first. This is the only
 * function the UI reads from.
 */
export function getArticles(): Article[] {
  return [...ARTICLES].sort((a, b) => a.publishedAt.localeCompare(b.publishedAt));
}
