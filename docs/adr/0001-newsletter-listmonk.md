# ADR 0001: Self-hosted listmonk for the Newsletter, called synchronously from the page server

Status: Accepted
Date: 2026-10-21

## Context

The landing page collects newsletter sign-ups. Until now the form was a
disabled "Coming soon" placeholder with a simulated success. We need a real
subscription path, and the working reference is the PHP project
`paysubscriptions` (its `MailingSubscribeHandler` and ADR 0006), which
subscribes addresses to a self-hosted listmonk instance.

This page differs from that project in one structural way: it has no queue,
worker or database. Whatever subscribes the visitor must therefore run
inside the page's own server.

The `paysubscriptions` reference also guards its form with reCAPTCHA.
That would send visitor data to a third party on every page load, which
this page avoids everywhere else (self-hosted Umami, no external scripts).
The bot check here must therefore keep working without any third party
either.

## Decision

- Use the existing self-hosted listmonk for the Newsletter.
- The page's server calls the listmonk subscribers API **synchronously**
  from a Server Action (`subscribeNewsletter`) and reports the outcome back
  to the form in the same round trip.
- listmonk owns double opt-in from there: it sends the confirmation email
  and the address counts as subscribed only after the visitor clicks the
  link.
- The Newsletter uses a dedicated listmonk list, separate from other
  projects' lists, configured via `LISTMONK_LIST_ID`.
- A 409 (duplicate email) is treated as success and the existing
  subscriber is left untouched, so the form never reveals whether an
  address was already on the list.
- There is no migration of earlier sign-ups: there are none, the form
  never stored anything.
- When any `LISTMONK_*` env var is unset, the form keeps its disabled
  "Coming soon" state (same pattern as the Umami tracker).
- Guard sign-ups with ALTCHA, the self-hosted open-source proof-of-work
  challenge, instead of reCAPTCHA:
  - The page's own server issues challenges signed with an HMAC key read
    from server-side env (`ALTCHA_HMAC_KEY`); the key never reaches the
    browser.
  - The form embeds the ALTCHA widget served from our own bundle (the
    `altcha` package, no CDN), which fetches a challenge from the
    same-origin `GET /api/altcha/challenge` route and solves it in the
    visitor's browser before submit.
  - The widget is invisible (`display="invisible"`) and solves on page
    load; the trust line under the form shows its live status ("Running
    human check…" / "Human check passed" / "Human check failed • Retry"),
    and Subscribe stays disabled until the check passes. The form starts a
    fresh check itself after every submit and on expiry, since the
    widget's `auto="onload"` fires only once. Chosen over the visible
    checkbox box, a floating popover and a restyled inline strip after a
    prototype (branch `prototype/altcha-placement`).
  - On submit the server verifies the solution (signature + expiry +
    proof-of-work) **before** the per-IP throttle counts the attempt and
    before listmonk is called. A missing, tampered, expired or
    already-used solution is refused with a "Verification failed, please
    try again" state and makes no listmonk request.
  - A solved challenge redeems only once while it is valid (in-memory
    store of redeemed challenges, pruned at expiry; single container,
    same assumption as the throttle).
  - Challenges expire after `ALTCHA_CHALLENGE_TTL_S` (5 minutes).
  - `ALTCHA_HMAC_KEY` joins the "configured" gate: when it is unset, the
    form stays in its "Coming soon" state.

## Consequences

- No new infrastructure to operate: no queue, no worker, no database, no
  cron. The trade-off is that a slow listmonk response holds the form's
  Server Action open; a 10s timeout bounds this and surfaces as the generic
  failure state.
- The visitor sees exactly four states — "Almost done: check your inbox
  and click the confirmation link", "Something went wrong, please try
  again later", the verification "Verification failed, please try again."
  (missing, tampered, expired or replayed bot-check solution, refused
  before the throttle and listmonk), and the throttled "Too many
  attempts, please try again later" (per-IP sliding-window limit, checked
  after verification and before listmonk, so a refused or throttled
  sign-up never reaches listmonk) — and never listmonk details.
- Server logs carry only the outcome class (credentials / transient /
  rejected / throttled / verification), never the subscriber address and
  never the client IP.
- API credentials and the ALTCHA HMAC key live only in server-side env
  and never reach the browser.
- The page still loads no third-party script or request for the bot
  check: the widget ships in our bundle and talks only to our own
  challenge route.
