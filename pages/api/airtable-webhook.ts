import type { NextApiRequest, NextApiResponse } from "next";
import { isValidAirtableSignature } from "@/lib/webhookSignature";
import { LOT_PAGES } from "@/lib/staticProps";
import { lotPath } from "@/lib/lots";
import { fetchWebhookPayloads } from "@/lib/airtableWebhooks";
import { changedLotReferences } from "@/lib/webhookPayloads";

// The signature is computed on the exact bytes Airtable sent, so Next must not parse the body.
export const config = { api: { bodyParser: false } };

const MAX_BODY_BYTES = 4 * 1024;

// Pings arrive seconds after an edit; a wider window tolerates Airtable retries.
const RECENT_CHANGES_WINDOW_MS = 10 * 60 * 1000;

async function readRawBody(req: NextApiRequest): Promise<string> {
  const chunks: Buffer[] = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > MAX_BODY_BYTES) throw new Error("Payload too large");
    chunks.push(Buffer.from(chunk));
  }
  return Buffer.concat(chunks).toString("utf8");
}

/** Lot pages changed in the last minutes, read from the webhook payloads. */
async function changedLotPages(): Promise<string[]> {
  const referenceFieldId = process.env.AIRTABLE_REFERENCE_FIELD_ID;
  if (!referenceFieldId) {
    console.warn("[airtable-webhook] AIRTABLE_REFERENCE_FIELD_ID is not set: lot pages are not rebuilt.");
    return [];
  }
  const since = new Date(Date.now() - RECENT_CHANGES_WINDOW_MS);
  return changedLotReferences(await fetchWebhookPayloads(), referenceFieldId, since).map(lotPath);
}

/**
 * Airtable pings this endpoint whenever a record of the Lots table changes.
 * The ping carries no data: we rebuild the listing pages, then read the recent
 * payloads to rebuild only the pages of the lots that changed.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end();
  }

  let rawBody: string;
  try {
    rawBody = await readRawBody(req);
  } catch {
    return res.status(413).end();
  }

  const signature = req.headers["x-airtable-content-mac"];
  const secret = process.env.AIRTABLE_WEBHOOK_MAC_SECRET ?? "";
  if (!isValidAirtableSignature(rawBody, typeof signature === "string" ? signature : undefined, secret)) {
    return res.status(401).end();
  }

  try {
    await Promise.all(LOT_PAGES.map((path) => res.revalidate(path)));
  } catch (error) {
    console.error("[airtable-webhook] Revalidation failed:", error);
    return res.status(500).end();
  }

  // Best effort: if this part fails, listing pages are already fresh and lot
  // pages fall back to their time-based window.
  let lotPages: string[] = [];
  try {
    lotPages = await changedLotPages();
    await Promise.all(lotPages.map((path) => res.revalidate(path)));
  } catch (error) {
    console.error("[airtable-webhook] Lot page revalidation failed:", error);
  }

  const revalidated = [...LOT_PAGES, ...lotPages];
  console.info(`[airtable-webhook] Revalidated ${revalidated.join(", ")}`);
  return res.status(200).json({ revalidated });
}
