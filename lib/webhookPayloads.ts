/*
 * Airtable webhook pings carry no data. To know which lots changed, the webhook
 * route reads the recent payloads (https://airtable.com/developers/web/api/list-webhook-payloads).
 * The webhook is created with `includeCellValuesInFieldIds: [<Référence field>]`,
 * so every changed record carries its lot reference even when only the status changed.
 */

type CellValues = Record<string, unknown>;

interface ChangedRecord {
  current?: { cellValuesByFieldId?: CellValues };
  previous?: { cellValuesByFieldId?: CellValues };
  unchanged?: { cellValuesByFieldId?: CellValues };
}

interface TableChanges {
  changedRecordsById?: Record<string, ChangedRecord>;
  createdRecordsById?: Record<string, { cellValuesByFieldId?: CellValues }>;
}

export interface WebhookPayload {
  timestamp: string;
  changedTablesById?: Record<string, TableChanges>;
}

function asReference(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

/**
 * References of lots created or changed since `since`. When a reference itself was
 * edited, both the old and the new one are returned so both pages get rebuilt.
 */
export function changedLotReferences(payloads: WebhookPayload[], referenceFieldId: string, since: Date): string[] {
  const references = new Set<string>();

  for (const payload of payloads) {
    if (new Date(payload.timestamp) < since) continue;

    for (const table of Object.values(payload.changedTablesById ?? {})) {
      for (const record of Object.values(table.changedRecordsById ?? {})) {
        for (const values of [record.current, record.previous, record.unchanged]) {
          const reference = asReference(values?.cellValuesByFieldId?.[referenceFieldId]);
          if (reference) references.add(reference);
        }
      }
      for (const record of Object.values(table.createdRecordsById ?? {})) {
        const reference = asReference(record.cellValuesByFieldId?.[referenceFieldId]);
        if (reference) references.add(reference);
      }
    }
  }

  return [...references];
}
