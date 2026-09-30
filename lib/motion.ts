/*
 * Motion boundaries (see docs/adr for the rationale):
 * - GSAP + ScrollTrigger: scroll choreography declared in markup via data attributes.
 * - Motion (motion/react): transitions driven by React state (drawer, filters, form).
 *
 * Components never import GSAP directly. They tag elements with:
 *   data-reveal            fade + rise when scrolled into view
 *   data-reveal="lines"    heading split into masked lines that rise in turn
 *   data-reveal="image"    image unveiled by a clip-path wipe
 *   data-reveal="stagger"  children tagged data-reveal-item rise one after another, bottom first
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

export const EASE_OUT = "expo.out";
const REVEAL_START = "top 88%";

function delayOf(element: HTMLElement): number {
  return Number(element.dataset.revealDelay ?? 0);
}

function revealFade(element: HTMLElement) {
  gsap.fromTo(
    element,
    { autoAlpha: 0, y: 28 },
    {
      autoAlpha: 1,
      y: 0,
      duration: 1.1,
      delay: delayOf(element),
      ease: EASE_OUT,
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
    onSplit: (split) =>
      gsap.from(split.lines, {
        yPercent: 110,
        duration: 1.2,
        stagger: 0.09,
        delay: delayOf(element),
        ease: EASE_OUT,
        scrollTrigger: { trigger: element, start: REVEAL_START, once: true },
      }),
  });
}

function revealImage(element: HTMLElement) {
  gsap.fromTo(
    element,
    { autoAlpha: 1, clipPath: "inset(100% 0% 0% 0%)" },
    {
      clipPath: "inset(0% 0% 0% 0%)",
      duration: 1.6,
      delay: delayOf(element),
      ease: "expo.inOut",
      scrollTrigger: { trigger: element, start: REVEAL_START, once: true },
    }
  );
}

function revealStagger(element: HTMLElement) {
  gsap.set(element, { autoAlpha: 1 });
  gsap.from(element.querySelectorAll("[data-reveal-item]"), {
    scaleY: 0,
    transformOrigin: "50% 100%",
    duration: 0.9,
    ease: EASE_OUT,
    stagger: { each: 0.018, from: "end" },
    delay: delayOf(element),
    clearProps: "transform",
    scrollTrigger: { trigger: element, start: "top 80%", once: true },
  });
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
        scrub: true,
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
