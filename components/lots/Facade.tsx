import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { Lot } from "@/types";
import { countByStatus, formatFloor, formatFloorShort, formatPrice, groupByFloor } from "@/lib/lots";
import { STATUS_STYLES, StatusDot } from "@/components/lots/status";
import { cn } from "@/lib/utils";

interface FacadeProps {
  lots: Lot[];
  /** Lots matching the active filters. Others are dimmed. Omit to show all lots at full strength. */
  matchingIds?: ReadonlySet<string>;
  selectedId?: string | null;
  onSelect?: (lot: Lot) => void;
  /** Compact variant: no caption, no scroll entrance (used inside the lot drawer). */
  compact?: boolean;
}

function describeLot(lot: Lot) {
  return `Lot ${lot.reference}, ${lot.type}, ${lot.surface} m², ${formatFloor(lot.etage)}, ${formatPrice(lot.prix)}, ${lot.statut}`;
}

/**
 * Building elevation where each window is a lot, coloured by its live Airtable status.
 * Floors with fewer lots (the set-back top floor) are drawn narrower, like the real building.
 */
export default function Facade({ lots, matchingIds, selectedId, onSelect, compact = false }: FacadeProps) {
  const [hovered, setHovered] = useState<Lot | null>(null);
  const floors = groupByFloor(lots);
  const widestFloor = Math.max(1, ...floors.map((floor) => floor.lots.length));
  const focusLot = hovered ?? lots.find((lot) => lot.id === selectedId) ?? null;

  return (
    <figure className="w-full">
      <div data-reveal={compact ? undefined : "stagger"} className="grid grid-cols-[2.5rem_1fr] gap-x-3 sm:grid-cols-[3.5rem_1fr] sm:gap-x-5">
        <div aria-hidden />
        <div aria-hidden className="mx-auto h-4 w-[82%] bg-ink/8 [clip-path:polygon(4%_0,96%_0,100%_100%,0_100%)] sm:h-6" />

        {floors.map((floor) => (
          <FloorRow
            key={floor.etage}
            etage={floor.etage}
            widthRatio={floor.lots.length / widestFloor}
            onLeave={() => setHovered(null)}
          >
            {floor.lots.map((lot) => (
              <Window
                key={lot.id}
                lot={lot}
                dimmed={matchingIds ? !matchingIds.has(lot.id) : false}
                selected={lot.id === selectedId}
                onHover={setHovered}
                onSelect={onSelect}
              />
            ))}
          </FloorRow>
        ))}

        <div aria-hidden />
        <Garden />
      </div>

      {!compact && (
      <figcaption className="mt-6 flex min-h-14 flex-col gap-4 border-t border-line pt-5 sm:flex-row sm:items-center sm:justify-between">
        <Readout lot={focusLot} lots={lots} />
        <Legend />
      </figcaption>
      )}
    </figure>
  );
}

function FloorRow({
  etage,
  widthRatio,
  onLeave,
  children,
}: {
  etage: number;
  widthRatio: number;
  onLeave: () => void;
  children: React.ReactNode;
}) {
  return (
    <>
      <p className="eyebrow tabular flex items-center justify-end text-[0.625rem] sm:text-[0.6875rem]">
        {formatFloorShort(etage)}
      </p>
      <div
        role="group"
        aria-label={formatFloor(etage)}
        onMouseLeave={onLeave}
        style={{ width: `${widthRatio * 100}%` }}
        className="mx-auto flex border-x border-t border-line bg-paper px-1 sm:px-2"
      >
        {children}
      </div>
    </>
  );
}

function Window({
  lot,
  dimmed,
  selected,
  onHover,
  onSelect,
}: {
  lot: Lot;
  dimmed: boolean;
  selected: boolean;
  onHover: (lot: Lot) => void;
  onSelect?: (lot: Lot) => void;
}) {
  return (
    <div className="flex-1 px-[2px] py-2 sm:px-1.5 sm:py-3">
      <button
        type="button"
        data-reveal-item
        aria-label={describeLot(lot)}
        aria-pressed={onSelect ? selected : undefined}
        onMouseEnter={() => onHover(lot)}
        onFocus={() => onHover(lot)}
        onClick={() => onSelect?.(lot)}
        className={cn(
          "group relative block aspect-[3/4] w-full cursor-pointer rounded-[1px] outline-offset-2",
          "transition-[opacity,transform,filter] duration-500 ease-out-expo hover:-translate-y-0.5",
          STATUS_STYLES[lot.statut].swatch,
          dimmed && "opacity-15 saturate-0",
          selected && "ring-2 ring-ink ring-offset-2 ring-offset-paper"
        )}
      >
        {/* Mullion: a centred glazing bar so the swatch reads as a window. */}
        <span aria-hidden className="absolute inset-y-[12%] left-1/2 w-px bg-paper/35" />
        {lot.terrasse ? (
          <span aria-hidden className="absolute inset-x-[-12%] -bottom-1 h-[2px] bg-ink/70" />
        ) : null}
      </button>
    </div>
  );
}

function Garden() {
  return (
    <div aria-hidden className="relative">
      <div className="h-px bg-ink" />
      <svg viewBox="0 0 400 24" preserveAspectRatio="none" className="h-5 w-full text-garden/70 sm:h-7">
        {Array.from({ length: 26 }, (_, index) => {
          const x = 8 + index * 15.2;
          const radius = 5 + ((index * 7) % 5);
          return <circle key={index} cx={x} cy={radius + 1} r={radius} fill="currentColor" opacity={0.5 + ((index * 3) % 5) / 10} />;
        })}
      </svg>
    </div>
  );
}

function Readout({ lot, lots }: { lot: Lot | null; lots: Lot[] }) {
  const available = countByStatus(lots).Disponible;

  return (
    <div aria-live="polite" className="relative min-h-6 overflow-hidden text-sm">
      <AnimatePresence mode="wait" initial={false}>
        <motion.p
          key={lot?.id ?? "summary"}
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -12, opacity: 0 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="tabular flex flex-wrap items-center gap-x-3 gap-y-1"
        >
          {lot ? (
            <>
              <StatusDot status={lot.statut} />
              <span className="font-medium">{lot.reference}</span>
              <span className="text-ink-soft">{lot.type} · {lot.surface} m² · {formatFloor(lot.etage)} · {lot.exposition}</span>
              <span>{lot.statut === "Vendu" ? "Vendu" : formatPrice(lot.prix)}</span>
            </>
          ) : (
            <span className="text-ink-soft">
              <span className="text-ink">{available} logements disponibles</span> sur {lots.length} — survolez une fenêtre
            </span>
          )}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}

function Legend() {
  return (
    <ul className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-ink-soft">
      {Object.entries(STATUS_STYLES).map(([status, style]) => (
        <li key={status} className="flex items-center gap-2">
          <span aria-hidden className={cn("inline-block h-3 w-2.5 rounded-[1px]", style.swatch)} />
          {style.label}
        </li>
      ))}
      <li className="flex items-center gap-2">
        <span aria-hidden className="inline-block h-[2px] w-3 bg-ink/70" />
        Terrasse
      </li>
    </ul>
  );
}
