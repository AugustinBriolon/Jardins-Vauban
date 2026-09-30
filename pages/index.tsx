import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import type { InferGetStaticPropsType } from "next";
import type { Lot } from "@/types";
import { getLotsStaticProps } from "@/lib/staticProps";
import { LOT_TYPES, countByType, filtersToQuery, formatPrice, startingPriceByType } from "@/lib/lots";
import { SITE } from "@/lib/site";
import ActionLink from "@/components/ui/ActionLink";
import SectionHeading from "@/components/ui/SectionHeading";
import Facade from "@/components/lots/Facade";
import LotDrawer from "@/components/lots/LotDrawer";
import { useSelectedLot } from "@/hooks/useSelectedLot";
import Neighbourhood from "@/components/home/Neighbourhood";
import LotSearch from "@/components/home/LotSearch";
import heroPhoto from "@/public/images/rue-pierre-bordeaux.jpg";
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

const MILESTONES = [
  { period: "Automne 2026", title: "Avant-première", text: "Inscriptions ouvertes, priorité de choix aux premiers contacts.", current: true },
  { period: "Début 2027", title: "Ouverture commerciale", text: "Grille de prix définitive et signature des contrats de réservation." },
  { period: "Mi-2027", title: "Lancement du chantier", text: "Démarrage des travaux après obtention de la garantie d'achèvement." },
  { period: SITE.delivery, title: "Livraison", text: "Remise des clés et réception des parties communes." },
];

export default function HomePage({ lots }: InferGetStaticPropsType<typeof getStaticProps>) {
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

      <Hero lots={lots} />
      <Programme />
      <LotsPreview lots={lots} />
      <Neighbourhood />
      <Timeline />
      <Developer />
      <FinalCall />
    </>
  );
}

function Hero({ lots }: { lots: Lot[] }) {
  const router = useRouter();

  return (
    <section className="shell pt-28 pb-20 lg:pt-32 lg:pb-32">
      <div data-reveal className="flex flex-wrap items-center gap-x-6 gap-y-2 border-b border-line pb-5">
        <p className="eyebrow">Bordeaux — {SITE.district}</p>
        <p className="eyebrow hidden sm:block">Livraison {SITE.deliveryShort}</p>
        <p className="eyebrow ml-auto flex items-center gap-2 whitespace-nowrap text-garden">
          <span className="relative flex size-2">
            <span className="absolute inset-0 rounded-full bg-garden motion-safe:animate-ping" />
            <span className="relative size-2 rounded-full bg-garden" />
          </span>
          Avant-première<span className="hidden sm:inline">{NBSP}ouverte</span>
        </p>
      </div>

      <div className="mt-8 grid gap-6 sm:mt-10 sm:gap-8 lg:mt-14 lg:grid-cols-12 lg:items-end">
        <h1
          data-reveal="lines"
          className="font-display text-[clamp(3.5rem,11vw,11rem)] leading-[0.88] tracking-[-0.035em] lg:col-span-9 lg:text-[clamp(5rem,8.2vw,11rem)]"
        >
          Les Jardins <em className="text-garden">de</em>
          <br />
          Vauban
        </h1>
        <div data-reveal data-reveal-delay="0.3" className="space-y-4 lg:col-span-3 lg:pb-3">
          <p className="max-w-sm leading-relaxed text-ink-soft sm:text-lg">
            {SITE.totalLots} appartements du T2 au T4 autour d&apos;un jardin de {SITE.gardenArea}, au sud du centre historique.
          </p>
          <ActionLink href={SITE.brochureUrl} variant="text" target="_blank" rel="noopener">
            Télécharger la plaquette
          </ActionLink>
        </div>
      </div>

      {lots.length > 0 && (
        <div data-reveal data-reveal-delay="0.45" className="mt-8 sm:mt-12 lg:mt-16">
          <LotSearch
            lots={lots}
            onSearch={(filters) => router.push({ pathname: "/lots", query: { ...filtersToQuery(filters) } })}
          />
        </div>
      )}

      <div data-reveal="image" data-reveal-delay="0.2" className="relative mt-8 aspect-[4/5] overflow-hidden sm:mt-12 sm:aspect-[21/9] lg:mt-16">
        <Image
          src={heroPhoto}
          alt="Rue bordée de façades en pierre blonde dans le centre de Bordeaux"
          fill
          priority
          placeholder="blur"
          sizes="100vw"
          data-parallax="14"
          className="scale-110 object-cover"
        />
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
  const { selectedLot, selectLot, closeLot } = useSelectedLot(lots);
  const startingPrices = startingPriceByType(lots);
  const typeCounts = countByType(lots);

  return (
    <section className="bg-paper py-24 lg:py-36">
      <div className="shell">
        <SectionHeading index="02" label="Les lots" title={<>Chaque fenêtre est un logement. Mise à jour en continu.</>} />

        <div className="mt-16 grid gap-14 lg:mt-24 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-8">
            {lots.length > 0 ? (
              <Facade lots={lots} selectedId={selectedLot?.id ?? null} onSelect={selectLot} />
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
      <LotDrawer
        lot={selectedLot}
        allLots={lots}
        onClose={closeLot}
        onShowSimilar={(lot) => router.push({ pathname: "/lots", query: { ...filtersToQuery({ types: [lot.type], budgetMax: null, availableOnly: true }) } })}
      />
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
            {SITE.developer} est un promoteur de Nouvelle-Aquitaine. Quarante collaborateurs, six à huit résidences livrées chaque année.
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
            Un conseiller vous rappelle sous 48{NBSP}h ouvrées pour vous présenter les lots qui correspondent à votre projet.
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
