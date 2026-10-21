import { beforeEach, describe, expect, it } from "vitest";

import {
  consumeNewsletterRateLimit,
  NEWSLETTER_RATE_LIMIT_MAX_ATTEMPTS,
  NEWSLETTER_RATE_LIMIT_WINDOW_MS,
  NEWSLETTER_UNKNOWN_CLIENT_IP,
  resetNewsletterRateLimits,
  resolveNewsletterClientIp,
} from "./newsletter-rate-limit";

const IP = "203.0.113.7";
const OTHER_IP = "198.51.100.42";
const T0 = 1_000_000_000_000;

describe("resolveNewsletterClientIp", () => {
  it("returns the single forwarded address", () => {
    expect(resolveNewsletterClientIp("203.0.113.7")).toBe("203.0.113.7");
  });

  it("takes the rightmost entry of a forwarded chain, the one the proxy appended", () => {
    expect(resolveNewsletterClientIp("203.0.113.7, 70.41.3.18, 150.172.238.4")).toBe("150.172.238.4");
  });

  it("ignores a forged client-supplied entry to the left of the proxy address", () => {
    expect(resolveNewsletterClientIp("203.0.113.99, 198.51.100.42")).toBe("198.51.100.42");
  });

  it("trims whitespace and skips empty entries", () => {
    expect(resolveNewsletterClientIp("  203.0.113.7  , 70.41.3.18  , ")).toBe("70.41.3.18");
  });

  it.each([null, undefined, "", "   ", ","])("maps %j to the shared unknown bucket", (header) => {
    expect(resolveNewsletterClientIp(header)).toBe(NEWSLETTER_UNKNOWN_CLIENT_IP);
  });
});

describe("consumeNewsletterRateLimit", () => {
  beforeEach(() => {
    resetNewsletterRateLimits();
  });

  it(`allows the first ${NEWSLETTER_RATE_LIMIT_MAX_ATTEMPTS} attempts within the window`, () => {
    for (let i = 0; i < NEWSLETTER_RATE_LIMIT_MAX_ATTEMPTS; i++) {
      expect(consumeNewsletterRateLimit(IP, T0 + i * 1000)).toBe(true);
    }
  });

  it("refuses the (N+1)th attempt within the window", () => {
    for (let i = 0; i < NEWSLETTER_RATE_LIMIT_MAX_ATTEMPTS; i++) {
      consumeNewsletterRateLimit(IP, T0 + i * 1000);
    }
    expect(consumeNewsletterRateLimit(IP, T0 + NEWSLETTER_RATE_LIMIT_MAX_ATTEMPTS * 1000)).toBe(false);
  });

  it("keeps refusing while the hammering continues inside the window", () => {
    for (let i = 0; i < NEWSLETTER_RATE_LIMIT_MAX_ATTEMPTS + 3; i++) {
      consumeNewsletterRateLimit(IP, T0 + i * 1000);
    }
    expect(consumeNewsletterRateLimit(IP, T0 + (NEWSLETTER_RATE_LIMIT_MAX_ATTEMPTS + 3) * 1000)).toBe(false);
  });

  it("leaves a different IP unaffected", () => {
    for (let i = 0; i < NEWSLETTER_RATE_LIMIT_MAX_ATTEMPTS; i++) {
      consumeNewsletterRateLimit(IP, T0 + i);
    }
    expect(consumeNewsletterRateLimit(IP, T0 + 10_000)).toBe(false);
    expect(consumeNewsletterRateLimit(OTHER_IP, T0 + 10_000)).toBe(true);
  });

  it("slides: attempts older than an hour stop counting", () => {
    for (let i = 0; i < NEWSLETTER_RATE_LIMIT_MAX_ATTEMPTS; i++) {
      consumeNewsletterRateLimit(IP, T0 + i * 1000);
    }
    expect(consumeNewsletterRateLimit(IP, T0 + 60_000)).toBe(false);
    expect(consumeNewsletterRateLimit(IP, T0 + NEWSLETTER_RATE_LIMIT_WINDOW_MS + 1000)).toBe(true);
  });

  it("expires each attempt individually as the window slides past it", () => {
    consumeNewsletterRateLimit(IP, T0);
    consumeNewsletterRateLimit(IP, T0 + 1000);
    // The first attempt just fell out of the window; the second still counts.
    expect(consumeNewsletterRateLimit(IP, T0 + NEWSLETTER_RATE_LIMIT_WINDOW_MS + 1)).toBe(true);
  });
});
