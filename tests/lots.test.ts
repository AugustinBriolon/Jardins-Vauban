import { describe, expect, it } from "vitest";
import {
  EMPTY_FILTERS,
  countByStatus,
  filterLots,
  formatFloor,
  groupByFloor,
  hasActiveFilters,
  lotPath,
  priceBounds,
  pricePerSquareMeter,
  similarLots,
  sortLots,
  startingPriceByType,
} from "@/lib/lots";
import { makeLot } from "./fixtures";

const lots = [
  makeLot({ id: "1", reference: "A010", type: "T2", prix: 210_000, etage: 0, statut: "Disponible" }),
  makeLot({ id: "2", reference: "A002", type: "T3", prix: 320_000, etage: 1, statut: "Vendu" }),
  makeLot({ id: "3", reference: "A003", type: "T4", prix: 455_000, etage: 1, statut: "Optionné" }),
  makeLot({ id: "4", reference: "A004", type: "T3", prix: 298_000, etage: 4, statut: "Disponible" }),
];

describe("filterLots", () => {
  it("returns every lot without filters", () => {
    expect(filterLots(lots, EMPTY_FILTERS)).toHaveLength(4);
  });

  it("keeps only selected types", () => {
    const result = filterLots(lots, { ...EMPTY_FILTERS, types: ["T3"] });
    expect(result.map((lot) => lot.id)).toEqual(["2", "4"]);
  });

  it("applies the budget as an inclusive ceiling", () => {
    const result = filterLots(lots, { ...EMPTY_FILTERS, budgetMax: 320_000 });
    expect(result.map((lot) => lot.id)).toEqual(["1", "2", "4"]);
  });

  it("combines type, budget and availability", () => {
    const result = filterLots(lots, { types: ["T3", "T4"], budgetMax: 500_000, availableOnly: true });
    expect(result.map((lot) => lot.id)).toEqual(["4"]);
  });
});

describe("hasActiveFilters", () => {
  it("is false for the empty filter set and true once anything is set", () => {
    expect(hasActiveFilters(EMPTY_FILTERS)).toBe(false);
    expect(hasActiveFilters({ ...EMPTY_FILTERS, availableOnly: true })).toBe(true);
  });
});

describe("sortLots", () => {
  it("sorts references naturally", () => {
    expect(sortLots(lots, "reference").map((lot) => lot.reference)).toEqual(["A002", "A003", "A004", "A010"]);
  });

  it("sorts by price ascending without mutating the input", () => {
    const original = [...lots];
    expect(sortLots(lots, "prix").map((lot) => lot.id)).toEqual(["1", "4", "2", "3"]);
    expect(lots).toEqual(original);
  });
});

describe("groupByFloor", () => {
  it("orders floors from top to bottom for the building elevation", () => {
    const floors = groupByFloor(lots);
    expect(floors.map((floor) => floor.etage)).toEqual([4, 1, 0]);
    expect(floors[1].lots.map((lot) => lot.reference)).toEqual(["A002", "A003"]);
  });
});

describe("aggregates", () => {
  it("counts lots per status", () => {
    expect(countByStatus(lots)).toEqual({ Disponible: 2, Optionné: 1, Vendu: 1 });
  });

  it("gives the lowest available price per type, null when none is left", () => {
    expect(startingPriceByType(lots)).toEqual({ T2: 210_000, T3: 298_000, T4: null });
  });

  it("rounds slider bounds to 10 000 €", () => {
    expect(priceBounds(lots)).toEqual({ min: 210_000, max: 460_000 });
    expect(priceBounds([])).toEqual({ min: 0, max: 0 });
  });
});

describe("formatting", () => {
  it("names floors the French way", () => {
    expect(formatFloor(0)).toBe("Rez-de-jardin");
    expect(formatFloor(1)).toBe("1er étage");
    expect(formatFloor(3)).toBe("3e étage");
  });

  it("computes a rounded price per square metre", () => {
    expect(pricePerSquareMeter(makeLot({ prix: 250_000, surface: 48 }))).toBe(5208);
  });
});

describe("lot pages", () => {
  it("builds the shareable path of a lot", () => {
    expect(lotPath("A012")).toBe("/lots/A012");
  });

  it("suggests available lots of the same type, closest in price first", () => {
    const target = makeLot({ id: "t", type: "T3", prix: 300_000 });
    const pool = [
      target,
      makeLot({ id: "far", type: "T3", prix: 400_000 }),
      makeLot({ id: "close", type: "T3", prix: 310_000 }),
      makeLot({ id: "sold", type: "T3", prix: 301_000, statut: "Vendu" }),
      makeLot({ id: "other-type", type: "T2", prix: 300_000 }),
    ];
    expect(similarLots(target, pool).map((lot) => lot.id)).toEqual(["close", "far"]);
  });
});
