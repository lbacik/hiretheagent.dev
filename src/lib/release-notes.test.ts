import { describe, expect, it } from "vitest";

import { parseReleaseNotes, splitInlineCode } from "./release-notes";

const GENERATED = `## What's Changed
### Features
* Add dark mode by @alice in https://github.com/lbacik/simple-coding-agent/pull/12
* Speed up startup by @bob in https://github.com/lbacik/simple-coding-agent/pull/13
### Fixes
* Fix crash on empty config by @carol in https://github.com/lbacik/simple-coding-agent/pull/14

## New Contributors
* @dave made their first contribution in https://github.com/lbacik/simple-coding-agent/pull/14

**Full Changelog**: https://github.com/lbacik/simple-coding-agent/compare/v0.1.0...v0.2.0`;

describe("parseReleaseNotes", () => {
  it("parses the generated shape into categories with their changes", () => {
    const notes = parseReleaseNotes(GENERATED);
    expect(notes).toEqual({
      kind: "parsed",
      categories: [
        {
          title: "Features",
          changes: [
            {
              title: "Add dark mode",
              prNumber: 12,
              prUrl: "https://github.com/lbacik/simple-coding-agent/pull/12",
            },
            {
              title: "Speed up startup",
              prNumber: 13,
              prUrl: "https://github.com/lbacik/simple-coding-agent/pull/13",
            },
          ],
        },
        {
          title: "Fixes",
          changes: [
            {
              title: "Fix crash on empty config",
              prNumber: 14,
              prUrl: "https://github.com/lbacik/simple-coding-agent/pull/14",
            },
          ],
        },
      ],
    });
  });

  it("drops the author and exposes the PR as number and URL", () => {
    const notes = parseReleaseNotes(
      "## What's Changed\n### Fixes\n* Fix crash on empty config by @carol in https://github.com/lbacik/simple-coding-agent/pull/14",
    );
    expect(notes).toEqual({
      kind: "parsed",
      categories: [
        {
          title: "Fixes",
          changes: [
            {
              title: "Fix crash on empty config",
              prNumber: 14,
              prUrl: "https://github.com/lbacik/simple-coding-agent/pull/14",
            },
          ],
        },
      ],
    });
  });

  it("hides New Contributors and the Full Changelog line", () => {
    const notes = parseReleaseNotes(GENERATED);
    expect(JSON.stringify(notes)).not.toContain("dave");
    expect(JSON.stringify(notes)).not.toContain("compare/");
  });

  it("ignores blank lines between sections", () => {
    const notes = parseReleaseNotes(
      "## What's Changed\n\n\n### Features\n\n* Add dark mode by @alice in https://github.com/lbacik/simple-coding-agent/pull/12\n\n\n**Full Changelog**: https://github.com/lbacik/simple-coding-agent/compare/v0.1.0...v0.1.1",
    );
    expect(notes.kind).toBe("parsed");
  });

  it("parses a body with CRLF line endings like one with LF", () => {
    const crlf = GENERATED.replace(/\n/g, "\r\n");
    expect(parseReleaseNotes(crlf)).toEqual(parseReleaseNotes(GENERATED));
  });

  it("ignores the HTML comment GitHub prepends for a configured release.yml", () => {
    const body = `<!-- Release notes generated using configuration in .github/release.yml at v0.5.1 -->

## What's Changed
### Other changes
* Stop prefixing PR titles with \`agent:\` by @lbacik in https://github.com/lbacik/simple-coding-agent/pull/262
* Publish a GitHub Release with categorized notes for every \`v*\` tag by @lbacik in https://github.com/lbacik/simple-coding-agent/pull/264


**Full Changelog**: https://github.com/lbacik/simple-coding-agent/compare/v0.5.0...v0.5.1`;
    expect(parseReleaseNotes(body)).toEqual({
      kind: "parsed",
      categories: [
        {
          title: "Other changes",
          changes: [
            {
              title: "Stop prefixing PR titles with `agent:`",
              prNumber: 262,
              prUrl: "https://github.com/lbacik/simple-coding-agent/pull/262",
            },
            {
              title: "Publish a GitHub Release with categorized notes for every `v*` tag",
              prNumber: 264,
              prUrl: "https://github.com/lbacik/simple-coding-agent/pull/264",
            },
          ],
        },
      ],
    });
  });

  it("falls back to plain text when a line falls outside the shape", () => {
    const body = "## What's Changed\n### Features\n* Add dark mode by @alice in https://github.com/lbacik/simple-coding-agent/pull/12\nSee the setup guide for the new env vars.";
    expect(parseReleaseNotes(body)).toEqual({ kind: "fallback", text: body });
  });

  it("falls back to plain text for a hand-edited body", () => {
    const body = "Hand-edited notes (not the generated shape):\n\n- Meta traffic now goes through the gateway.";
    expect(parseReleaseNotes(body)).toEqual({ kind: "fallback", text: body });
  });

  it("yields maintenance for a null body", () => {
    expect(parseReleaseNotes(null)).toEqual({ kind: "maintenance" });
  });

  it("yields maintenance for an empty body", () => {
    expect(parseReleaseNotes("")).toEqual({ kind: "maintenance" });
  });

  it("yields maintenance for a generated shape with no entries", () => {
    expect(
      parseReleaseNotes(
        "**Full Changelog**: https://github.com/lbacik/simple-coding-agent/compare/v0.2.1...v0.2.2",
      ),
    ).toEqual({ kind: "maintenance" });
  });
});

describe("splitInlineCode", () => {
  it("returns a title without backticks as one text segment", () => {
    expect(splitInlineCode("Add dark mode")).toEqual([{ kind: "text", text: "Add dark mode" }]);
  });

  it("splits paired backticks into code segments", () => {
    expect(splitInlineCode("Publish notes for every `v*` tag")).toEqual([
      { kind: "text", text: "Publish notes for every " },
      { kind: "code", text: "v*" },
      { kind: "text", text: " tag" },
    ]);
  });

  it("handles code at the edges and several spans", () => {
    expect(splitInlineCode("`a` and `b`")).toEqual([
      { kind: "code", text: "a" },
      { kind: "text", text: " and " },
      { kind: "code", text: "b" },
    ]);
  });

  it("leaves an unpaired backtick in the text", () => {
    expect(splitInlineCode("Rename `foo to bar")).toEqual([
      { kind: "text", text: "Rename `foo to bar" },
    ]);
  });
});
