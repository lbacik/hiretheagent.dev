import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { GET } from "./route";
import { isAltchaConfigured } from "../../../../lib/altcha";

const HMAC_KEY = "test-hmac-key-at-least-16-chars";

describe("GET /api/altcha/challenge", () => {
  beforeEach(() => {
    process.env.ALTCHA_HMAC_KEY = HMAC_KEY;
  });

  afterEach(() => {
    delete process.env.ALTCHA_HMAC_KEY;
  });

  it("issues a signed challenge with no-store caching when configured", async () => {
    expect(isAltchaConfigured()).toBe(true);
    const response = await GET();
    expect(response.status).toBe(200);
    expect(response.headers.get("Cache-Control")).toContain("no-store");
    const body = (await response.json()) as {
      parameters?: Record<string, unknown>;
      signature?: string;
    };
    expect(body.parameters?.algorithm).toBe("SHA-256");
    expect(typeof body.signature).toBe("string");
  });

  it("returns 503 while ALTCHA_HMAC_KEY is unset", async () => {
    delete process.env.ALTCHA_HMAC_KEY;
    expect(isAltchaConfigured()).toBe(false);
    const response = await GET();
    expect(response.status).toBe(503);
  });
});
