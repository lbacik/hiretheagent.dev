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
};

const ARTICLES: Article[] = [
  {
    title: "Agents on Autopilot",
    url: "https://lbacik.medium.com/agents-on-autopilot-e5f17554553e",
    publishedAt: "2026-10-20",
  },
  {
    title: "The trust boundary behind ready-for-agent",
    url: "https://lbacik.medium.com/the-trust-boundary-behind-ready-for-agent-24b3d7e7ca9a",
    publishedAt: "2026-10-16",
  },
  {
    title: "Coding Agent — Attempt 1",
    url: "https://lbacik.medium.com/coding-agent-attempt-1-6156f86c2afc",
    publishedAt: "2026-10-10",
  },
];

/**
 * Returns all Articles sorted by publishedAt, oldest first. This is the only
 * function the UI reads from.
 */
export function getArticles(): Article[] {
  return [...ARTICLES].sort((a, b) => a.publishedAt.localeCompare(b.publishedAt));
}
