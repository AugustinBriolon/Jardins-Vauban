import Head from "next/head";
import Link from "next/link";
import type { InferGetStaticPropsType } from "next";
import { ArrowLeft } from "lucide-react";
import type { Lot } from "@/types";
import { getLotPaths, getLotStaticProps } from "@/lib/staticProps";
import { formatFloor, formatPrice, lotPath, similarLots } from "@/lib/lots";
import { SITE } from "@/lib/site";
import { NBSP } from "@/lib/utils";
import Facade from "@/components/lots/Facade";
import LotFacts from "@/components/lots/LotFacts";
import CopyLinkButton from "@/components/lots/CopyLinkButton";
import { StatusLabel } from "@/components/lots/status";
import ContactForm from "@/components/contact/ContactForm";
import ActionLink from "@/components/ui/ActionLink";
import heroPhoto from "@/public/images/rue-pierre-bordeaux.jpg";

export const getStaticPaths = getLotPaths;
export const getStaticProps = getLotStaticProps;

function describe(lot: Lot) {
  const price = lot.statut === "Vendu" ? "vendu" : formatPrice(lot.prix);
  return `${lot.type} de ${lot.surface} m², ${formatFloor(lot.etage).toLowerCase()}, exposé ${lot.exposition}, ${price}. ${SITE.programme}, Bordeaux ${SITE.district}, livraison ${SITE.delivery}.`;
}

export default function LotPage({ lot, lots }: InferGetStaticPropsType<typeof getStaticProps>) {
  const title = `Lot ${lot.reference} — ${lot.type} de ${lot.surface} m² | ${SITE.programme}`;
  const sold = lot.statut === "Vendu";
  const alternatives = similarLots(lot, lots);

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={describe(lot)} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={describe(lot)} />
        <meta property="og:image" content={heroPhoto.src} />
      </Head>

      <article className="shell pt-28 pb-24 lg:pt-36 lg:pb-36">
        <div data-reveal className="flex items-center justify-between gap-4 border-b border-line pb-5">
          <Link href="/lots" className="eyebrow link-draw inline-flex items-center gap-2 pb-0.5">
            <ArrowLeft aria-hidden className="size-3.5" />
            Tous les lots
          </Link>
          <p className="eyebrow">Lot {lot.reference}</p>
        </div>

        <header className="mt-10 grid gap-10 lg:mt-14 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            <h1
              data-reveal="lines"
              className="font-display text-[clamp(3.5rem,9vw,8rem)] leading-[0.9] tracking-[-0.03em]"
            >
              {lot.type} · {lot.surface}{NBSP}m²
            </h1>
            <div data-reveal className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-3">
              <StatusLabel status={lot.statut} />
              <span className="text-ink-soft">{formatFloor(lot.etage)} · Exposition {lot.exposition}</span>
            </div>
          </div>
          <div data-reveal className="flex flex-col justify-end gap-2 lg:col-span-4 lg:col-start-9 lg:items-end lg:text-right">
            <p className="eyebrow">{sold ? "Statut" : "Prix TTC"}</p>
            <p className="font-display tabular text-5xl sm:text-6xl">{sold ? "Vendu" : formatPrice(lot.prix)}</p>
            <CopyLinkButton reference={lot.reference} className="lg:self-end" />
          </div>
        </header>

        <div className="mt-16 grid gap-14 lg:mt-24 lg:grid-cols-12 lg:gap-8">
          <section data-reveal className="lg:col-span-5">
            <h2 className="eyebrow mb-6">Caractéristiques</h2>
            <LotFacts lot={lot} />
            <p className="mt-6 text-sm text-ink-soft">
              Prix TTC hors frais de notaire, TVA 20{NBSP}%. Plans détaillés et grille définitive remis sur demande.
            </p>
          </section>

          <section data-reveal className="lg:col-span-6 lg:col-start-7">
            <h2 className="eyebrow mb-6">Position dans la résidence</h2>
            <div aria-hidden inert>
              <Facade lots={lots} selectedId={lot.id} matchingIds={new Set([lot.id])} compact />
            </div>
          </section>
        </div>

        <section id="demande" className="mt-24 grid scroll-mt-28 gap-12 border-t border-line pt-16 lg:mt-36 lg:grid-cols-12 lg:gap-8 lg:pt-24">
          <div className="lg:col-span-5">
            <h2 data-reveal="lines" className="font-display text-[clamp(2.5rem,5vw,4.5rem)] leading-[0.95] tracking-[-0.02em]">
              {sold ? "Ce lot est vendu. D'autres vous attendent." : "Recevoir le plan de ce lot."}
            </h2>
            <p data-reveal className="mt-6 max-w-md text-lg text-ink-soft">
              {sold
                ? "Laissez-nous vos coordonnées : nous vous proposons les lots équivalents encore disponibles."
                : "Plan détaillé, conditions de réservation et simulation de financement : un conseiller vous répond sous 48\u00a0h ouvrées."}
            </p>
          </div>
          <div data-reveal className="lg:col-span-6 lg:col-start-7">
            <ContactForm lotReference={lot.reference} />
          </div>
        </section>

        {alternatives.length > 0 && (
          <section className="mt-24 border-t border-line pt-16 lg:mt-36">
            <h2 data-reveal className="eyebrow">Autres {lot.type} disponibles</h2>
            <ul className="mt-8 grid gap-4 sm:grid-cols-3">
              {alternatives.map((other, index) => (
                <li key={other.id} data-reveal data-reveal-delay={String(index * 0.08)}>
                  <Link
                    href={lotPath(other.reference)}
                    className="group block border border-line p-6 transition-colors duration-500 hover:border-ink hover:bg-paper"
                  >
                    <p className="eyebrow">Lot {other.reference}</p>
                    <p className="font-display mt-4 text-4xl">
                      {other.type} · {other.surface}{NBSP}m²
                    </p>
                    <p className="tabular mt-2 text-ink-soft">
                      {formatFloor(other.etage)} · {formatPrice(other.prix)}
                    </p>
                    <p className="mt-6 text-sm transition-transform duration-500 ease-out-expo group-hover:translate-x-1">Voir ce lot →</p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <div data-reveal className="mt-24 flex justify-center">
          <ActionLink href="/lots" variant="outline">Voir tous les lots</ActionLink>
        </div>
      </article>
    </>
  );
}
