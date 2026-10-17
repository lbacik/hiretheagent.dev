import { buildChangeLogRows } from "@/lib/change-log";
import { getStableReleases } from "@/lib/releases";
import { ChangeLogFeed } from "./ChangeLogFeed";

// Server half of the Change log section: one flat feed of Changes across
// all of simple-coding-agent's Releases, directly below the newsletter form
// and above Active Projects. Renders nothing while there is no Release
// (the API answers `200 []` until the Release backfill runs).
export async function ChangeLog() {
  const releases = await getStableReleases();
  if (releases.length === 0) return null;

  return (
    <section id="changelog" className="mt-16 sm:mt-24 scroll-mt-28">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-3">
          <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-500">
            Change log
          </h2>
          <p className="text-xs text-slate-500 font-mono mt-0.5">
            What changed in each simple-coding-agent Release.
          </p>
        </div>
        <ChangeLogFeed rows={buildChangeLogRows(releases)} />
      </div>
    </section>
  );
}
