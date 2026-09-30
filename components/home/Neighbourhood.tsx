import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useInView } from "motion/react";
import { NEARBY_PLACES, RESIDENCE } from "@/lib/site";
import SectionHeading from "@/components/ui/SectionHeading";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import { cn } from "@/lib/utils";

// MapLibre only runs in the browser and weighs ~300 kB gzip: load it client-side, on approach.
const NeighbourhoodMap = dynamic(() => import("@/components/home/NeighbourhoodMap"), { ssr: false });

// MapLibre 6 needs WebGL2, which is missing when hardware acceleration is disabled
// (common on managed corporate laptops) and on some older devices.
function supportsWebGL2() {
  try {
    return Boolean(document.createElement("canvas").getContext("webgl2"));
  } catch {
    return false;
  }
}

const OSM_LINK = `https://www.openstreetmap.org/?mlat=${RESIDENCE.latitude}&mlon=${RESIDENCE.longitude}#map=15/${RESIDENCE.latitude}/${RESIDENCE.longitude}`;

function MapFallback() {
  return (
    <div className="flex h-full flex-col items-start justify-end gap-3 p-8">
      <p className="font-display text-3xl">Rue Vauban, Bordeaux Nansouty</p>
      <p className="max-w-sm text-ink-soft">La carte interactive ne peut pas s&apos;afficher sur cet appareil.</p>
      <a href={OSM_LINK} target="_blank" rel="noopener noreferrer" className="link-draw pb-0.5">
        Voir l&apos;emplacement sur OpenStreetMap
      </a>
    </div>
  );
}

export default function Neighbourhood() {
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const mapFrameRef = useRef<HTMLDivElement>(null);
  const nearViewport = useInView(mapFrameRef, { once: true, margin: "600px 0px" });

  return (
    <section className="shell py-24 lg:py-36">
      <SectionHeading index="03" label="Le quartier" title={<>Nansouty, le Bordeaux des échoppes et des marchés.</>} />

      <div className="mt-16 grid gap-10 lg:mt-24 lg:grid-cols-12 lg:gap-8">
        <ul className="lg:col-span-4" onMouseLeave={() => setHighlightedId(null)}>
          {NEARBY_PLACES.map((place, index) => (
            <li
              key={place.id}
              data-reveal
              data-reveal-delay={String(index * 0.06)}
              onMouseEnter={() => setHighlightedId(place.id)}
              className={cn(
                "grid grid-cols-[5.5rem_1fr] items-baseline gap-4 border-b border-line py-5 transition-colors duration-500 first:border-t sm:grid-cols-[7rem_1fr]",
                highlightedId === place.id ? "text-ink" : highlightedId ? "text-ink/45" : "text-ink"
              )}
            >
              <span className="font-display tabular text-3xl sm:text-4xl">{place.time}</span>
              <span>
                <span className="eyebrow block">{place.mode}</span>
                <span className="block">{place.name}</span>
                <span className="block text-sm text-ink-soft">{place.detail}</span>
              </span>
            </li>
          ))}
          <li className="pt-4 text-xs text-ink-soft">Temps de trajet indicatifs.</li>
        </ul>

        <div
          ref={mapFrameRef}
          data-reveal
          className="relative h-[420px] overflow-hidden border border-line bg-paper sm:h-[520px] lg:col-span-8 lg:h-auto lg:min-h-[560px]"
        >
          {nearViewport &&
            (supportsWebGL2() ? (
              <ErrorBoundary fallback={<MapFallback />}>
                <NeighbourhoodMap highlightedId={highlightedId} onHighlight={setHighlightedId} />
              </ErrorBoundary>
            ) : (
              <MapFallback />
            ))}
        </div>
      </div>
    </section>
  );
}
