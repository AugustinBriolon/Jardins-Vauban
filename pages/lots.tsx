import Head from "next/head";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import type { GetStaticProps, InferGetStaticPropsType } from "next";
import { getLots } from "@/lib/airtable";
import type { Lot } from "@/types";
import LotsGrid from "@/components/LotsGrid";
import LotCardSkeleton from "@/components/LotCardSkeleton";
import Link from "next/link";
import { Download, FileText, Sparkles, HelpCircle } from "lucide-react";

// ISR (Incremental Static Regeneration) : La page et ses données sont pré-générées
// et préchargées automatiquement par Next.js au survol ou dans le viewport (Instant Navigation).
// Au clic, le changement de page est INSTANTANÉ (0 ms d'attente réseau).
// Toutes les 60 secondes, Vercel régénère la page en tâche de fond si Airtable a été modifié.
export const getStaticProps: GetStaticProps<{ lots: Lot[] }> = async () => {
  try {
    const lots = await getLots();
    return {
      props: { lots },
      revalidate: 60, // Revalidation en tâche de fond toutes les 60 secondes
    };
  } catch (err) {
    console.error("[lots] Airtable error during static generation:", err);
    return {
      props: { lots: [] },
      revalidate: 10,
    };
  }
};

export default function LotsPage({
  lots: initialLots,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const router = useRouter();
  const [lots, setLots] = useState<Lot[]>(initialLots || []);
  const [isNavigating, setIsNavigating] = useState(false);

  // Synchronisation si initialLots était vide au build ou pour rafraîchir en tâche de fond
  useEffect(() => {
    if (initialLots && initialLots.length > 0) {
      setLots(initialLots);
    } else {
      fetch("/api/lots")
        .then((r) => r.json())
        .then((d) => {
          if (Array.isArray(d)) setLots(d);
        })
        .catch(console.error);
    }
  }, [initialLots]);

  // Skeletons instantanés lors des transitions de navigation Next.js
  useEffect(() => {
    const handleStart = (url: string) => {
      if (url.includes("/lots")) setIsNavigating(true);
    };
    const handleComplete = () => setIsNavigating(false);

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  }, [router]);

  const disponibles = lots.filter((l) => l.statut === "Disponible").length;
  const optionnes = lots.filter((l) => l.statut === "Optionné").length;
  const vendus = lots.filter((l) => l.statut === "Vendu").length;

  return (
    <>
      <Head>
        <title>Lots & Prix disponibles — Les Jardins de Vauban | Kalimo Promotion</title>
        <meta
          name="description"
          content={`Consultez la grille des 48 lots du programme Les Jardins de Vauban à Bordeaux. ${disponibles} logements disponibles immédiatement du T2 au T4 avec prix, étages et plans.`}
        />
      </Head>

      {/* ── En-tête de page raffiné ────────────────────────────────────────── */}
      <section className="bg-[#1B2A4A] text-white py-16 sm:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#1B2A4A]/80 pointer-events-none" />
        <div className="max-w-6xl mx-auto px-6 sm:px-8 relative z-10">
          
          <div className="flex items-center gap-2 text-xs font-sans text-[#C9A96E] uppercase tracking-[0.22em] mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Catalogue officiel · Commercialisation active</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="font-serif text-3xl sm:text-5xl font-semibold mb-3 tracking-tight">
                Disponibilité des 48 logements
              </h1>
              <p className="font-sans text-white/70 text-sm sm:text-base max-w-xl font-light leading-relaxed">
                Retrouvez l&apos;ensemble des appartements du 2 au 4 pièces avec surface, étage, orientation, terrasse et prix direct promoteur (frais de notaire réduits).
              </p>
            </div>

            {/* Pastille temps réel */}
            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl px-5 py-3.5 flex items-center gap-4 flex-shrink-0">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[11px] font-sans font-semibold uppercase tracking-wider text-white/90">
                    Statuts en direct
                  </span>
                </div>
                <p className="text-xs font-sans text-white/60">
                  {disponibles} disponibles · {optionnes} sous option · {vendus} vendus
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── Contenu Principal ──────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 sm:px-8 py-12 sm:py-16">
        {isNavigating ? (
          <div className="space-y-6">
            <div className="h-28 bg-white rounded-3xl border border-stone-200/80 animate-pulse p-6" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {Array.from({ length: 8 }).map((_, i) => (
                <LotCardSkeleton key={i} index={i} />
              ))}
            </div>
          </div>
        ) : lots.length === 0 ? (
          <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center max-w-xl mx-auto space-y-4">
            <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
              <HelpCircle className="w-6 h-6" />
            </div>
            <h2 className="font-serif text-xl font-semibold text-[#1B2A4A]">
              Mise à jour du catalogue en cours
            </h2>
            <p className="font-sans text-stone-500 text-sm leading-relaxed">
              La grille des lots est momentanément en synchronisation avec l&apos;équipe commerciale. N&apos;hésitez pas à nous joindre pour obtenir la liste complète immédiatement.
            </p>
            <div className="pt-2">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center bg-[#1B2A4A] text-white px-6 py-2.5 rounded-xl font-sans text-xs font-semibold hover:bg-[#243660] transition-colors"
              >
                Contacter un conseiller
              </Link>
            </div>
          </div>
        ) : (
          <LotsGrid lots={lots} />
        )}

        {/* ── Encart Plaquette PDF Haute Qualité ───────────────────────────── */}
        <div className="mt-16 bg-gradient-to-br from-white to-stone-50 border border-stone-200/90 rounded-3xl p-8 sm:p-10 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-start gap-5">
            <div className="w-14 h-14 rounded-2xl bg-[#1B2A4A] flex items-center justify-center flex-shrink-0 shadow-md">
              <FileText className="w-7 h-7 text-[#C9A96E]" />
            </div>
            <div className="space-y-1">
              <span className="text-[11px] font-sans font-bold uppercase tracking-wider text-[#C9A96E]">
                Documentation Complète
              </span>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1B2A4A]">
                Brochure & Plans Commerciaux
              </h2>
              <p className="font-sans text-stone-500 text-xs sm:text-sm max-w-lg leading-relaxed">
                Téléchargez la plaquette officielle : plans d&apos;étage cotés, notice descriptive des prestations, labels écologiques et simulation de financement.
              </p>
            </div>
          </div>

          <Link
            href="/brochure.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 w-full md:w-auto inline-flex items-center justify-center gap-2.5 bg-[#1B2A4A] text-white hover:bg-[#243660] font-sans font-bold text-xs uppercase tracking-wider px-7 py-4 rounded-xl shadow-md transition-all hover:scale-[1.02]"
          >
            <Download className="w-4 h-4 text-[#C9A96E]" />
            Télécharger la plaquette (PDF)
          </Link>
        </div>
      </section>
    </>
  );
}
