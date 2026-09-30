import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { EASE_OUT } from "@/lib/easing";
import { lotPath } from "@/lib/lots";
import { cn } from "@/lib/utils";

/** Copies the lot page URL, so the sales team (or a buyer) can send it. */
export default function CopyLinkButton({ reference, className }: { reference: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(`${window.location.origin}${lotPath(reference)}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={copy}
      className={cn("relative h-10 overflow-hidden text-sm text-ink-soft transition-colors hover:text-ink", className)}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={copied ? "copied" : "copy"}
          initial={{ y: "100%" }}
          animate={{ y: "0%" }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.3, ease: EASE_OUT }}
          className="block"
          aria-live="polite"
        >
          {copied ? "Lien copié" : "Copier le lien de ce lot"}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
