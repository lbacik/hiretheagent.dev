// Pure feed logic for the Change log section. No UI lives here: the
// client ChangeLogFeed consumes these helpers for filtering and paging,
// and they are covered by Vitest with hand-built fixtures (no component
// tests).
//
// The input Releases arrive ordered by semver, newest first, from
// getStableReleases; the order is preserved, never recomputed here.

import { parseReleaseNotes } from "./release-notes";
import type { StableRelease } from "./releases";

export const CHANGE_LOG_PAGE_SIZE = 12;

export const CHANGE_LOG_FILTERS = ["All", "Features", "Fixes"] as const;

export type ChangeLogFilter = (typeof CHANGE_LOG_FILTERS)[number];

export const ALL_RELEASES_URL =
  "https://github.com/lbacik/simple-coding-agent/releases";

type ChangeLogReleaseRow = {
  key: string;
  releaseTag: string;
  releaseName: string;
  releaseUrl: string;
  releaseCreatedAt: string;
};

export type ChangeLogRow =
  | (ChangeLogReleaseRow & {
      kind: "change";
      category: string;
      title: string;
      prNumber: number;
      prUrl: string;
    })
  | (ChangeLogReleaseRow & { kind: "fallback"; text: string })
  | (ChangeLogReleaseRow & { kind: "maintenance" });

function releaseRow(release: StableRelease): ChangeLogReleaseRow {
  return {
    key: release.tagName,
    releaseTag: release.tagName,
    releaseName: release.name,
    releaseUrl: release.htmlUrl,
    releaseCreatedAt: release.createdAt,
  };
}

// One flat feed of Changes across all Releases: each Release contributes
// its Changes in note order, a plain-text row when its notes fall outside
// the generated shape, or a maintenance row when it has no Changes.
export function buildChangeLogRows(releases: StableRelease[]): ChangeLogRow[] {
  return releases.flatMap((release): ChangeLogRow[] => {
    const base = releaseRow(release);
    const notes = parseReleaseNotes(release.body);
    if (notes.kind === "fallback") return [{ ...base, kind: "fallback", text: notes.text }];
    if (notes.kind === "maintenance") return [{ ...base, kind: "maintenance" }];
    return notes.categories.flatMap((category) =>
      category.changes.map((change) => ({
        ...base,
        kind: "change" as const,
        key: `${release.tagName}#${change.prNumber}`,
        category: category.title,
        title: change.title,
        prNumber: change.prNumber,
        prUrl: change.prUrl,
      })),
    );
  });
}

// "Other changes" has no chip of its own; fallback and maintenance rows are
// Release-level rows shown only under All.
export function filterChangeLogRows(
  rows: ChangeLogRow[],
  filter: ChangeLogFilter,
): ChangeLogRow[] {
  if (filter === "All") return rows;
  return rows.filter((row) => row.kind === "change" && row.category === filter);
}

export function pageChangeLogRows(rows: ChangeLogRow[], limit: number): ChangeLogRow[] {
  return rows.slice(0, limit);
}

export function remainingChangeLogCount(rows: ChangeLogRow[], limit: number): number {
  return Math.max(0, rows.length - limit);
}
