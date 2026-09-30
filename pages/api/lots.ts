import type { NextApiRequest, NextApiResponse } from "next";
import { getLots } from "@/lib/airtable";
import type { Lot } from "@/types";

// Cache mémoire serveur : garantit qu'Airtable n'est jamais sollicité plus d'une fois
// par minute, même en cas d'attaque par cache-busting (?random=123) ou pic de charge.
let memoryCache: { lots: Lot[]; timestamp: number } | null = null;
const CACHE_TTL_MS = 60 * 1000;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Lot[] | { error: string; details?: string }>
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  // Diagnostic immédiat des variables d'environnement
  const hasApiKey = Boolean(
    process.env.AIRTABLE_API_KEY ||
    process.env.AIRTABLE_PERSONAL_ACCESS_TOKEN ||
    process.env.AIRTABLE_TOKEN
  );
  const hasBaseId = Boolean(process.env.AIRTABLE_BASE_ID);

  if (!hasApiKey || !hasBaseId) {
    const missing = [];
    if (!hasApiKey) missing.push("AIRTABLE_API_KEY");
    if (!hasBaseId) missing.push("AIRTABLE_BASE_ID");
    
    console.error(`[api/lots] Variables d'environnement manquantes sur Vercel : ${missing.join(", ")}`);
    return res.status(500).json({
      error: `Variables d'environnement manquantes sur le serveur : ${missing.join(", ")}. Veuillez les configurer dans les paramètres Vercel du projet.`,
    });
  }

  try {
    const now = Date.now();
    if (!memoryCache || now - memoryCache.timestamp > CACHE_TTL_MS) {
      const freshLots = await getLots();
      memoryCache = { lots: freshLots, timestamp: now };
    }

    // Cache CDN Vercel 60s + revalidation arrière-plan 300s
    res.setHeader(
      "Cache-Control",
      "public, s-maxage=60, stale-while-revalidate=300"
    );
    return res.status(200).json(memoryCache.lots);
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : String(err);
    console.error("[api/lots] Erreur Airtable détaillée :", errMsg);

    // Si Airtable est temporairement en erreur mais qu'on a du cache en mémoire, on sert le cache
    if (memoryCache?.lots && memoryCache.lots.length > 0) {
      return res.status(200).json(memoryCache.lots);
    }

    return res.status(500).json({
      error: "Impossible de récupérer les lots depuis Airtable.",
      details: errMsg,
    });
  }
}
