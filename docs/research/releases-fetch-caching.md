# Fetching and caching GitHub Releases in this Next.js app

Research for [#7](https://github.com/lbacik/hiretheagent.dev/issues/7), part of the map in [#6](https://github.com/lbacik/hiretheagent.dev/issues/6).

**Question:** how should a server component fetch the GitHub Releases of `lbacik/simple-coding-agent` with a cache of about 1 h and stale-while-revalidate on failure? The constraints: `src/app/layout.tsx` calls `await connection()`, so every request is dynamic, and `next.config.ts` builds with `output: "standalone"` into a Docker image.

**Version note:** the ticket says Next.js 16.3, but `package.json` and `node_modules/next/package.json` both say **16.4.2**. Everything below was checked against 16.4.2: the bundled docs in `node_modules/next/dist/docs/` and the compiled source in `node_modules/next/dist/`. Paths below are relative to `node_modules/next/dist/`.

## Answer

Use the extended `fetch` with `next: { revalidate: 3600 }`. This is the "previous model" fetch Data Cache. Do **not** enable `cacheComponents` and do **not** use `"use cache"` for this.

```ts
// sketch only, not a final implementation
const res = await fetch(
  "https://api.github.com/repos/lbacik/simple-coding-agent/releases?per_page=100",
  {
    headers: {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2026-03-10",
    },
    next: { revalidate: 3600 },
  },
);
// cold miss + failure: fetch throws (network) or res.ok === false (403/429/5xx)
// -> treat as "nothing cached" and hide the bar and the Change log section.
```

- **No config flag is needed.** This app has no `cacheComponents`, and the fetch cache works without it.
- **Stale-while-revalidate holds even when the refetch fails.** A stale entry is served at once while a background refetch runs. A failed refetch never replaces the entry: a network error is swallowed, and a non-200 response is not stored. Fetch-cache entries never expire by time.
- **The cache is in memory plus on disk** at `/app/.next/cache/fetch-cache` inside the container. It survives a process or container restart (`restart: unless-stopped`), but is lost when the container is recreated, which happens on every deploy of a new image.
- **Make one request** to `/releases?per_page=100`, filter out drafts and prereleases in code, and take the current version from that list. Skip `/releases/latest`; see the GitHub section below.

## 1. Which caching mechanism applies

### Fetch Data Cache with `next.revalidate` (recommended)

- The app does not set `cacheComponents`. For that case the docs point to *Caching and Revalidating (Previous Model)* (`docs/01-app/02-guides/caching-without-cache-components.md`), which documents `fetch(url, { next: { revalidate: 3600 } })` for time-based revalidation. *Caching* (`docs/01-app/01-getting-started/08-caching.md`) opens by saying it covers Cache Components only and sends readers without it to that guide.
- **It still caches on a dynamic route.** The docs' "fetch after a Request-time API runs every request" rule covers only fetches **without** a cache option. In `server/lib/patch-fetch.js`:
  - An explicit `next.revalidate` sets `currentFetchRevalidate`, so `hasNoExplicitCacheConfig` is false and `autoNoCache` does not apply (around lines 445-465).
  - `finalRevalidate = 3600`, so `isCacheableRevalidate = typeof finalRevalidate === 'number' && finalRevalidate > 0` is true (line ~614).
  - For a `'request'` work unit, the read path `incrementalCache.get(...)` and the write path `createCachedDynamicResponse(...)` both run (lines ~707-745 and ~760-850).
  - `connection()` does not set `forceDynamic`. Only `dynamic = 'force-dynamic'` (or `fetchCache = 'force-no-store'`) would turn this fetch into `no-store` (lines ~411-428). Neither is used.
- **Only `200` responses are stored.** `docs/01-app/03-api-reference/04-functions/fetch.md` ("Only responses with a `200` HTTP status code are stored") and `patch-fetch.js` line ~707 (`if (res.status === 200 && incrementalCache && cacheKey && ...)`).
- **The cache key does not include the build ID.** It is built from URL, method, headers and body. The filesystem handler stores it under `.next/cache/fetch-cache` "so it can be persisted across deploys" (comment in `server/lib/incremental-cache/file-system-cache.js`, `getFilePath`).

### `"use cache"` + `cacheLife` (not recommended here)

- **It needs `cacheComponents: true`,** plus `partialPrefetching`, which the docs say to set explicitly (`docs/01-app/03-api-reference/05-config/01-next-config-js/cacheComponents.md`, `docs/01-app/03-api-reference/01-directives/use-cache.md` "Usage"). Without it, `experimental.useCache` stays `undefined`, then gets backfilled from `cacheComponents` (`server/config.js` ~1080-1084), so the directive is off.
- **Enabling Cache Components changes the whole app,** not just this fetch. The root layout's top-level `await connection()` would have to move inside `<Suspense>` or be addressed per *Migrating to Cache Components* (`docs/01-app/02-guides/migrating-to-cache-components.md`; see also the note in `connection.md` that prefers `io()` under Cache Components). That is out of scope for this feature.
- **No stale-while-revalidate in production with the default handler.** The handler (`server/lib/cache-handlers/default.js`) is in memory only and drops an entry once it passes `revalidate`. Its header comment says stale entries "should be considered expired/missing" in production, and `get()` uses `maxAgeSeconds = process.env.__NEXT_DEV_SERVER ? ... : entry.revalidate`. After 1 h the next read is a miss that regenerates **in the foreground**. If GitHub fails at that moment, the error propagates and there is no last good value. The `cacheLife` docs describe serve-stale-then-refresh, but that only applies with a handler that keeps stale entries, such as `next dev` or a custom `cacheHandlers`.
- **Entries are lost on every restart,** because the cache is in memory, and on every deploy, because the build ID is part of the key (`use-cache.md`, "Cache keys" and the note under "Runtime caching considerations").

### `unstable_cache` (not recommended)

`docs/01-app/03-api-reference/04-functions/unstable_cache.md`: "This API has been replaced by `use cache` in Next.js 16." It has no advantage over `fetch` here, since the data source is a plain HTTP GET.

## 2. Failure and restart behaviour of the fetch cache

### When revalidation fails

- **A stale entry is served immediately.** In `patch-fetch.js` (~806-833), if `entry.isStale`, the code starts `doOriginalFetch(true)` in the background, attaches `pendingRevalidate.catch(console.error)`, and returns `entry.value.data` (the stale body) to the render.
- **A failed background refetch leaves the old entry in place.**
  - A network error rejects the background promise. It is logged with `console.error`, and nothing is written.
  - A non-200 response (GitHub `403`/`429` rate limit, `5xx`) is returned uncached by the `res.status === 200` guard. The entry and its `lastModified` stay as they were.
- **Fetch-cache entries never expire by time.** In `server/lib/incremental-cache/index.js` (~404-420), a FETCH entry is only ever marked `isStale = age > revalidate`. There is no `expire` for FETCH entries. They are dropped (`return null`) only by tag invalidation (`revalidateTag`/`revalidatePath`), which this feature would not use. So the last good value is served for as long as GitHub keeps failing.
- **While the entry is stale, every request starts a new background refetch.** After a failure the entry stays stale, so each request fires one refetch: `pendingRevalidates` dedupes only within a single request's `workStore`, and the cache lock is released as soon as an entry exists (`index.js` `lock()`, `patch-fetch.js` `if (entry) await handleUnlock()`). Under a GitHub outage or a rate limit, each page view makes one GitHub call until one succeeds. This is acceptable for a landing page, but the implementation should know about it.
- **A cold miss behaves like a normal fetch.** It throws on a network error and returns the non-OK `Response` on an HTTP error. The page code must catch both and apply the map's rule: nothing cached means hide the bar and the Change log section.
- On a cold miss, concurrent requests for the same key queue on `incrementalCache.lock(cacheKey)` until the first fetch finishes, so they share one origin call.
- A background refetch does not pass through the caller's `AbortSignal` ("don't pass through signal when revalidating", `patch-fetch.js` ~662). An `AbortSignal.timeout(...)` therefore bounds only the foreground cold-miss fetch. The fetch docs also say that passing a signal opts that call out of render-pass memoization. If both the bar and the Change log call the fetcher, wrap it in React `cache()` to dedupe.

### Persistence across restarts (standalone Docker)

- **The default handler is the filesystem cache with an in-memory front.**
  - In `index.js` (constructor), with no custom `cacheHandler`, `CurCacheHandler = FileSystemCache` when `fs && serverDistDir`.
  - The in-memory LRU front is `cacheMaxMemorySize`, default `50 * 1024 * 1024` (`server/config-shared.js` ~102). Disk writes are enabled by `experimental.isrFlushToDisk`, default `true` (`config-shared.js` ~233; passed to the handler as `flushToDisk: !this.minimalMode && ...isrFlushToDisk` in `server/next-server.js` ~617).
  - The docs agree: "By default, generated cache assets will be stored in memory (defaults to 50mb) and on disk" (`docs/01-app/02-guides/self-hosting.md`, "Configuring Caching").
- **Location:** `path.join(serverDistDir, '..', 'cache', 'fetch-cache')` (`file-system-cache.js` `getFilePath`). In the standalone image `serverDistDir` is `/app/.next/server`, so entries land in **`/app/.next/cache/fetch-cache`**. The Dockerfile copies `.next/standalone` with `--chown=app:app` and runs as `app`, so the directory is writable.
- **What survives:**
  - A process crash or a `docker restart` keeps the same container and its writable layer, so the disk entries come back. `compose.prod.yaml` uses `restart: unless-stopped`.
  - Recreating the container, which `docker compose up` does on every new-image deploy, starts with an empty `/app/.next/cache`. The first request after a deploy is a cold miss. If GitHub is down at that moment, the page hides both pieces until the next success.
  - To keep the cache across deploys, mount a volume at `/app/.next/cache`. The fetch-cache key has no build ID, so entries stay valid across deploys. This is optional and not required by the map's decisions.
- **Single instance:** one container is deployed, so the per-instance cache is fine. The multi-instance concerns in `self-hosting.md` and `how-revalidation-works.md` do not apply.

## 3. GitHub REST API facts

Sources: [REST API endpoints for releases](https://docs.github.com/en/rest/releases/releases), [Rate limits for the REST API](https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api), [Using pagination in the REST API](https://docs.github.com/en/rest/using-the-rest-api/using-pagination-in-the-rest-api), [Best practices for using the REST API](https://docs.github.com/en/rest/using-the-rest-api/best-practices-for-using-the-rest-api).

### `GET /repos/{owner}/{repo}/releases` (List releases)

- **Tags are not releases.** "This returns a list of releases, which does not include regular Git tags that have not been associated with a release."
- **Drafts are hidden from anonymous callers.** "Information about published releases are available to everyone. Only users with push access will receive listings for draft releases." An unauthenticated call never sees drafts. **Prereleases are included** and must be filtered out in code (`prerelease: false`, per the map).
- **Paging:** `per_page`: "The number of results per page (max 100)", default `30`. `page` is the page number, default `1`. The docs do not state the sort order, so the page should sort the entries itself.
- **Pagination uses the `link` response header** (`rel="next"`, `rel="last"`). The header is omitted when everything fits on one page. With 16 tags today, `per_page=100` covers everything in one request. A second page is needed only beyond 100 Releases.
- **Release fields the page needs** (from the response schema):

  | Field | Type |
  | --- | --- |
  | `tag_name` | string, required |
  | `name` | string or null |
  | `body` | string or null (Markdown; `body_html` / `body_text` exist only with the matching media type) |
  | `html_url` | URI, required |
  | `draft` | boolean, required |
  | `prerelease` | boolean, required |
  | `published_at` | date-time or **null**, required |
  | `created_at` | date-time, required |

  `name` can be null, so fall back to `tag_name`. `published_at` can be null too.
- **Recommended headers:** `Accept: application/vnd.github+json` and `X-GitHub-Api-Version: 2026-03-10` (the version the docs page shows).

### `GET /repos/{owner}/{repo}/releases/latest` (Get the latest release)

- **What counts as latest:** "View the latest published full release for the repository. The latest release is the most recent non-prerelease, non-draft release, sorted by the created_at attribute. The created_at attribute is the date of the commit used for the release, and not the date when the release was drafted or published." It returns `404` when there is none, which is the case today.
- **`make_latest` can move the "latest" marker.** On create and update, `make_latest`: "Drafts and prereleases cannot be set as latest. Defaults to true for newly published releases. `legacy` specifies that the latest release should be determined based on the release creation date and higher semantic version." `gh release create --latest` defaults to "automatic based on date and version".
- **Recommendation: skip `/latest`.** One `/releases` call already holds everything the bar and the Change log need. Taking the current version from the filtered list also halves the rate-limit cost and the number of cache entries. It avoids depending on the `make_latest` marker too, which the one-off backfill could set wrongly if historical Releases are created out of order.
- **Order by version, not by date.** Backfilled Releases will all carry roughly the same `published_at` (the backfill day). Order by semantic version of `tag_name`, not by `published_at`. For the Change log's dates, decide between `published_at` (backfill day for history) and `created_at` (which the docs say is the tag commit date). This is a spec decision for the map.

### Rate limits

- **60 requests per hour per IP.** "You can make unauthenticated requests if you are only fetching public data. Unauthenticated requests are associated with the originating IP address, not with the user or application that made the request." "The primary rate limit for unauthenticated requests is 60 requests per hour." The budget is shared with anything else calling the API from the server's public IP.
- **Exceeding it returns `403` or `429`.** "If you exceed your primary rate limit, you will receive a `403` or `429` response, and the `x-ratelimit-remaining` header will be `0`. You should not retry your request until after the time specified by the `x-ratelimit-reset` header." Status headers: `x-ratelimit-limit`, `x-ratelimit-remaining`, `x-ratelimit-used`, `x-ratelimit-reset`, `x-ratelimit-resource`.
- **Conditional `304` requests are free only when authenticated.** The docs say a `304` does not count against the limit only "if ... the request was made while correctly authorized with an `Authorization` header". Without a token (the map's decision) they would not help, and the Next fetch cache does not issue conditional requests anyway.
- **Budget:** at 1 call per hour per cache key in steady state, the page uses about 1 of the 60 requests. A failing period (see section 2) can spend more, one call per page view. Once the limit is hit, responses are `403`/`429`, which are not cached, so stale data keeps being served.

### Current state of the agent repo (checked 2026-10-16)

- `gh release list -R lbacik/simple-coding-agent` prints nothing: there are no Releases.
- `GET /repos/lbacik/simple-coding-agent/releases` returns `200` with `[]` (`x-ratelimit-limit: 60`).
- `GET .../releases/latest` returns `404`.
- Tags exist: `v0.1.0` … `v0.5.0` (16 tags).
- **An empty list is a valid `200` and will be cached.** The page must treat "no stable Releases" the same as "nothing to show": hide both pieces. Until the backfill lands, the feature renders nothing.

## Impact on the map's settled notes

None of the "Settled while charting" notes becomes infeasible:

- **Stale-while-revalidate on error:** achievable with `fetch` + `next.revalidate`, which serves the last good value indefinitely while refetches fail.
- **About 1 h cache, runtime fetch, no token, no build-time baking:** achievable, and 60 requests per hour unauthenticated is ample.
- **Fetch fails and nothing is cached, so hide both:** this is exactly the cold-miss case, which happens after every redeploy (container recreated) or on first start.
- **Only stable Releases:** drafts are already invisible without a token. Prereleases must be filtered client-side. `/releases/latest` already excludes both, but the recommendation is not to use it.

One caveat for the spec: the settled note implies SWR through "a cache", and it holds **only** with the fetch Data Cache. Choosing `"use cache"`/`cacheLife` (with Cache Components) and the default handler would break it: no stale value is kept in production after `revalidate`.
