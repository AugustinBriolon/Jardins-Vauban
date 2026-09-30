import type { NextApiRequest, NextApiResponse } from "next";
import { getLots } from "@/lib/airtable";
import type { Lot } from "@/types";

// Cache mémoire serveur : garantit qu'Airtable n'est jamais sollicité plus d'une fois
// par minute, même en cas d'attaque par cache-busting (?random=123) ou pic de charge.
let memoryCache: { lots: Lot[]; timestamp: number } | null = null;
const CACHE_TTL_MS = 60 * 1000;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Lot[] | { error: string }>
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ error: "Méthode non autorisée" });
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
  } catch (err) {
    console.error("[api/lots]", err);

    // Si Airtable est indisponible mais qu'on a du cache en mémoire (même expiré), on sert le cache dégradé
    if (memoryCache?.lots) {
      return res.status(200).json(memoryCache.lots);
    }

    return res.status(500).json({ error: "Impossible de récupérer les lots." });
  }
}
