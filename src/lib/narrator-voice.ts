/**
 * Voice selection for the workflow narrator (Web Speech API).
 *
 * Local (on-device) voices win over network ones: Chrome's remote "Google …"
 * voices stop after ~15 s of speech without firing `onend`, which would cut
 * the narration and stall the simulation.
 */

export type NarratorVoiceCandidate = Pick<
  SpeechSynthesisVoice,
  "name" | "lang" | "localService"
>;

/** Well-sounding English voices, best first (matched as name substrings). */
const PREFERRED_VOICE_NAMES = ["Samantha", "Daniel", "Alex", "Natural", "Google"];

function isEnglish(voice: NarratorVoiceCandidate): boolean {
  return voice.lang.toLowerCase().startsWith("en");
}

function rank(voice: NarratorVoiceCandidate): number {
  const nameIdx = PREFERRED_VOICE_NAMES.findIndex((n) => voice.name.includes(n));
  const nameRank = nameIdx === -1 ? PREFERRED_VOICE_NAMES.length : nameIdx;
  const localityRank = voice.localService ? 0 : 1;
  const usRank = voice.lang.replace("_", "-").toLowerCase() === "en-us" ? 0 : 1;
  // Locality dominates, then the name preference, then en-US over other English.
  return localityRank * 100 + nameRank * 2 + usRank;
}

/** Picks the best English narrator voice, or `null` when none is available. */
export function pickNarratorVoice<T extends NarratorVoiceCandidate>(
  voices: readonly T[]
): T | null {
  let best: T | null = null;
  let bestRank = Infinity;
  for (const voice of voices) {
    if (!isEnglish(voice)) continue;
    const r = rank(voice);
    if (r < bestRank) {
      best = voice;
      bestRank = r;
    }
  }
  return best;
}

/**
 * Upper bound for how long one narration may run before we assume the speech
 * engine hung (no `onend`/`onerror`, e.g. a broken audio output) and move on.
 */
export function narrationWatchdogMs(estimatedSpeechMs: number): number {
  return Math.round(estimatedSpeechMs * 1.6) + 4000;
}
