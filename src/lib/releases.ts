// Server-side data layer for simple-coding-agent Releases. No UI lives here:
// the version bar and the Change log section consume this module.
//
// Caching (see node_modules/next/dist/docs/01-app/02-guides/
// caching-without-cache-components.md): the single fetch below uses only the
// fetch Data Cache (`next: { revalidate }`), which keeps serving the stale
// value while GitHub fails. No `cacheComponents`, no `"use cache"`/`cacheLife`,
// no `unstable_cache`.

export const RELEASES_URL =
  "https://api.github.com/repos/lbacik/simple-coding-agent/releases?per_page=100";

export const RELEASES_REVALIDATE_SECONDS = 3600;

export const FRESHNESS_WINDOW_DAYS = 14;

export type GitHubReleasePayload = {
  tag_name: string;
  name: string | null;
  html_url: string;
  draft: boolean;
  prerelease: boolean;
  created_at: string;
  body: string | null;
};

export type StableRelease = {
  tagName: string;
  name: string;
  htmlUrl: string;
  createdAt: string;
  body: string | null;
};

function semverParts(tag: string): number[] {
  return tag
    .replace(/^v/, "")
    .split(/[.-]/)
    .map((part) => Number(part) || 0);
}

function bySemverDesc(a: StableRelease, b: StableRelease): number {
  const x = semverParts(a.tagName);
  const y = semverParts(b.tagName);
  for (let i = 0; i < Math.max(x.length, y.length); i++) {
    if ((x[i] ?? 0) !== (y[i] ?? 0)) return (y[i] ?? 0) - (x[i] ?? 0);
  }
  return 0;
}

function toStableRelease(payload: GitHubReleasePayload): StableRelease {
  return {
    tagName: payload.tag_name,
    name: payload.name ?? payload.tag_name,
    htmlUrl: payload.html_url,
    createdAt: payload.created_at,
    body: payload.body,
  };
}

// The only fetch for Releases. Thrown errors and non-OK responses yield an
// empty list, for which the UI renders nothing. Until the Release backfill
// runs the API answers `200 []`, which is a valid "nothing to show".
export async function getStableReleases(): Promise<StableRelease[]> {
  try {
    const res = await fetch(RELEASES_URL, {
      next: { revalidate: RELEASES_REVALIDATE_SECONDS },
    });
    if (!res.ok) return [];
    const payload: unknown = await res.json();
    if (!Array.isArray(payload)) return [];
    return (payload as GitHubReleasePayload[])
      .filter((item) => !item.draft && !item.prerelease)
      .map(toStableRelease)
      .sort(bySemverDesc);
  } catch {
    return [];
  }
}

// The Current Release: the Release with the highest semver tag, or none.
export function getCurrentRelease(
  releases: StableRelease[],
): StableRelease | undefined {
  return releases[0];
}

// `created_at` (the tag commit's date), formatted like "14 Oct 2026".
export function formatReleaseDate(createdAt: string): string {
  return new Date(createdAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

// "fresh" (the bar's green dot) while the Current Release is younger than
// 14 days. "Now" is injected so the boundary is testable.
export function isFreshRelease(release: StableRelease, now: Date): boolean {
  const ageMs = now.getTime() - new Date(release.createdAt).getTime();
  return ageMs < FRESHNESS_WINDOW_DAYS * 24 * 60 * 60 * 1000;
}
