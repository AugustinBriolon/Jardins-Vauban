import Airtable from "airtable";
import type { Lot, ContactFormData } from "@/types";

// Nettoyage anti-injection de formule pour tableurs (Excel, LibreOffice, Airtable export)
// Bloque l'exécution de formules arbitraires (=CMD, +cmd, @sum, etc.) si un export CSV est réalisé
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

  const apiKey = process.env.AIRTABLE_API_KEY;
  const baseId = process.env.AIRTABLE_BASE_ID;

  if (!apiKey || !baseId) {
    throw new Error(
      "Variables d'environnement Airtable manquantes (AIRTABLE_API_KEY / AIRTABLE_BASE_ID)."
    );
  }

  cachedBase = new Airtable({ apiKey }).base(baseId);
  return cachedBase;
}

// ─── Lots ────────────────────────────────────────────────────────────────────

export async function getLots(): Promise<Lot[]> {
  const base = getBase();
  const records = await base("Lots")
    .select({
      view: "Grid view",
      sort: [{ field: "Référence", direction: "asc" }],
    })
    .all();

  return records.map((r) => {
    const rawSurface = Number(r.get("Surface (m²)"));
    const rawEtage = Number(r.get("Étage"));
    const rawPrix = Number(r.get("Prix (€)"));
    const rawTerrasse = r.get("Terrasse (m²)");

    return {
      id: r.id,
      reference: String(r.get("Référence") || "Inconnue"),
      type: (r.get("Type") as Lot["type"]) || "T2",
      surface: Number.isFinite(rawSurface) ? rawSurface : 0,
      etage: Number.isFinite(rawEtage) ? rawEtage : 0,
      exposition: (r.get("Exposition") as Lot["exposition"]) || "Sud",
      prix: Number.isFinite(rawPrix) ? rawPrix : 0,
      statut: (r.get("Statut") as Lot["statut"]) || "Disponible",
      terrasse: rawTerrasse ? Number(rawTerrasse) : null,
      description: r.get("Description") ? String(r.get("Description")) : null,
    };
  });
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
