/*
 * Motion boundaries (see docs/adr for the rationale):
 * - GSAP + ScrollTrigger: scroll choreography declared in markup via data attributes.
 * - Motion (motion/react): transitions driven by React state (drawer, filters, form).
 *
 * Components never import GSAP directly. They tag elements with:
 *   data-reveal            fade + rise when scrolled into view
 *   data-reveal="lines"    heading split into masked lines that rise in turn
 *   data-reveal="image"    image unveiled by a clip-path wipe
 *   data-reveal="stagger"  fades in, then children tagged data-reveal-item "light up" in random order
 *   data-reveal-delay="n"  optional delay in seconds
 *   data-parallax="n"      image drifts n % of its height while the section scrolls
 * and `useScrollChoreography` (mounted once in _app) animates them.
 */
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);
}

/*
 * Motion language: long, decelerating eases (power3/power4) rather than snappy
 * expo curves, generous durations and short travel distances. Elements settle
 * into place instead of popping.
 */
const EASE_STRONG = "power4.out";
const EASE_SOFT = "power3.out";
const REVEAL_START = "top 88%";

// Tight display leading (0.86–0.95) makes line boxes shorter than the glyphs:
// descenders (g, p, j) and capital accents (À, É) would be clipped by the mask.
// The mask is enlarged by this much, and compensated with negative margins so layout is unchanged.
const MASK_BLEED = "0.2em";

function delayOf(element: HTMLElement): number {
  return Number(element.dataset.revealDelay ?? 0);
}

function revealFade(element: HTMLElement) {
  gsap.fromTo(
    element,
    { autoAlpha: 0, y: 24 },
    {
      autoAlpha: 1,
      y: 0,
      duration: 1.4,
      delay: delayOf(element),
      ease: EASE_SOFT,
      scrollTrigger: { trigger: element, start: REVEAL_START, once: true },
    }
  );
}

function revealLines(element: HTMLElement) {
  gsap.set(element, { autoAlpha: 1 });
  // autoSplit re-splits when web fonts load or the viewport resizes,
  // so line breaks always match what is actually rendered.
  SplitText.create(element, {
    type: "lines",
    mask: "lines",
    autoSplit: true,
    onSplit: (split) => {
      gsap.set(split.masks, {
        paddingTop: MASK_BLEED,
        paddingBottom: MASK_BLEED,
        marginTop: `-${MASK_BLEED}`,
        marginBottom: `-${MASK_BLEED}`,
      });
      return gsap.from(split.lines, {
        yPercent: 135,
        rotate: 2,
        transformOrigin: "0% 100%",
        duration: 1.6,
        stagger: 0.12,
        delay: delayOf(element),
        ease: EASE_STRONG,
        scrollTrigger: { trigger: element, start: REVEAL_START, once: true },
      });
    },
  });
}

function revealImage(element: HTMLElement) {
  const image = element.querySelector("img");
  const timeline = gsap.timeline({
    delay: delayOf(element),
    scrollTrigger: { trigger: element, start: REVEAL_START, once: true },
  });
  timeline.fromTo(
    element,
    { autoAlpha: 1, clipPath: "inset(100% 0% 0% 0%)" },
    { clipPath: "inset(0% 0% 0% 0%)", duration: 1.8, ease: "power4.inOut" }
  );
  // The photo settles from a slight zoom while the frame opens.
  if (image) timeline.from(image, { scale: 1.3, duration: 2.4, ease: EASE_STRONG }, 0);
}

// Unlit window colour: the stone of the facade (--color-line).
const UNLIT_WINDOW = "#d6cdbd";

/** The building fades in, then its windows light up one by one, in random order. */
function revealStagger(element: HTMLElement) {
  const timeline = gsap.timeline({
    delay: delayOf(element),
    scrollTrigger: { trigger: element, start: "top 80%", once: true },
  });
  timeline.fromTo(element, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 1.2, ease: EASE_SOFT });
  timeline.from(
    element.querySelectorAll("[data-reveal-item]"),
    {
      backgroundColor: UNLIT_WINDOW,
      duration: 0.8,
      ease: "power2.out",
      stagger: { each: 0.03, from: "random" },
      clearProps: "backgroundColor",
    },
    0.4
  );
}

function parallax(element: HTMLElement) {
  const amount = Number(element.dataset.parallax || 10);
  gsap.fromTo(
    element,
    { yPercent: -amount / 2 },
    {
      yPercent: amount / 2,
      ease: "none",
      scrollTrigger: {
        trigger: element.parentElement ?? element,
        start: "top bottom",
        end: "bottom top",
        // Slight catch-up so the image trails the scroll instead of being welded to it.
        scrub: 0.8,
      },
    }
  );
}

function showImmediately(scope: HTMLElement) {
  gsap.set(scope.querySelectorAll("[data-reveal]"), { autoAlpha: 1, clearProps: "transform" });
}

function choreograph(scope: HTMLElement) {
  scope.querySelectorAll<HTMLElement>("[data-reveal]").forEach((element) => {
    const kind = element.dataset.reveal;
    if (kind === "lines") revealLines(element);
    else if (kind === "image") revealImage(element);
    else if (kind === "stagger") revealStagger(element);
    else revealFade(element);
  });
  scope.querySelectorAll<HTMLElement>("[data-parallax]").forEach(parallax);
}

/**
 * Animates every tagged element inside the returned ref. Re-runs when `routeKey`
 * changes so each page gets its own triggers; previous ones are reverted.
 */
export function useScrollChoreography<T extends HTMLElement>(routeKey: string) {
  const scopeRef = useRef<T>(null);

  useGSAP(
    () => {
      const scope = scopeRef.current;
      if (!scope) return;

      const media = gsap.matchMedia();
      media.add(
        {
          animate: "(prefers-reduced-motion: no-preference)",
          reduce: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          if (context.conditions?.reduce) showImmediately(scope);
          else choreograph(scope);
        }
      );

      // Fonts and images shift layout after first paint; recompute trigger positions.
      const refresh = () => ScrollTrigger.refresh();
      document.fonts?.ready.then(refresh);
      window.addEventListener("load", refresh, { once: true });
      return () => {
        window.removeEventListener("load", refresh);
        media.revert();
      };
    },
    { scope: scopeRef, dependencies: [routeKey], revertOnUpdate: true }
  );

  return scopeRef;
}
