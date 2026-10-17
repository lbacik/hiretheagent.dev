import { describe, expect, it } from "vitest";

import {
  buildChangeLogRows,
  CHANGE_LOG_PAGE_SIZE,
  filterChangeLogRows,
  pageChangeLogRows,
  remainingChangeLogCount,
  type ChangeLogRow,
} from "./change-log";
import type { StableRelease } from "./releases";

function release(overrides: Partial<StableRelease>): StableRelease {
  return {
    tagName: "v0.2.0",
    name: "v0.2.0",
    htmlUrl: "https://github.com/lbacik/simple-coding-agent/releases/tag/v0.2.0",
    createdAt: "2026-10-14T15:25:17Z",
    body: null,
    ...overrides,
  };
}

function generatedBody(entries: string): string {
  return `## What's Changed\n${entries}\n\n**Full Changelog**: https://github.com/lbacik/simple-coding-agent/compare/v0.1.0...v0.2.0`;
}

function entry(title: string, pr: number): string {
  return `* ${title} by @lbacik in https://github.com/lbacik/simple-coding-agent/pull/${pr}`;
}

describe("buildChangeLogRows", () => {
  it("flattens releases into change rows carrying their release divider", () => {
    const rows = buildChangeLogRows([
      release({
        tagName: "v0.2.0",
        name: "v0.2.0",
        htmlUrl: "https://github.com/lbacik/simple-coding-agent/releases/tag/v0.2.0",
        createdAt: "2026-10-14T15:25:17Z",
        body: generatedBody(
          `### Features\n${entry("Add dark mode", 12)}\n### Fixes\n${entry("Fix crash on empty config", 14)}`,
        ),
      }),
      release({
        tagName: "v0.1.0",
        name: "v0.1.0",
        htmlUrl: "https://github.com/lbacik/simple-coding-agent/releases/tag/v0.1.0",
        createdAt: "2026-10-01T10:00:00Z",
        body: generatedBody(`### Features\n${entry("Speed up startup", 13)}`),
      }),
    ]);

    expect(rows).toEqual([
      {
        kind: "change",
        key: "v0.2.0#12",
        releaseTag: "v0.2.0",
        releaseName: "v0.2.0",
        releaseUrl: "https://github.com/lbacik/simple-coding-agent/releases/tag/v0.2.0",
        releaseCreatedAt: "2026-10-14T15:25:17Z",
        category: "Features",
        title: "Add dark mode",
        prNumber: 12,
        prUrl: "https://github.com/lbacik/simple-coding-agent/pull/12",
      },
      {
        kind: "change",
        key: "v0.2.0#14",
        releaseTag: "v0.2.0",
        releaseName: "v0.2.0",
        releaseUrl: "https://github.com/lbacik/simple-coding-agent/releases/tag/v0.2.0",
        releaseCreatedAt: "2026-10-14T15:25:17Z",
        category: "Fixes",
        title: "Fix crash on empty config",
        prNumber: 14,
        prUrl: "https://github.com/lbacik/simple-coding-agent/pull/14",
      },
      {
        kind: "change",
        key: "v0.1.0#13",
        releaseTag: "v0.1.0",
        releaseName: "v0.1.0",
        releaseUrl: "https://github.com/lbacik/simple-coding-agent/releases/tag/v0.1.0",
        releaseCreatedAt: "2026-10-01T10:00:00Z",
        category: "Features",
        title: "Speed up startup",
        prNumber: 13,
        prUrl: "https://github.com/lbacik/simple-coding-agent/pull/13",
      },
    ]);
  });

  it("keeps the caller's semver order, newest first", () => {
    const rows = buildChangeLogRows([
      release({ tagName: "v0.10.0", body: generatedBody(`### Fixes\n${entry("Tenth", 30)}`) }),
      release({ tagName: "v0.9.0", body: generatedBody(`### Fixes\n${entry("Ninth", 29)}`) }),
    ]);
    expect(rows.map((row) => row.releaseTag)).toEqual(["v0.10.0", "v0.9.0"]);
  });

  it("yields a plain-text fallback row for a hand-edited body", () => {
    const body = "Hand-edited notes:\n\n- Meta traffic now goes through the gateway.";
    const rows = buildChangeLogRows([release({ tagName: "v0.3.3", body })]);
    expect(rows).toEqual([
      {
        kind: "fallback",
        key: "v0.3.3",
        releaseTag: "v0.3.3",
        releaseName: "v0.2.0",
        releaseUrl: "https://github.com/lbacik/simple-coding-agent/releases/tag/v0.2.0",
        releaseCreatedAt: "2026-10-14T15:25:17Z",
        text: body,
      },
    ]);
  });

  it("yields a maintenance row for a release with no changes", () => {
    const rows = buildChangeLogRows([release({ tagName: "v0.2.2", body: null })]);
    expect(rows).toEqual([
      {
        kind: "maintenance",
        key: "v0.2.2",
        releaseTag: "v0.2.2",
        releaseName: "v0.2.0",
        releaseUrl: "https://github.com/lbacik/simple-coding-agent/releases/tag/v0.2.0",
        releaseCreatedAt: "2026-10-14T15:25:17Z",
      },
    ]);
  });

  it("yields no rows for an empty list", () => {
    expect(buildChangeLogRows([])).toEqual([]);
  });
});

describe("filterChangeLogRows", () => {
  const rows: ChangeLogRow[] = buildChangeLogRows([
    release({
      tagName: "v0.2.0",
      body: generatedBody(
        `### Features\n${entry("Add dark mode", 12)}\n### Fixes\n${entry("Fix crash", 14)}\n### Other changes\n${entry("Bump deps", 15)}`,
      ),
    }),
    release({ tagName: "v0.2.2", body: null }),
    release({ tagName: "v0.1.9", body: "Hand-edited notes." }),
  ]);

  it("shows every row under All", () => {
    expect(filterChangeLogRows(rows, "All")).toEqual(rows);
    expect(filterChangeLogRows(rows, "All")).toHaveLength(5);
  });

  it("shows only Features under Features", () => {
    const filtered = filterChangeLogRows(rows, "Features");
    expect(filtered).toHaveLength(1);
    expect(filtered[0]).toMatchObject({ kind: "change", category: "Features", prNumber: 12 });
  });

  it("shows only Fixes under Fixes", () => {
    const filtered = filterChangeLogRows(rows, "Fixes");
    expect(filtered).toHaveLength(1);
    expect(filtered[0]).toMatchObject({ kind: "change", category: "Fixes", prNumber: 14 });
  });

  it("shows Other changes only under All", () => {
    expect(filterChangeLogRows(rows, "All").some((row) => row.kind === "change" && row.category === "Other changes")).toBe(
      true,
    );
    expect(filterChangeLogRows(rows, "Features").some((row) => row.kind === "change" && row.category === "Other changes")).toBe(
      false,
    );
    expect(filterChangeLogRows(rows, "Fixes").some((row) => row.kind === "change" && row.category === "Other changes")).toBe(
      false,
    );
  });

  it("shows fallback and maintenance rows only under All", () => {
    for (const filter of ["Features", "Fixes"] as const) {
      const filtered = filterChangeLogRows(rows, filter);
      expect(filtered.some((row) => row.kind === "fallback")).toBe(false);
      expect(filtered.some((row) => row.kind === "maintenance")).toBe(false);
    }
    expect(filterChangeLogRows(rows, "All").some((row) => row.kind === "fallback")).toBe(true);
    expect(filterChangeLogRows(rows, "All").some((row) => row.kind === "maintenance")).toBe(true);
  });
});

describe("paging by 12", () => {
  function manyRows(count: number): ChangeLogRow[] {
    const releases = Array.from({ length: count }, (_, i) =>
      release({
        tagName: `v0.1.${count - i}`,
        name: `v0.1.${count - i}`,
        body: generatedBody(`### Features\n${entry(`Change ${count - i}`, 100 + i)}`),
      }),
    );
    return buildChangeLogRows(releases);
  }

  it("pages by 12", () => {
    expect(CHANGE_LOG_PAGE_SIZE).toBe(12);
  });

  it("shows the first 12 rows with the N left count", () => {
    const rows = manyRows(25);
    expect(pageChangeLogRows(rows, CHANGE_LOG_PAGE_SIZE)).toHaveLength(12);
    expect(remainingChangeLogCount(rows, CHANGE_LOG_PAGE_SIZE)).toBe(13);
  });

  it("adds 12 more per page, ending on a partial page", () => {
    const rows = manyRows(25);
    expect(pageChangeLogRows(rows, CHANGE_LOG_PAGE_SIZE * 2)).toHaveLength(24);
    expect(remainingChangeLogCount(rows, CHANGE_LOG_PAGE_SIZE * 2)).toBe(1);
    expect(pageChangeLogRows(rows, CHANGE_LOG_PAGE_SIZE * 3)).toHaveLength(25);
    expect(remainingChangeLogCount(rows, CHANGE_LOG_PAGE_SIZE * 3)).toBe(0);
  });

  it("reports nothing left once every row is shown", () => {
    const rows = manyRows(5);
    expect(pageChangeLogRows(rows, CHANGE_LOG_PAGE_SIZE)).toHaveLength(5);
    expect(remainingChangeLogCount(rows, CHANGE_LOG_PAGE_SIZE)).toBe(0);
  });
});
