import type { GetStaticProps } from "next";
import type { Lot } from "@/types";
import { getLots } from "@/lib/airtable";

export interface LotsPageProps {
  lots: Lot[];
}

// A status changed in Airtable reaches the site within a minute:
// the first visit after this delay triggers a background rebuild of the page.
const REVALIDATE_SECONDS = 60;

/** Shared ISR loader for every page that displays lots. */
export const getLotsStaticProps: GetStaticProps<LotsPageProps> = async () => {
  try {
    return { props: { lots: await getLots() }, revalidate: REVALIDATE_SECONDS };
  } catch (error) {
    console.error("[getLotsStaticProps] Airtable unavailable:", error);
    // Retry sooner so a transient Airtable outage does not stick for a full minute.
    return { props: { lots: [] }, revalidate: 10 };
  }
};
