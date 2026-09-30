export type LotStatus = "Disponible" | "Optionné" | "Vendu";
export type LotType = "T2" | "T3" | "T4";
export type Exposition =
  | "Nord"
  | "Sud"
  | "Est"
  | "Ouest"
  | "Nord-Est"
  | "Nord-Ouest"
  | "Sud-Est"
  | "Sud-Ouest";

export interface Lot {
  id: string;
  reference: string;
  type: LotType;
  surface: number;
  etage: number;
  exposition: Exposition;
  prix: number;
  statut: LotStatus;
  terrasse?: number | null;
  description?: string | null;
}

export interface ContactFormData {
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  lotSouhaite?: string;
  message: string;
  consentement: boolean;
}
