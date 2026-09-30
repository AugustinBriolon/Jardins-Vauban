import { z } from "zod";

/** Single validation contract for the enquiry form, used by the browser and the API route. */
export const contactSchema = z.object({
  prenom: z.string().trim().min(1, "Indiquez votre prénom.").max(80, "80 caractères maximum."),
  nom: z.string().trim().min(1, "Indiquez votre nom.").max(80, "80 caractères maximum."),
  email: z.string().trim().max(255, "Adresse trop longue.").email("Adresse e-mail invalide."),
  telephone: z
    .string()
    .trim()
    .max(25, "Numéro trop long.")
    .regex(/^[0-9+.\s()-]*$/, "Numéro de téléphone invalide.")
    .optional()
    .or(z.literal("")),
  lotSouhaite: z
    .string()
    .trim()
    .max(30, "Référence trop longue.")
    .regex(/^[a-zA-Z0-9\s_-]*$/, "Référence de lot invalide.")
    .optional()
    .or(z.literal("")),
  message: z.string().trim().min(5, "Quelques mots sur votre projet (5 caractères minimum).").max(3000, "3 000 caractères maximum."),
  consentement: z.boolean().refine((value) => value, "Votre accord est nécessaire pour que nous puissions vous répondre."),
  website_hp: z.string().optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;
export type ContactField = keyof ContactInput;

/** First error message per field, for inline display. */
export function fieldErrors(input: unknown): Partial<Record<ContactField, string>> {
  const result = contactSchema.safeParse(input);
  if (result.success) return {};
  const errors: Partial<Record<ContactField, string>> = {};
  for (const issue of result.error.issues) {
    const field = issue.path[0] as ContactField;
    errors[field] ??= issue.message;
  }
  return errors;
}
