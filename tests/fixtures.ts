import type { Lot } from "@/types";

export function makeLot(overrides: Partial<Lot> = {}): Lot {
  return {
    id: "rec1",
    reference: "A001",
    type: "T2",
    surface: 45,
    etage: 0,
    exposition: "Sud",
    prix: 200_000,
    statut: "Disponible",
    terrasse: null,
    description: null,
    ...overrides,
  };
}
