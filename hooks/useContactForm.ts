import { useState } from "react";
import { useRouter } from "next/router";
import { contactSchema, fieldErrors, type ContactField, type ContactInput } from "@/lib/contactSchema";

export type SubmitStatus = "idle" | "sending" | "success" | "error";

const EMPTY_FORM: ContactInput = {
  prenom: "",
  nom: "",
  email: "",
  telephone: "",
  lotSouhaite: "",
  message: "",
  consentement: false,
  website_hp: "",
};

const LOT_REFERENCE = /^[a-zA-Z0-9_-]{1,20}$/;

/**
 * Form state, inline validation (shared Zod schema) and submission to /api/contact.
 * The lot is pre-filled from `lotReference` (lot page) or from `?lot=` (contact page).
 */
export function useContactForm(lotReference?: string) {
  const router = useRouter();
  const [values, setValues] = useState<ContactInput>({ ...EMPTY_FORM, lotSouhaite: lotReference ?? "" });
  const [touched, setTouched] = useState<Partial<Record<ContactField, boolean>>>({});
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [serverError, setServerError] = useState<string | null>(null);

  // Pre-fill the lot when arriving from a lot detail (?lot=A012). The query is only
  // known after hydration, so state is adjusted during render when it first appears.
  const queryLot = typeof router.query.lot === "string" && LOT_REFERENCE.test(router.query.lot) ? router.query.lot : null;
  const [prefilledLot, setPrefilledLot] = useState<string | null>(null);
  if (queryLot && queryLot !== prefilledLot) {
    setPrefilledLot(queryLot);
    setValues((current) => ({ ...current, lotSouhaite: queryLot }));
  }

  const errors = fieldErrors(values);
  const visibleError = (field: ContactField) => (touched[field] ? errors[field] : undefined);

  const setValue = <K extends ContactField>(field: K, value: ContactInput[K]) =>
    setValues((current) => ({ ...current, [field]: value }));

  const touch = (field: ContactField) => setTouched((current) => ({ ...current, [field]: true }));

  const submit = async () => {
    const parsed = contactSchema.safeParse(values);
    if (!parsed.success) {
      setTouched(Object.fromEntries(Object.keys(values).map((field) => [field, true])));
      return;
    }

    setStatus("sending");
    setServerError(null);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      if (!response.ok) {
        const body = (await response.json().catch(() => ({}))) as { error?: string };
        throw new Error(body.error ?? "L'envoi a échoué.");
      }
      setStatus("success");
    } catch (error) {
      setStatus("error");
      setServerError(error instanceof Error ? error.message : "L'envoi a échoué.");
    }
  };

  const restart = () => {
    setValues({ ...EMPTY_FORM, lotSouhaite: lotReference ?? "" });
    setTouched({});
    setStatus("idle");
  };

  return { values, status, serverError, firstName: values.prenom, visibleError, setValue, touch, submit, restart };
}
