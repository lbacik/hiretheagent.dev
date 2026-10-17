// Server-side parser for Release notes. No Markdown dependency.
//
// It recognises GitHub's generated-notes shape:
// - `## What's Changed`;
// - `### <Category>` (the agent repo uses `Features`, `Fixes`, `Other changes`);
// - `* <title> by @<login> in <PR url>`;
// - `## New Contributors` and its lines;
// - `**Full Changelog**: <url>`.
// Blank lines and single-line HTML comments are ignored (GitHub prepends
// `<!-- Release notes generated using configuration in .github/release.yml
// ... -->` when the repo configures its notes).
//
// Output: categories with their Changes (title, PR number, PR URL), with
// `by @<login>` dropped. "New Contributors" and "Full Changelog" are parsed
// but never output. If any non-empty line falls outside that shape, the result
// is the Release's whole body as plain text (shown later with
// `white-space: pre-line` and no Markdown). A `body` that is null or empty,
// or a generated shape with no entries, yields "maintenance".

export type ParsedChange = {
  title: string;
  prNumber: number;
  prUrl: string;
};

export type ParsedCategory = {
  title: string;
  changes: ParsedChange[];
};

export type ReleaseNotes =
  | { kind: "parsed"; categories: ParsedCategory[] }
  | { kind: "fallback"; text: string }
  | { kind: "maintenance" };

const ENTRY_PATTERN = /^\* (.+) by @\S+ in (\S+\/pull\/(\d+))$/;
const HTML_COMMENT_PATTERN = /^<!--.*-->$/;
const INLINE_CODE_PATTERN = /`([^`]+)`/g;

export type TitleSegment = { kind: "text" | "code"; text: string };

// Splits a Change title on paired backticks so `code` spans can be shown as
// <code>. An unpaired backtick stays in the text as is.
export function splitInlineCode(title: string): TitleSegment[] {
  const segments: TitleSegment[] = [];
  let last = 0;
  for (const match of title.matchAll(INLINE_CODE_PATTERN)) {
    if (match.index > last)
      segments.push({ kind: "text", text: title.slice(last, match.index) });
    segments.push({ kind: "code", text: match[1] ?? "" });
    last = match.index + match[0].length;
  }
  if (last < title.length) segments.push({ kind: "text", text: title.slice(last) });
  return segments;
}

export function parseReleaseNotes(body: string | null): ReleaseNotes {
  if (body === null || body.trim() === "") return { kind: "maintenance" };

  const categories: ParsedCategory[] = [];
  let recognized = true;
  let section: "changes" | "contributors" | null = null;

  // Bodies edited in GitHub's web UI come back with CRLF line endings.
  for (const line of body.split(/\r?\n/)) {
    if (line.trim() === "" || HTML_COMMENT_PATTERN.test(line.trim())) continue;
    if (line.startsWith("## What's Changed")) section = "changes";
    else if (line.startsWith("## New Contributors")) section = "contributors";
    else if (line.startsWith("### ") && section === "changes")
      categories.push({ title: line.slice(4), changes: [] });
    else if (line.startsWith("**Full Changelog**: ")) {
      // Parsed but never output.
    } else if (line.startsWith("* ") && section === "contributors") {
      // Parsed but never output.
    } else if (line.startsWith("* ") && section === "changes") {
      const match = line.match(ENTRY_PATTERN);
      if (match && categories.length > 0) {
        const last = categories[categories.length - 1];
        if (last) {
          last.changes.push({
            title: match[1] ?? "",
            prUrl: match[2] ?? "",
            prNumber: Number(match[3]),
          });
        }
      } else {
        recognized = false;
      }
    } else {
      recognized = false;
    }
  }

  if (!recognized) return { kind: "fallback", text: body };
  if (categories.every((category) => category.changes.length === 0))
    return { kind: "maintenance" };
  return { kind: "parsed", categories };
}
