import {
  formatReleaseDate,
  getCurrentRelease,
  getStableReleases,
  isFreshRelease,
} from "@/lib/releases";
import { parseReleaseNotes } from "@/lib/release-notes";
import { VersionBar } from "./VersionBar";

// Thin sticky bar below the Header showing simple-coding-agent's Current
// Release. The Current Release is resolved on the server; the toggle state
// lives in the client VersionBar. Renders nothing while there is no Release
// (the API answers `200 []` until the Release backfill runs).
export async function AnnouncementBar() {
  const current = getCurrentRelease(await getStableReleases());
  if (!current) return null;

  return (
    <VersionBar
      release={{
        name: current.name,
        date: formatReleaseDate(current.createdAt),
        fresh: isFreshRelease(current, new Date()),
        notes: parseReleaseNotes(current.body),
        htmlUrl: current.htmlUrl,
      }}
    />
  );
}
