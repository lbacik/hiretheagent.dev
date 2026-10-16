// PROTOTYPE (issue #10): stub of GET /repos/lbacik/simple-coding-agent/releases?per_page=100.
// Generated from the agent repo's real tags (dates = tag commit dates) and merged PRs, shaped like
// GitHub generated notes under the release.yml categories from issue #8. Categorization of these
// historical PRs is a guess from their titles (backfill is issue #11). All published_at values are
// identical, as a one-off backfill would make them. One prerelease is included to prove the filter.
// v0.3.3's body is hand-edited on purpose, to show the plain-text fallback; v0.2.2 has no changes.

export type GitHubRelease = {
  tag_name: string; name: string; html_url: string; draft: boolean; prerelease: boolean;
  created_at: string; published_at: string; body: string;
};

export const releasesPayload: GitHubRelease[] = [
  {
    "tag_name": "v0.6.0-rc.1",
    "name": "v0.6.0-rc.1",
    "html_url": "https://github.com/lbacik/simple-coding-agent/releases/tag/v0.6.0-rc.1",
    "draft": false,
    "prerelease": true,
    "created_at": "2026-10-16T10:00:00Z",
    "published_at": "2026-10-16T10:01:00Z",
    "body": "## What's Changed\n### Features\n* Fleet dashboard preview by @lbacik in https://github.com/lbacik/simple-coding-agent/pull/260\n\n**Full Changelog**: https://github.com/lbacik/simple-coding-agent/compare/v0.5.0...v0.6.0-rc.1"
  },
  {
    "tag_name": "v0.5.0",
    "name": "v0.5.0",
    "html_url": "https://github.com/lbacik/simple-coding-agent/releases/tag/v0.5.0",
    "draft": false,
    "prerelease": false,
    "created_at": "2026-10-14T15:25:17Z",
    "published_at": "2026-10-17T09:12:44Z",
    "body": "## What's Changed\n### Features\n* Keep recent events in telemetry by @lbacik in https://github.com/lbacik/simple-coding-agent/pull/252\n* Publish context-window, compaction and subagent figures in telemetry by @lbacik in https://github.com/lbacik/simple-coding-agent/pull/255\n* Publish live budget, token, turn and cache figures in telemetry by @lbacik in https://github.com/lbacik/simple-coding-agent/pull/254\n* Report the last finished attempt in telemetry by @lbacik in https://github.com/lbacik/simple-coding-agent/pull/253\n* Show the claimed attempt in telemetry by @lbacik in https://github.com/lbacik/simple-coding-agent/pull/251\n* Report last known publication progress and workspace state in telemetry by @lbacik in https://github.com/lbacik/simple-coding-agent/pull/250\n* Serve a telemetry snapshot through agentctl telemetry --json by @lbacik in https://github.com/lbacik/simple-coding-agent/pull/249\n* Make agent containers discoverable and publish telemetry snapshot examples by @lbacik in https://github.com/lbacik/simple-coding-agent/pull/248\n### Fixes\n* Control listener thread dies on an unexpected handler exception by @lbacik in https://github.com/lbacik/simple-coding-agent/pull/247\n\n**Full Changelog**: https://github.com/lbacik/simple-coding-agent/compare/v0.4.5...v0.5.0"
  },
  {
    "tag_name": "v0.4.5",
    "name": "v0.4.5",
    "html_url": "https://github.com/lbacik/simple-coding-agent/releases/tag/v0.4.5",
    "draft": false,
    "prerelease": false,
    "created_at": "2026-10-14T11:02:35Z",
    "published_at": "2026-10-17T09:12:44Z",
    "body": "## What's Changed\n### Fixes\n* Deferred-setup continuation: model never gets a chance to fix a red baseline found after conflict resolution by @lbacik in https://github.com/lbacik/simple-coding-agent/pull/237\n* Final check that dirties the working tree is detected only after publication by @lbacik in https://github.com/lbacik/simple-coding-agent/pull/231\n* A held workspace exits the process with code 1 and crash-loops the container by @lbacik in https://github.com/lbacik/simple-coding-agent/pull/230\n* CLAUDE_AGENT_SDK_VERSION exported by the Agent SDK overrides the pinned SDK version by @lbacik in https://github.com/lbacik/simple-coding-agent/pull/221\n* PR auto-merge fails on unprotected base branches: 'Protected branch rules not configured' not treated as directly mergeable by @lbacik in https://github.com/lbacik/simple-coding-agent/pull/220\n* Files ignored only on the attempt branch become \"unexplained dirty work\" after cleanup switches to the base branch, and intake holds by @lbacik in https://github.com/lbacik/simple-coding-agent/pull/218\n* Valid handoff note still rejected when the work commit beneath it also deletes a handoff note by @lbacik in https://github.com/lbacik/simple-coding-agent/pull/217\n\n**Full Changelog**: https://github.com/lbacik/simple-coding-agent/compare/v0.4.4...v0.4.5"
  },
  {
    "tag_name": "v0.4.4",
    "name": "v0.4.4",
    "html_url": "https://github.com/lbacik/simple-coding-agent/releases/tag/v0.4.4",
    "draft": false,
    "prerelease": false,
    "created_at": "2026-10-12T19:09:22Z",
    "published_at": "2026-10-17T09:12:44Z",
    "body": "## What's Changed\n### Fixes\n* Valid handoff note rejected when the note is committed more than once by @lbacik in https://github.com/lbacik/simple-coding-agent/pull/214\n* Soft-threshold gate lifts as soon as the handoff skill is invoked; a compaction mid-handoff lost the note by @lbacik in https://github.com/lbacik/simple-coding-agent/pull/211\n\n**Full Changelog**: https://github.com/lbacik/simple-coding-agent/compare/v0.4.3...v0.4.4"
  },
  {
    "tag_name": "v0.4.3",
    "name": "v0.4.3",
    "html_url": "https://github.com/lbacik/simple-coding-agent/releases/tag/v0.4.3",
    "draft": false,
    "prerelease": false,
    "created_at": "2026-10-11T15:58:23Z",
    "published_at": "2026-10-17T09:12:44Z",
    "body": "## What's Changed\n### Features\n* Auto-continue round-finished issues up to MAX_AUTO_CONTINUATIONS by @lbacik in https://github.com/lbacik/simple-coding-agent/pull/210\n* Soft threshold as a handoff reserve of turns; document token settings by @lbacik in https://github.com/lbacik/simple-coding-agent/pull/209\n* Cheaper token handoff: supply git state, finish in one Write + one Bash by @lbacik in https://github.com/lbacik/simple-coding-agent/pull/208\n* Record requeue source in attempt results and count automatic continuations by @lbacik in https://github.com/lbacik/simple-coding-agent/pull/205\n### Fixes\n* PR auto-merge always fails: GraphQL mutations use non-existent MergeMethod type by @lbacik in https://github.com/lbacik/simple-coding-agent/pull/207\n\n**Full Changelog**: https://github.com/lbacik/simple-coding-agent/compare/v0.4.2...v0.4.3"
  },
  {
    "tag_name": "v0.4.2",
    "name": "v0.4.2",
    "html_url": "https://github.com/lbacik/simple-coding-agent/releases/tag/v0.4.2",
    "draft": false,
    "prerelease": false,
    "created_at": "2026-10-11T14:25:08Z",
    "published_at": "2026-10-17T09:12:44Z",
    "body": "## What's Changed\n### Fixes\n* Operator handoff (`agentctl handoff now`) expires without the model ever invoking the handoff skill by @lbacik in https://github.com/lbacik/simple-coding-agent/pull/203\n* Attempt ends as incomplete without explanation when the model skips code-review by @lbacik in https://github.com/lbacik/simple-coding-agent/pull/200\n\n**Full Changelog**: https://github.com/lbacik/simple-coding-agent/compare/v0.4.1...v0.4.2"
  },
  {
    "tag_name": "v0.4.1",
    "name": "v0.4.1",
    "html_url": "https://github.com/lbacik/simple-coding-agent/releases/tag/v0.4.1",
    "draft": false,
    "prerelease": false,
    "created_at": "2026-10-11T13:32:30Z",
    "published_at": "2026-10-17T09:12:44Z",
    "body": "## What's Changed\n### Fixes\n* Handoff silently downgraded to incomplete when the note's started_at is not ISO 8601 by @lbacik in https://github.com/lbacik/simple-coding-agent/pull/199\n* Continuation tolerates a red baseline check but never tells the model about it by @lbacik in https://github.com/lbacik/simple-coding-agent/pull/196\n* Attempt ends while async review subagents are still running; review results are dropped by @lbacik in https://github.com/lbacik/simple-coding-agent/pull/197\n* Model is never told the profile's gating check commands by @lbacik in https://github.com/lbacik/simple-coding-agent/pull/195\n\n**Full Changelog**: https://github.com/lbacik/simple-coding-agent/compare/v0.4.0...v0.4.1"
  },
  {
    "tag_name": "v0.4.0",
    "name": "v0.4.0",
    "html_url": "https://github.com/lbacik/simple-coding-agent/releases/tag/v0.4.0",
    "draft": false,
    "prerelease": false,
    "created_at": "2026-10-11T11:43:17Z",
    "published_at": "2026-10-17T09:12:44Z",
    "body": "## What's Changed\n### Features\n* Per-issue auto-merge opt-in via the agent-auto-merge label by @lbacik in https://github.com/lbacik/simple-coding-agent/pull/192\n* ProvenanceVerifier checks the PATH CLI, not the CLI the SDK actually runs by @lbacik in https://github.com/lbacik/simple-coding-agent/pull/189\n* Operator-controlled auto-merge of complete implementation PRs (PR_AUTO_MERGE) by @lbacik in https://github.com/lbacik/simple-coding-agent/pull/188\n* Richer emergency handoff note from runtime-reconstructed facts by @lbacik in https://github.com/lbacik/simple-coding-agent/pull/183\n### Fixes\n* Control-socket startup failure crashes with TypeError instead of logging control_endpoint_unavailable by @lbacik in https://github.com/lbacik/simple-coding-agent/pull/191\n\n**Full Changelog**: https://github.com/lbacik/simple-coding-agent/compare/v0.3.3...v0.4.0"
  },
  {
    "tag_name": "v0.3.3",
    "name": "v0.3.3",
    "html_url": "https://github.com/lbacik/simple-coding-agent/releases/tag/v0.3.3",
    "draft": false,
    "prerelease": false,
    "created_at": "2026-10-11T10:29:45Z",
    "published_at": "2026-10-17T09:12:44Z",
    "body": "Hand-edited notes (not the generated shape):\n\n- Meta traffic now goes through the **LiteLLM gateway**.\n- See [the setup guide](https://github.com/lbacik/simple-coding-agent#setup) for the new env vars."
  },
  {
    "tag_name": "v0.3.2",
    "name": "v0.3.2",
    "html_url": "https://github.com/lbacik/simple-coding-agent/releases/tag/v0.3.2",
    "draft": false,
    "prerelease": false,
    "created_at": "2026-10-02T14:42:01Z",
    "published_at": "2026-10-17T09:12:44Z",
    "body": "## What's Changed\n### Features\n* Make the model backend configurable via env (keep Meta as the default) by @lbacik in https://github.com/lbacik/simple-coding-agent/pull/165\n### Other changes\n* Upgrade to claude-agent-sdk 0.2.163 + Claude Code 2.1.286 (#166) by @lbacik in https://github.com/lbacik/simple-coding-agent/pull/168\n\n**Full Changelog**: https://github.com/lbacik/simple-coding-agent/compare/v0.3.1...v0.3.2"
  },
  {
    "tag_name": "v0.3.1",
    "name": "v0.3.1",
    "html_url": "https://github.com/lbacik/simple-coding-agent/releases/tag/v0.3.1",
    "draft": false,
    "prerelease": false,
    "created_at": "2026-10-02T09:15:59Z",
    "published_at": "2026-10-17T09:12:44Z",
    "body": "## What's Changed\n### Features\n* Log each settled response's own figures in limits_checked, and reconcile interrupted responses separately by @lbacik in https://github.com/lbacik/simple-coding-agent/pull/161\n* Report agent version and guard release tags (#150) by @lbacik in https://github.com/lbacik/simple-coding-agent/pull/158\n### Fixes\n* limits_checked is never logged for the last response of each thread by @lbacik in https://github.com/lbacik/simple-coding-agent/pull/163\n* Don't restart-loop on a dirty working tree while intake is stopped by @lbacik in https://github.com/lbacik/simple-coding-agent/pull/160\n\n**Full Changelog**: https://github.com/lbacik/simple-coding-agent/compare/v0.3.0...v0.3.1"
  },
  {
    "tag_name": "v0.3.0",
    "name": "v0.3.0",
    "html_url": "https://github.com/lbacik/simple-coding-agent/releases/tag/v0.3.0",
    "draft": false,
    "prerelease": false,
    "created_at": "2026-10-01T18:58:07Z",
    "published_at": "2026-10-17T09:12:44Z",
    "body": "## What's Changed\n### Features\n* Make the token soft-threshold handoff work in practice (#153) by @lbacik in https://github.com/lbacik/simple-coding-agent/pull/157\n* Record per-category token usage and prompt-cache effectiveness (#149) by @lbacik in https://github.com/lbacik/simple-coding-agent/pull/156\n* Record the token budget summary in the attempt archive (#119, part 4) by @lbacik in https://github.com/lbacik/simple-coding-agent/pull/152\n* Enforce the token hard ceiling (#119, part 3) by @lbacik in https://github.com/lbacik/simple-coding-agent/pull/151\n* Drive the soft threshold from the token ledger (#119, part 2) by @lbacik in https://github.com/lbacik/simple-coding-agent/pull/148\n* Add Meta model pricing to the container's managed settings by @lbacik in https://github.com/lbacik/simple-coding-agent/pull/143\n* Copy CLI transcripts into the attempt archive by @lbacik in https://github.com/lbacik/simple-coding-agent/pull/142\n* Add the token ledger and token budget settings (#119, part 1) by @lbacik in https://github.com/lbacik/simple-coding-agent/pull/145\n### Fixes\n* Fix FakeWorkspace NameError and add CI (ruff + pytest) by @lbacik in https://github.com/lbacik/simple-coding-agent/pull/146\n### Other changes\n* Make tracker extras required and remove _tracker_method (#109, PR 2) by @lbacik in https://github.com/lbacik/simple-coding-agent/pull/147\n* Finish migrating tests to the shared doubles in tests/fakes.py (#109 follow-up) by @lbacik in https://github.com/lbacik/simple-coding-agent/pull/144\n* Attempt workspace interface and unconditional sealing (#109, PR 1) by @lbacik in https://github.com/lbacik/simple-coding-agent/pull/120\n\n**Full Changelog**: https://github.com/lbacik/simple-coding-agent/compare/v0.2.3...v0.3.0"
  },
  {
    "tag_name": "v0.2.3",
    "name": "v0.2.3",
    "html_url": "https://github.com/lbacik/simple-coding-agent/releases/tag/v0.2.3",
    "draft": false,
    "prerelease": false,
    "created_at": "2026-09-30T07:47:52Z",
    "published_at": "2026-10-17T09:12:44Z",
    "body": "## What's Changed\n### Features\n* Stop running subagents when the cost soft threshold is crossed by @lbacik in https://github.com/lbacik/simple-coding-agent/pull/118\n* Record sealing and attempt workspace (design for #109) by @lbacik in https://github.com/lbacik/simple-coding-agent/pull/114\n### Fixes\n* Bump agent-installer to 0.7.2 so the skill pin is honoured by @lbacik in https://github.com/lbacik/simple-coding-agent/pull/116\n\n**Full Changelog**: https://github.com/lbacik/simple-coding-agent/compare/v0.2.2...v0.2.3"
  },
  {
    "tag_name": "v0.2.2",
    "name": "v0.2.2",
    "html_url": "https://github.com/lbacik/simple-coding-agent/releases/tag/v0.2.2",
    "draft": false,
    "prerelease": false,
    "created_at": "2026-09-29T20:35:02Z",
    "published_at": "2026-10-17T09:12:44Z",
    "body": "**Full Changelog**: https://github.com/lbacik/simple-coding-agent/compare/v0.2.1...v0.2.2"
  },
  {
    "tag_name": "v0.2.1",
    "name": "v0.2.1",
    "html_url": "https://github.com/lbacik/simple-coding-agent/releases/tag/v0.2.1",
    "draft": false,
    "prerelease": false,
    "created_at": "2026-09-28T08:42:56Z",
    "published_at": "2026-10-17T09:12:44Z",
    "body": "## What's Changed\n### Features\n* agentctl: show the consecutive-error counter in status and add a command to reset it by @lbacik in https://github.com/lbacik/simple-coding-agent/pull/108\n### Fixes\n* Operator-handoff stream wait kills the SDK stream after 60s of silence (\"stream ended without a terminal ResultMessage\") by @lbacik in https://github.com/lbacik/simple-coding-agent/pull/107\n* Dirty work is never committed before cleanup() when execution.status is INFRASTRUCTURE_ERROR by @lbacik in https://github.com/lbacik/simple-coding-agent/pull/104\n\n**Full Changelog**: https://github.com/lbacik/simple-coding-agent/compare/v0.2.0...v0.2.1"
  },
  {
    "tag_name": "v0.2.0",
    "name": "v0.2.0",
    "html_url": "https://github.com/lbacik/simple-coding-agent/releases/tag/v0.2.0",
    "draft": false,
    "prerelease": false,
    "created_at": "2026-09-25T13:09:43Z",
    "published_at": "2026-10-17T09:12:44Z",
    "body": "## What's Changed\n### Features\n* Handle handoff publication deadlines and failures by @lbacik in https://github.com/lbacik/simple-coding-agent/pull/99\n* Request a handoff at a safe model boundary by @lbacik in https://github.com/lbacik/simple-coding-agent/pull/97\n* Recover and release retained implementation attempts by @lbacik in https://github.com/lbacik/simple-coding-agent/pull/96\n* Prioritize one eligible issue for the next claim by @lbacik in https://github.com/lbacik/simple-coding-agent/pull/93\n* Stop after N implementation attempts by @lbacik in https://github.com/lbacik/simple-coding-agent/pull/92\n* Expose agentctl in each Compose instance by @lbacik in https://github.com/lbacik/simple-coding-agent/pull/91\n* Resume issue intake by @lbacik in https://github.com/lbacik/simple-coding-agent/pull/90\n* Control issue intake with durable stop and live status by @lbacik in https://github.com/lbacik/simple-coding-agent/pull/89\n* Make implementation attempt finalization restart-safe by @lbacik in https://github.com/lbacik/simple-coding-agent/pull/88\n### Fixes\n* Fix a real editor-spawn hang and a fake-client 10s stall in the test suite by @lbacik in https://github.com/lbacik/simple-coding-agent/pull/102\n* Cost soft-threshold handoff can be skipped: instruction goes to a subagent and the run still ends as complete by @lbacik in https://github.com/lbacik/simple-coding-agent/pull/101\n* Incomplete attempt without a branch permanently blocks the issue with continuation_branch_missing by @lbacik in https://github.com/lbacik/simple-coding-agent/pull/100\n* Fix macOS local test failures: AF_UNIX path limit and missing sleeper by @lbacik in https://github.com/lbacik/simple-coding-agent/pull/94\n* Bootstrap workspace preparation rebases the attempt branch onto hardcoded `main`, breaking repos whose profile uses another `base_branch` by @lbacik in https://github.com/lbacik/simple-coding-agent/pull/74\n\n**Full Changelog**: https://github.com/lbacik/simple-coding-agent/compare/v0.1.0...v0.2.0"
  },
  {
    "tag_name": "v0.1.0",
    "name": "v0.1.0",
    "html_url": "https://github.com/lbacik/simple-coding-agent/releases/tag/v0.1.0",
    "draft": false,
    "prerelease": false,
    "created_at": "2026-09-24T13:29:52Z",
    "published_at": "2026-10-17T09:12:44Z",
    "body": "## What's Changed\n### Features\n* Require a trustworthy committed handoff note; preserve dirty work locally by @lbacik in https://github.com/lbacik/simple-coding-agent/pull/56\n* Implement resource-aware handoff execution, durable publication, and recovery by @lbacik in https://github.com/lbacik/simple-coding-agent/pull/55\n* Document handoff/continuation domain terms and add end-to-end acceptance tests by @lbacik in https://github.com/lbacik/simple-coding-agent/pull/53\n* Release round-finished on claim; short-circuit missing continuation branch by @lbacik in https://github.com/lbacik/simple-coding-agent/pull/52\n* Feed filtered issue comments and a continuation pointer into the model's prompt by @lbacik in https://github.com/lbacik/simple-coding-agent/pull/50\n* Restore and safely rebase continuation branches on handoff resume by @lbacik in https://github.com/lbacik/simple-coding-agent/pull/51\n* Move pinned versions to env and log the model execution process by @lbacik in https://github.com/lbacik/simple-coding-agent/pull/39\n* Package the agent for local and Docker Compose operation by @lbacik in https://github.com/lbacik/simple-coding-agent/pull/38\n* Implement operating controls and observability by @lbacik in https://github.com/lbacik/simple-coding-agent/pull/37\n* Recover interrupted attempts at startup by @lbacik in https://github.com/lbacik/simple-coding-agent/pull/36\n* Implement post-attempt cleanup and sequential polling loop by @lbacik in https://github.com/lbacik/simple-coding-agent/pull/35\n* Implement branch publication, pull requests and attempt result comments by @lbacik in https://github.com/lbacik/simple-coding-agent/pull/34\n* Implement setup/check execution and completion evaluation by @lbacik in https://github.com/lbacik/simple-coding-agent/pull/33\n* Implement pinned SDK execution workflow by @lbacik in https://github.com/lbacik/simple-coding-agent/pull/32\n* Implement persistent git workspace lifecycle by @lbacik in https://github.com/lbacik/simple-coding-agent/pull/31\n* Implement GitHub issue claim selection by @lbacik in https://github.com/lbacik/simple-coding-agent/pull/30\n* Implement durable attempt checkpoints by @lbacik in https://github.com/lbacik/simple-coding-agent/pull/29\n* Implement runtime configuration and repository profile validation by @lbacik in https://github.com/lbacik/simple-coding-agent/pull/28\n### Fixes\n* Final-check crash leaves no terminal event, and workspace reprepare races setup, causing repeated infrastructure_error by @lbacik in https://github.com/lbacik/simple-coding-agent/pull/72\n* setup runs against a conflicted rebase, causing a false infrastructure_error by @lbacik in https://github.com/lbacik/simple-coding-agent/pull/71\n* Red final check + failed partial push is reported as infrastructure_error with \"Implementation succeeded\" by @lbacik in https://github.com/lbacik/simple-coding-agent/pull/70\n\n## New Contributors\n* @lbacik made their first contribution in https://github.com/lbacik/simple-coding-agent/pull/71\n\n**Full Changelog**: https://github.com/lbacik/simple-coding-agent/commits/v0.1.0"
  }
];
