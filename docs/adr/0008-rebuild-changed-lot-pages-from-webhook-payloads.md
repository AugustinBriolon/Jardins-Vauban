# 8. Rebuild changed lot pages from webhook payloads

Date: 2026-09-30

## Status

Proposed

Amends [ADR-0007](0007-size-revalidation-to-airtable-free-quota.md)

## Context

[ADR 0007](0007-size-revalidation-to-airtable-free-quota.md) left the 48 lot pages outside the webhook: rebuilding all of them on every change would cost 48 Airtable API calls, against a Free-plan quota of 1,000 per month. A lot page could therefore show an outdated status for about a day. That is visible in a demo (change a status in Airtable, open the lot page) and falls short of the brief for the page the sales team actually sends to prospects.

An Airtable webhook ping does not say which record changed. The details are in the webhook **payloads**, which Airtable keeps for one week.

## Decision

On each ping, after rebuilding `/` and `/lots`, the webhook route reads the recent payloads and rebuilds **only the pages of the lots that changed**.

- The webhook is created with `includeCellValuesInFieldIds: [Référence]`, so each changed record carries its lot reference even when only the status changed. `includePreviousCellValues` covers a renamed reference: both pages are rebuilt.
- The site stores no cursor (it has no database). It reads payloads from the start of the retention window, at most 3 pages of 50, and keeps changes from the last 10 minutes (`lib/webhookPayloads.ts`, a pure and tested function).
- This step is best effort. If it fails, the listing pages are already fresh and lot pages fall back to their time-based window, now set to one week.
- `scripts/create-webhook.ts` deletes any previous webhook pointing to the same URL (its old secret would be rejected) and prints `AIRTABLE_REFERENCE_FIELD_ID`.

Estimated monthly usage (100 status changes, 100 enquiries, ten lot pages viewed regularly):

| Source | Calls |
|---|---|
| Webhook (2 listing pages, 1 payload read, 1 lot page per change) | 400 |
| Enquiries | 100 |
| Cron | 30 |
| Daily listing safety net | 60 |
| Weekly lot-page safety net | ~40 |
| **Total** | **≈ 630** |

## Options considered

### Option A — Keep ADR 0007 (lot pages daily)
- Pros: nothing to build.
- Cons: a lot page can lag a status change by about a day.

### Option B — Rebuild all 48 lot pages on every ping
- Pros: simple.
- Cons: 48 calls per change, so the quota is gone after about 20 changes.

### Option C — Targeted rebuild from payloads (chosen)
- Pros: every page is exact within seconds, and a change costs about 4 calls.
- Cons: the webhook must be recreated with the new `includes`. Reading payloads without a stored cursor costs more calls if a week holds more than 50 changes (capped at 3 reads).

### Option D — App Router with a tag-invalidated shared cache
- Pros: one call refreshes every page, and no payload parsing.
- Cons: requires migrating from the Pages Router. It remains the long-term recommendation.

## Consequences

### Positive
- Listing pages, the lot drawer and lot pages all reflect a change within seconds.
- The lot-page safety net can be weekly, which lowers background API usage.

### Negative
- One more environment variable (`AIRTABLE_REFERENCE_FIELD_ID`) and a webhook to recreate.
- A deleted lot is not detected by reference (Airtable only sends its record ID): its page stays until the weekly rebuild returns a 404.

### Neutral
- Reading payloads also extends the webhook's 7-day lifetime, in addition to the daily cron.

## References
- `pages/api/airtable-webhook.ts`, `lib/webhookPayloads.ts`, `lib/airtableWebhooks.ts`, `scripts/create-webhook.ts`
- https://airtable.com/developers/web/api/list-webhook-payloads
- https://airtable.com/developers/web/api/model/webhooks-table-changed
