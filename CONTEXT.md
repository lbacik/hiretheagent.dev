# hiretheagent.dev

The public landing page for simple-coding-agent: it explains what the agent does, shows where it works today, and collects newsletter sign-ups.

## Language

**simple-coding-agent**:
The unattended coding agent this page presents, developed in its own repository (`lbacik/simple-coding-agent`). Always named by its repository name.
_Avoid_: Agent Sid, the agent engine

**Release**:
A published version of simple-coding-agent, identified by its `v*` tag and carrying release notes. The page treats the agent repository's Releases as the only source of version information. Only stable versions count: drafts and prereleases are not Releases.
_Avoid_: Tag, build, deploy

**Current Release**:
The Release whose tag is the highest by semver; the version the page presents as simple-coding-agent's current one.
_Avoid_: Latest release, newest release

**Change log**:
The list of Releases with their notes, as shown on this page.
_Avoid_: Release history, news

**Change**:
One entry in a Release's notes, corresponding to one merged pull request and categorized as a feature, a fix or another change. The Change log lists Changes, grouped under the Release that shipped them.
_Avoid_: Commit, update, item

**Article**:
A Medium post written by the page's author that is directly about simple-coding-agent or this page. Posts about coding agents in general, or by other authors, are not Articles.
_Avoid_: Post, blog entry, story

**Newsletter**:
The sign-up form on the landing page (`NewsletterForm`, anchors `#newsletter` with `#waitlist` kept as an alias). A submission is sent synchronously from the page's server to a dedicated list on the self-hosted listmonk instance, which owns double opt-in from there (see ADR 0001). The visitor sees only "check your inbox" or "try again later", never listmonk details.
_Avoid_: Waitlist, mailing list
