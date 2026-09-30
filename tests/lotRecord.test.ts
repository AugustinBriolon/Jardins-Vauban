import { describe, expect, it } from "vitest";
import { LOT_FIELDS, parseLotRecord } from "@/lib/lotRecord";

const validFields = {
  [LOT_FIELDS.reference]: "A012",
  [LOT_FIELDS.type]: "T3",
  [LOT_FIELDS.surface]: 68,
  [LOT_FIELDS.etage]: 1,
  [LOT_FIELDS.exposition]: "Sud",
  [LOT_FIELDS.prix]: 312_000,
  [LOT_FIELDS.statut]: "Disponible",
};

describe("parseLotRecord", () => {
  it("maps a valid Airtable record to a lot", () => {
    const result = parseLotRecord("rec1", { ...validFields, [LOT_FIELDS.terrasse]: 12 });
    expect(result).toEqual({
      ok: true,
      lot: {
        id: "rec1",
        reference: "A012",
        type: "T3",
        surface: 68,
        etage: 1,
        exposition: "Sud",
        prix: 312_000,
        statut: "Disponible",
        terrasse: 12,
        description: null,
      },
    });
  });

  it("rejects a price typo that would show 22 900 000 € on the site", () => {
    const result = parseLotRecord("rec1", { ...validFields, [LOT_FIELDS.prix]: 22_900_000 });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.reference).toBe("A012");
      expect(result.problems.join()).toMatch(/prix au m²/);
    }
  });

  it("rejects a missing price instead of inventing one", () => {
    const { [LOT_FIELDS.prix]: _omitted, ...withoutPrice } = validFields;
    expect(_omitted).toBeDefined();
    expect(parseLotRecord("rec1", withoutPrice).ok).toBe(false);
  });

  it("rejects a status outside the three allowed values", () => {
    const result = parseLotRecord("rec1", { ...validFields, [LOT_FIELDS.statut]: "Réservé" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.problems.join()).toMatch(/statut inconnu/);
  });

  it("lists every problem of a badly filled record", () => {
    const result = parseLotRecord("rec9", { [LOT_FIELDS.type]: "T7", [LOT_FIELDS.surface]: 5 });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.reference).toBe("rec9");
      expect(result.problems.length).toBeGreaterThanOrEqual(4);
    }
  });
});
