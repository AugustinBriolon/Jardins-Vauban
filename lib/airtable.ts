import Airtable from "airtable";
import type { Lot, ContactFormData } from "@/types";
import { parseLotRecord } from "@/lib/lotRecord";
import { sortLots } from "@/lib/lots";

// Nettoyage anti-injection de formule pour tableurs (Excel, LibreOffice, Airtable export)
function sanitizeForSpreadsheet(val: string | undefined | null): string {
  if (!val) return "";
  const trimmed = val.trim();
  if (/^[=+@\-\t\r]/.test(trimmed)) {
    return `'${trimmed}`;
  }
  return trimmed;
}

// Instance Singleton pour éviter de recréer les clients HTTP
let cachedBase: Airtable.Base | null = null;

function getBase(): Airtable.Base {
  if (cachedBase) return cachedBase;

  const apiKey =
    process.env.AIRTABLE_API_KEY ||
    process.env.AIRTABLE_PERSONAL_ACCESS_TOKEN ||
    process.env.AIRTABLE_TOKEN;
  const baseId = process.env.AIRTABLE_BASE_ID;

  if (!apiKey || !baseId) {
    throw new Error(
      `Variables d'environnement Airtable manquantes. Requis : AIRTABLE_API_KEY (${Boolean(
        apiKey
      )}) et AIRTABLE_BASE_ID (${Boolean(baseId)}).`
    );
  }

  cachedBase = new Airtable({ apiKey }).base(baseId);
  return cachedBase;
}

// ─── Lots ────────────────────────────────────────────────────────────────────

/** Reads every lot, keeping only records that pass validation (see lib/lotRecord.ts). */
async function fetchLots(): Promise<Lot[]> {
  // No view on purpose: the site must not depend on how the sales team arranges Airtable views.
  const records = await getBase()("Lots").select().all();
  const lots: Lot[] = [];

  for (const record of records) {
    const parsed = parseLotRecord(record.id, record.fields);
    if (parsed.ok) lots.push(parsed.lot);
    else console.warn(`[airtable] Lot ${parsed.reference} ignoré : ${parsed.problems.join(" ; ")}`);
  }

  return sortLots(lots, "reference");
}

// During `next build` every lot page asks for the same list: share one request per
// build worker to stay under Airtable's 5 requests/s. Never cached at runtime, so a
// rebuild triggered by the webhook always reads fresh data.
let buildCache: Promise<Lot[]> | null = null;

export function getLots(): Promise<Lot[]> {
  if (process.env.NEXT_PHASE !== "phase-production-build") return fetchLots();
  buildCache ??= fetchLots().catch((error) => {
    buildCache = null;
    throw error;
  });
  return buildCache;
}

// ─── Demandes ─────────────────────────────────────────────────────────────────

export async function createDemande(data: ContactFormData): Promise<string> {
  const base = getBase();
  const record = await base("Demandes").create({
    Nom: sanitizeForSpreadsheet(data.nom),
    Prénom: sanitizeForSpreadsheet(data.prenom),
    Email: data.email.trim().toLowerCase(),
    Téléphone: sanitizeForSpreadsheet(data.telephone || ""),
    "Lot souhaité": sanitizeForSpreadsheet(data.lotSouhaite || ""),
    Message: sanitizeForSpreadsheet(data.message),
    "Consentement RGPD": Boolean(data.consentement),
    "Date de demande": new Date().toISOString(),
    Source: "Site web – Les Jardins de Vauban",
  });

  return record.id;
}
