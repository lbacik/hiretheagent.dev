import { createNewsletterChallenge, isAltchaConfigured } from "@/lib/altcha";

// Each challenge carries a fresh random nonce and a short expiry, so this
// route must never be cached: a shared challenge would redeem once and
// every later visitor presenting it would fail the single-use check.
export const dynamic = "force-dynamic";

/**
 * Issues a fresh signed ALTCHA challenge for the Newsletter widget.
 * Same origin, no cookies, no third party — the widget fetches this URL
 * and solves the proof-of-work in the visitor's browser. Returns 503
 * while `ALTCHA_HMAC_KEY` is unset (the form stays "Coming soon" then).
 */
export async function GET(): Promise<Response> {
  if (!isAltchaConfigured()) {
    return Response.json({ error: "Newsletter verification is not configured." }, { status: 503 });
  }
  const challenge = await createNewsletterChallenge();
  return Response.json(challenge, { headers: { "Cache-Control": "no-store" } });
}
