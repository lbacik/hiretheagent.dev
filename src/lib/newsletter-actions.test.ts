import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { headers } from "next/headers";
import { solveChallenge } from "altcha-lib";
import { deriveKey } from "altcha-lib/algorithms/sha";

import { subscribeNewsletter } from "./newsletter-actions";
import { createNewsletterChallenge, resetRedeemedNewsletterChallenges } from "./altcha";
import {
  NEWSLETTER_RATE_LIMIT_MAX_ATTEMPTS,
  resetNewsletterRateLimits,
} from "./newsletter-rate-limit";

vi.mock("next/headers", () => ({ headers: vi.fn() }));

const TEST_IP = "203.0.113.7";
const OTHER_TEST_IP = "198.51.100.42";
const HMAC_KEY = "test-hmac-key-at-least-16-chars";

function mockClientIp(ip: string = TEST_IP) {
  vi.mocked(headers).mockResolvedValue(new Headers({ "x-forwarded-for": ip }));
}

const FULL_ENV = {
  LISTMONK_URL: "https://lists.example.com",
  LISTMONK_API_USER: "api-user",
  LISTMONK_API_TOKEN: "api-token",
  LISTMONK_LIST_ID: "7",
};

const ADDRESS = "visitor@example.com";

function mockFetch(status: number) {
  const fetchMock = vi.fn(async () => new Response(null, { status }));
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

/** Mints a fresh solved ALTCHA payload, as the widget would submit. */
async function freshPayload(overrides: { expiresAt?: number | Date } = {}): Promise<string> {
  const challenge = await createNewsletterChallenge(process.env, { cost: 1, ...overrides });
  const solution = await solveChallenge({ challenge, deriveKey });
  if (!solution) throw new Error("test setup: challenge unsolved");
  return Buffer.from(
    JSON.stringify({
      challenge: { parameters: challenge.parameters, signature: challenge.signature },
      solution,
    }),
  ).toString("base64");
}

/** Submits a sign-up with a fresh valid bot-check solution unless told otherwise. */
async function subscribe(email: string, payload?: string | null) {
  return subscribeNewsletter(email, payload === undefined ? await freshPayload() : payload);
}

describe("subscribeNewsletter", () => {
  let errorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    resetNewsletterRateLimits();
    resetRedeemedNewsletterChallenges();
    mockClientIp();
    process.env.LISTMONK_URL = FULL_ENV.LISTMONK_URL;
    process.env.LISTMONK_API_USER = FULL_ENV.LISTMONK_API_USER;
    process.env.LISTMONK_API_TOKEN = FULL_ENV.LISTMONK_API_TOKEN;
    process.env.LISTMONK_LIST_ID = FULL_ENV.LISTMONK_LIST_ID;
    process.env.ALTCHA_HMAC_KEY = HMAC_KEY;
    errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    delete process.env.LISTMONK_URL;
    delete process.env.LISTMONK_API_USER;
    delete process.env.LISTMONK_API_TOKEN;
    delete process.env.LISTMONK_LIST_ID;
    delete process.env.ALTCHA_HMAC_KEY;
    resetRedeemedNewsletterChallenges();
  });

  function loggedLines(): string[] {
    return errorSpy.mock.calls.map((args: unknown[]) => args.map(String).join(" "));
  }

  it("returns ok on 200 and logs nothing", async () => {
    mockFetch(200);
    await expect(subscribe(ADDRESS)).resolves.toEqual({ ok: true });
    expect(errorSpy).not.toHaveBeenCalled();
  });

  it("returns ok on 409 so duplicates look identical to new sign-ups", async () => {
    mockFetch(409);
    await expect(subscribe(ADDRESS)).resolves.toEqual({ ok: true });
    expect(errorSpy).not.toHaveBeenCalled();
  });

  it.each([
    [401, "credentials"],
    [403, "credentials"],
    [429, "transient"],
    [500, "transient"],
    [422, "rejected"],
  ])("returns failure on %i and logs a distinguishable line", async (status, fragment) => {
    mockFetch(status);
    await expect(subscribe(ADDRESS)).resolves.toEqual({ ok: false });
    expect(errorSpy).toHaveBeenCalledTimes(1);
    expect(loggedLines()[0]).toContain(fragment);
  });

  it("returns failure on network errors and logs a transient line", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        throw new TypeError("fetch failed");
      }),
    );
    await expect(subscribe(ADDRESS)).resolves.toEqual({ ok: false });
    expect(loggedLines()[0]).toContain("transient");
  });

  it("never includes the subscriber address in log lines", async () => {
    for (const status of [401, 429, 500, 422]) {
      errorSpy.mockClear();
      mockFetch(status);
      await subscribe(ADDRESS);
      for (const line of loggedLines()) {
        expect(line).not.toContain(ADDRESS);
        expect(line).not.toContain("visitor");
      }
    }
  });

  it("returns failure without calling listmonk when any LISTMONK_* var is missing", async () => {
    delete process.env.LISTMONK_API_TOKEN;
    const fetchMock = mockFetch(200);
    await expect(subscribe(ADDRESS)).resolves.toEqual({ ok: false });
    expect(fetchMock).not.toHaveBeenCalled();
    expect(loggedLines()[0]).toContain("not configured");
  });

  it("returns failure without calling listmonk for a malformed email", async () => {
    const fetchMock = mockFetch(200);
    await expect(subscribe("not-an-email")).resolves.toEqual({ ok: false });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  async function fillQuota() {
    for (let i = 0; i < NEWSLETTER_RATE_LIMIT_MAX_ATTEMPTS; i++) {
      await subscribe(`visitor${i}@example.com`);
    }
  }

  it("refuses the (N+1)th sign-up from the same IP without calling listmonk", async () => {
    const fetchMock = mockFetch(200);
    await fillQuota();
    expect(fetchMock).toHaveBeenCalledTimes(NEWSLETTER_RATE_LIMIT_MAX_ATTEMPTS);
    await expect(subscribe(ADDRESS)).resolves.toEqual({ ok: false, throttled: true });
    expect(fetchMock).toHaveBeenCalledTimes(NEWSLETTER_RATE_LIMIT_MAX_ATTEMPTS);
  });

  it("reports throttling with the too-many-attempts log line", async () => {
    mockFetch(200);
    await fillQuota();
    errorSpy.mockClear();
    await subscribe(ADDRESS);
    expect(errorSpy).toHaveBeenCalledTimes(1);
    expect(loggedLines()[0]).toContain("too many attempts");
  });

  it("leaves sign-ups from a different IP unaffected", async () => {
    const fetchMock = mockFetch(200);
    await fillQuota();
    await expect(subscribe(ADDRESS)).resolves.toEqual({ ok: false, throttled: true });
    mockClientIp(OTHER_TEST_IP);
    await expect(subscribe(ADDRESS)).resolves.toEqual({ ok: true });
    expect(fetchMock).toHaveBeenCalledTimes(NEWSLETTER_RATE_LIMIT_MAX_ATTEMPTS + 1);
  });

  it("never logs the client IP together with the subscriber address", async () => {
    const fetchMock = mockFetch(200);
    for (let i = 0; i < NEWSLETTER_RATE_LIMIT_MAX_ATTEMPTS + 1; i++) {
      await subscribe(ADDRESS);
    }
    expect(fetchMock).toHaveBeenCalledTimes(NEWSLETTER_RATE_LIMIT_MAX_ATTEMPTS);
    for (const line of loggedLines()) {
      expect(line).not.toContain(ADDRESS);
      expect(line).not.toContain("visitor");
      expect(line).not.toContain(TEST_IP);
      expect(line).not.toContain("203.0.113");
    }
  });

  it("refuses a submit without a solution and makes no listmonk request", async () => {
    const fetchMock = mockFetch(200);
    for (const missing of [undefined, null, ""]) {
      await expect(subscribeNewsletter(ADDRESS, missing)).resolves.toEqual({
        ok: false,
        verificationFailed: true,
      });
    }
    expect(fetchMock).not.toHaveBeenCalled();
    expect(loggedLines()[0]).toContain("verification failed");
  });

  it("refuses a tampered solution and makes no listmonk request", async () => {
    const fetchMock = mockFetch(200);
    const parsed = JSON.parse(
      Buffer.from(await freshPayload(), "base64").toString("utf8"),
    ) as { solution: { counter: number } };
    parsed.solution.counter += 1;
    const tampered = Buffer.from(JSON.stringify(parsed)).toString("base64");
    await expect(subscribeNewsletter(ADDRESS, tampered)).resolves.toEqual({
      ok: false,
      verificationFailed: true,
    });
    expect(fetchMock).not.toHaveBeenCalled();
    expect(loggedLines()[0]).toContain("verification failed");
  });

  it("refuses an expired solution and makes no listmonk request", async () => {
    const fetchMock = mockFetch(200);
    const expired = await freshPayload({ expiresAt: new Date(Date.now() - 60_000) });
    await expect(subscribeNewsletter(ADDRESS, expired)).resolves.toEqual({
      ok: false,
      verificationFailed: true,
    });
    expect(fetchMock).not.toHaveBeenCalled();
    expect(loggedLines()[0]).toContain("verification failed");
  });

  it("refuses a replayed solution: the second use makes no listmonk request", async () => {
    const fetchMock = mockFetch(200);
    const payload = await freshPayload();
    await expect(subscribeNewsletter(ADDRESS, payload)).resolves.toEqual({ ok: true });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    await expect(subscribeNewsletter(ADDRESS, payload)).resolves.toEqual({
      ok: false,
      verificationFailed: true,
    });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("does not count failed verifications against the per-IP throttle", async () => {
    const fetchMock = mockFetch(200);
    for (let i = 0; i < NEWSLETTER_RATE_LIMIT_MAX_ATTEMPTS; i++) {
      await expect(subscribeNewsletter(ADDRESS, null)).resolves.toEqual({
        ok: false,
        verificationFailed: true,
      });
    }
    await expect(subscribe(ADDRESS)).resolves.toEqual({ ok: true });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("refuses every submit while ALTCHA_HMAC_KEY is unset", async () => {
    delete process.env.ALTCHA_HMAC_KEY;
    const fetchMock = mockFetch(200);
    await expect(subscribeNewsletter(ADDRESS, "whatever")).resolves.toEqual({
      ok: false,
      verificationFailed: true,
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("never includes the subscriber address in verification log lines", async () => {
    mockFetch(200);
    await subscribeNewsletter(ADDRESS, null);
    await subscribeNewsletter(ADDRESS, "not-base64!!!");
    for (const line of loggedLines()) {
      expect(line).not.toContain(ADDRESS);
      expect(line).not.toContain("visitor");
    }
  });
});
