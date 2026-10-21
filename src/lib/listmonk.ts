// Server-only listmonk client for the Newsletter sign-up.
//
// Never import this module (or `process.env.LISTMONK_*`) from a client
// component: the API user and token must stay on the server. The only
// client-reachable entry point is the `subscribeNewsletter` Server Action in
// `./newsletter-actions`, which returns a bare ok flag.
//
// Reference behaviour: paysubscriptions `MailingSubscribeHandler` and its
// ADR 0006 — synchronous here (this page has no queue, worker or database),
// with listmonk owning double opt-in from the subscribe call on.

export type ListmonkConfig = {
  baseUrl: string;
  apiUser: string;
  apiToken: string;
  listId: number;
};

export type SubscribeOutcome =
  | "subscribed"
  | "already-subscribed"
  | "credentials-error"
  | "transient-failure"
  | "rejected"
  | "invalid-email";

export const NEWSLETTER_FETCH_TIMEOUT_MS = 10_000;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function readEnv(source: Record<string, string | undefined> = process.env): ListmonkConfig | null {
  const baseUrl = source.LISTMONK_URL?.trim().replace(/\/+$/, "");
  const apiUser = source.LISTMONK_API_USER?.trim();
  const apiToken = source.LISTMONK_API_TOKEN?.trim();
  const listId = Number(source.LISTMONK_LIST_ID?.trim());
  if (!baseUrl || !apiUser || !apiToken || !Number.isInteger(listId) || listId <= 0) {
    return null;
  }
  return { baseUrl, apiUser, apiToken, listId };
}

/**
 * Reads the listmonk connection from server-side env. Returns null unless
 * all four `LISTMONK_*` vars are set (and the list id is a positive
 * integer), so local dev, CI and unconfigured deploys render the Newsletter
 * form in its disabled "Coming soon" state — mirroring how the Umami
 * tracker is skipped when unconfigured.
 */
export function newsletterConfig(env: Record<string, string | undefined> = process.env): ListmonkConfig | null {
  return readEnv(env);
}

export function isNewsletterConfigured(env: Record<string, string | undefined> = process.env): boolean {
  return readEnv(env) !== null;
}

export function isValidNewsletterEmail(email: string): boolean {
  return EMAIL_PATTERN.test(email.trim());
}

function classifyStatus(status: number): SubscribeOutcome {
  if (status >= 200 && status < 300) return "subscribed";
  if (status === 409) return "already-subscribed";
  if (status === 401 || status === 403) return "credentials-error";
  if (status === 429 || status >= 500) return "transient-failure";
  return "rejected";
}

/**
 * Subscribes one address to the configured listmonk list with
 * `status: "enabled"` and leaves listmonk to own double opt-in (it sends
 * the confirmation email; the address counts as subscribed only after the
 * visitor clicks the link).
 *
 * A 409 (duplicate email) is reported as `already-subscribed` so the caller
 * can treat it as success without touching the existing subscriber — the
 * form must not reveal whether an address was already on the list.
 *
 * This function never logs (in particular never the address); logging is the
 * caller's job and must record only the outcome/status class.
 */
export async function subscribeToListmonk(
  config: ListmonkConfig,
  email: string,
  fetchImpl: typeof fetch = fetch,
  timeoutMs: number = NEWSLETTER_FETCH_TIMEOUT_MS,
): Promise<SubscribeOutcome> {
  const address = email.trim();
  if (!isValidNewsletterEmail(address)) {
    return "invalid-email";
  }
  let response: Response;
  try {
    response = await fetchImpl(`${config.baseUrl}/api/subscribers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `token ${config.apiUser}:${config.apiToken}`,
      },
      body: JSON.stringify({ email: address, status: "enabled", lists: [config.listId] }),
      signal: AbortSignal.timeout(timeoutMs),
    });
  } catch {
    return "transient-failure";
  }
  return classifyStatus(response.status);
}
