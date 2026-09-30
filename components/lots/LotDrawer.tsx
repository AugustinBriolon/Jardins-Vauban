import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import type { Lot } from "@/types";
import { formatFloor, formatPrice, pricePerSquareMeter } from "@/lib/lots";
import ActionLink, { actionClasses } from "@/components/ui/ActionLink";
import Facade from "@/components/lots/Facade";
import { NBSP } from "@/lib/utils";
import { StatusLabel } from "@/components/lots/status";

interface LotDrawerProps {
  lot: Lot | null;
  allLots: Lot[];
  onClose: () => void;
  onShowSimilar: (lot: Lot) => void;
}

const PANEL_EASE = [0.76, 0, 0.24, 1] as const;

/** Closes on Escape, locks page scroll and moves focus into the panel while open. */
function useDialogBehaviour(open: boolean, onClose: () => void) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const onKeyDown = (event: KeyboardEvent) => event.key === "Escape" && onClose();

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
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
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.7, ease: PANEL_EASE }}
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
  const facts = [
    { term: "Surface habitable", value: `${lot.surface} m²` },
    { term: "Extérieur", value: lot.terrasse ? `Terrasse de ${lot.terrasse} m²` : "—" },
    { term: "Niveau", value: formatFloor(lot.etage) },
    { term: "Exposition", value: lot.exposition },
    { term: "Prix", value: lot.statut === "Vendu" ? "—" : formatPrice(lot.prix) },
    { term: "Prix au m²", value: lot.statut === "Vendu" ? "—" : formatPrice(pricePerSquareMeter(lot)) },
  ];

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
          <dl>
            {facts.map((fact) => (
              <div key={fact.term} className="tabular flex justify-between gap-6 border-b border-line py-3 first:border-t">
                <dt className="text-ink-soft">{fact.term}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </dl>
        </Stagger>

        <Stagger>
          <p className="eyebrow mb-4">Position dans la résidence</p>
          <div aria-hidden inert>
            <Facade lots={allLots} selectedId={lot.id} matchingIds={new Set([lot.id])} compact />
          </div>
        </Stagger>

        <Stagger className="mt-auto flex flex-col gap-3">
          <PrimaryAction lot={lot} onShowSimilar={onShowSimilar} />
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
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
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
    <ActionLink href={`/contact?lot=${encodeURIComponent(lot.reference)}`} className="w-full">
      {label}
    </ActionLink>
  );
}

/** Lets the sales team (or a buyer) share a direct link to this lot. */
function CopyLinkButton({ reference }: { reference: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    const url = `${window.location.origin}/lots?lot=${encodeURIComponent(reference)}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button type="button" onClick={copy} className="relative h-10 overflow-hidden text-sm text-ink-soft transition-colors hover:text-ink">
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={copied ? "copied" : "copy"}
          initial={{ y: "100%" }}
          animate={{ y: "0%" }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="block"
          aria-live="polite"
        >
          {copied ? "Lien copié" : "Copier le lien de ce lot"}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
