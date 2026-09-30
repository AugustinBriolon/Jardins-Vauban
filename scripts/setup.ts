/**
 * Script de setup Airtable — Les Jardins de Vauban
 *
 * Ce script :
 *  1. Crée la table "Lots" avec tous ses champs
 *  2. Crée la table "Demandes" avec tous ses champs
 *  3. Insère les 48 lots de démonstration
 *
 * Prérequis :
 *  - Token avec les scopes : data.records:read, data.records:write, schema.bases:write
 *
 * Usage :
 *   cp .env.local.example .env.local   (remplir les vraies valeurs)
 *   npx ts-node --skip-project scripts/setup.ts
 */

import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const BASE_ID = process.env.AIRTABLE_BASE_ID!;
const TOKEN = process.env.AIRTABLE_API_KEY!;

if (!BASE_ID || !TOKEN) {
  console.error("❌ AIRTABLE_API_KEY et AIRTABLE_BASE_ID doivent être définis dans .env.local");
  process.exit(1);
}

const HEADERS = {
  Authorization: `Bearer ${TOKEN}`,
  "Content-Type": "application/json",
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function apiCall(method: string, path: string, body?: unknown) {
  const res = await fetch(`https://api.airtable.com/v0${path}`, {
    method,
    headers: HEADERS,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Airtable API ${method} ${path} → ${res.status}: ${err}`);
  }
  return res.json() as Promise<Record<string, unknown>>;
}

// ─── 1. Créer la table Lots ───────────────────────────────────────────────────

async function createLotsTable() {
  console.log("📋 Création de la table Lots...");

  const result = await apiCall("POST", `/meta/bases/${BASE_ID}/tables`, {
    name: "Lots",
    description: "Les 48 lots du programme Les Jardins de Vauban",
    fields: [
      { name: "Référence", type: "singleLineText" },
      {
        name: "Type",
        type: "singleSelect",
        options: {
          choices: [
            { name: "T2", color: "blueLight2" },
            { name: "T3", color: "greenLight2" },
            { name: "T4", color: "purpleLight2" },
          ],
        },
      },
      { name: "Surface (m²)", type: "number", options: { precision: 0 } },
      { name: "Étage", type: "number", options: { precision: 0 } },
      {
        name: "Exposition",
        type: "singleSelect",
        options: {
          choices: [
            { name: "Nord", color: "grayLight2" },
            { name: "Sud", color: "yellowLight2" },
            { name: "Est", color: "orangeLight2" },
            { name: "Ouest", color: "orangeLight2" },
            { name: "Nord-Est", color: "grayLight2" },
            { name: "Nord-Ouest", color: "grayLight2" },
            { name: "Sud-Est", color: "yellowLight2" },
            { name: "Sud-Ouest", color: "yellowLight2" },
          ],
        },
      },
      { name: "Prix (€)", type: "currency", options: { precision: 0, symbol: "€" } },
      {
        name: "Statut",
        type: "singleSelect",
        options: {
          choices: [
            { name: "Disponible", color: "greenBright" },
            { name: "Optionné", color: "yellowBright" },
            { name: "Vendu", color: "redBright" },
          ],
        },
      },
      { name: "Terrasse (m²)", type: "number", options: { precision: 0 } },
      { name: "Description", type: "multilineText" },
    ],
  });

  const tableId = (result as { id: string }).id;
  console.log(`  ✓ Table Lots créée (id: ${tableId})`);
  return tableId;
}

// ─── 2. Créer la table Demandes ───────────────────────────────────────────────

async function createDemandesTable() {
  console.log("📋 Création de la table Demandes...");

  const result = await apiCall("POST", `/meta/bases/${BASE_ID}/tables`, {
    name: "Demandes",
    description: "Formulaires de contact reçus depuis le site",
    fields: [
      { name: "Nom", type: "singleLineText" },
      { name: "Prénom", type: "singleLineText" },
      { name: "Email", type: "email" },
      { name: "Téléphone", type: "phoneNumber" },
      { name: "Lot souhaité", type: "singleLineText" },
      { name: "Message", type: "multilineText" },
      { name: "Consentement RGPD", type: "checkbox", options: { icon: "check", color: "greenBright" } },
      { name: "Date de demande", type: "dateTime", options: { dateFormat: { name: "european" }, timeFormat: { name: "24hour" }, timeZone: "Europe/Paris" } },
      { name: "Source", type: "singleLineText" },
    ],
  });

  const tableId = (result as { id: string }).id;
  console.log(`  ✓ Table Demandes créée (id: ${tableId})`);
  return tableId;
}

// ─── 3. Seed des 48 lots ─────────────────────────────────────────────────────

type LotType = "T2" | "T3" | "T4";
type Statut = "Disponible" | "Optionné" | "Vendu";
type Exposition = "Nord" | "Sud" | "Est" | "Ouest" | "Nord-Est" | "Nord-Ouest" | "Sud-Est" | "Sud-Ouest";

const TYPES: { type: LotType; surfaceMin: number; surfaceMax: number }[] = [
  { type: "T2", surfaceMin: 42, surfaceMax: 55 },
  { type: "T3", surfaceMin: 62, surfaceMax: 78 },
  { type: "T4", surfaceMin: 85, surfaceMax: 105 },
];

const EXPOSITIONS: Exposition[] = [
  "Sud", "Sud-Ouest", "Sud-Est", "Est",
  "Ouest", "Nord-Est", "Nord-Ouest", "Nord",
];

// 14 T2 + 22 T3 + 12 T4 = 48
const DISTRIBUTION: LotType[] = [
  ...Array<LotType>(14).fill("T2"),
  ...Array<LotType>(22).fill("T3"),
  ...Array<LotType>(12).fill("T4"),
];

const STATUTS: Statut[] = Array(48).fill("Disponible").map((s, i) => {
  if ([2, 7, 15, 23, 31].includes(i)) return "Vendu";
  if ([5, 12, 19, 27].includes(i)) return "Optionné";
  return s as Statut;
});

function rand(min: number, max: number) {
  return Math.round(Math.random() * (max - min) + min);
}

function buildLots() {
  return DISTRIBUTION.map((type, i) => {
    const cfg = TYPES.find((t) => t.type === type)!;
    const surface = rand(cfg.surfaceMin, cfg.surfaceMax);
    const etage = Math.floor(i / 10);
    const prixM2 = 4200 + etage * 150;
    const prix = Math.round((surface * prixM2) / 1000) * 1000;
    const exposition = EXPOSITIONS[i % EXPOSITIONS.length];
    const hasTerrasse = etage === 0 || rand(0, 3) === 0;
    const batiment = i < 24 ? "A" : "B";
    const numLot = ((i % 24) + 1).toString().padStart(2, "0");
    const reference = `${batiment}${etage}${numLot}`;

    return {
      Référence: reference,
      Type: type,
      "Surface (m²)": surface,
      Étage: etage,
      Exposition: exposition,
      "Prix (€)": prix,
      Statut: STATUTS[i],
      ...(hasTerrasse ? { "Terrasse (m²)": rand(8, 20) } : {}),
    };
  });
}

async function seedLots() {
  console.log("🌱 Insertion des 48 lots...");
  const lots = buildLots();

  for (let i = 0; i < lots.length; i += 10) {
    const chunk = lots.slice(i, i + 10);
    await apiCall("POST", `/${BASE_ID}/Lots`, {
      records: chunk.map((fields) => ({ fields })),
    });
    console.log(`  ✓ Lots ${i + 1}–${Math.min(i + 10, lots.length)}`);
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`\n🏗️  Setup Airtable — Les Jardins de Vauban`);
  console.log(`   Base ID : ${BASE_ID}\n`);

  await createLotsTable();
  await createDemandesTable();
  await seedLots();

  console.log(`\n✅ Setup terminé !`);
  console.log(`   → Ouvre Airtable pour vérifier les tables`);
  console.log(`   → Lance ensuite : npm run dev\n`);
}

main().catch((err) => {
  console.error("\n❌ Erreur :", err.message);
  process.exit(1);
});
