import type { AppProps } from "next/app";
import { Geist, Instrument_Serif } from "next/font/google";
import { MotionConfig } from "motion/react";
import { Analytics } from "@vercel/analytics/next";
import "@/styles/globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useScrollChoreography } from "@/lib/motion";
import { useSmoothScroll } from "@/lib/smoothScroll";
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });
const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
});

export default function App({ Component, pageProps, router }: AppProps) {
  useSmoothScroll();
  // Keyed on the actual path (not the route pattern, not the query): moving between
  // two lot pages re-runs the choreography, opening a lot drawer (?lot=) does not.
  const scopeRef = useScrollChoreography<HTMLDivElement>(router.asPath.split(/[?#]/)[0]);

  return (
    <MotionConfig reducedMotion="user">
      <div
        ref={scopeRef}
        className={cn(geist.variable, instrumentSerif.variable, "flex min-h-dvh flex-col font-sans")}
      >
        <a
          href="#contenu"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:bg-ink focus:px-4 focus:py-2 focus:text-paper"
        >
          Aller au contenu
        </a>
        <Header />
        <main id="contenu" className="flex-1">
          <Component {...pageProps} />
        </main>
        <Footer />
        {/* Vercel Web Analytics: cookie-free audience measurement, no consent banner needed. */}
        <Analytics />
      </div>
    </MotionConfig>
  );
}
