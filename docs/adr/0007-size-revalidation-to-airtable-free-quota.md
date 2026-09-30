# 7. Size revalidation to the Airtable Free API quota

Date: 2026-09-30

## Status

Proposed

Amends [ADR-0005](0005-revalidate-pages-on-airtable-webhook.md)

## Context

[ADR 0005](0005-revalidate-pages-on-airtable-webhook.md) kept time-based ISR as a safety net: 300 s for listing pages and 60 s for the 48 lot pages. Every rebuild reads the `Lots` table, which costs one Airtable API call.

The Airtable Free plan allows **1,000 API calls per month**, strictly enforced since January 2025. Past the limit, the API is throttled. With 60 s windows, ten lot pages viewed regularly could consume several thousand calls a month on their own. The site would then stop refreshing within the first days of the sales launch.

API call sources:

| Source | Calls |
|---|---|
| Webhook ping (a lot changes) | 2 (rebuild `/` and `/lots`) |
| Enquiry form | 1 per enquiry |
| Daily webhook refresh (cron) | 1 per day, about 30 per month |
| Deployment | about 13 (one read per build worker) |
| Time-based rebuild | 1 per expired page that gets visited |

## Decision

We will keep the webhook as the primary refresh path and set every time-based window to **24 hours** (`lib/staticProps.ts`).

Estimated monthly usage with 100 status changes, 100 enquiries and ten lot pages viewed daily:

| Source | Calls |
|---|---|
| Webhook | 200 |
| Enquiries | 100 |
| Cron | 30 |
| Listing pages | 60 |
| Lot pages | 300 |
| **Total** | **≈ 690** |

## Options considered

### Option A — Keep short windows (60–300 s)
- Pros: lot pages close to real time.
- Cons: the quota is exhausted within days under modest traffic, after which nothing refreshes.

### Option B — Daily windows, webhook first (chosen)
- Pros: a configuration change only, and it stays within the Free plan under realistic traffic.
- Cons: a lot page can show an outdated status for a little over a day. The first visitor after expiry receives the cached page while it rebuilds.

### Option C — Targeted rebuilds from webhook payloads
- Pros: each changed lot page is rebuilt within seconds, and there is no time-based rebuild at all.
- Cons: reading payloads needs a stored cursor or paging through a week of changes, plus a way to map record IDs to references. That is significant complexity for a junior developer to maintain.

### Option D — One shared, tag-invalidated cache (App Router)
- Pros: every page reads the same cached Airtable response. One `revalidateTag("lots")` from the webhook refreshes all 50 pages with a single API call. This is the right long-term design.
- Cons: requires migrating from the Pages Router to the App Router (data cache and `revalidateTag` are App Router features).

## Consequences

### Positive
- The site stays within the Airtable Free plan, at 0 €.
- Listing pages and the lot drawer stay exact within seconds of a change.

### Negative
- Lot pages can lag a status change by a little over a day. The brief's requirement ("not shown as available the next day") is met by the listing pages, not strictly by every lot page.
- The estimate depends on traffic. A traffic peak on lot pages or a very large number of enquiries would still need Option D or a paid Airtable plan.

### Neutral
- Option D is the recommended next step if the site moves to production (see DECISIONS.md).

## References
- `lib/staticProps.ts`
- https://support.airtable.com/articles/7735693959-managing-api-call-limits-in-airtable
