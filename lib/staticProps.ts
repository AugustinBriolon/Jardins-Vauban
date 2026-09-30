import type { GetStaticPaths, GetStaticProps } from "next";
import type { Lot } from "@/types";
import { getLots } from "@/lib/airtable";

export interface LotsPageProps {
  lots: Lot[];
}

export interface LotPageProps {
  lot: Lot;
  lots: Lot[];
}

/** Listing pages rebuilt on every lot change (see api/airtable-webhook); lot pages are rebuilt individually. */
export const LOT_PAGES = ["/", "/lots"] as const;

/*
 * Airtable's Free plan allows 1,000 API calls per month, and every time-based
 * rebuild costs one call. The webhook is therefore the primary refresh path
 * (listing pages rebuilt within seconds of a change); time-based ISR is only a
 * daily safety net. See docs/adr/0007.
 */
const LISTING_REVALIDATE_SECONDS = 24 * 60 * 60;

// Lot pages are rebuilt by the webhook only when their lot changes (see
// api/airtable-webhook), so their time-based window can be a weekly safety net.
const LOT_PAGE_REVALIDATE_SECONDS = 7 * 24 * 60 * 60;

const isBuild = () => process.env.NEXT_PHASE === "phase-production-build";

/**
 * Loads lots for a static page. If Airtable fails during a background revalidation
 * we throw on purpose: Next.js then keeps serving the last good version of the page
 * instead of replacing it with an empty one. Only at build time do we fall back to
 * an empty list, so an Airtable outage cannot block a deployment.
 */
async function loadLots(caller: string): Promise<Lot[]> {
  try {
    return await getLots();
  } catch (error) {
    console.error(`[${caller}] Airtable unavailable:`, error);
    if (isBuild()) return [];
    throw error;
  }
}

/** ISR loader shared by the home page and the catalogue. */
export const getLotsStaticProps: GetStaticProps<LotsPageProps> = async () => ({
  props: { lots: await loadLots("getLotsStaticProps") },
  revalidate: LISTING_REVALIDATE_SECONDS,
});

/** Pre-renders every lot page at build time; unknown references render on first request. */
export const getLotPaths: GetStaticPaths = async () => {
  const lots = await loadLots("getLotPaths");
  return {
    paths: lots.map((lot) => ({ params: { reference: lot.reference } })),
    fallback: "blocking",
  };
};

export const getLotStaticProps: GetStaticProps<LotPageProps> = async ({ params }) => {
  const lots = await loadLots("getLotStaticProps");
  const lot = lots.find((candidate) => candidate.reference === params?.reference);
  if (!lot) return { notFound: true, revalidate: LOT_PAGE_REVALIDATE_SECONDS };
  return { props: { lot, lots }, revalidate: LOT_PAGE_REVALIDATE_SECONDS };
};
