import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { solveChallenge } from "altcha-lib";
import { deriveKey } from "altcha-lib/algorithms/sha";

import {
  ALTCHA_CHALLENGE_TTL_S,
  createNewsletterChallenge,
  isAltchaConfigured,
  resetRedeemedNewsletterChallenges,
  verifyNewsletterChallenge,
} from "./altcha";

const HMAC_KEY = "test-hmac-key-at-least-16-chars";
const OTHER_HMAC_KEY = "another-test-hmac-key-16-chars";

function envWith(key: string | undefined): Record<string, string | undefined> {
  return key === undefined ? {} : { ALTCHA_HMAC_KEY: key };
}

/** Creates a challenge and solves it, returning the widget-style payload string. */
async function solvedPayload(
  env: Record<string, string | undefined> = envWith(HMAC_KEY),
  overrides: { expiresAt?: number | Date; cost?: number } = { cost: 1 },
): Promise<string> {
  const challenge = await createNewsletterChallenge(env, overrides);
  const solution = await solveChallenge({ challenge, deriveKey });
  if (!solution) throw new Error("test setup: challenge unsolved");
  return Buffer.from(
    JSON.stringify({
      challenge: { parameters: challenge.parameters, signature: challenge.signature },
      solution,
    }),
  ).toString("base64");
}

type MutablePayload = {
  challenge: { parameters: { salt: string }; signature: string };
  solution: { counter: number };
};

function tamperPayload(payload: string, mutate: (parsed: MutablePayload) => void): string {
  const parsed = JSON.parse(Buffer.from(payload, "base64").toString("utf8"));
  mutate(parsed);
  return Buffer.from(JSON.stringify(parsed)).toString("base64");
}

describe("isAltchaConfigured", () => {
  it("returns true when ALTCHA_HMAC_KEY is set", () => {
    expect(isAltchaConfigured(envWith(HMAC_KEY))).toBe(true);
  });

  it.each([undefined, "", "   "])("returns false when the key is %s", (key) => {
    expect(isAltchaConfigured(envWith(key as string | undefined))).toBe(false);
  });
});

describe("verifyNewsletterChallenge", () => {
  beforeEach(() => {
    resetRedeemedNewsletterChallenges();
  });

  afterEach(() => {
    resetRedeemedNewsletterChallenges();
  });

  it("accepts a freshly solved challenge", async () => {
    const payload = await solvedPayload();
    await expect(verifyNewsletterChallenge(payload, envWith(HMAC_KEY))).resolves.toBe(true);
  });

  it("rejects a missing, empty or malformed payload", async () => {
    await expect(verifyNewsletterChallenge(null, envWith(HMAC_KEY))).resolves.toBe(false);
    await expect(verifyNewsletterChallenge(undefined, envWith(HMAC_KEY))).resolves.toBe(false);
    await expect(verifyNewsletterChallenge("", envWith(HMAC_KEY))).resolves.toBe(false);
    await expect(verifyNewsletterChallenge("not-base64!!!", envWith(HMAC_KEY))).resolves.toBe(false);
    const notJson = Buffer.from("just a string").toString("base64");
    await expect(verifyNewsletterChallenge(notJson, envWith(HMAC_KEY))).resolves.toBe(false);
  });

  it("rejects a tampered solution", async () => {
    const payload = await solvedPayload();
    const tampered = tamperPayload(payload, (parsed) => {
      parsed.solution.counter += 1;
    });
    await expect(verifyNewsletterChallenge(tampered, envWith(HMAC_KEY))).resolves.toBe(false);
  });

  it("rejects tampered challenge parameters", async () => {
    const payload = await solvedPayload();
    const tampered = tamperPayload(payload, (parsed) => {
      parsed.challenge.parameters.salt = "00".repeat(16);
    });
    await expect(verifyNewsletterChallenge(tampered, envWith(HMAC_KEY))).resolves.toBe(false);
  });

  it("rejects a forged signature", async () => {
    const payload = await solvedPayload();
    const tampered = tamperPayload(payload, (parsed) => {
      parsed.challenge.signature = "00".repeat(32);
    });
    await expect(verifyNewsletterChallenge(tampered, envWith(HMAC_KEY))).resolves.toBe(false);
  });

  it("rejects a payload signed with a different key", async () => {
    const payload = await solvedPayload(envWith(OTHER_HMAC_KEY));
    await expect(verifyNewsletterChallenge(payload, envWith(HMAC_KEY))).resolves.toBe(false);
  });

  it("rejects an expired challenge", async () => {
    const payload = await solvedPayload(envWith(HMAC_KEY), {
      cost: 1,
      expiresAt: new Date(Date.now() - 60_000),
    });
    await expect(verifyNewsletterChallenge(payload, envWith(HMAC_KEY))).resolves.toBe(false);
  });

  it("rejects a replayed payload: each solved challenge redeems only once", async () => {
    const payload = await solvedPayload();
    await expect(verifyNewsletterChallenge(payload, envWith(HMAC_KEY))).resolves.toBe(true);
    await expect(verifyNewsletterChallenge(payload, envWith(HMAC_KEY))).resolves.toBe(false);
    // A third attempt stays rejected.
    await expect(verifyNewsletterChallenge(payload, envWith(HMAC_KEY))).resolves.toBe(false);
  });

  it("accepts two distinct solutions independently", async () => {
    const first = await solvedPayload();
    const second = await solvedPayload();
    await expect(verifyNewsletterChallenge(first, envWith(HMAC_KEY))).resolves.toBe(true);
    await expect(verifyNewsletterChallenge(second, envWith(HMAC_KEY))).resolves.toBe(true);
  });

  it("rejects everything when ALTCHA_HMAC_KEY is unset", async () => {
    const payload = await solvedPayload();
    await expect(verifyNewsletterChallenge(payload, envWith(undefined))).resolves.toBe(false);
  });

  it(`creates challenges expiring in about ${ALTCHA_CHALLENGE_TTL_S}s`, async () => {
    const before = Math.floor(Date.now() / 1000);
    const challenge = await createNewsletterChallenge(envWith(HMAC_KEY));
    const after = Math.floor(Date.now() / 1000);
    expect(challenge.parameters.expiresAt).toBeDefined();
    expect(challenge.parameters.expiresAt as number).toBeGreaterThanOrEqual(
      before + ALTCHA_CHALLENGE_TTL_S,
    );
    expect(challenge.parameters.expiresAt as number).toBeLessThanOrEqual(
      after + ALTCHA_CHALLENGE_TTL_S,
    );
  });

  it("refuses to create a challenge without ALTCHA_HMAC_KEY", async () => {
    await expect(createNewsletterChallenge(envWith(undefined))).rejects.toThrow();
  });
});
