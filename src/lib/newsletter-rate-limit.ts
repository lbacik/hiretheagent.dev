// Sliding-window per-IP throttle for Newsletter sign-ups.
//
// NOTE: the attempt timestamps live in module memory. That is acceptable
// only because the page runs as a single container (see compose.prod.yaml:
// one `web` replica behind nginx-proxy). A second replica would keep its
// own counters and the limit would apply per container, not globally —
// scaling past one replica needs a shared store (Redis, database) instead.

export const NEWSLETTER_RATE_LIMIT_MAX_ATTEMPTS = 5;

export const NEWSLETTER_RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;

export const NEWSLETTER_UNKNOWN_CLIENT_IP = "unknown";

const attemptsByIp = new Map<string, number[]>();

/**
 * Cap for the number of tracked IPs. Past it, fully-expired entries are
 * swept so one long-lived container cannot grow the map without bound.
 */
const MAX_TRACKED_IPS = 1000;

/**
 * Resolves the client IP from the forwarding header set by the reverse
 * proxy in front of the container (nginx-proxy). Only `X-Forwarded-For`
 * is read — no other client-supplied header is trusted. The proxy
 * appends the peer address to the right (`$proxy_add_x_forwarded_for`),
 * so the rightmost entry is the one the proxy itself added; entries to
 * its left are client-supplied and untrusted (a script rotating a forged
 * leftmost entry must not evade the limit). A missing or empty header
 * maps to a shared "unknown" bucket so a request without the header is
 * still throttled, never unlimited.
 */
export function resolveNewsletterClientIp(forwardedFor: string | null | undefined): string {
  const entries = (forwardedFor ?? "")
    .split(",")
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0);
  return entries.length > 0 ? entries[entries.length - 1] : NEWSLETTER_UNKNOWN_CLIENT_IP;
}

/**
 * Consumes one sign-up attempt for `clientIp` and reports whether it is
 * still within the limit. Every call records its timestamp — including
 * throttled ones, so hammering keeps the visitor blocked while the
 * window slides — and timestamps older than the window stop counting.
 * The `now` parameter exists so tests can control time without sleeps.
 */
export function consumeNewsletterRateLimit(clientIp: string, now: number = Date.now()): boolean {
  const windowStart = now - NEWSLETTER_RATE_LIMIT_WINDOW_MS;
  const recent = (attemptsByIp.get(clientIp) ?? []).filter((timestamp) => timestamp > windowStart);
  recent.push(now);
  attemptsByIp.set(clientIp, recent);
  if (attemptsByIp.size > MAX_TRACKED_IPS) {
    for (const [ip, timestamps] of attemptsByIp) {
      if (ip !== clientIp && !timestamps.some((timestamp) => timestamp > windowStart)) {
        attemptsByIp.delete(ip);
      }
    }
  }
  return recent.length <= NEWSLETTER_RATE_LIMIT_MAX_ATTEMPTS;
}

/** Clears all recorded attempts. Test-only hook. */
export function resetNewsletterRateLimits(): void {
  attemptsByIp.clear();
}
