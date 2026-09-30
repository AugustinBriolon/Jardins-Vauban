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
