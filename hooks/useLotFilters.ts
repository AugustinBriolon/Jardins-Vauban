import { useMemo, useState } from "react";
import type { Lot, LotType } from "@/types";
import {
  EMPTY_FILTERS,
  filterLots,
  hasActiveFilters,
  sortLots,
  type LotFilters,
  type LotSortKey,
} from "@/lib/lots";

/** Filter and sort state for the lots catalogue, with the derived visible list. */
export function useLotFilters(lots: Lot[]) {
  const [filters, setFilters] = useState<LotFilters>(EMPTY_FILTERS);
  const [sortKey, setSortKey] = useState<LotSortKey>("reference");

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
