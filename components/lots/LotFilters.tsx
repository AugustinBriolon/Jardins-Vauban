import { AnimatePresence, motion } from "motion/react";
import type { LotType } from "@/types";
import { LOT_TYPES, formatPrice, type LotFilters as Filters } from "@/lib/lots";
import AnimatedNumber from "@/components/ui/AnimatedNumber";
import { cn } from "@/lib/utils";

const BUDGET_STEP = 10_000;

interface LotFiltersProps {
  filters: Filters;
  priceRange: { min: number; max: number };
  typeCounts: Record<LotType, number>;
  resultCount: number;
  isFiltered: boolean;
  onToggleType: (type: LotType) => void;
  onBudgetChange: (budgetMax: number | null) => void;
  onAvailableOnlyChange: (availableOnly: boolean) => void;
  onReset: () => void;
}

export default function LotFilters({
  filters,
  priceRange,
  typeCounts,
  resultCount,
  isFiltered,
  onToggleType,
  onBudgetChange,
  onAvailableOnlyChange,
  onReset,
}: LotFiltersProps) {
  const budget = filters.budgetMax ?? priceRange.max;

  return (
    <div role="search" aria-label="Filtrer les lots" className="space-y-10">
      <div className="flex items-end justify-between border-b border-ink pb-4">
        <p aria-live="polite" className="text-sm">
          <AnimatedNumber value={resultCount} className="font-display tabular mr-2 text-5xl leading-none" />
          <span className="text-ink-soft">{resultCount > 1 ? "lots" : "lot"}</span>
        </p>
        <AnimatePresence>
          {isFiltered && (
            <motion.button
              type="button"
              onClick={onReset}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              className="link-draw pb-0.5 text-sm"
            >
              Réinitialiser
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <fieldset>
        <legend className="eyebrow mb-4">Typologie</legend>
        <div className="grid grid-cols-3 gap-2">
          {LOT_TYPES.map((type) => {
            const active = filters.types.includes(type);
            return (
              <button
                key={type}
                type="button"
                aria-pressed={active}
                onClick={() => onToggleType(type)}
                className={cn(
                  "flex flex-col items-start rounded-sm border px-3 py-3 text-left transition-colors duration-300",
                  active ? "border-ink bg-ink text-paper" : "border-line hover:border-ink"
                )}
              >
                <span className="font-display text-2xl leading-none">{type}</span>
                <span className={cn("mt-1 text-xs", active ? "text-paper/70" : "text-ink-soft")}>
                  {typeCounts[type]} lots
                </span>
              </button>
            );
          })}
        </div>
      </fieldset>

      <div>
        <div className="mb-4 flex items-baseline justify-between">
          <label htmlFor="budget" className="eyebrow">Budget maximum</label>
          <output htmlFor="budget" className="tabular text-sm">
            {filters.budgetMax === null ? "Tous les prix" : formatPrice(budget)}
          </output>
        </div>
        <input
          id="budget"
          type="range"
          min={priceRange.min}
          max={priceRange.max}
          step={BUDGET_STEP}
          value={budget}
          aria-valuetext={formatPrice(budget)}
          onChange={(event) => {
            const value = Number(event.target.value);
            onBudgetChange(value >= priceRange.max ? null : value);
          }}
          className="h-1 w-full cursor-pointer accent-garden"
        />
        <div className="tabular mt-2 flex justify-between text-xs text-ink-soft">
          <span>{formatPrice(priceRange.min)}</span>
          <span>{formatPrice(priceRange.max)}</span>
        </div>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={filters.availableOnly}
        onClick={() => onAvailableOnlyChange(!filters.availableOnly)}
        className="flex w-full items-center justify-between gap-4 text-left text-sm"
      >
        Disponibles uniquement
        <span
          aria-hidden
          className={cn(
            "relative h-6 w-11 shrink-0 rounded-full border transition-colors duration-300",
            filters.availableOnly ? "border-garden bg-garden" : "border-line bg-paper"
          )}
        >
          <motion.span
            layout
            transition={{ type: "spring", stiffness: 500, damping: 34 }}
            className={cn(
              "absolute top-0.5 size-4.5 rounded-full",
              filters.availableOnly ? "right-0.5 bg-paper" : "left-0.5 bg-ink/60"
            )}
          />
        </span>
      </button>
    </div>
  );
}
