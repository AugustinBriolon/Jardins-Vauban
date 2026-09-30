import type { NextApiRequest, NextApiResponse } from "next";

/**
 * Airtable webhooks created with a personal access token expire after 7 days.
 * A daily Vercel cron (vercel.json) calls this route to extend it.
 * Vercel sends `Authorization: Bearer $CRON_SECRET` on cron invocations.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}` || !process.env.CRON_SECRET) {
    return res.status(401).end();
  }

  const { AIRTABLE_API_KEY, AIRTABLE_BASE_ID, AIRTABLE_WEBHOOK_ID } = process.env;
  if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID || !AIRTABLE_WEBHOOK_ID) {
    return res.status(500).json({ error: "Airtable webhook environment variables are missing." });
  }

  const response = await fetch(
    `https://api.airtable.com/v0/bases/${AIRTABLE_BASE_ID}/webhooks/${AIRTABLE_WEBHOOK_ID}/refresh`,
    { method: "POST", headers: { Authorization: `Bearer ${AIRTABLE_API_KEY}` } }
  );

  if (!response.ok) {
    console.error("[refresh-webhook] Airtable refused the refresh:", response.status, await response.text());
    return res.status(502).end();
  }

  const { expirationTime } = (await response.json()) as { expirationTime: string };
  return res.status(200).json({ expirationTime });
}
