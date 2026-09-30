import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import type { Lot } from "@/types";
import { lotPath } from "@/lib/lots";
import ActionLink, { actionClasses } from "@/components/ui/ActionLink";
import Facade from "@/components/lots/Facade";
import { NBSP } from "@/lib/utils";
import { StatusLabel } from "@/components/lots/status";
import LotFacts from "@/components/lots/LotFacts";
import CopyLinkButton from "@/components/lots/CopyLinkButton";
import { lockScroll } from "@/lib/smoothScroll";
import { EASE_OUT, EASE_IN_OUT } from "@/lib/easing";

interface LotDrawerProps {
  lot: Lot | null;
  allLots: Lot[];
  onClose: () => void;
  onShowSimilar: (lot: Lot) => void;
}

/** Closes on Escape, locks page scroll and moves focus into the panel while open. */
function useDialogBehaviour(open: boolean, onClose: () => void) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const onKeyDown = (event: KeyboardEvent) => event.key === "Escape" && onClose();

    document.addEventListener("keydown", onKeyDown);
    lockScroll(true);
    panelRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      lockScroll(false);
      previouslyFocused?.focus();
    };
  }, [open, onClose]);

  return panelRef;
}

export default function LotDrawer({ lot, allLots, onClose, onShowSimilar }: LotDrawerProps) {
  const panelRef = useDialogBehaviour(lot !== null, onClose);

  return (
    <AnimatePresence>
      {lot && (
        <div className="fixed inset-0 z-50">
          <motion.div
            aria-hidden
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 bg-ink/40 backdrop-blur-[2px]"
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="lot-drawer-title"
            tabIndex={-1}
            data-lenis-prevent
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.9, ease: EASE_IN_OUT }}
            className="absolute inset-y-0 right-0 flex w-full max-w-xl flex-col overflow-y-auto bg-limestone outline-none"
          >
            <LotDetail lot={lot} allLots={allLots} onClose={onClose} onShowSimilar={onShowSimilar} />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function LotDetail({ lot, allLots, onClose, onShowSimilar }: LotDrawerProps & { lot: Lot }) {
  return (
    <>
      <div className="flex items-center justify-between border-b border-line px-6 py-5 sm:px-10">
        <p className="eyebrow">Lot {lot.reference}</p>
        <button
          type="button"
          onClick={onClose}
          className="group -mr-2 flex size-10 items-center justify-center rounded-full transition-colors hover:bg-ink hover:text-paper"
        >
          <X aria-hidden className="size-4 transition-transform duration-500 ease-out-expo group-hover:rotate-90" />
          <span className="sr-only">Fermer</span>
        </button>
      </div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.06, delayChildren: 0.25 } } }}
        className="flex flex-1 flex-col gap-10 px-6 py-10 sm:px-10"
      >
        <Stagger>
          <h2 id="lot-drawer-title" className="font-display text-6xl leading-none tracking-tight">
            {lot.type} <span className="text-ink-soft">·</span> {lot.surface}{NBSP}m²
          </h2>
          <div className="mt-4">
            <StatusLabel status={lot.statut} />
          </div>
        </Stagger>

        <Stagger>
          <LotFacts lot={lot} />
        </Stagger>

        <Stagger>
          <p className="eyebrow mb-4">Position dans la résidence</p>
          <div aria-hidden inert>
            <Facade lots={allLots} selectedId={lot.id} matchingIds={new Set([lot.id])} compact />
          </div>
        </Stagger>

        <Stagger className="mt-auto flex flex-col gap-3">
          <PrimaryAction lot={lot} onShowSimilar={onShowSimilar} />
          <ActionLink href={lotPath(lot.reference)} variant="outline" className="w-full">
            Voir la fiche complète
          </ActionLink>
          <CopyLinkButton reference={lot.reference} />
        </Stagger>
      </motion.div>
    </>
  );
}

function Stagger({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
      transition={{ duration: 0.6, ease: EASE_OUT }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function PrimaryAction({ lot, onShowSimilar }: { lot: Lot; onShowSimilar: (lot: Lot) => void }) {
  if (lot.statut === "Vendu") {
    return (
      <button type="button" onClick={() => onShowSimilar(lot)} className={actionClasses("solid", "w-full")}>
        Voir les {lot.type} encore disponibles
      </button>
    );
  }

  const label = lot.statut === "Optionné" ? "Être prévenu si l'option est levée" : "Recevoir le plan de ce lot";
  return (
    <ActionLink href={`${lotPath(lot.reference)}#demande`} className="w-full">
      {label}
    </ActionLink>
  );
}
