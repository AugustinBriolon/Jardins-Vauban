import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { createDemande } from "@/lib/airtable";

// Schéma de validation strict Zod (compatible Zod v3 & v4)
const contactSchema = z.object({
  nom: z
    .string()
    .trim()
    .min(1, "Le nom est requis.")
    .max(80, "Le nom ne doit pas dépasser 80 caractères."),
  prenom: z
    .string()
    .trim()
    .min(1, "Le prénom est requis.")
    .max(80, "Le prénom ne doit pas dépasser 80 caractères."),
  email: z
    .string()
    .trim()
    .email("Veuillez saisir une adresse email valide.")
    .max(255, "L'email est trop long."),
  telephone: z
    .string()
    .trim()
    .max(25, "Numéro de téléphone trop long.")
    .regex(/^[0-9+.\s()-]*$/, "Format de numéro de téléphone non valide.")
    .optional()
    .or(z.literal("")),
  lotSouhaite: z
    .string()
    .trim()
    .max(30, "La référence de lot est trop longue.")
    .regex(/^[a-zA-Z0-9\s_-]*$/, "Caractères invalides dans la référence de lot.")
    .optional()
    .or(z.literal("")),
  message: z
    .string()
    .trim()
    .min(5, "Le message doit contenir au moins 5 caractères.")
    .max(3000, "Le message ne peut pas dépasser 3 000 caractères."),
  consentement: z
    .boolean()
    .refine((val) => val === true, {
      message: "Le consentement au traitement des données personnelles est obligatoire.",
    }),
  website_hp: z.string().optional(),
});

// Limiteur de requêtes in-memory (Rate Limiter IP)
// 5 requêtes maximum par fenêtre de 10 minutes par IP
interface RateLimitRecord {
  count: number;
  resetAt: number;
}
const rateLimitMap = new Map<string, RateLimitRecord>();
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS_PER_WINDOW = 5;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  // Nettoyage périodique pour éviter toute fuite mémoire
  if (rateLimitMap.size > 1000) {
    for (const [key, val] of rateLimitMap.entries()) {
      if (val.resetAt < now) rateLimitMap.delete(key);
    }
  }

  if (!record || record.resetAt < now) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }

  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }

  record.count += 1;
  return true;
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "16kb",
    },
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ success: true } | { error: string }>
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  // 1. Détection de l'IP et contrôle de fréquence (Rate Limiting)
  const forwarded = req.headers["x-forwarded-for"];
  const clientIp = typeof forwarded === "string"
    ? forwarded.split(",")[0].trim()
    : req.socket.remoteAddress || "127.0.0.1";

  if (!checkRateLimit(clientIp)) {
    return res.status(429).json({
      error: "Trop de requêtes. Veuillez patienter quelques minutes avant de renouveler votre demande.",
    });
  }

  // 2. Contrôle anti-CSRF d'origine
  const origin = req.headers.origin;
  const host = req.headers.host;
  if (origin && host && !origin.includes(host)) {
    return res.status(403).json({ error: "Requête non autorisée." });
  }

  // 3. Validation stricte des données avec Zod
  const validation = contactSchema.safeParse(req.body);
  if (!validation.success) {
    // Compatible Zod 3 (error.errors) et Zod 4 (error.issues)
    const errObj = validation.error as unknown as { issues?: Array<{ message: string }>; errors?: Array<{ message: string }> };
    const issueList = errObj.issues || errObj.errors || [];
    const firstError = issueList[0]?.message || "Données fournies non valides.";
    return res.status(400).json({ error: firstError });
  }

  const data = validation.data;

  // 4. Protection Honeypot
  if (data.website_hp && data.website_hp.trim().length > 0) {
    return res.status(200).json({ success: true });
  }

  // 5. Enregistrement sécurisé dans Airtable
  try {
    await createDemande({
      nom: data.nom,
      prenom: data.prenom,
      email: data.email,
      telephone: data.telephone,
      lotSouhaite: data.lotSouhaite,
      message: data.message,
      consentement: data.consentement,
    });

    return res.status(201).json({ success: true });
  } catch (err) {
    console.error("[api/contact] Erreur enregistrement Airtable :", err);
    return res.status(500).json({
      error: "Une erreur technique est survenue. Veuillez réessayer ou nous contacter par téléphone.",
    });
  }
}
