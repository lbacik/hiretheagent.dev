export type UmamiTracker = {
  scriptUrl: string;
  websiteId: string;
  domains: string;
};

// Umami ignores hits from other hosts, so even a configured local run stays
// out of the stats.
const UMAMI_DOMAINS = "hiretheagent.dev";

// Read at request time from the container env. Returns null unless both
// values are set, so local dev, CI and unconfigured deploys emit no tracker.
export function umamiTracker(): UmamiTracker | null {
  const scriptUrl = process.env.UMAMI_SCRIPT_URL?.trim();
  const websiteId = process.env.UMAMI_WEBSITE_ID?.trim();
  if (!scriptUrl || !websiteId) {
    return null;
  }
  return { scriptUrl, websiteId, domains: UMAMI_DOMAINS };
}
