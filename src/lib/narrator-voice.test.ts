import { describe, expect, it } from "vitest";
import { narrationWatchdogMs, pickNarratorVoice } from "./narrator-voice";

const voice = (name: string, lang: string, localService: boolean) => ({
  name,
  lang,
  localService,
});

describe("pickNarratorVoice", () => {
  it("returns null when there are no English voices", () => {
    expect(pickNarratorVoice([])).toBeNull();
    expect(pickNarratorVoice([voice("Zosia", "pl-PL", true)])).toBeNull();
  });

  it("prefers a local voice over a remote Google voice", () => {
    const picked = pickNarratorVoice([
      voice("Google US English", "en-US", false),
      voice("Fred", "en-US", true),
    ]);
    expect(picked?.name).toBe("Fred");
  });

  it("prefers a well-known local voice over another local one", () => {
    const picked = pickNarratorVoice([
      voice("Fred", "en-US", true),
      voice("Daniel", "en-GB", true),
      voice("Samantha", "en-US", true),
    ]);
    expect(picked?.name).toBe("Samantha");
  });

  it("prefers en-US among otherwise equal voices", () => {
    const picked = pickNarratorVoice([
      voice("Karen", "en-AU", true),
      voice("Fred", "en-US", true),
    ]);
    expect(picked?.name).toBe("Fred");
  });

  it("falls back to a remote English voice when nothing local exists", () => {
    const picked = pickNarratorVoice([
      voice("Zosia", "pl-PL", true),
      voice("Google UK English Male", "en-GB", false),
    ]);
    expect(picked?.name).toBe("Google UK English Male");
  });
});

describe("narrationWatchdogMs", () => {
  it("leaves generous headroom over the speech estimate", () => {
    expect(narrationWatchdogMs(10_000)).toBeGreaterThan(10_000 * 1.5);
  });
});
