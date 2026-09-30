import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { buttonVariants } from "@/components/ui/button";
import {
  ArrowRight,
  Download,
  MapPin,
  Building2,
  Calendar,
  Zap,
  Phone,
  CheckCircle,
  Trees,
  Train,
  Shield,
  Sparkles,
  Award,
} from "lucide-react";
import { cn } from "@/lib/utils";

const FEATURES = [
  {
    icon: Trees,
    tag: "Nature & Écologie",
    title: "2 400 m² d'espaces paysagers",
    desc: "Un véritable havre de biodiversité en cœur d'îlot : jardins partagés, cheminements arborés et terrasses privatives végétalisées.",
  },
  {
    icon: Train,
    tag: "Mobilité douce",
    title: "Tram B à 300 mètres",
    desc: "La station Peixotto à 4 minutes à pied vous relie à la place de la Comédie et au centre historique de Bordeaux en 12 minutes.",
  },
  {
    icon: Building2,
    tag: "Architecture",
    title: "48 logements du T2 au T4",
    desc: "Des typologies soignées, pensées pour maximiser la luminosité naturelle avec de généreuses hauteurs sous plafond et stationnements en sous-sol.",
  },
  {
    icon: Zap,
    tag: "Basse consommation",
    title: "Performance énergétique RE 2020",
    desc: "Conception bioclimatique, isolation acoustique et thermique renforcée, pompes à chaleur individuelles et charges réduites.",
  },
  {
    icon: Shield,
    tag: "Sécurité & Confort",
    title: "Résidence fermée et sécurisée",
    desc: "Accès piétons par badge Vigik et vidéophone, parkings sous-sol sécurisés, locaux à vélos électrifiés et ascenseurs basse consommation.",
  },
  {
    icon: Award,
    tag: "Financement & Fiscalité",
    title: "Éligible PTZ & Dispositifs neufs",
    desc: "Frais de notaire réduits à ~2,5%, exonération temporaire de taxe foncière et accompagnement personnalisé pour votre plan de financement.",
  },
];

const TRUST_STATS = [
  { value: "48", label: "Appartements neufs", sub: "Du T2 au T4 familial" },
  { value: "T2 2027", label: "Livraison prévue", sub: "Travaux en cours" },
  { value: "300 m", label: "Du tramway ligne B", sub: "Station Peixotto" },
  { value: "100%", label: "Garantie d'achèvement", sub: "Promoteur régional certifié" },
];

export default function HomePage() {
  return (
    <>
      <Head>
        <title>Les Jardins de Vauban — Appartements Neufs Bordeaux | Kalimo Promotion</title>
        <meta
          name="description"
          content="Programme immobilier neuf à Bordeaux (33) : 48 appartements d'exception du T2 au T4 au cœur d'un parc paysager de 2 400 m². Tram B à 300m. Livraison T2 2027."
        />
        <meta property="og:title" content="Les Jardins de Vauban — Logements Neufs à Bordeaux" />
        <meta
          property="og:description"
          content="Découvrez 48 appartements neufs du T2 au T4 à Bordeaux. Consultez les plans, prix et disponibilités en temps réel."
        />
      </Head>

      {/* ─── Hero Section ─────────────────────────────────────────────────── */}
      <section className="relative bg-[#1B2A4A] text-white overflow-hidden min-h-[85vh] flex items-center">
        {/* Voiles dégradés pour contraste parfait et élégance */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#1B2A4A] via-[#1B2A4A]/90 to-[#1B2A4A]/50 z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1B2A4A] via-transparent to-transparent z-10" />

        {/* Image de fond */}
        <div className="absolute inset-0">
          <Image
            src="/hero.jpg"
            alt="Perspective extérieure de la résidence Les Jardins de Vauban à Bordeaux"
            fill
            className="object-cover object-center scale-105 transform motion-safe:animate-pulse-subtle"
            priority
          />
        </div>

        <div className="relative z-20 max-w-6xl mx-auto px-6 sm:px-8 py-24 sm:py-32 w-full">
          {/* Badge statut */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-1.5 text-xs text-[#C9A96E] font-sans font-medium mb-6">
            <Sparkles className="w-3.5 h-3.5 text-[#C9A96E]" />
            <span className="uppercase tracking-[0.18em]">Commercialisation exclusive en avant-première</span>
          </div>

          {/* Titre majestueux */}
          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-semibold leading-[1.08] mb-6 max-w-3xl text-balance">
            L&apos;élégance végétale en cœur de Bordeaux
          </h1>

          <p className="font-sans text-white/80 text-base sm:text-xl max-w-2xl leading-relaxed mb-10 text-balance font-light">
            Découvrez <strong>Les Jardins de Vauban</strong> : une adresse confidentielle de 48 appartements neufs du T2 au T4 bordés d&apos;un parc paysager préservé, à 4 minutes à pied du tramway.
          </p>

          {/* Boutons d'action */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 max-w-md sm:max-w-none">
            <Link
              href="/lots"
              prefetch={true}
              className={cn(
                buttonVariants({ size: "lg" }),
                "bg-[#C9A96E] text-[#1B2A4A] hover:bg-[#DFC093] font-sans font-bold text-sm tracking-wide h-13 px-8 rounded-xl shadow-lg transition-all hover:translate-y-[-1px] flex items-center justify-center gap-2"
              )}
            >
              Découvrir les 48 lots et prix
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/brochure.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "border-white/30 text-white bg-white/5 hover:bg-white/15 backdrop-blur-sm font-sans text-sm h-13 px-7 rounded-xl flex items-center justify-center gap-2"
              )}
            >
              <Download className="w-4 h-4 text-[#C9A96E]" />
              Télécharger la plaquette PDF
            </Link>
          </div>

          {/* Badges d'assurance */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-16 pt-8 border-t border-white/10 max-w-4xl">
            {[
              { icon: MapPin, text: "Bordeaux — Rive Gauche" },
              { icon: Building2, text: "Du 2 au 4 pièces" },
              { icon: Calendar, text: "Livraison 2e trimestre 2027" },
              { icon: Zap, text: "Norme environnementale RE 2020" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2.5 text-xs font-sans text-white/75">
                <Icon className="w-4 h-4 text-[#C9A96E] flex-shrink-0" />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Bandeau Chiffres Clés & Confiance ─────────────────────────────── */}
      <section className="bg-white border-b border-stone-200/80">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 py-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 divide-y sm:divide-y-0 sm:divide-x divide-stone-200">
            {TRUST_STATS.map((item, index) => (
              <div
                key={item.label}
                className={cn("pt-4 sm:pt-0 flex flex-col", index !== 0 && "sm:pl-8")}
              >
                <span className="font-serif text-3xl sm:text-4xl font-bold text-[#1B2A4A] tracking-tight">
                  {item.value}
                </span>
                <span className="font-sans text-xs font-semibold text-stone-800 uppercase tracking-wider mt-1">
                  {item.label}
                </span>
                <span className="font-sans text-xs text-stone-400 mt-0.5">
                  {item.sub}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Section Atouts du Programme ──────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 sm:px-8 py-24 sm:py-32">
        <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-20">
          <p className="text-[#C9A96E] text-xs font-sans tracking-[0.25em] uppercase font-semibold mb-3">
            Prestations & Environnement
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#1B2A4A] font-semibold leading-tight mb-5">
            L&apos;art de vivre bordelais, la sérénité en plus
          </h2>
          <p className="font-sans text-stone-600 text-sm sm:text-base leading-relaxed">
            Conçue par des architectes de renom, la résidence concilie le cachet de la pierre bordelaise avec les exigences environnementales les plus poussées.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {FEATURES.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="group bg-white rounded-3xl border border-stone-200/80 p-8 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#1B2A4A]/5 border border-[#1B2A4A]/10 flex items-center justify-center mb-6 group-hover:bg-[#1B2A4A] transition-colors">
                    <Icon className="w-6 h-6 text-[#C9A96E] group-hover:text-white transition-colors" />
                  </div>
                  <span className="text-[11px] font-sans font-bold uppercase tracking-wider text-[#C9A96E] block mb-2">
                    {item.tag}
                  </span>
                  <h3 className="font-serif text-xl font-bold text-[#1B2A4A] mb-3 leading-snug">
                    {item.title}
                  </h3>
                  <p className="font-sans text-xs sm:text-sm text-stone-500 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── Section Situation Géographique ───────────────────────────────── */}
      <section className="bg-stone-100/60 border-y border-stone-200/80 py-24 sm:py-32">
        <div className="max-w-6xl mx-auto px-6 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Texte & points d'intérêt */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <p className="text-[#C9A96E] text-xs font-sans tracking-[0.25em] uppercase font-semibold mb-2">
                  Emplacement Stratégique
                </p>
                <h2 className="font-serif text-3xl sm:text-4xl text-[#1B2A4A] font-semibold leading-tight">
                  Quartier Vauban — Nansouty
                </h2>
              </div>

              <p className="font-sans text-stone-600 text-sm leading-relaxed">
                Situé dans le prolongement de la place Nansouty, ce quartier résidentiel très convoité offre un équilibre parfait entre vie commerçante de quartier et calme absolu.
              </p>

              <div className="space-y-3 pt-2">
                {[
                  { time: "4 min à pied", label: "Tram B (Station Peixotto) — direct hypercentre & universités" },
                  { time: "5 min à pied", label: "Commerces de bouche, boulangeries artisanales et supermarché bio" },
                  { time: "3 min à vélo", label: "Écoles maternelles, primaires et collège de secteur réputé" },
                  { time: "12 min en tram", label: "Gare TGV Bordeaux Saint-Jean (Paris à 2h04)" },
                ].map((pt) => (
                  <div
                    key={pt.label}
                    className="flex items-start gap-3 bg-white rounded-xl p-3.5 border border-stone-200/70"
                  >
                    <span className="bg-[#1B2A4A] text-white text-[11px] font-sans font-semibold px-2.5 py-1 rounded-md whitespace-nowrap">
                      {pt.time}
                    </span>
                    <span className="font-sans text-xs text-stone-700 leading-snug pt-0.5">
                      {pt.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Carte intégrée dans un écrin élégant */}
            <div className="lg:col-span-6">
              <div className="bg-white rounded-3xl p-3 border border-stone-200/80 shadow-lg overflow-hidden">
                <div className="relative rounded-2xl overflow-hidden h-[360px] sm:h-[420px]">
                  <iframe
                    src="https://www.openstreetmap.org/export/embed.html?bbox=-0.5890%2C44.8280%2C-0.5690%2C44.8380&layer=mapnik&marker=44.8330%2C-0.5790"
                    width="100%"
                    height="100%"
                    title="Carte de situation du programme Les Jardins de Vauban"
                    className="border-0 w-full h-full"
                    loading="lazy"
                  />
                  <div className="absolute bottom-3 left-3 bg-[#1B2A4A] text-white px-3.5 py-2 rounded-xl text-xs font-sans shadow-md flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[#C9A96E]" />
                    <span>Rue Vauban, 33000 Bordeaux</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Section Pourquoi Choisir Kalimo Promotion ─────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 sm:px-8 py-20 sm:py-24">
        <div className="bg-[#1B2A4A] rounded-3xl text-white p-8 sm:p-14 relative overflow-hidden">
          <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-[#C9A96E]/10 pointer-events-none blur-2xl" />
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10">
            <div className="md:col-span-8 space-y-4">
              <span className="text-[#C9A96E] text-xs font-sans tracking-[0.2em] uppercase font-semibold">
                Promoteur Régional Engagé
              </span>
              <h3 className="font-serif text-2xl sm:text-4xl font-semibold leading-tight">
                L&apos;ancrage et la solidité de Kalimo Promotion
              </h3>
              <p className="font-sans text-white/75 text-sm leading-relaxed max-w-2xl font-light">
                Acteur de référence en Nouvelle-Aquitaine fort de 40 collaborateurs, KALIMO Promotion livre chaque année 6 à 8 résidences d&apos;exception. Tous nos programmes bénéficient de la Garantie Financière d&apos;Achèvement (GFA) extrinsèque auprès d&apos;un établissement bancaire de premier rang.
              </p>
              <div className="flex flex-wrap gap-4 pt-2 font-sans text-xs text-[#C9A96E]">
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-400" /> Garantie décennale
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-400" /> Garantie de parfait achèvement
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-400" /> Garantie biennale
                </span>
              </div>
            </div>

            <div className="md:col-span-4 flex flex-col gap-3 justify-center">
              <Link
                href="/lots"
                prefetch={true}
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "bg-[#C9A96E] text-[#1B2A4A] hover:bg-[#DFC093] font-sans font-bold text-sm tracking-wide rounded-xl h-12 w-full justify-center"
                )}
              >
                Consulter les 48 lots
              </Link>
              <Link
                href="/contact"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "border-white/30 text-white bg-white/5 hover:bg-white/10 font-sans text-sm rounded-xl h-12 w-full justify-center"
                )}
              >
                Prendre rendez-vous
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Bannière de Réassurance & CTA Final ───────────────────────────── */}
      <section className="bg-stone-50 border-t border-stone-200/80 py-20 text-center">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="font-serif text-3xl sm:text-4xl text-[#1B2A4A] font-semibold mb-4 leading-tight">
            Préparez votre projet en toute sérénité
          </h2>
          <p className="font-sans text-stone-600 text-sm leading-relaxed mb-8 max-w-xl mx-auto">
            La directrice commerciale et l&apos;équipe Kalimo Promotion sont à votre écoute pour vous présenter les plans détaillés et réserver votre futur logement.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contact"
              className={cn(
                buttonVariants({ size: "lg" }),
                "bg-[#1B2A4A] text-white hover:bg-[#243660] font-sans font-bold text-sm px-8 h-12 rounded-xl shadow-md w-full sm:w-auto"
              )}
            >
              Contacter l&apos;équipe commerciale
            </Link>
            <a
              href="tel:+33556000000"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "border-stone-300 text-stone-800 hover:bg-white font-sans text-sm px-6 h-12 rounded-xl flex items-center gap-2 w-full sm:w-auto"
              )}
            >
              <Phone className="w-4 h-4 text-[#C9A96E]" />
              05 56 00 00 00
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
