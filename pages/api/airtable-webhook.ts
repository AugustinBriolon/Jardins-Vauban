import type { NextApiRequest, NextApiResponse } from "next";
import { isValidAirtableSignature } from "@/lib/webhookSignature";
import { LOT_PAGES } from "@/lib/staticProps";

// The signature is computed on the exact bytes Airtable sent, so Next must not parse the body.
export const config = { api: { bodyParser: false } };

const MAX_BODY_BYTES = 4 * 1024;

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

/**
 * Airtable pings this endpoint whenever a record of the Lots table changes.
 * The ping carries no data: we only rebuild the pages that display lots,
 * so a status change is visible in seconds instead of waiting for ISR.
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
    return res.status(200).json({ revalidated: LOT_PAGES });
  } catch (error) {
    console.error("[airtable-webhook] Revalidation failed:", error);
    return res.status(500).end();
  }
}
