"use server";

import { headers } from "next/headers";

import { isValidNewsletterEmail, newsletterConfig, subscribeToListmonk } from "./listmonk";
import { verifyNewsletterChallenge } from "./altcha";
import {
  consumeNewsletterRateLimit,
  resolveNewsletterClientIp,
} from "./newsletter-rate-limit";

export type NewsletterResult = { ok: boolean; throttled?: boolean; verificationFailed?: boolean };

/**
 * Server Action behind the Newsletter form. Calls listmonk synchronously
 * (this page has no queue, worker or database) and reports back a bare
 * ok flag: the visitor sees one success state and one generic failure
 * state, never listmonk details. A throttled visitor additionally gets
 * the `throttled` flag for the distinct "too many attempts" message, and
 * a visitor whose bot check fails gets `verificationFailed` for the
 * distinct "verification failed, please try again" message.
 *
 * The ALTCHA proof-of-work is verified first, before the per-IP throttle
 * counts the attempt and before listmonk is called — a missing, tampered,
 * expired or already-redeemed solution never reaches either. Sign-ups are
 * then throttled per source IP (sliding one-hour window) before any other
 * work, so a refused sign-up never reaches listmonk.
 *
 * Log lines carry only the outcome class, never the subscriber address
 * and never the client IP.
 */
/**
 * Reads the client IP from the forwarding header set by the reverse proxy
 * (nginx-proxy). Falls back to the shared "unknown" bucket when the header
 * is absent, so such requests are still throttled, never unlimited.
 */
async function newsletterClientIp(): Promise<string> {
  try {
    return resolveNewsletterClientIp((await headers()).get("x-forwarded-for"));
  } catch {
    return resolveNewsletterClientIp(null);
  }
}

export async function subscribeNewsletter(
  email: string,
  altchaPayload?: string | null,
): Promise<NewsletterResult> {
  // Bot check first, before the throttle counts the attempt and before
  // listmonk is called — a missing, tampered, expired or already-redeemed
  // solution never reaches either. The log line carries neither the
  // address nor the payload.
  if (!(await verifyNewsletterChallenge(altchaPayload))) {
    console.error("newsletter subscribe rejected: verification failed, please try again");
    return { ok: false, verificationFailed: true };
  }
  // Throttle next, before any other work — a refused sign-up must never
  // reach listmonk, or the form becomes a spam cannon. The log line carries
  // neither the address nor the IP.
  if (!consumeNewsletterRateLimit(await newsletterClientIp())) {
    console.error("newsletter subscribe throttled: too many attempts, please try again later");
    return { ok: false, throttled: true };
  }
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
