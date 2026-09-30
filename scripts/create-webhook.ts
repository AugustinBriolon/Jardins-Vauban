/**
 * Registers an Airtable webhook that pings the site whenever a record of the Lots
 * table changes, so pages are rebuilt within seconds.
 *
 * Usage (once per environment):
 *   npx ts-node --skip-project scripts/create-webhook.ts https://<your-site>/api/airtable-webhook
 *
 * The token needs the `webhook:manage` and `data.records:read` scopes.
 * Copy the printed values into the Vercel environment variables.
 */
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const BASE_ID = process.env.AIRTABLE_BASE_ID;
const TOKEN = process.env.AIRTABLE_API_KEY;
const NOTIFICATION_URL = process.argv[2];

/** Airtable must be able to reach the URL: reject placeholders, localhost and plain http. */
function assertPublicWebhookUrl(value: string | undefined): asserts value is string {
  let url: URL;
  try {
    url = new URL(value ?? "");
  } catch {
    throw new Error("Pass the public URL of the deployed site, e.g. https://my-site.vercel.app/api/airtable-webhook");
  }
  const isLocal = ["localhost", "127.0.0.1"].includes(url.hostname);
  if (url.protocol !== "https:" || isLocal || !url.hostname.includes(".") || /[<>]/.test(decodeURI(url.href))) {
    throw new Error(`"${value}" is not a public https URL. Use the deployed site, e.g. https://my-site.vercel.app/api/airtable-webhook`);
  }
  if (url.pathname !== "/api/airtable-webhook") {
    throw new Error(`The URL must end with /api/airtable-webhook (got ${url.pathname})`);
  }
}

async function airtable<T>(method: string, apiPath: string, body?: unknown): Promise<T> {
  const response = await fetch(`https://api.airtable.com/v0${apiPath}`, {
    method,
    headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (response.status === 403 && apiPath.endsWith("/webhooks")) {
    throw new Error(
      "Airtable refused to create the webhook (403). Add the `webhook:manage` scope to the token " +
        "(https://airtable.com/create/tokens) and check the base is in its access list. " +
        "If it still fails, webhooks may not be available on this Airtable plan."
    );
  }
  if (!response.ok) throw new Error(`${method} ${apiPath} → ${response.status} ${await response.text()}`);
  return (await response.json()) as T;
}

async function main() {
  if (!BASE_ID || !TOKEN) throw new Error("AIRTABLE_API_KEY and AIRTABLE_BASE_ID must be set in .env.local");
  assertPublicWebhookUrl(NOTIFICATION_URL);

  const { tables } = await airtable<{ tables: { id: string; name: string }[] }>("GET", `/meta/bases/${BASE_ID}/tables`);
  const lotsTable = tables.find((table) => table.name === "Lots");
  if (!lotsTable) throw new Error("No table named 'Lots' in this base");

  const webhook = await airtable<{ id: string; macSecretBase64: string; expirationTime: string }>(
    "POST",
    `/bases/${BASE_ID}/webhooks`,
    {
      notificationUrl: NOTIFICATION_URL,
      specification: { options: { filters: { dataTypes: ["tableData"], recordChangeScope: lotsTable.id } } },
    }
  );

  console.log("Webhook created. Add these environment variables (Vercel and .env.local):\n");
  console.log(`AIRTABLE_WEBHOOK_ID=${webhook.id}`);
  console.log(`AIRTABLE_WEBHOOK_MAC_SECRET=${webhook.macSecretBase64}`);
  console.log(`\nExpires ${webhook.expirationTime}; the daily cron /api/cron/refresh-webhook extends it.`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
