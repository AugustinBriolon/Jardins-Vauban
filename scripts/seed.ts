/**
 * Script de seed Airtable — Les Jardins de Vauban
 * Génère 48 lots réalistes dans la table "Lots".
 *
 * Usage :
 *   cp .env.local.example .env.local   (et remplir les vraies valeurs)
 *   npx ts-node --skip-project scripts/seed.ts
 */

import Airtable from "airtable";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID!
);

type LotType = "T2" | "T3" | "T4";
type Statut = "Disponible" | "Optionné" | "Vendu";
type Exposition =
  | "Nord"
  | "Sud"
  | "Est"
  | "Ouest"
  | "Nord-Est"
  | "Nord-Ouest"
  | "Sud-Est"
  | "Sud-Ouest";

const TYPES: { type: LotType; surfaceMin: number; surfaceMax: number; prixBase: number }[] = [
  { type: "T2", surfaceMin: 42, surfaceMax: 55, prixBase: 195000 },
  { type: "T3", surfaceMin: 62, surfaceMax: 78, prixBase: 260000 },
  { type: "T4", surfaceMin: 85, surfaceMax: 105, prixBase: 340000 },
];

const EXPOSITIONS: Exposition[] = [
  "Sud", "Sud-Ouest", "Sud-Est",
  "Est", "Ouest",
  "Nord-Est", "Nord-Ouest", "Nord",
];

// Distribution : 14 T2, 22 T3, 12 T4 = 48 lots
const DISTRIBUTION: LotType[] = [
  ...Array(14).fill("T2"),
  ...Array(22).fill("T3"),
  ...Array(12).fill("T4"),
];

// Quelques lots vendus/optionnés pour rendre réaliste
const STATUTS: Statut[] = Array(48).fill("Disponible").map((_, i) => {
  if ([2, 7, 15, 23, 31].includes(i)) return "Vendu";
  if ([5, 12, 19, 27].includes(i)) return "Optionné";
  return "Disponible";
});

function rand(min: number, max: number) {
  return Math.round(Math.random() * (max - min) + min);
}

function buildLots() {
  return DISTRIBUTION.map((type, i) => {
    const cfg = TYPES.find((t) => t.type === type)!;
    const surface = rand(cfg.surfaceMin, cfg.surfaceMax);
    const etage = Math.floor(i / 10); // 5 étages, ~10 lots/étage
    const prixM2 = 4200 + etage * 150; // plus cher en étage
    const prix = Math.round((surface * prixM2) / 1000) * 1000;
    const exposition = EXPOSITIONS[i % EXPOSITIONS.length];
    const hasTerrasse = etage === 0 || rand(0, 3) === 0;
    const bâtiment = i < 24 ? "A" : "B";
    const numLot = ((i % 24) + 1).toString().padStart(2, "0");
    const reference = `${bâtiment}${etage}${numLot}`;

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

async function seed() {
  const lots = buildLots();
  console.log(`🌱 Insertion de ${lots.length} lots dans Airtable…`);

  // Airtable limite à 10 enregistrements par requête
  for (let i = 0; i < lots.length; i += 10) {
    const chunk = lots.slice(i, i + 10);
    await base("Lots").create(chunk.map((fields) => ({ fields })));
    console.log(`  ✓ Lots ${i + 1}–${Math.min(i + 10, lots.length)}`);
  }

  console.log("✅ Seed terminé !");
}

seed().catch((err) => {
  console.error("❌ Erreur :", err);
  process.exit(1);
});
