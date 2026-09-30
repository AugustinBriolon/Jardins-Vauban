# 5. Revalidate lot pages on Airtable webhook

Date: 2026-09-30

## Status

Proposed

Amended by [ADR-0007](0007-size-revalidation-to-airtable-free-quota.md) (revalidation windows)

## Context

The sales director updates lot statuses herself in Airtable. Her requirement: "when a lot is sold, it must not be shown as available the next day". Pages listing lots are statically generated. Until now, freshness relied on ISR with a 60 s window. That meets the requirement, but a visitor may still see a sold lot for up to a minute, and every page is rebuilt every minute even when nothing changed.

Constraints: the Airtable Free plan (the "Run a script" automation action is unavailable) and a hosting budget under 20 €/month.

## Decision

We will rebuild `/` and `/lots` **on demand** when a record of the `Lots` table changes, using the Airtable Webhooks API:

- `scripts/create-webhook.ts` registers a webhook on the `Lots` table that points to `/api/airtable-webhook`.
- `/api/airtable-webhook` verifies the `X-Airtable-Content-MAC` HMAC signature on the raw body, then calls `res.revalidate()` for the pages in `LOT_PAGES`.
- Webhooks created with a personal access token expire after 7 days. A daily Vercel cron calls `/api/cron/refresh-webhook`, protected by `CRON_SECRET`, to extend it.
- ISR stays as a safety net for the listing pages, with its window raised from 60 s to 300 s.
- The 48 lot pages (`/lots/[reference]`) are **not** rebuilt by the webhook: each rebuild reads Airtable, and 48 of them at once would exceed the 5 requests/s limit. They keep a 60 s ISR window.
- If Airtable fails during a background rebuild, the loader throws so Next.js keeps serving the last good page instead of an empty one.

## Options considered

### Option A — ISR only (time-based)
- Pros: no moving parts.
- Cons: stale for up to the revalidation window, and constant rebuilds when nothing changes.

### Option B — Server-side rendering on every request
- Pros: always fresh.
- Cons: one Airtable call per page view against a limit of 5 requests/s per base, slower responses, and an outage of Airtable takes the site down.

### Option C — Airtable automation "Run a script" calling a revalidation URL
- Pros: configured in the Airtable UI, no expiry.
- Cons: not available on the Free plan; it requires a paid plan billed per user, which does not fit the budget.

### Option D — Airtable Webhooks API + on-demand revalidation (chosen)
- Pros: not documented as plan-restricted, so expected to work on the Free plan (to be confirmed when the webhook is first created), updates in seconds, requests are authenticated by HMAC, no rebuild when nothing changes.
- Cons: the webhook expires without the daily refresh. Three more environment variables.

## Consequences

### Positive
- A status change reaches the site in a few seconds instead of up to a minute.
- Forged pings are rejected: an invalid signature returns 401 and triggers no rebuild.

### Negative
- If the cron fails for 7 days in a row, the webhook expires silently and freshness falls back to the 5-minute ISR window. The cron logs in Vercel must be checked when handing over.
- The webhook must be created once per environment, with a token that has the `webhook:manage` scope.

### Neutral
- Vercel Hobby allows daily crons, which is enough for a 7-day expiry.

## References
- `pages/api/airtable-webhook.ts`, `pages/api/cron/refresh-webhook.ts`, `lib/webhookSignature.ts`, `scripts/create-webhook.ts`, `vercel.json`
- https://airtable.com/developers/web/api/webhooks-overview
- https://support.airtable.com/articles/6328053615-airtable-automation-action-run-a-script
