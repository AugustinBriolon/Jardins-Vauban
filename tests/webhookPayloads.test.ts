import { describe, expect, it } from "vitest";
import { changedLotReferences, type WebhookPayload } from "@/lib/webhookPayloads";

const REF = "fldReference";
const since = new Date("2026-09-30T10:00:00.000Z");

function payload(timestamp: string, changes: WebhookPayload["changedTablesById"]): WebhookPayload {
  return { timestamp, changedTablesById: changes };
}

describe("changedLotReferences", () => {
  it("finds the reference of a lot whose status changed (reference carried in 'unchanged')", () => {
    const payloads = [
      payload("2026-09-30T10:05:00.000Z", {
        tblLots: {
          changedRecordsById: {
            rec1: {
              current: { cellValuesByFieldId: { fldStatut: { name: "Vendu" } } },
              unchanged: { cellValuesByFieldId: { [REF]: "A007" } },
            },
          },
        },
      }),
    ];
    expect(changedLotReferences(payloads, REF, since)).toEqual(["A007"]);
  });

  it("returns both the old and the new reference when the reference itself is edited", () => {
    const payloads = [
      payload("2026-09-30T10:05:00.000Z", {
        tblLots: {
          changedRecordsById: {
            rec1: {
              current: { cellValuesByFieldId: { [REF]: "A008" } },
              previous: { cellValuesByFieldId: { [REF]: "A007" } },
            },
          },
        },
      }),
    ];
    expect(changedLotReferences(payloads, REF, since).sort()).toEqual(["A007", "A008"]);
  });

  it("includes created lots and ignores payloads older than the window", () => {
    const payloads = [
      payload("2026-09-30T09:00:00.000Z", {
        tblLots: { changedRecordsById: { rec1: { unchanged: { cellValuesByFieldId: { [REF]: "OLD1" } } } } },
      }),
      payload("2026-09-30T10:01:00.000Z", {
        tblLots: { createdRecordsById: { rec2: { cellValuesByFieldId: { [REF]: "B201" } } } },
      }),
    ];
    expect(changedLotReferences(payloads, REF, since)).toEqual(["B201"]);
  });

  it("deduplicates and skips records without a usable reference", () => {
    const change = { rec1: { unchanged: { cellValuesByFieldId: { [REF]: "A007" } } }, rec2: { current: { cellValuesByFieldId: {} } } };
    const payloads = [
      payload("2026-09-30T10:02:00.000Z", { tblLots: { changedRecordsById: change } }),
      payload("2026-09-30T10:03:00.000Z", { tblLots: { changedRecordsById: change } }),
    ];
    expect(changedLotReferences(payloads, REF, since)).toEqual(["A007"]);
  });
});
