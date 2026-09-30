import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import type { InferGetStaticPropsType } from "next";
import type { Lot } from "@/types";
import { getLotsStaticProps } from "@/lib/staticProps";
import { LOT_TYPES, countByStatus, countByType, formatPrice, startingPriceByType } from "@/lib/lots";
import { SITE } from "@/lib/site";
import ActionLink from "@/components/ui/ActionLink";
import SectionHeading from "@/components/ui/SectionHeading";
import Facade from "@/components/lots/Facade";
import LocationPlan from "@/components/home/LocationPlan";
import heroPhoto from "@/public/images/rue-pierre-bordeaux.jpg";
import quaysPhoto from "@/public/images/quais-garonne.jpg";
import { NBSP } from "@/lib/utils";
import boursePhoto from "@/public/images/place-de-la-bourse.jpg";

export const getStaticProps = getLotsStaticProps;

const PROGRAMME_FACTS = [
  { term: "Logements", value: `${SITE.totalLots} appartements` },
  { term: "Typologies", value: "Du T2 au T4" },
  { term: "Livraison prévue", value: SITE.delivery },
  { term: "Cœur d'îlot", value: `${SITE.gardenArea} de jardin` },
  { term: "Performance", value: `Réglementation ${SITE.energyStandard}` },
  { term: "Stationnement", value: "Parking en sous-sol, local vélos" },
];

const NEIGHBOURHOOD = [
  { time: "3 min", mode: "à pied", place: "Place Nansouty et son marché" },
  { time: "5 min", mode: "à pied", place: "Arrêt de tramway" },
  { time: "8 min", mode: "à vélo", place: "Gare Saint-Jean, Paris en 2 h" },
  { time: "15 min", mode: "en tram", place: "Place de la Comédie" },
];

const MILESTONES = [
  { period: "Automne 2026", title: "Avant-première", text: "Inscriptions ouvertes, priorité de choix aux premiers contacts.", current: true },
  { period: "Début 2027", title: "Ouverture commerciale", text: "Grille de prix définitive et signature des contrats de réservation." },
  { period: "Mi-2027", title: "Lancement du chantier", text: "Démarrage des travaux après obtention de la garantie d'achèvement." },
  { period: SITE.delivery, title: "Livraison", text: "Remise des clés et réception des parties communes." },
];

export default function HomePage({ lots }: InferGetStaticPropsType<typeof getStaticProps>) {
  const available = countByStatus(lots).Disponible;

  return (
    <>
      <Head>
        <title>{`${SITE.programme} — Appartements neufs à Bordeaux Nansouty`}</title>
        <meta
          name="description"
          content={`${SITE.totalLots} appartements neufs du T2 au T4 autour d'un jardin de ${SITE.gardenArea}, quartier Nansouty à Bordeaux. Livraison ${SITE.delivery}. Prix et disponibilités en temps réel.`}
        />
        <meta property="og:title" content={`${SITE.programme} — Bordeaux Nansouty`} />
        <meta property="og:image" content={heroPhoto.src} />
      </Head>

      <Hero available={available} />
      <Programme />
      <LotsPreview lots={lots} />
      <Neighbourhood />
      <Timeline />
      <Developer />
      <FinalCall />
    </>
  );
}

function Hero({ available }: { available: number }) {
  return (
    <section className="shell pt-28 pb-20 lg:pt-36 lg:pb-32">
      <div data-reveal className="flex flex-wrap items-center gap-x-6 gap-y-2 border-b border-line pb-5">
        <p className="eyebrow">Bordeaux — {SITE.district}</p>
        <p className="eyebrow">Livraison {SITE.deliveryShort}</p>
        <p className="eyebrow ml-auto flex items-center gap-2 text-garden">
          <span className="relative flex size-2">
            <span className="absolute inset-0 rounded-full bg-garden motion-safe:animate-ping" />
            <span className="relative size-2 rounded-full bg-garden" />
          </span>
          Avant-première ouverte
        </p>
      </div>

      <h1
        data-reveal="lines"
        className="font-display mt-10 text-[clamp(3.75rem,13.5vw,13rem)] leading-[0.86] tracking-[-0.035em]"
      >
        Les Jardins <em className="text-garden">de</em>
        <br />
        Vauban
      </h1>

      <div className="mt-12 grid gap-10 lg:mt-20 lg:grid-cols-12 lg:gap-8">
        <div className="flex flex-col justify-between gap-10 lg:col-span-4">
          <p data-reveal data-reveal-delay="0.3" className="max-w-sm text-lg leading-relaxed text-ink-soft">
            {SITE.totalLots} appartements du T2 au T4, en pierre claire, autour d&apos;un jardin de {SITE.gardenArea}.
            Au sud du centre historique, à cinq minutes du tramway.
          </p>
          <div data-reveal data-reveal-delay="0.45" className="flex flex-col gap-3 sm:flex-row sm:items-center lg:flex-col lg:items-start">
            <ActionLink href="/lots">Voir les {available > 0 ? `${available} lots disponibles` : "lots"}</ActionLink>
            <ActionLink href={SITE.brochureUrl} variant="text" target="_blank" rel="noopener" className="sm:ml-4 lg:ml-0">
              Télécharger la plaquette
            </ActionLink>
          </div>
        </div>

        <div data-reveal="image" data-reveal-delay="0.2" className="relative aspect-[4/5] overflow-hidden sm:aspect-[16/10] lg:col-span-8">
          <Image
            src={heroPhoto}
            alt="Rue bordée de façades en pierre blonde dans le centre de Bordeaux"
            fill
            priority
            placeholder="blur"
            sizes="(min-width: 1024px) 66vw, 100vw"
            data-parallax="12"
            className="scale-110 object-cover"
          />
        </div>
      </div>
    </section>
  );
}

function Programme() {
  return (
    <section id="programme" className="shell scroll-mt-24 border-t border-line py-24 lg:py-36">
      <SectionHeading
        index="01"
        label="Le programme"
        title={<>La pierre de Bordeaux, un jardin au{NBSP}centre.</>}
      />

      <div className="mt-16 grid gap-12 lg:mt-24 lg:grid-cols-12 lg:gap-8">
        <div data-reveal className="space-y-5 text-lg leading-relaxed text-ink-soft lg:col-span-5 lg:col-start-4">
          <p>
            Deux bâtiments de quatre étages dessinent un cœur d&apos;îlot planté, fermé à la rue.
            Chaque logement ouvre sur le jardin ou sur une terrasse, avec des hauteurs sous plafond de 2,60{NBSP}m.
          </p>
          <p>
            Le dernier niveau, en retrait, accueille des appartements avec de larges terrasses orientées sud.
          </p>
        </div>

        <dl className="lg:col-span-4">
          {PROGRAMME_FACTS.map((fact, index) => (
            <div
              key={fact.term}
              data-reveal
              data-reveal-delay={String(index * 0.06)}
              className="flex items-baseline justify-between gap-6 border-b border-line py-4 first:border-t"
            >
              <dt className="eyebrow">{fact.term}</dt>
              <dd className="text-right">{fact.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

function LotsPreview({ lots }: { lots: Lot[] }) {
  const router = useRouter();
  const startingPrices = startingPriceByType(lots);
  const typeCounts = countByType(lots);

  return (
    <section className="bg-paper py-24 lg:py-36">
      <div className="shell">
        <SectionHeading index="02" label="Les lots" title={<>Chaque fenêtre est un logement. Mise à jour en continu.</>} />

        <div className="mt-16 grid gap-14 lg:mt-24 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-8">
            {lots.length > 0 ? (
              <Facade lots={lots} onSelect={(lot) => router.push(`/lots?lot=${lot.reference}`)} />
            ) : (
              <p className="border border-line p-8 text-ink-soft">La grille des lots est momentanément indisponible.</p>
            )}
          </div>

          <div className="flex flex-col justify-between gap-10 lg:col-span-3 lg:col-start-10">
            <ul>
              {LOT_TYPES.map((type, index) => (
                <li
                  key={type}
                  data-reveal
                  data-reveal-delay={String(index * 0.08)}
                  className="flex items-baseline justify-between border-b border-line py-5 first:border-t"
                >
                  <span>
                    <span className="font-display text-4xl">{type}</span>
                    <span className="eyebrow ml-3">{typeCounts[type]} lots</span>
                  </span>
                  <span className="tabular text-right text-sm">
                    {startingPrices[type] === null ? (
                      <span className="text-ink-soft">Tous réservés</span>
                    ) : (
                      <>
                        <span className="block text-ink-soft">à partir de</span>
                        {formatPrice(startingPrices[type])}
                      </>
                    )}
                  </span>
                </li>
              ))}
            </ul>
            <div data-reveal>
              <ActionLink href="/lots" className="w-full">Explorer les {lots.length || SITE.totalLots} lots</ActionLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Neighbourhood() {
  return (
    <section id="quartier" className="scroll-mt-24 py-24 lg:py-36">
      <div className="shell">
        <SectionHeading index="03" label="Le quartier" title={<>Nansouty, le Bordeaux des échoppes et des marchés.</>} />
      </div>

      <div data-reveal="image" className="relative mt-16 aspect-[16/9] overflow-hidden lg:mt-24 lg:aspect-[21/8]">
        <Image
          src={quaysPhoto}
          alt="Les quais de la Garonne à Bordeaux au lever du soleil"
          fill
          placeholder="blur"
          sizes="100vw"
          data-parallax="16"
          className="scale-115 object-cover"
        />
      </div>

      <div className="shell mt-16 grid gap-14 lg:mt-24 lg:grid-cols-12 lg:gap-8">
        <ul className="lg:col-span-5">
          {NEIGHBOURHOOD.map((item, index) => (
            <li
              key={item.place}
              data-reveal
              data-reveal-delay={String(index * 0.06)}
              className="grid grid-cols-[7rem_1fr] items-baseline gap-4 border-b border-line py-5 first:border-t"
            >
              <span className="font-display tabular text-4xl">{item.time}</span>
              <span>
                <span className="eyebrow block">{item.mode}</span>
                {item.place}
              </span>
            </li>
          ))}
        </ul>
        <div data-reveal className="lg:col-span-6 lg:col-start-7">
          <LocationPlan />
        </div>
      </div>
    </section>
  );
}

function Timeline() {
  return (
    <section className="shell border-t border-line py-24 lg:py-36">
      <SectionHeading index="04" label="Calendrier" title={<>De l&apos;avant-première à la remise des clés.</>} />

      <ol className="mt-16 grid gap-10 sm:grid-cols-2 lg:mt-24 lg:grid-cols-4 lg:gap-8">
        {MILESTONES.map((step, index) => (
          <li key={step.title} data-reveal data-reveal-delay={String(index * 0.1)} className="relative border-t border-line pt-6">
            {step.current && <span aria-hidden className="absolute -top-px left-0 h-0.5 w-full bg-garden" />}
            <p className={step.current ? "eyebrow text-garden" : "eyebrow"}>
              {step.period}
              {step.current && <span className="sr-only"> (étape en cours)</span>}
            </p>
            <h3 className="font-display mt-4 text-3xl">{step.title}</h3>
            <p className="mt-3 text-ink-soft">{step.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

function Developer() {
  return (
    <section className="relative isolate overflow-hidden bg-ink py-24 text-paper lg:py-36">
      <Image
        src={boursePhoto}
        alt=""
        fill
        placeholder="blur"
        sizes="100vw"
        data-parallax="14"
        className="-z-10 scale-115 object-cover opacity-25"
      />
      <div className="shell grid gap-12 lg:grid-cols-12 lg:gap-8">
        <p data-reveal className="eyebrow text-paper/60 lg:col-span-3">Le promoteur</p>
        <div className="lg:col-span-8">
          <p data-reveal="lines" className="font-display text-[clamp(2rem,4.5vw,4rem)] leading-[1.05]">
            {SITE.developer}, promoteur régional en Nouvelle-Aquitaine{NBSP}: quarante collaborateurs, six à huit résidences livrées chaque année.
          </p>
          <p data-reveal className="mt-10 max-w-xl text-paper/70">
            Vente en l&apos;état futur d&apos;achèvement : garantie financière d&apos;achèvement, garantie de parfait achèvement,
            biennale et décennale, comme le prévoit la loi pour chaque logement neuf.
          </p>
        </div>
      </div>
    </section>
  );
}

function FinalCall() {
  return (
    <section className="shell py-24 lg:py-40">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
        <h2
          data-reveal="lines"
          className="font-display text-[clamp(2.75rem,7vw,7rem)] leading-[0.92] tracking-[-0.02em] lg:col-span-8"
        >
          Recevez les plans et les prix avant l&apos;ouverture.
        </h2>
        <div data-reveal className="flex flex-col justify-end gap-6 lg:col-span-4">
          <p className="text-ink-soft">
            Un conseiller vous rappelle sous 48 h ouvrées pour vous présenter les lots qui correspondent à votre projet.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <ActionLink href="/contact">Être rappelé</ActionLink>
            <a href={SITE.phone.href} className="tabular link-draw w-fit py-2 text-lg">{SITE.phone.display}</a>
          </div>
        </div>
      </div>
    </section>
  );
}
