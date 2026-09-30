"use client";
import { useState, useMemo, useTransition } from "react";
import type { Lot, LotType } from "@/types";
import LotCard from "./LotCard";
import LotCardSkeleton from "./LotCardSkeleton";
import { cn } from "@/lib/utils";
import { SlidersHorizontal, RotateCcw } from "lucide-react";

const TYPES: LotType[] = ["T2", "T3", "T4"];

interface Props {
  lots: Lot[];
}

export default function LotsGrid({ lots }: Props) {
  const maxPrix = useMemo(() => Math.max(...lots.map((l) => l.prix), 600000), [lots]);

  const [selectedTypes, setSelectedTypes] = useState<LotType[]>([]);
  const [budgetMax, setBudgetMax] = useState(maxPrix);
  const [seulsDisponibles, setSeulsDisponibles] = useState(false);
  const [isPending, startTransition] = useTransition();

  const toggleType = (type: LotType) => {
    startTransition(() => {
      setSelectedTypes((prev) =>
        prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
      );
    });
  };

  const handleBudgetChange = (value: number) => {
    startTransition(() => {
      setBudgetMax(value);
    });
  };

  const handleToggleDispo = () => {
    startTransition(() => {
      setSeulsDisponibles((v) => !v);
    });
  };

  const handleReset = () => {
    startTransition(() => {
      setSelectedTypes([]);
      setBudgetMax(maxPrix);
      setSeulsDisponibles(false);
    });
  };

  const hasFilters = selectedTypes.length > 0 || budgetMax < maxPrix || seulsDisponibles;

  const filtered = useMemo(
    () =>
      lots.filter((lot) => {
        if (selectedTypes.length > 0 && !selectedTypes.includes(lot.type)) return false;
        if (lot.prix > budgetMax) return false;
        if (seulsDisponibles && lot.statut !== "Disponible") return false;
        return true;
      }),
    [lots, selectedTypes, budgetMax, seulsDisponibles]
  );

  const counts = {
    disponible: lots.filter((l) => l.statut === "Disponible").length,
    optionné: lots.filter((l) => l.statut === "Optionné").length,
    vendu: lots.filter((l) => l.statut === "Vendu").length,
  };

  return (
    <div className="space-y-6">
      {/* ── Barre de Filtres Stable & Épurée ─────────────────────────────── */}
      <div className="bg-white rounded-3xl border border-stone-200/90 p-6 shadow-sm space-y-5">
        
        {/* En-tête des filtres avec Reset en place fixe (ne décale plus les inputs) */}
        <div className="flex items-center justify-between pb-3.5 border-b border-stone-100">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#1B2A4A]">
            <SlidersHorizontal className="w-4 h-4 text-[#C9A96E]" />
            <span className="uppercase tracking-wider">Filtrer par critères</span>
          </div>

          {/* Bouton Réinitialiser réservé à cet emplacement fixe */}
          <button
            type="button"
            onClick={handleReset}
            className={cn(
              "text-xs font-medium text-stone-500 hover:text-[#1B2A4A] transition-all duration-200 flex items-center gap-1.5 px-2.5 py-1 rounded-lg hover:bg-stone-100",
              hasFilters ? "opacity-100" : "opacity-0 pointer-events-none"
            )}
            title="Effacer tous les filtres"
          >
            <RotateCcw className="w-3 h-3 text-[#C9A96E]" />
            <span>Réinitialiser les filtres</span>
          </button>
        </div>

        {/* Rangée des contrôles de filtrage */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
          
          {/* 1. Sélection de Type (4 colonnes) */}
          <div className="md:col-span-4 space-y-2">
            <span className="text-[10px] font-sans font-semibold text-stone-400 uppercase tracking-widest block">
              Typologie
            </span>
            <div className="flex gap-2">
              {TYPES.map((t) => {
                const active = selectedTypes.includes(t);
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => toggleType(t)}
                    className={cn(
                      "text-xs font-bold px-4 py-2 rounded-xl border transition-all duration-150 flex-1",
                      active
                        ? "bg-[#1B2A4A] text-white border-[#1B2A4A] shadow-sm"
                        : "text-stone-600 bg-stone-50 border-stone-200 hover:border-[#1B2A4A]/40 hover:bg-white"
                    )}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Curseur de Budget (5 colonnes) */}
          <div className="md:col-span-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-sans font-semibold text-stone-400 uppercase tracking-widest">
                Budget maximum
              </span>
              <span className="font-semibold text-xs text-[#1B2A4A] font-sans bg-stone-100 px-2 py-0.5 rounded-md">
                {new Intl.NumberFormat("fr-FR", {
                  style: "currency",
                  currency: "EUR",
                  maximumFractionDigits: 0,
                }).format(budgetMax)}
              </span>
            </div>
            <div className="py-1">
              <input
                type="range"
                min={150000}
                max={maxPrix}
                step={10000}
                value={budgetMax}
                onChange={(e) => handleBudgetChange(Number(e.target.value))}
                className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #1B2A4A ${((budgetMax - 150000) / (maxPrix - 150000)) * 100}%, #E8E3D9 0%)`,
                  accentColor: "#C9A96E",
                }}
              />
            </div>
          </div>

          {/* 3. Interrupteur Disponible uniquement (3 colonnes) */}
          <div className="md:col-span-3 flex justify-start md:justify-end">
            <button
              type="button"
              onClick={handleToggleDispo}
              className="flex items-center gap-3 cursor-pointer py-1.5 px-3 rounded-xl hover:bg-stone-50 transition-colors border border-transparent hover:border-stone-200"
            >
              <div className="relative flex-shrink-0">
                <div
                  className="w-9 h-5 rounded-full transition-colors duration-200"
                  style={{ background: seulsDisponibles ? "#1B2A4A" : "#E8E3D9" }}
                />
                <div
                  className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200"
                  style={{ transform: seulsDisponibles ? "translateX(16px)" : "translateX(0)" }}
                />
              </div>
              <span className="text-xs font-sans text-stone-700 font-medium select-none whitespace-nowrap">
                Disponibles seuls
              </span>
            </button>
          </div>

        </div>
      </div>

      {/* ── Badges de Comptage Récapitulatif ──────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-1">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border border-emerald-200"
            style={{ background: "#DCFCE7", color: "#166534" }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
            {counts.disponible} disponible{counts.disponible > 1 ? "s" : ""}
          </span>
          <span
            className="inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full border border-amber-200 text-stone-700"
            style={{ background: "#FEF9C3" }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />
            {counts.optionné} sous option
          </span>
          <span
            className="inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full border border-red-200 text-stone-700"
            style={{ background: "#FEE2E2" }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 inline-block" />
            {counts.vendu} vendu{counts.vendu > 1 ? "s" : ""}
          </span>
        </div>

        <div className="text-xs text-stone-500 font-sans">
          Affichage de <span className="font-bold text-[#1B2A4A]">{filtered.length}</span> logement{filtered.length > 1 ? "s" : ""}
        </div>
      </div>

      {/* ── Grille des Lots (avec Skeletons en cas de transition) ────────── */}
      {isPending ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <LotCardSkeleton key={i} index={i} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-3xl border border-stone-200 p-16 text-center text-stone-400 space-y-3">
          <p className="text-4xl">🔍</p>
          <p className="font-serif text-lg font-semibold text-stone-700">
            Aucun logement ne correspond à ces critères
          </p>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Augmentez votre budget ou désactivez le filtre d&apos;exclusivité pour découvrir d&apos;autres opportunités.
          </p>
          <button
            type="button"
            onClick={handleReset}
            className="mt-2 text-xs font-semibold text-[#1B2A4A] bg-stone-100 hover:bg-stone-200 px-4 py-2 rounded-xl transition-colors inline-flex items-center gap-1.5"
          >
            <RotateCcw className="w-3 h-3 text-[#C9A96E]" />
            Réinitialiser les filtres
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((lot, i) => (
            <LotCard key={lot.id} lot={lot} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
