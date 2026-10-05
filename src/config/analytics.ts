// Both values are public (Umami tracker URL and website ID), so hardcoding is fine.
export const analytics = {
  scriptUrl: "https://umami.rum.luka.sh/script.js",
  websiteId: "601d337e-2e86-4190-9b9c-08bb5d5589d4",
  // Umami ignores hits from other hosts, keeping local runs out of the stats.
  domains: "hiretheagent.dev",
} as const;
