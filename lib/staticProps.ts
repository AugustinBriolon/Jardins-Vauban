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

/** Listing pages rebuilt on demand when a lot changes (see api/airtable-webhook). */
export const LOT_PAGES = ["/", "/lots"] as const;

// Safety net if a webhook ping is missed: the first visit after this delay
// triggers a background rebuild of the page.
const LISTING_REVALIDATE_SECONDS = 300;

// Lot pages are not rebuilt by the webhook (48 rebuilds would exceed Airtable's
// 5 requests/s limit), so they refresh on a shorter time window.
const LOT_PAGE_REVALIDATE_SECONDS = 60;

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
