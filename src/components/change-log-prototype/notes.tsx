"use client";

// PROTOTYPE (issue #10): shared helpers for the Change log variants.
// - stable filter + semver order (published_at is identical for backfilled Releases)
// - date = created_at (the tag commit's date), not published_at
// - two ways to render a Release body, switchable via `?render=parsed|markdown`:
//   "parsed": a ~40-line custom parser for the generated-notes shape
//   "markdown": react-markdown on the raw body, no plugins

import Markdown from "react-markdown";
import { useSearchParams } from "next/navigation";
import { releasesPayload, type GitHubRelease } from "./releases";

export type Entry = { title: string; pr: number; url: string };
export type Category = { title: string; entries: Entry[] };
export type Release = GitHubRelease & {
  categories: Category[];
  compareUrl?: string;
  newContributors: string[];
  recognized: boolean;
  changeCount: number;
};

const semver = (tag: string) => tag.replace(/^v/, "").split(/[.-]/).map((p) => Number(p) || 0);
const bySemverDesc = (a: GitHubRelease, b: GitHubRelease) => {
  const [x, y] = [semver(a.tag_name), semver(b.tag_name)];
  for (let i = 0; i < Math.max(x.length, y.length); i++) if ((x[i] ?? 0) !== (y[i] ?? 0)) return (y[i] ?? 0) - (x[i] ?? 0);
  return 0;
};

// Parses: "### <Category>" headings, "* <title> by @<login> in <pr url>" lines,
// "## New Contributors" lines and the "**Full Changelog**: <url>" line. Any other non-empty line
// means the body is not in the generated shape: `recognized` is false and the body is shown as
// plain text instead (decided in issue #10).
export function parseNotes(body: string) {
  const categories: Category[] = [];
  const newContributors: string[] = [];
  let compareUrl: string | undefined;
  let recognized = true;
  let section: "changes" | "contributors" | null = null;
  for (const line of body.split("\n")) {
    if (line.trim() === "") continue;
    if (line.startsWith("## What's Changed")) section = "changes";
    else if (line.startsWith("## New Contributors")) section = "contributors";
    else if (line.startsWith("### ") && section === "changes") categories.push({ title: line.slice(4), entries: [] });
    else if (line.startsWith("**Full Changelog**: ")) compareUrl = line.slice(20).trim();
    else if (line.startsWith("* ") && section === "contributors") newContributors.push(line.slice(2));
    else if (line.startsWith("* ") && section === "changes") {
      const m = line.match(/^\* (.+) by @\S+ in (\S+\/pull\/(\d+))$/);
      if (m && categories.length) categories.at(-1)!.entries.push({ title: m[1], url: m[2], pr: Number(m[3]) });
      else recognized = false;
    } else recognized = false;
  }
  return { categories, newContributors, compareUrl, recognized };
}

export const releases: Release[] = releasesPayload
  .filter((r) => !r.draft && !r.prerelease)
  .sort(bySemverDesc)
  .map((r) => {
    const parsed = parseNotes(r.body);
    return { ...r, ...parsed, changeCount: parsed.categories.reduce((n, c) => n + c.entries.length, 0) };
  });

export const allReleasesUrl = "https://github.com/lbacik/simple-coding-agent/releases";

export const releaseDate = (r: Release) =>
  new Date(r.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });

export function useRenderMode() {
  return useSearchParams().get("render") === "markdown" ? "markdown" : "parsed";
}

// Renders one Release's notes in the mode chosen by `?render=`.
export function Notes({ release, compact = false }: { release: Release; compact?: boolean }) {
  const mode = useRenderMode();

  if (mode === "markdown") {
    return (
      <div className="prototype-md text-left text-sm text-slate-700 [&_h2]:font-bold [&_h2]:text-base [&_h2]:mt-3 [&_h3]:font-semibold [&_h3]:mt-2 [&_ul]:list-disc [&_ul]:pl-5 [&_a]:text-blue-600 [&_a]:underline [&_p]:mt-2 break-words">
        <Markdown>{release.body}</Markdown>
      </div>
    );
  }

  if (release.changeCount === 0) {
    return <p className="text-left text-sm text-slate-500 italic">Maintenance release, no user-facing changes.</p>;
  }

  return (
    <div className="text-left space-y-3">
      {release.categories.map((c) => (
        <div key={c.title}>
          <h5 className="text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-500 mb-1">{c.title}</h5>
          <ul className="space-y-1 text-sm text-slate-700">
            {c.entries.slice(0, compact ? 3 : undefined).map((e) => (
              <li key={e.pr} className="flex gap-2">
                <span className="text-slate-400">–</span>
                <span>
                  {e.title}{" "}
                  <a href={e.url} target="_blank" rel="noopener noreferrer" className="font-mono text-xs text-slate-400 hover:text-blue-600">
                    #{e.pr}
                  </a>
                </span>
              </li>
            ))}
            {compact && c.entries.length > 3 && (
              <li className="text-xs font-mono text-slate-400 pl-4">+{c.entries.length - 3} more</li>
            )}
          </ul>
        </div>
      ))}
    </div>
  );
}
