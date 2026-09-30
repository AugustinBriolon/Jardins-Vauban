import type { Lot, LotStatus, LotType } from "@/types";

export const LOT_TYPES: LotType[] = ["T2", "T3", "T4"];
export const LOT_STATUSES: LotStatus[] = ["Disponible", "Optionné", "Vendu"];

export interface LotFilters {
  types: LotType[];
  budgetMax: number | null;
  availableOnly: boolean;
}

export const EMPTY_FILTERS: LotFilters = {
  types: [],
  budgetMax: null,
  availableOnly: false,
};

export type LotSortKey = "reference" | "prix" | "surface" | "etage";

export function matchesFilters(lot: Lot, filters: LotFilters): boolean {
  if (filters.types.length > 0 && !filters.types.includes(lot.type)) return false;
  if (filters.budgetMax !== null && lot.prix > filters.budgetMax) return false;
  if (filters.availableOnly && lot.statut !== "Disponible") return false;
  return true;
}

export function filterLots(lots: Lot[], filters: LotFilters): Lot[] {
  return lots.filter((lot) => matchesFilters(lot, filters));
}

export function hasActiveFilters(filters: LotFilters): boolean {
  return filters.types.length > 0 || filters.budgetMax !== null || filters.availableOnly;
}

export function sortLots(lots: Lot[], key: LotSortKey): Lot[] {
  return [...lots].sort((a, b) => {
    if (key === "reference") {
      return a.reference.localeCompare(b.reference, "fr", { numeric: true });
    }
    return a[key] - b[key] || a.reference.localeCompare(b.reference, "fr", { numeric: true });
  });
}

export function countByStatus(lots: Lot[]): Record<LotStatus, number> {
  const counts: Record<LotStatus, number> = { Disponible: 0, Optionné: 0, Vendu: 0 };
  for (const lot of lots) counts[lot.statut] += 1;
  return counts;
}

export function countByType(lots: Lot[]): Record<LotType, number> {
  const counts: Record<LotType, number> = { T2: 0, T3: 0, T4: 0 };
  for (const lot of lots) counts[lot.type] += 1;
  return counts;
}

/** Floors ordered top to bottom, as they appear on the building elevation. */
export function groupByFloor(lots: Lot[]): { etage: number; lots: Lot[] }[] {
  const floors = new Map<number, Lot[]>();
  for (const lot of sortLots(lots, "reference")) {
    floors.set(lot.etage, [...(floors.get(lot.etage) ?? []), lot]);
  }
  return [...floors.entries()]
    .sort(([a], [b]) => b - a)
    .map(([etage, floorLots]) => ({ etage, lots: floorLots }));
}

/** Rounds the slider bounds to the nearest 10 000 € so the steps read cleanly. */
export function priceBounds(lots: Lot[]): { min: number; max: number } {
  if (lots.length === 0) return { min: 0, max: 0 };
  const prices = lots.map((lot) => lot.prix);
  return {
    min: Math.floor(Math.min(...prices) / 10_000) * 10_000,
    max: Math.ceil(Math.max(...prices) / 10_000) * 10_000,
  };
}

export function pricePerSquareMeter(lot: Lot): number {
  return Math.round(lot.prix / lot.surface);
}

const priceFormatter = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

export function formatPrice(value: number): string {
  return priceFormatter.format(value);
}

export function formatFloor(etage: number): string {
  if (etage === 0) return "Rez-de-jardin";
  if (etage === 1) return "1er étage";
  return `${etage}e étage`;
}

export function formatFloorShort(etage: number): string {
  return etage === 0 ? "RDJ" : `R+${etage}`;
}

/** Lowest price among available lots of each type, or null when none is left. */
export function startingPriceByType(lots: Lot[]): Record<LotType, number | null> {
  const result: Record<LotType, number | null> = { T2: null, T3: null, T4: null };
  for (const lot of lots) {
    if (lot.statut !== "Disponible") continue;
    const current = result[lot.type];
    result[lot.type] = current === null ? lot.prix : Math.min(current, lot.prix);
  }
  return result;
}

// ─── URL (de)serialisation ──────────────────────────────────────────────────
// Filters live in the query string so a search can be shared, bookmarked,
// and handed from the home page search to the catalogue.

export type FilterQuery = { type?: string; budget?: string; dispo?: string };

export function filtersToQuery(filters: LotFilters): FilterQuery {
  const query: FilterQuery = {};
  if (filters.types.length > 0) query.type = filters.types.join(",");
  if (filters.budgetMax !== null) query.budget = String(filters.budgetMax);
  if (filters.availableOnly) query.dispo = "1";
  return query;
}

function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

/** Tolerates hand-edited URLs: unknown types and non-numeric budgets are ignored. */
export function filtersFromQuery(query: Record<string, string | string[] | undefined>): LotFilters {
  const types = (firstValue(query.type) ?? "")
    .split(",")
    .filter((type): type is LotType => (LOT_TYPES as string[]).includes(type));
  const budget = Number(firstValue(query.budget));
  return {
    types,
    budgetMax: Number.isFinite(budget) && budget > 0 ? budget : null,
    availableOnly: firstValue(query.dispo) === "1",
  };
}

/** Round budget ceilings between the cheapest and the most expensive lot. */
export function budgetSteps(bounds: { min: number; max: number }, step = 25_000): number[] {
  const steps: number[] = [];
  for (let value = Math.ceil(bounds.min / step) * step; value < bounds.max; value += step) {
    steps.push(value);
  }
  return steps;
}

/** Public URL of a lot's dedicated page, the link sent to prospects. */
export function lotPath(reference: string): string {
  return `/lots/${encodeURIComponent(reference)}`;
}

/** Available lots of the same type, closest in price first. */
export function similarLots(lot: Lot, lots: Lot[], limit = 3): Lot[] {
  return lots
    .filter((other) => other.id !== lot.id && other.type === lot.type && other.statut === "Disponible")
    .sort((a, b) => Math.abs(a.prix - lot.prix) - Math.abs(b.prix - lot.prix))
    .slice(0, limit);
}
