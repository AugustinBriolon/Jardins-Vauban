import { useState } from "react";
import type { Lot, LotType } from "@/types";
import { LOT_TYPES, budgetSteps, filterLots, formatPrice, priceBounds, type LotFilters } from "@/lib/lots";
import AnimatedNumber from "@/components/ui/AnimatedNumber";
import { actionClasses, ActionArrow } from "@/components/ui/ActionLink";
import { cn } from "@/lib/utils";

interface LotSearchProps {
  lots: Lot[];
  onSearch: (filters: LotFilters) => void;
}

/**
 * Entry point for visitors who come to find an apartment: pick a type and a budget,
 * see immediately how many available lots match, jump to them.
 */
export default function LotSearch({ lots, onSearch }: LotSearchProps) {
  const [types, setTypes] = useState<LotType[]>([]);
  const [budgetMax, setBudgetMax] = useState<number | null>(null);

  const filters: LotFilters = { types, budgetMax, availableOnly: true };
  const matchCount = filterLots(lots, filters).length;
  const steps = budgetSteps(priceBounds(lots));

  const toggleType = (type: LotType) =>
    setTypes((current) => (current.includes(type) ? current.filter((t) => t !== type) : [...current, type]));

  return (
    <form
      role="search"
      aria-label="Rechercher un logement"
      onSubmit={(event) => {
        event.preventDefault();
        onSearch(filters);
      }}
      className="grid gap-6 border border-line bg-paper p-5 sm:grid-cols-2 sm:gap-8 sm:items-end sm:p-8 lg:gap-10 lg:p-10 xl:grid-cols-[auto_auto_minmax(0,18rem)_1fr] xl:gap-12"
    >
      <div className="sm:self-center xl:pr-4">
        <p className="font-display text-3xl leading-none sm:text-4xl">Trouver votre logement</p>
        <p className="mt-2 hidden text-sm text-ink-soft sm:block">Disponibilités en temps réel</p>
      </div>

      <fieldset>
        <legend className="eyebrow mb-3 sm:mb-4">Typologie</legend>
        <div className="flex gap-3">
          {LOT_TYPES.map((type) => {
            const active = types.includes(type);
            return (
              <button
                key={type}
                type="button"
                aria-pressed={active}
                onClick={() => toggleType(type)}
                className={cn(
                  "font-display h-12 flex-1 rounded-full border px-5 text-xl sm:min-w-16 sm:flex-none transition-[background-color,color,border-color] duration-500 ease-out-expo",
                  active ? "border-ink bg-ink text-paper" : "border-line hover:border-ink"
                )}
              >
                {type}
              </button>
            );
          })}
        </div>
      </fieldset>

      <div>
        <label htmlFor="hero-budget" className="eyebrow mb-3 block sm:mb-4">Budget maximum</label>
        <div className="relative">
          <select
            id="hero-budget"
            value={budgetMax ?? ""}
            onChange={(event) => setBudgetMax(event.target.value ? Number(event.target.value) : null)}
            className="tabular h-12 w-full cursor-pointer appearance-none border-b border-line bg-transparent pr-8 text-lg outline-none transition-colors focus:border-ink"
          >
            <option value="">Tous les budgets</option>
            {steps.map((step) => (
              <option key={step} value={step}>Jusqu&apos;à {formatPrice(step)}</option>
            ))}
          </select>
          <span aria-hidden className="pointer-events-none absolute top-1/2 right-1 -translate-y-1/2 text-ink-soft">↓</span>
        </div>
      </div>

      <button type="submit" disabled={matchCount === 0} className={actionClasses("solid", "h-14 w-full px-8 sm:w-auto sm:justify-self-end")}>
        <span aria-live="polite">
          {matchCount === 0 ? (
            "Aucun logement disponible"
          ) : (
            <>
              Voir les <AnimatedNumber value={matchCount} className="tabular" /> logements
            </>
          )}
        </span>
        <ActionArrow />
      </button>
    </form>
  );
}
