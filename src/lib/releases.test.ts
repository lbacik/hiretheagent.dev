import { afterEach, describe, expect, it, vi } from "vitest";

import {
  formatReleaseDate,
  getCurrentRelease,
  getStableReleases,
  isFreshRelease,
  RELEASES_REVALIDATE_SECONDS,
  RELEASES_URL,
  type GitHubReleasePayload,
  type StableRelease,
} from "./releases";

function payload(overrides: Partial<GitHubReleasePayload>): GitHubReleasePayload {
  return {
    tag_name: "v0.1.0",
    name: "v0.1.0",
    html_url: "https://github.com/lbacik/simple-coding-agent/releases/tag/v0.1.0",
    draft: false,
    prerelease: false,
    created_at: "2026-10-14T15:25:17Z",
    body: null,
    ...overrides,
  };
}

function release(overrides: Partial<StableRelease>): StableRelease {
  return {
    tagName: "v0.1.0",
    name: "v0.1.0",
    htmlUrl: "https://github.com/lbacik/simple-coding-agent/releases/tag/v0.1.0",
    createdAt: "2026-10-14T15:25:17Z",
    body: null,
    ...overrides,
  };
}

function stubFetch(res: Response | Promise<Response> | Error) {
  const impl =
    res instanceof Error ? () => Promise.reject(res) : () => Promise.resolve(res);
  vi.stubGlobal("fetch", vi.fn(impl));
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("getStableReleases request", () => {
  it("calls /releases?per_page=100 with a one-hour fetch Data Cache", async () => {
    stubFetch(new Response("[]", { status: 200 }));
    await getStableReleases();
    expect(fetch).toHaveBeenCalledOnce();
    expect(fetch).toHaveBeenCalledWith(RELEASES_URL, {
      next: { revalidate: RELEASES_REVALIDATE_SECONDS },
    });
    expect(RELEASES_URL).toBe(
      "https://api.github.com/repos/lbacik/simple-coding-agent/releases?per_page=100",
    );
    expect(RELEASES_REVALIDATE_SECONDS).toBe(3600);
  });
});

describe("getStableReleases selection", () => {
  it("drops drafts and prereleases", async () => {
    stubFetch(
      new Response(
        JSON.stringify([
          payload({ tag_name: "v0.3.0" }),
          payload({ tag_name: "v0.4.0", draft: true }),
          payload({ tag_name: "v0.5.0-rc.1", prerelease: true }),
        ]),
        { status: 200 },
      ),
    );
    expect((await getStableReleases()).map((r) => r.tagName)).toEqual(["v0.3.0"]);
  });

  it("orders by semver, never by date", async () => {
    stubFetch(
      new Response(
        JSON.stringify([
          payload({ tag_name: "v0.9.0", created_at: "2026-10-14T15:25:17Z" }),
          payload({ tag_name: "v0.10.0", created_at: "2026-10-01T10:00:00Z" }),
        ]),
        { status: 200 },
      ),
    );
    expect((await getStableReleases()).map((r) => r.tagName)).toEqual([
      "v0.10.0",
      "v0.9.0",
    ]);
  });

  it("falls back to tag_name when name is null", async () => {
    stubFetch(
      new Response(JSON.stringify([payload({ tag_name: "v0.3.0", name: null })]), {
        status: 200,
      }),
    );
    expect(await getStableReleases()).toMatchObject([{ tagName: "v0.3.0", name: "v0.3.0" }]);
  });
});

describe("getStableReleases failure paths", () => {
  it.each([
    ["network error", new Error("fetch failed")],
    ["500", new Response("boom", { status: 500 })],
    ["403", new Response("forbidden", { status: 403 })],
    ["429", new Response("rate limited", { status: 429 })],
    ["200 with an empty list", new Response("[]", { status: 200 })],
    [
      "200 with only prereleases",
      new Response(JSON.stringify([payload({ tag_name: "v0.6.0-rc.1", prerelease: true })]), {
        status: 200,
      }),
    ],
  ])("yields an empty list on %s", async (_label, stub) => {
    stubFetch(stub);
    await expect(getStableReleases()).resolves.toEqual([]);
  });
});

describe("getCurrentRelease", () => {
  it("is the release with the highest semver tag", () => {
    const releases = [
      release({ tagName: "v0.9.0" }),
      release({ tagName: "v0.2.0" }),
      release({ tagName: "v0.10.0" }),
    ];
    expect(getCurrentRelease(releases)).toMatchObject({ tagName: "v0.10.0" });
  });

  it("is none for an empty list", () => {
    expect(getCurrentRelease([])).toBeUndefined();
  });
});

describe("formatReleaseDate", () => {
  it("formats created_at like 14 Oct 2026 in en-GB UTC", () => {
    expect(formatReleaseDate("2026-10-14T15:25:17Z")).toBe("14 Oct 2026");
  });
});

describe("isFreshRelease", () => {
  it("is fresh while younger than 14 days", () => {
    const now = new Date("2026-10-20T15:25:17Z");
    expect(isFreshRelease(release({ createdAt: "2026-10-14T15:25:17Z" }), now)).toBe(true);
  });

  it("is not fresh once 14 days old", () => {
    const now = new Date("2026-10-28T15:25:17Z");
    expect(isFreshRelease(release({ createdAt: "2026-10-14T15:25:17Z" }), now)).toBe(false);
  });

  it("is not fresh after 14 days", () => {
    const now = new Date("2026-10-30T15:25:17Z");
    expect(isFreshRelease(release({ createdAt: "2026-10-14T15:25:17Z" }), now)).toBe(false);
  });
});
