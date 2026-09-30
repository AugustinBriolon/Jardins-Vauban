import Head from "next/head";
import Link from "next/link";
import ContactForm from "@/components/ContactForm";
import { buttonVariants } from "@/components/ui/button";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ShieldCheck,
  Download,
  Sparkles,
  CalendarCheck,
  Building,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function ContactPage() {
  return (
    <>
      <Head>
        <title>Contact & Renseignements — Les Jardins de Vauban | Kalimo Promotion</title>
        <meta
          name="description"
          content="Prenez contact avec l'équipe commerciale de Kalimo Promotion pour réserver un appartement neuf dans la résidence Les Jardins de Vauban à Bordeaux. Réponse garantie sous 24h ouvrées."
        />
      </Head>

      {/* ── En-tête de page ────────────────────────────────────────────────── */}
      <section className="bg-[#1B2A4A] text-white py-16 sm:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#1B2A4A]/80 pointer-events-none" />
        <div className="max-w-6xl mx-auto px-6 sm:px-8 relative z-10">
          <div className="flex items-center gap-2 text-xs font-sans text-[#C9A96E] uppercase tracking-[0.22em] mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Service Commercial Dédié</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-semibold mb-4 tracking-tight">
            Demande de renseignement
          </h1>
          <p className="font-sans text-white/70 text-sm sm:text-base max-w-xl font-light leading-relaxed">
            Vous souhaitez des informations sur un lot précis, planifier une visite du site ou échanger sur votre capacité d&apos;emprunt ? Notre équipe vous répond sous 24 heures ouvrées.
          </p>
        </div>
      </section>

      {/* ── Grille formulaire + coordonnées ───────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 sm:px-8 py-14 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* Colonne Formulaire (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-stone-200/90 p-7 sm:p-10 shadow-sm">
            <div className="mb-8">
              <h2 className="font-serif text-2xl font-bold text-[#1B2A4A] mb-2">
                Échangeons sur votre projet
              </h2>
              <p className="font-sans text-xs sm:text-sm text-stone-500 leading-relaxed">
                Remplissez les champs ci-dessous. Vos coordonnées restent strictement confidentielles et ne seront jamais partagées.
              </p>
            </div>
            <ContactForm />
          </div>

          {/* Colonne Informations & Réassurance (5 cols) */}
          <aside className="lg:col-span-5 space-y-6">
            
            {/* Carte Coordonnées Promoteur */}
            <div className="bg-white rounded-3xl border border-stone-200/90 p-7 shadow-sm space-y-5">
              <div className="flex items-center gap-3 border-b border-stone-100 pb-4">
                <div className="w-10 h-10 rounded-xl bg-[#1B2A4A] flex items-center justify-center flex-shrink-0">
                  <Building className="w-5 h-5 text-[#C9A96E]" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#1B2A4A]">
                    KALIMO Promotion
                  </h3>
                  <p className="font-sans text-xs text-stone-400">Siège Régional Nouvelle-Aquitaine</p>
                </div>
              </div>

              <ul className="space-y-4 font-sans text-xs sm:text-sm text-stone-600">
                <li className="flex items-start gap-3.5">
                  <MapPin className="w-4 h-4 text-[#C9A96E] mt-0.5 flex-shrink-0" />
                  <span>
                    12 allée de Tourny
                    <br />
                    33000 Bordeaux (Parking Tourny à 50m)
                  </span>
                </li>

                <li className="flex items-center gap-3.5">
                  <Phone className="w-4 h-4 text-[#C9A96E] flex-shrink-0" />
                  <a
                    href="tel:+33556000000"
                    className="font-semibold text-[#1B2A4A] hover:text-[#C9A96E] transition-colors"
                  >
                    05 56 00 00 00
                  </a>
                </li>

                <li className="flex items-center gap-3.5">
                  <Mail className="w-4 h-4 text-[#C9A96E] flex-shrink-0" />
                  <a
                    href="mailto:contact@kalimo-promotion.fr"
                    className="hover:text-[#C9A96E] transition-colors"
                  >
                    contact@kalimo-promotion.fr
                  </a>
                </li>
              </ul>
            </div>

            {/* Carte Engagement Réactivité */}
            <div className="bg-[#1B2A4A] text-white rounded-3xl p-7 shadow-sm space-y-3">
              <div className="flex items-center gap-2.5 text-[#C9A96E] text-xs font-sans font-bold uppercase tracking-wider">
                <CalendarCheck className="w-4 h-4" />
                <span>Engagement de réactivité</span>
              </div>
              <h3 className="font-serif text-lg font-bold">
                Réponse sous 24 heures ouvrées
              </h3>
              <p className="font-sans text-white/70 text-xs sm:text-sm leading-relaxed font-light">
                Chaque demande fait l&apos;objet d&apos;une étude personnalisée par notre conseillère dédiée afin de vérifier la disponibilité des lots en temps réel.
              </p>
            </div>

            {/* Carte Conformité Données RGPD */}
            <div className="bg-stone-50 rounded-3xl border border-stone-200/90 p-7 space-y-3">
              <div className="flex items-center gap-2.5 text-[#1B2A4A] text-xs font-sans font-bold uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Protection des Données Personnelles</span>
              </div>
              <p className="font-sans text-xs text-stone-500 leading-relaxed">
                Vos données sont exclusivement traitées pour répondre à votre demande. Elles sont conservées 12 mois maximum et ne font l&apos;objet d&apos;aucune revente commerciale.
              </p>
              <div className="pt-1">
                <Link
                  href="/politique-de-confidentialite"
                  className="inline-flex items-center gap-1.5 text-xs font-sans font-semibold text-[#1B2A4A] hover:text-[#C9A96E] underline transition-colors"
                >
                  Consulter notre Politique de Confidentialité complète →
                </Link>
              </div>
            </div>

            {/* Téléchargement direct de plaquette */}
            <Link
              href="/brochure.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "w-full h-12 rounded-2xl border-stone-300 text-stone-800 hover:bg-stone-100 font-sans text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm"
              )}
            >
              <Download className="w-4 h-4 text-[#C9A96E]" />
              Télécharger la plaquette (PDF)
            </Link>

          </aside>
        </div>
      </section>
    </>
  );
}
