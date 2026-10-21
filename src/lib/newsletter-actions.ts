"use server";

import { isValidNewsletterEmail, newsletterConfig, subscribeToListmonk } from "./listmonk";

export type NewsletterResult = { ok: boolean };

/**
 * Server Action behind the Newsletter form. Calls listmonk synchronously
 * (this page has no queue, worker or database) and reports back a bare
 * ok flag: the visitor sees one success state and one generic failure
 * state, never listmonk details.
 *
 * Log lines carry only the outcome class, never the subscriber address.
 */
export async function subscribeNewsletter(email: string): Promise<NewsletterResult> {
  const config = newsletterConfig();
  if (!config) {
    console.error("newsletter subscribe skipped: listmonk not configured");
    return { ok: false };
  }
  if (!isValidNewsletterEmail(email)) {
    console.error("newsletter subscribe rejected: invalid email shape");
    return { ok: false };
  }
  const outcome = await subscribeToListmonk(config, email);
  switch (outcome) {
    case "subscribed":
    case "already-subscribed":
      // 409 (duplicate) is success: the existing subscriber stays untouched
      // and the form reveals nothing about prior membership.
      return { ok: true };
    case "credentials-error":
      console.error("newsletter subscribe failed: listmonk credentials rejected (401/403)");
      return { ok: false };
    case "transient-failure":
      console.error("newsletter subscribe failed: transient listmonk failure (429/5xx/network/timeout)");
      return { ok: false };
    case "rejected":
      console.error("newsletter subscribe failed: listmonk rejected the request (4xx)");
      return { ok: false };
    case "invalid-email":
      console.error("newsletter subscribe rejected: invalid email shape");
      return { ok: false };
  }
}
