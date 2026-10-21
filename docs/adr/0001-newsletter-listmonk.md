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

## Consequences

- No new infrastructure to operate: no queue, no worker, no database, no
  cron. The trade-off is that a slow listmonk response holds the form's
  Server Action open; a 10s timeout bounds this and surfaces as the generic
  failure state.
- The visitor sees exactly three states — "Almost done: check your inbox
  and click the confirmation link", "Something went wrong, please try
  again later", and the throttled "Too many attempts, please try again
  later" (per-IP sliding-window limit, checked before any other work so a
  refused sign-up never reaches listmonk) — and never listmonk details.
- Server logs carry only the outcome class (credentials / transient /
  rejected / throttled), never the subscriber address and never the
  client IP.
- API credentials live only in server-side env and never reach the
  browser.
