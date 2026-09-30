import Airtable from "airtable";
import type { Lot, ContactFormData } from "@/types";

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

// Helper pour extraire un champ même si la casse ou les accents varient
function getField(record: Airtable.Record<Airtable.FieldSet>, ...candidates: string[]): unknown {
  for (const c of candidates) {
    const val = record.get(c);
    if (val !== undefined && val !== null && val !== "") {
      return val;
    }
  }
  return undefined;
}

// ─── Lots ────────────────────────────────────────────────────────────────────

export async function getLots(): Promise<Lot[]> {
  const base = getBase();

  // IMPORTANT : ne PAS spécifier de 'view' pour ne pas planter si la vue s'appelle "Vue Grille" ou autre
  const records = await base("Lots").select().all();

  const lots: Lot[] = records.map((r) => {
    const rawRef = getField(r, "Référence", "Reference", "Ref", "ref", "Nom", "Name");
    const rawType = getField(r, "Type", "type", "Typologie");
    const rawSurface = Number(getField(r, "Surface (m²)", "Surface", "surface", "m2", "Superficie"));
    const rawEtage = Number(getField(r, "Étage", "Etage", "etage", "Floor"));
    const rawExpo = getField(r, "Exposition", "exposition", "Orientation");
    const rawPrix = Number(getField(r, "Prix (€)", "Prix", "prix", "Price", "Montant"));
    const rawStatut = getField(r, "Statut", "statut", "Status", "status", "État");
    const rawTerrasse = getField(r, "Terrasse (m²)", "Terrasse", "terrasse", "Balcon");
    const rawDesc = getField(r, "Description", "description", "Notes");

    return {
      id: r.id,
      reference: rawRef ? String(rawRef) : r.id.slice(-4).toUpperCase(),
      type: (rawType as Lot["type"]) || "T2",
      surface: Number.isFinite(rawSurface) && rawSurface > 0 ? rawSurface : 45,
      etage: Number.isFinite(rawEtage) ? rawEtage : 0,
      exposition: (rawExpo as Lot["exposition"]) || "Sud",
      prix: Number.isFinite(rawPrix) && rawPrix > 0 ? rawPrix : 200000,
      statut: (rawStatut as Lot["statut"]) || "Disponible",
      terrasse: rawTerrasse && Number(rawTerrasse) > 0 ? Number(rawTerrasse) : null,
      description: rawDesc ? String(rawDesc) : null,
    };
  });

  // Tri naturel par référence côté serveur
  return lots.sort((a, b) =>
    a.reference.localeCompare(b.reference, undefined, { numeric: true })
  );
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
