import { describe, expect, it } from "vitest";
import { contactSchema, fieldErrors } from "@/lib/contactSchema";

const valid = {
  prenom: "Camille",
  nom: "Durand",
  email: "camille@example.fr",
  telephone: "06 12 34 56 78",
  lotSouhaite: "A012",
  message: "Je cherche un T3 exposé sud.",
  consentement: true,
};

describe("contactSchema", () => {
  it("accepts a complete enquiry", () => {
    expect(contactSchema.safeParse(valid).success).toBe(true);
  });

  it("accepts an enquiry without the optional fields", () => {
    expect(contactSchema.safeParse({ ...valid, telephone: "", lotSouhaite: "" }).success).toBe(true);
  });

  it("refuses an enquiry without consent", () => {
    expect(fieldErrors({ ...valid, consentement: false }).consentement).toBeDefined();
  });

  it("rejects characters that could be used for injection in the lot field", () => {
    expect(fieldErrors({ ...valid, lotSouhaite: "=HYPERLINK(1)" }).lotSouhaite).toBeDefined();
  });

  it("reports one message per invalid field", () => {
    const errors = fieldErrors({ ...valid, prenom: "", email: "not-an-email" });
    expect(Object.keys(errors).sort()).toEqual(["email", "prenom"]);
  });
});
