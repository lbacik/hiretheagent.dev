// PROTOTYPE (issue #9): a stubbed Release, shaped like one entry of
// GET /repos/lbacik/simple-coding-agent/releases (only the fields the bar could use),
// with notes in the categories decided in issue #8.

export type StubRelease = {
  tagName: string;
  name: string;
  htmlUrl: string;
  publishedAt: string;
  // Notes grouped by release.yml category, as GitHub's generated Markdown would render them.
  categories: { title: string; entries: { title: string; pr: number }[] }[];
};

export const release: StubRelease = {
  tagName: "v0.5.0",
  name: "v0.5.0",
  htmlUrl: "https://github.com/lbacik/simple-coding-agent/releases/tag/v0.5.0",
  publishedAt: "2026-10-10T14:21:07Z",
  categories: [
    {
      title: "Features",
      entries: [
        { title: "Run the test suite in the sandbox before opening the PR", pr: 58 },
        { title: "Support Bring-your-own-LLM via an OpenAI-compatible endpoint", pr: 61 },
      ],
    },
    {
      title: "Fixes",
      entries: [{ title: "Retry the GitHub API on secondary rate limits", pr: 63 }],
    },
    {
      title: "Other changes",
      entries: [{ title: "Bump the base Docker image to Debian trixie", pr: 64 }],
    },
  ],
};

export const changeCount = release.categories.reduce((n, c) => n + c.entries.length, 0);
export const headline = release.categories[0]?.entries[0]?.title;

export const releasedOn = new Date(release.publishedAt).toLocaleDateString("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

const DAY = 24 * 60 * 60 * 1000;
// "New" while the Release is younger than two weeks (frozen "now" so the prototype is stable).
export const isFresh = Date.parse("2026-10-16T00:00:00Z") - Date.parse(release.publishedAt) < 14 * DAY;
