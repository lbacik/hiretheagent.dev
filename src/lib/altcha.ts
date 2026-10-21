// Server-only ALTCHA proof-of-work for the Newsletter sign-up.
//
// The page issues its own ALTCHA challenges and verifies the visitor's
// solution locally — no cookies, no external script or service, so the
// page keeps sending no visitor data to third parties (unlike the
// reCAPTCHA the `paysubscriptions` reference uses).
//
// Never import this module (or `process.env.ALTCHA_HMAC_KEY`) from a
// client component: the HMAC key that signs challenges must stay on the
// server. The only client-reachable pieces are the challenge route
// (`/api/altcha/challenge`, served from our bundle via the `altcha`
// widget package) and the `subscribeNewsletter` Server Action, which
// takes the widget's payload string and verifies it here before the
// per-IP throttle counts the attempt and before listmonk is called.
//
// A solved challenge redeems only once while it is valid: redeemed
// nonces live in module memory and are pruned once their challenge has
// expired. That is acceptable only because the page runs as a single
// container (see compose.prod.yaml: one `web` replica behind
// nginx-proxy) — the same assumption as the per-IP throttle.

import { createChallenge, verifySolution, type Challenge } from "altcha-lib";
import { deriveKey } from "altcha-lib/algorithms/sha";

/** How long an issued challenge stays valid, in seconds (minutes, per spec). */
export const ALTCHA_CHALLENGE_TTL_S = 5 * 60;

/** Key-derivation algorithm for challenges; the widget solves it in-browser. */
export const ALTCHA_ALGORITHM = "SHA-256";

/**
 * Per-attempt hashing cost. The browser tries ~256 counters on average
 * for the default `00` key prefix, so this keeps a solve comfortably
 * under a second while verification stays a single derivation.
 */
export const ALTCHA_COST = 200;

const REDEEMED_TTL_MS = ALTCHA_CHALLENGE_TTL_S * 1000;

/** Nonce → challenge expiry timestamp (ms). Pruned once the challenge has expired. */
const redeemedNonces = new Map<string, number>();

function readHmacKey(env: Record<string, string | undefined>): string | null {
  const key = env.ALTCHA_HMAC_KEY?.trim();
  return key ? key : null;
}

export function isAltchaConfigured(env: Record<string, string | undefined> = process.env): boolean {
  return readHmacKey(env) !== null;
}

/**
 * Issues a fresh signed challenge for the widget to solve. Throws when
 * `ALTCHA_HMAC_KEY` is unset — callers must keep the form in its
 * "Coming soon" state instead (see `isAltchaConfigured`). The
 * `overrides` parameter exists so tests can mint cheap or expired
 * challenges without waiting.
 */
export async function createNewsletterChallenge(
  env: Record<string, string | undefined> = process.env,
  overrides: { expiresAt?: number | Date; cost?: number } = {},
): Promise<Challenge> {
  const hmacSignatureSecret = readHmacKey(env);
  if (!hmacSignatureSecret) {
    throw new Error("newsletter altcha challenge requested without ALTCHA_HMAC_KEY");
  }
  return createChallenge({
    algorithm: ALTCHA_ALGORITHM,
    cost: overrides.cost ?? ALTCHA_COST,
    deriveKey,
    hmacSignatureSecret,
    expiresAt: overrides.expiresAt ?? new Date(Date.now() + REDEEMED_TTL_MS),
  });
}

type WidgetPayload = {
  challenge: Pick<Challenge, "parameters" | "signature">;
  solution: { counter: number; derivedKey: string };
};

function parseWidgetPayload(payload: string): WidgetPayload | null {
  let decoded: unknown;
  try {
    decoded = JSON.parse(Buffer.from(payload, "base64").toString("utf8"));
  } catch {
    return null;
  }
  if (typeof decoded !== "object" || decoded === null) return null;
  const { challenge, solution } = decoded as Record<string, unknown>;
  if (typeof challenge !== "object" || challenge === null) return null;
  if (typeof solution !== "object" || solution === null) return null;
  const { parameters, signature } = challenge as Record<string, unknown>;
  const { counter, derivedKey } = solution as Record<string, unknown>;
  if (typeof parameters !== "object" || parameters === null) return null;
  if (typeof signature !== "string") return null;
  if (typeof counter !== "number" || !Number.isInteger(counter)) return null;
  if (typeof derivedKey !== "string") return null;
  return {
    challenge: { parameters: parameters as Challenge["parameters"], signature },
    solution: { counter, derivedKey },
  };
}

function pruneRedeemedNonces(now: number): void {
  for (const [nonce, expiresAtMs] of redeemedNonces) {
    if (now > expiresAtMs) {
      redeemedNonces.delete(nonce);
    }
  }
}

function challengeExpiresAtMs(parameters: Challenge["parameters"], now: number): number {
  const expiresAt = parameters.expiresAt;
  if (typeof expiresAt === "number" && Number.isFinite(expiresAt)) {
    return expiresAt * 1000;
  }
  return now + REDEEMED_TTL_MS;
}

/**
 * Verifies the widget's payload: signature, expiry and proof-of-work via
 * `verifySolution`, then single-use redemption of the challenge nonce.
 * Returns false for a missing, malformed, tampered, expired or already
 * redeemed payload — and fail-closed when `ALTCHA_HMAC_KEY` is unset.
 * Never logs and never throws: the caller owns the outcome log line.
 */
export async function verifyNewsletterChallenge(
  payload: string | null | undefined,
  env: Record<string, string | undefined> = process.env,
): Promise<boolean> {
  const hmacSignatureSecret = readHmacKey(env);
  if (!hmacSignatureSecret || !payload) return false;
  const parsed = parseWidgetPayload(payload);
  if (!parsed) return false;
  const now = Date.now();
  pruneRedeemedNonces(now);
  const nonce = parsed.challenge.parameters.nonce;
  if (typeof nonce !== "string" || redeemedNonces.has(nonce)) return false;
  let verified = false;
  try {
    const result = await verifySolution({
      challenge: parsed.challenge,
      solution: parsed.solution,
      deriveKey,
      hmacSignatureSecret,
    });
    verified = result.verified;
  } catch {
    verified = false;
  }
  // Record the nonce only after verification, so unverified payloads
  // cannot write to the store — and check-then-set is safe here because
  // the whole check runs synchronously between awaits. The stored value
  // is the challenge's own expiry, so entries prune literally at expiry.
  if (verified) {
    if (redeemedNonces.has(nonce)) return false;
    redeemedNonces.set(nonce, challengeExpiresAtMs(parsed.challenge.parameters, now));
  }
  return verified;
}

/** Clears all redeemed challenge nonces. Test-only hook. */
export function resetRedeemedNewsletterChallenges(): void {
  redeemedNonces.clear();
}
