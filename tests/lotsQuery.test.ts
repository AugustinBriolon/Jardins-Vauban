import { describe, expect, it } from "vitest";
import { EMPTY_FILTERS, budgetSteps, filtersFromQuery, filtersToQuery } from "@/lib/lots";

describe("filters in the URL", () => {
  it("omits empty filters from the query", () => {
    expect(filtersToQuery(EMPTY_FILTERS)).toEqual({});
  });

  it("round-trips a full set of filters", () => {
    const filters = { types: ["T2" as const, "T4" as const], budgetMax: 350_000, availableOnly: true };
    expect(filtersToQuery(filters)).toEqual({ type: "T2,T4", budget: "350000", dispo: "1" });
    expect(filtersFromQuery(filtersToQuery(filters))).toEqual(filters);
  });

  it("ignores unknown types and invalid budgets from hand-edited URLs", () => {
    expect(filtersFromQuery({ type: "T2,T9,<b>", budget: "abc", dispo: "yes" })).toEqual({
      types: ["T2"],
      budgetMax: null,
      availableOnly: false,
    });
  });

  it("uses the first value when a parameter is repeated", () => {
    expect(filtersFromQuery({ budget: ["300000", "999"] }).budgetMax).toBe(300_000);
  });
});

describe("budgetSteps", () => {
  it("lists round ceilings strictly between the price bounds", () => {
    expect(budgetSteps({ min: 180_000, max: 300_000 })).toEqual([200_000, 225_000, 250_000, 275_000]);
  });

  it("returns nothing when there are no lots", () => {
    expect(budgetSteps({ min: 0, max: 0 })).toEqual([]);
  });
});
