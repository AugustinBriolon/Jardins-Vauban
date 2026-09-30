import { useCallback } from "react";
import { useRouter } from "next/router";
import type { Lot } from "@/types";

/**
 * The open lot lives in the URL (?lot=A012) so a link to a specific lot
 * can be shared by the sales team and survives a page reload.
 */
export function useSelectedLot(lots: Lot[]) {
  const router = useRouter();
  const reference = typeof router.query.lot === "string" ? router.query.lot : null;
  const selectedLot = lots.find((lot) => lot.reference === reference) ?? null;

  const setReference = useCallback(
    (next: string | null) => {
      const query = next ? { lot: next } : {};
      router.replace({ pathname: router.pathname, query }, undefined, { shallow: true, scroll: false });
    },
    [router]
  );

  return {
    selectedLot,
    selectLot: (lot: Lot) => setReference(lot.reference),
    closeLot: useCallback(() => setReference(null), [setReference]),
  };
}
