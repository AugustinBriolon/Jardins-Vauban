import { AnimatePresence, motion } from "motion/react";
import { ArrowDown } from "lucide-react";
import type { Lot } from "@/types";
import { formatFloorShort, formatPrice, type LotSortKey } from "@/lib/lots";
import { STATUS_STYLES, StatusDot } from "@/components/lots/status";
import { cn } from "@/lib/utils";

interface LotTableProps {
  lots: Lot[];
  sortKey: LotSortKey;
  selectedId: string | null;
  onSort: (key: LotSortKey) => void;
  onSelect: (lot: Lot) => void;
}

const ROW_EASE = [0.16, 1, 0.3, 1] as const;

const SORT_LABELS: Record<LotSortKey, string> = {
  reference: "référence",
  prix: "prix",
  surface: "surface",
  etage: "étage",
};

export default function LotTable({ lots, sortKey, selectedId, onSort, onSelect }: LotTableProps) {
  const sortHeader = (key: LotSortKey, label: string, className?: string) => (
    <th scope="col" aria-sort={sortKey === key ? "ascending" : "none"} className={cn("py-3 font-normal", className)}>
      <button
        type="button"
        onClick={() => onSort(key)}
        className={cn("eyebrow inline-flex items-center gap-1 transition-colors hover:text-ink", sortKey === key && "text-ink")}
      >
        {label}
        <ArrowDown
          aria-hidden
          className={cn("size-3 transition-opacity", sortKey === key ? "opacity-100" : "opacity-0")}
        />
      </button>
    </th>
  );

  return (
    <table className="w-full border-collapse text-left text-sm">
      <caption className="sr-only">Liste des lots, triée par {SORT_LABELS[sortKey]}</caption>
      <thead className="border-b border-ink">
        <tr>
          {sortHeader("reference", "Lot")}
          <th scope="col" className="eyebrow py-3 font-normal">Type</th>
          {sortHeader("surface", "Surface", "text-right")}
          {sortHeader("etage", "Étage", "hidden text-right sm:table-cell")}
          <th scope="col" className="eyebrow hidden py-3 pl-6 font-normal lg:table-cell">Exposition</th>
          <th scope="col" className="eyebrow hidden py-3 text-right font-normal md:table-cell">Extérieur</th>
          {sortHeader("prix", "Prix", "text-right")}
          <th scope="col" className="eyebrow py-3 pl-4 font-normal sm:pl-6">
            <span className="sr-only sm:not-sr-only">Statut</span>
          </th>
        </tr>
      </thead>
      <tbody>
        <AnimatePresence initial={false}>
          {lots.map((lot) => (
            <motion.tr
              key={lot.id}
              layout="position"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: ROW_EASE }}
              onClick={() => onSelect(lot)}
              className={cn(
                "tabular group cursor-pointer border-b border-line transition-colors duration-300 hover:bg-paper",
                lot.statut === "Vendu" && "text-ink-soft",
                lot.id === selectedId && "bg-paper"
              )}
            >
              <th scope="row" className="py-4 font-normal">
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    onSelect(lot);
                  }}
                  className="font-medium transition-transform duration-500 ease-out-expo group-hover:translate-x-1"
                >
                  {lot.reference}
                  <span className="sr-only">, voir le détail</span>
                </button>
              </th>
              <td className="py-4">{lot.type}</td>
              <td className="py-4 text-right">{lot.surface} m²</td>
              <td className="hidden py-4 text-right sm:table-cell">{formatFloorShort(lot.etage)}</td>
              <td className="hidden py-4 pl-6 lg:table-cell">{lot.exposition}</td>
              <td className="hidden py-4 text-right md:table-cell">{lot.terrasse ? `${lot.terrasse} m²` : "—"}</td>
              <td className="py-4 text-right">{lot.statut === "Vendu" ? "—" : formatPrice(lot.prix)}</td>
              <td className="py-4 pl-4 sm:pl-6">
                <span className="inline-flex items-center gap-2">
                  <StatusDot status={lot.statut} />
                  <span className="hidden sm:inline">{STATUS_STYLES[lot.statut].label}</span>
                  <span className="sr-only sm:hidden">{STATUS_STYLES[lot.statut].label}</span>
                </span>
              </td>
            </motion.tr>
          ))}
        </AnimatePresence>
      </tbody>
    </table>
  );
}
