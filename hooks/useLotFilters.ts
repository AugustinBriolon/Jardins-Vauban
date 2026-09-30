import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import type { Lot, LotType } from "@/types";
import {
  EMPTY_FILTERS,
  filterLots,
  filtersFromQuery,
  filtersToQuery,
  hasActiveFilters,
  sortLots,
  type LotFilters,
  type LotSortKey,
} from "@/lib/lots";

const URL_SYNC_DELAY_MS = 300;
const FILTER_KEYS = ["type", "budget", "dispo"];

/** Mirrors filters into the query string (debounced: the budget slider fires on every step). */
function useFiltersInUrl(filters: LotFilters, enabled: boolean) {
  const router = useRouter();

  useEffect(() => {
    if (!enabled) return;
    const timer = setTimeout(() => {
      const otherParams = Object.fromEntries(
        Object.entries(router.query).filter(([key]) => !FILTER_KEYS.includes(key))
      );
      router.replace({ pathname: router.pathname, query: { ...otherParams, ...filtersToQuery(filters) } }, undefined, {
        shallow: true,
        scroll: false,
      });
    }, URL_SYNC_DELAY_MS);
    return () => clearTimeout(timer);
    // router.query is read at fire time on purpose; depending on it would loop on our own replace.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, enabled]);
}

/** Filter and sort state for the lots catalogue, initialised from and kept in sync with the URL. */
export function useLotFilters(lots: Lot[]) {
  const router = useRouter();
  const [filters, setFilters] = useState<LotFilters>(EMPTY_FILTERS);
  const [sortKey, setSortKey] = useState<LotSortKey>("reference");
  const [initialised, setInitialised] = useState(false);

  // The query is only known after hydration of a static page: adopt it once, during render.
  if (router.isReady && !initialised) {
    setInitialised(true);
    setFilters(filtersFromQuery(router.query));
  }

  useFiltersInUrl(filters, initialised);

  const visibleLots = useMemo(() => sortLots(filterLots(lots, filters), sortKey), [lots, filters, sortKey]);
  const matchingIds = useMemo(() => new Set(visibleLots.map((lot) => lot.id)), [visibleLots]);

  return {
    filters,
    sortKey,
    visibleLots,
    matchingIds,
    isFiltered: hasActiveFilters(filters),
    setSortKey,
    toggleType: (type: LotType) =>
      setFilters((current) => ({
        ...current,
        types: current.types.includes(type)
          ? current.types.filter((selected) => selected !== type)
          : [...current.types, type],
      })),
    setBudgetMax: (budgetMax: number | null) => setFilters((current) => ({ ...current, budgetMax })),
    setAvailableOnly: (availableOnly: boolean) => setFilters((current) => ({ ...current, availableOnly })),
    showSimilar: (lot: Lot) => setFilters({ ...EMPTY_FILTERS, types: [lot.type], availableOnly: true }),
    reset: () => setFilters(EMPTY_FILTERS),
  };
}
