/*
 * Smooth scrolling with Lenis, driven by the GSAP ticker so scroll position,
 * ScrollTrigger and every tween advance on the same frame (no jitter on parallax).
 * Lenis honours prefers-reduced-motion by itself (smoothing disabled).
 */
import { useEffect } from "react";
import { useRouter } from "next/router";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Header height plus breathing room, so anchored sections are not hidden under it.
const ANCHOR_OFFSET = -96;

let lenis: Lenis | null = null;

/** Freezes page scroll while a modal layer (drawer, mobile menu) is open. */
export function lockScroll(locked: boolean) {
  if (lenis) {
    if (locked) lenis.stop();
    else lenis.start();
    return;
  }
  document.documentElement.style.overflow = locked ? "hidden" : "";
}

/** Mounted once in _app. */
export function useSmoothScroll() {
  const { events } = useRouter();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const instance = new Lenis({
      duration: 1.2,
      easing: (t) => 1 - Math.pow(1 - t, 4),
      anchors: { offset: ANCHOR_OFFSET },
      prevent: (node) => node.closest("[data-lenis-prevent]") !== null,
    });
    lenis = instance;

    const tick = (time: number) => instance.raf(time * 1000);
    instance.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Page height changes on navigation; let Lenis measure the new document.
    const onRouteChange = () => instance.resize();
    events.on("routeChangeComplete", onRouteChange);

    return () => {
      events.off("routeChangeComplete", onRouteChange);
      gsap.ticker.remove(tick);
      instance.destroy();
      lenis = null;
    };
  }, [events]);
}
