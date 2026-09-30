export default function LotCardSkeleton({ index = 0 }: { index?: number }) {
  return (
    <div
      className="bg-white rounded-2xl overflow-hidden border border-stone-100 flex flex-col animate-pulse shadow-sm"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Haut : badges + prix */}
      <div className="px-4 pt-4 pb-3 flex items-start justify-between gap-2">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            {/* Type badge */}
            <div className="w-8 h-5 bg-stone-200 rounded-md" />
            {/* Ref */}
            <div className="w-10 h-4 bg-stone-100 rounded" />
          </div>
          {/* Prix */}
          <div className="w-28 h-6 bg-stone-200 rounded-md" />
        </div>

        {/* Badge statut */}
        <div className="w-20 h-5 bg-stone-100 rounded-full" />
      </div>

      {/* Séparateur */}
      <div className="mx-4 h-px bg-stone-100" />

      {/* Caractéristiques */}
      <div className="px-4 py-3 flex-1 grid grid-cols-2 gap-2.5">
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded bg-stone-200 flex-shrink-0" />
          <div className="w-12 h-3.5 bg-stone-100 rounded" />
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded bg-stone-200 flex-shrink-0" />
          <div className="w-10 h-3.5 bg-stone-100 rounded" />
        </div>
        <div className="flex items-center gap-2 col-span-2">
          <div className="w-3.5 h-3.5 rounded bg-stone-200 flex-shrink-0" />
          <div className="w-16 h-3.5 bg-stone-100 rounded" />
        </div>
      </div>

      {/* CTA */}
      <div className="px-4 pb-4">
        <div className="w-full h-9 rounded-xl bg-stone-200" />
      </div>
    </div>
  );
}
