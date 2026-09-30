import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { NAV_LINKS, SITE } from "@/lib/site";
import { lockScroll } from "@/lib/smoothScroll";
import { actionClasses } from "@/components/ui/ActionLink";
import { cn } from "@/lib/utils";
import { EASE_OUT, EASE_IN_OUT } from "@/lib/easing";

const HIDE_AFTER_PX = 120;

/** Hides the bar while scrolling down, brings it back on the slightest scroll up. */
function useHeaderVisibility() {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (current) => {
    const previous = scrollY.getPrevious() ?? 0;
    setHidden(current > previous && current > HIDE_AFTER_PX);
    setScrolled(current > 8);
  });

  return { hidden, scrolled };
}

function isActive(pathname: string, href: string) {
  return !href.includes("#") && pathname === href;
}

export default function Header() {
  const { pathname, events } = useRouter();
  const { hidden, scrolled } = useHeaderVisibility();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const close = () => setMenuOpen(false);
    events.on("routeChangeStart", close);
    events.on("hashChangeStart", close);
    return () => {
      events.off("routeChangeStart", close);
      events.off("hashChangeStart", close);
    };
  }, [events]);

  useEffect(() => {
    lockScroll(menuOpen);
  }, [menuOpen]);

  return (
    <>
      <motion.header
        animate={{ y: hidden && !menuOpen ? "-100%" : "0%" }}
        transition={{ duration: 0.6, ease: EASE_OUT }}
        className={cn(
          "fixed inset-x-0 top-0 z-40 transition-[background-color,border-color] duration-500",
          scrolled || menuOpen
            ? "border-b border-line/70 bg-limestone/85 backdrop-blur-md"
            : "border-b border-transparent"
        )}
      >
        <div className="shell flex h-16 items-center justify-between gap-6 lg:h-20">
          <Link href="/" className="group flex items-baseline gap-3" aria-label={`${SITE.programme} — accueil`}>
            <span className="font-display text-2xl leading-none tracking-tight">
              Les Jardins <em className="text-garden">de</em> Vauban
            </span>
            <span className="eyebrow hidden sm:inline">{SITE.developer}</span>
          </Link>

          <nav aria-label="Navigation principale" className="hidden items-center gap-10 md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive(pathname, link.href) ? "page" : undefined}
                className={cn(
                  "link-draw pb-0.5 text-sm text-ink-soft transition-colors hover:text-ink",
                  "aria-[current=page]:text-ink"
                )}
              >
                {link.label}
              </Link>
            ))}
            <Link href="/contact" className={actionClasses("solid", "h-10 px-5")}>
              Être rappelé
            </Link>
          </nav>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="menu-mobile"
            className="relative -mr-2 flex size-11 items-center justify-center md:hidden"
          >
            <span className="sr-only">{menuOpen ? "Fermer le menu" : "Ouvrir le menu"}</span>
            <span
              aria-hidden
              className={cn(
                "absolute h-px w-6 bg-ink transition-transform duration-500 ease-out-expo",
                menuOpen ? "rotate-45" : "-translate-y-1"
              )}
            />
            <span
              aria-hidden
              className={cn(
                "absolute h-px w-6 bg-ink transition-transform duration-500 ease-out-expo",
                menuOpen ? "-rotate-45" : "translate-y-1"
              )}
            />
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            id="menu-mobile"
            data-lenis-prevent
            aria-label="Navigation mobile"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.9, ease: EASE_IN_OUT }}
            className="fixed inset-0 z-30 flex flex-col justify-between bg-limestone px-4 pt-28 pb-10 md:hidden"
          >
            <ul className="space-y-2">
              {[...NAV_LINKS, { href: "/contact", label: "Contact" }].map((link, index) => (
                <li key={link.href} className="overflow-hidden">
                  <motion.div
                    initial={{ y: "110%" }}
                    animate={{ y: "0%" }}
                    transition={{ delay: 0.25 + index * 0.06, duration: 0.8, ease: EASE_OUT }}
                  >
                    <Link href={link.href} className="font-display block text-5xl leading-tight">
                      {link.label}
                    </Link>
                  </motion.div>
                </li>
              ))}
            </ul>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="space-y-1 border-t border-line pt-6 text-sm text-ink-soft"
            >
              <a href={SITE.phone.href} className="block text-ink">{SITE.phone.display}</a>
              <p>{SITE.openingHours}</p>
            </motion.div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}
