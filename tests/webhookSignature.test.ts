import { createHmac } from "node:crypto";
import { describe, expect, it } from "vitest";
import { isValidAirtableSignature } from "@/lib/webhookSignature";

const secretBase64 = Buffer.from("test-mac-secret").toString("base64");
const body = JSON.stringify({ base: { id: "app1" }, webhook: { id: "ach1" }, timestamp: "2026-09-30T10:00:00.000Z" });

function sign(payload: string, secret = secretBase64) {
  return "hmac-sha256=" + createHmac("sha256", Buffer.from(secret, "base64")).update(payload).digest("hex");
}

describe("isValidAirtableSignature", () => {
  it("accepts a ping signed with the webhook secret", () => {
    expect(isValidAirtableSignature(body, sign(body), secretBase64)).toBe(true);
  });

  it("rejects a tampered body", () => {
    expect(isValidAirtableSignature(body.replace("app1", "app2"), sign(body), secretBase64)).toBe(false);
  });

  it("rejects a signature made with another secret", () => {
    const otherSecret = Buffer.from("attacker").toString("base64");
    expect(isValidAirtableSignature(body, sign(body, otherSecret), secretBase64)).toBe(false);
  });

  it("rejects a missing header or an unconfigured secret", () => {
    expect(isValidAirtableSignature(body, undefined, secretBase64)).toBe(false);
    expect(isValidAirtableSignature(body, sign(body), "")).toBe(false);
  });
});
