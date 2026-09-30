import type { Lot } from "@/types";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const STATUS_CONFIG = {
  Disponible: { label: "Disponible", bg: "#DCFCE7", text: "#166534", dot: "#22C55E" },
  Optionné:   { label: "Optionné",   bg: "#FEF9C3", text: "#854D0E", dot: "#F59E0B" },
  Vendu:      { label: "Vendu",      bg: "#FEE2E2", text: "#991B1B", dot: "#EF4444" },
} as const;

const EXPO_EMOJI: Record<string, string> = {
  Sud: "☀️", "Sud-Est": "🌤️", "Sud-Ouest": "🌤️",
  Est: "🌅", Ouest: "🌇",
  Nord: "🧭", "Nord-Est": "🧭", "Nord-Ouest": "🧭",
};

function formatPrix(prix: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency", currency: "EUR", maximumFractionDigits: 0,
  }).format(prix);
}

interface Props {
  lot: Lot;
  index?: number;
}

export default function LotCard({ lot, index = 0 }: Props) {
  const status = STATUS_CONFIG[lot.statut];
  const isUnavailable = lot.statut !== "Disponible";
  const delay = `${index * 40}ms`;

  return (
    <article
      className={cn("fade-up bg-white rounded-2xl overflow-hidden border border-stone-100 flex flex-col", isUnavailable ? "opacity-55" : "card-lift")}
      style={{ animationDelay: delay }}
    >
      {/* ── Haut : prix + statut ─────────────────────────────────────── */}
      <div className="px-4 pt-4 pb-3 flex items-start justify-between gap-2">
        <div>
          {/* Type + Référence */}
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-black px-2.5 py-0.5 rounded-md text-white bg-[#1B2A4A]">
              {lot.type}
            </span>
            <span className="text-xs text-stone-400 font-mono">{lot.reference}</span>
          </div>
          {/* Prix */}
          <p className="font-serif text-xl font-bold text-[#1B2A4A] leading-tight">
            {formatPrix(lot.prix)}
          </p>
        </div>

        {/* Badge statut avec dot */}
        <span
          className="inline-flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap flex-shrink-0"
          style={{ background: status.bg, color: status.text }}
        >
          <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: status.dot }} />
          {status.label}
        </span>
      </div>

      {/* Séparateur */}
      <div className="mx-4 h-px bg-stone-100" />

      {/* ── Caractéristiques ─────────────────────────────────────────── */}
      <div className="px-4 py-3 flex-1 grid grid-cols-2 gap-2">
        {/* Surface */}
        <div className="flex items-center gap-1.5 text-xs text-stone-500">
          <svg className="w-3 h-3 flex-shrink-0 text-[#C9A96E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          </svg>
          <span className="font-semibold text-stone-700">{lot.surface} m²</span>
        </div>

        {/* Étage */}
        <div className="flex items-center gap-1.5 text-xs text-stone-500">
          <svg className="w-3 h-3 flex-shrink-0 text-[#C9A96E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-2 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <span className="font-semibold text-stone-700">
            {lot.etage === 0 ? "RDC" : `${lot.etage}e ét.`}
          </span>
        </div>

        {/* Exposition */}
        <div className="flex items-center gap-1.5 text-xs text-stone-500 col-span-2">
          <span className="text-sm leading-none">{EXPO_EMOJI[lot.exposition] ?? "📍"}</span>
          <span className="font-semibold text-stone-700">{lot.exposition}</span>
        </div>

        {/* Terrasse */}
        {lot.terrasse && (
          <div className="flex items-center gap-1.5 text-xs text-stone-500 col-span-2">
            <svg className="w-3 h-3 flex-shrink-0 text-[#C9A96E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span>Terrasse <span className="font-semibold text-stone-700">{lot.terrasse} m²</span></span>
          </div>
        )}
      </div>

      {/* ── CTA ──────────────────────────────────────────────────────── */}
      <div className="px-4 pb-4">
        {lot.statut === "Disponible" ? (
          <Link
            href={`/contact?lot=${encodeURIComponent(lot.reference)}`}
            className={cn(
              buttonVariants(),
              "w-full justify-center rounded-xl text-xs font-bold bg-[#1B2A4A] hover:bg-[#243660]"
            )}
          >
            Me renseigner →
          </Link>
        ) : (
          <div className="w-full py-2.5 rounded-xl text-xs font-semibold text-center text-stone-400 bg-stone-100">
            {lot.statut === "Vendu" ? "Vendu" : "Sous option"}
          </div>
        )}
      </div>
    </article>
  );
}
