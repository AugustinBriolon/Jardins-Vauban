import type { WebhookPayload } from "@/lib/webhookPayloads";

// Payloads are kept one week by Airtable, 50 per page. A few pages cover a normal week
// of edits; the cap bounds API usage (Free plan: 1,000 calls per month).
const PAGE_SIZE = 50;
const MAX_PAGES = 3;

/**
 * Reads the webhook's payloads from the start of Airtable's one-week retention.
 * No cursor is stored (the site has no database): callers filter by timestamp.
 */
export async function fetchWebhookPayloads(): Promise<WebhookPayload[]> {
  const { AIRTABLE_API_KEY, AIRTABLE_BASE_ID, AIRTABLE_WEBHOOK_ID } = process.env;
  if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID || !AIRTABLE_WEBHOOK_ID) {
    throw new Error("Airtable webhook environment variables are missing.");
  }

  const payloads: WebhookPayload[] = [];
  let cursor = 1;

  for (let page = 0; page < MAX_PAGES; page += 1) {
    const url = `https://api.airtable.com/v0/bases/${AIRTABLE_BASE_ID}/webhooks/${AIRTABLE_WEBHOOK_ID}/payloads?cursor=${cursor}&limit=${PAGE_SIZE}`;
    const response = await fetch(url, { headers: { Authorization: `Bearer ${AIRTABLE_API_KEY}` } });
    if (!response.ok) throw new Error(`Airtable payloads → ${response.status} ${await response.text()}`);

    const body = (await response.json()) as { payloads: WebhookPayload[]; cursor: number; mightHaveMore: boolean };
    payloads.push(...body.payloads);
    cursor = body.cursor;
    if (!body.mightHaveMore) break;
  }

  return payloads;
}
