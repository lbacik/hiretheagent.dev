import { describe, expect, it } from "vitest";

import { parseReleaseNotes } from "./release-notes";

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
