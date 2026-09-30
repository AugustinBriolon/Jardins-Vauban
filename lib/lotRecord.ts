import { z } from "zod";
import type { Lot } from "@/types";
import { LOT_STATUSES, LOT_TYPES } from "@/lib/lots";

/*
 * Lots are edited by hand in Airtable by the sales team. A typo must never reach
 * buyers (e.g. 22 900 000 € instead of 229 000 €, which also breaks the budget filter).
 * Every record is validated here; a record that fails is left out of the site and
 * reported in the server logs, and the rest of the grid keeps working.
 */

export const LOT_FIELDS = {
  reference: "Référence",
  type: "Type",
  surface: "Surface (m²)",
  etage: "Étage",
  exposition: "Exposition",
  prix: "Prix (€)",
  statut: "Statut",
  terrasse: "Terrasse (m²)",
  description: "Description",
} as const;

// Plausibility bounds for new-build apartments in Bordeaux.
export const PLAUSIBLE_PRICE_PER_M2 = { min: 2_000, max: 15_000 };

const EXPOSITIONS = ["Nord", "Sud", "Est", "Ouest", "Nord-Est", "Nord-Ouest", "Sud-Est", "Sud-Ouest"] as const;

const lotRecordSchema = z
  .object({
    [LOT_FIELDS.reference]: z.string().trim().min(1, "référence manquante"),
    [LOT_FIELDS.type]: z.enum(LOT_TYPES, "type inconnu"),
    [LOT_FIELDS.surface]: z.number("surface manquante").min(15, "surface trop petite").max(250, "surface trop grande"),
    [LOT_FIELDS.etage]: z.number("étage manquant").int("étage non entier").min(0).max(20, "étage improbable"),
    [LOT_FIELDS.exposition]: z.enum(EXPOSITIONS, "exposition inconnue"),
    [LOT_FIELDS.prix]: z.number("prix manquant").positive("prix nul ou négatif"),
    [LOT_FIELDS.statut]: z.enum(LOT_STATUSES, "statut inconnu"),
    [LOT_FIELDS.terrasse]: z.number().min(0).max(300, "terrasse improbable").nullish(),
    [LOT_FIELDS.description]: z.string().nullish(),
  })
  .refine(
    (fields) => {
      const perM2 = fields[LOT_FIELDS.prix] / fields[LOT_FIELDS.surface];
      return perM2 >= PLAUSIBLE_PRICE_PER_M2.min && perM2 <= PLAUSIBLE_PRICE_PER_M2.max;
    },
    { message: "prix au m² hors de la fourchette plausible", path: [LOT_FIELDS.prix] }
  );

export type LotParseResult =
  | { ok: true; lot: Lot }
  | { ok: false; reference: string; problems: string[] };

export function parseLotRecord(id: string, fields: Record<string, unknown>): LotParseResult {
  const result = lotRecordSchema.safeParse(fields);
  if (!result.success) {
    return {
      ok: false,
      reference: String(fields[LOT_FIELDS.reference] ?? id),
      problems: result.error.issues.map((issue) => `${String(issue.path[0])} : ${issue.message}`),
    };
  }

  const data = result.data;
  return {
    ok: true,
    lot: {
      id,
      reference: data[LOT_FIELDS.reference],
      type: data[LOT_FIELDS.type],
      surface: data[LOT_FIELDS.surface],
      etage: data[LOT_FIELDS.etage],
      exposition: data[LOT_FIELDS.exposition],
      prix: data[LOT_FIELDS.prix],
      statut: data[LOT_FIELDS.statut],
      terrasse: data[LOT_FIELDS.terrasse] || null,
      description: data[LOT_FIELDS.description] ?? null,
    },
  };
}
