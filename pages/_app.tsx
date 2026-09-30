import type { AppProps } from "next/app";
import { Analytics } from "@vercel/analytics/next";
import "@/styles/globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <Component {...pageProps} />
      </main>
      <Footer />
      {/* Vercel Analytics : cookie-free, RGPD-friendly */}
      <Analytics />
    </div>
  );
}
