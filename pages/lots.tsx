import Head from "next/head";
import type { InferGetStaticPropsType } from "next";
import type { Lot } from "@/types";
import { getLotsStaticProps } from "@/lib/staticProps";
import { countByStatus, countByType, priceBounds } from "@/lib/lots";
import { SITE } from "@/lib/site";
import { useLotFilters } from "@/hooks/useLotFilters";
import { useSelectedLot } from "@/hooks/useSelectedLot";
import Facade from "@/components/lots/Facade";
import LotFilters from "@/components/lots/LotFilters";
import LotTable from "@/components/lots/LotTable";
import LotDrawer from "@/components/lots/LotDrawer";
import { NBSP } from "@/lib/utils";
import ActionLink from "@/components/ui/ActionLink";

export const getStaticProps = getLotsStaticProps;

export default function LotsPage({ lots }: InferGetStaticPropsType<typeof getStaticProps>) {
  const statusCounts = countByStatus(lots);

  return (
    <>
      <Head>
        <title>{`Lots, prix et disponibilités — ${SITE.programme}`}</title>
        <meta
          name="description"
          content={`${statusCounts.Disponible} appartements disponibles sur ${lots.length} aux ${SITE.programme}, Bordeaux : typologie, surface, étage, exposition et prix de chaque lot.`}
        />
      </Head>

      <section className="shell pt-28 pb-12 lg:pt-36 lg:pb-16">
        <p data-reveal className="eyebrow">Grille de prix — avant-première</p>
        <div className="mt-6 grid gap-8 lg:grid-cols-12 lg:items-end">
          <h1
            data-reveal="lines"
            className="font-display text-[clamp(3.5rem,10vw,9rem)] leading-[0.88] tracking-[-0.03em] lg:col-span-8"
          >
            Les {lots.length || SITE.totalLots} lots
          </h1>
          <dl data-reveal className="tabular flex gap-8 text-sm lg:col-span-4 lg:justify-end">
            {Object.entries(statusCounts).map(([status, count]) => (
              <div key={status}>
                <dt className="eyebrow">{status}s</dt>
                <dd className="font-display mt-1 text-4xl">{count}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {lots.length > 0 ? <Catalogue lots={lots} /> : <Unavailable />}
    </>
  );
}

function Catalogue({ lots }: { lots: Lot[] }) {
  const catalogue = useLotFilters(lots);
  const { selectedLot, selectLot, closeLot } = useSelectedLot(lots);

  return (
    <section className="shell grid gap-14 border-t border-line pt-12 pb-24 lg:grid-cols-12 lg:gap-8 lg:pb-36">
      <aside className="lg:col-span-3">
        <div className="lg:sticky lg:top-28">
          <LotFilters
            filters={catalogue.filters}
            priceRange={priceBounds(lots)}
            typeCounts={countByType(lots)}
            resultCount={catalogue.visibleLots.length}
            isFiltered={catalogue.isFiltered}
            onToggleType={catalogue.toggleType}
            onBudgetChange={catalogue.setBudgetMax}
            onAvailableOnlyChange={catalogue.setAvailableOnly}
            onReset={catalogue.reset}
          />
          <p className="mt-10 text-xs leading-relaxed text-ink-soft">
            Disponibilités synchronisées avec l&apos;équipe commerciale. Prix TTC hors frais de notaire, TVA 20{NBSP}%.
          </p>
        </div>
      </aside>

      <div className="space-y-20 lg:col-span-8 lg:col-start-5">
        <Facade
          lots={lots}
          matchingIds={catalogue.matchingIds}
          selectedId={selectedLot?.id ?? null}
          onSelect={selectLot}
        />

        {catalogue.visibleLots.length > 0 ? (
          <LotTable
            lots={catalogue.visibleLots}
            sortKey={catalogue.sortKey}
            selectedId={selectedLot?.id ?? null}
            onSort={catalogue.setSortKey}
            onSelect={selectLot}
          />
        ) : (
          <div className="border-y border-line py-16 text-center">
            <p className="font-display text-3xl">Aucun lot ne correspond à ces critères.</p>
            <button type="button" onClick={catalogue.reset} className="link-draw mt-4 pb-0.5 text-sm">
              Réinitialiser les filtres
            </button>
          </div>
        )}
      </div>

      <LotDrawer
        lot={selectedLot}
        allLots={lots}
        onClose={closeLot}
        onShowSimilar={(lot) => {
          catalogue.showSimilar(lot);
          closeLot();
        }}
      />
    </section>
  );
}

function Unavailable() {
  return (
    <section className="shell border-t border-line py-24">
      <p className="font-display max-w-2xl text-4xl">
        La grille des lots est momentanément indisponible.
      </p>
      <p className="mt-4 max-w-xl text-ink-soft">
        Notre équipe peut vous communiquer les disponibilités par téléphone au {SITE.phone.display}.
      </p>
      <ActionLink href="/contact" className="mt-8">Nous contacter</ActionLink>
    </section>
  );
}
