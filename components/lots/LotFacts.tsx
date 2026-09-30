import type { Lot } from "@/types";
import { formatFloor, formatPrice, pricePerSquareMeter } from "@/lib/lots";

/** Key characteristics of a lot as a definition list (drawer and lot page). */
export default function LotFacts({ lot }: { lot: Lot }) {
  const sold = lot.statut === "Vendu";
  const facts = [
    { term: "Surface habitable", value: `${lot.surface} m²` },
    { term: "Extérieur", value: lot.terrasse ? `Terrasse de ${lot.terrasse} m²` : "—" },
    { term: "Niveau", value: formatFloor(lot.etage) },
    { term: "Exposition", value: lot.exposition },
    { term: "Prix", value: sold ? "—" : formatPrice(lot.prix) },
    { term: "Prix au m²", value: sold ? "—" : formatPrice(pricePerSquareMeter(lot)) },
  ];

  return (
    <dl>
      {facts.map((fact) => (
        <div key={fact.term} className="tabular flex justify-between gap-6 border-b border-line py-3 first:border-t">
          <dt className="text-ink-soft">{fact.term}</dt>
          <dd className="text-right">{fact.value}</dd>
        </div>
      ))}
    </dl>
  );
}
