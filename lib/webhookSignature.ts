import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Checks the `X-Airtable-Content-MAC` header of an Airtable webhook ping:
 * "hmac-sha256=" + hex HMAC-SHA256 of the raw body, keyed with the webhook's
 * base64-decoded MAC secret. Constant-time comparison prevents timing attacks.
 */
export function isValidAirtableSignature(rawBody: string, header: string | undefined, macSecretBase64: string): boolean {
  if (!header || !macSecretBase64) return false;

  const expected =
    "hmac-sha256=" + createHmac("sha256", Buffer.from(macSecretBase64, "base64")).update(rawBody, "utf8").digest("hex");

  const received = Buffer.from(header);
  const reference = Buffer.from(expected);
  return received.length === reference.length && timingSafeEqual(received, reference);
}
