import { Map, MapControls, MapMarker, MarkerContent, MarkerLabel } from "@/components/ui/map";
import { NEARBY_PLACES, RESIDENCE } from "@/lib/site";
import { cn } from "@/lib/utils";

// OpenFreeMap: free, keyless tiles that allow commercial use (unlike the CARTO default of mapcn).
const MAP_STYLE = "https://tiles.openfreemap.org/styles/positron";

// French wording for MapLibre's built-in messages (cooperative gestures overlay).
const MAP_LOCALE = {
  "CooperativeGesturesHandler.WindowsHelpText": "Ctrl + molette pour zoomer sur la carte",
  "CooperativeGesturesHandler.MacHelpText": "⌘ + molette pour zoomer sur la carte",
  "CooperativeGesturesHandler.MobileHelpText": "Utilisez deux doigts pour déplacer la carte",
};

interface NeighbourhoodMapProps {
  highlightedId: string | null;
  onHighlight: (id: string | null) => void;
}

/**
 * Street map of the residence and the places listed beside it.
 * Loaded client-side only (see pages/index.tsx): MapLibre needs the browser and is heavy.
 */
export default function NeighbourhoodMap({ highlightedId, onHighlight }: NeighbourhoodMapProps) {
  return (
    <Map
      styles={{ light: MAP_STYLE, dark: MAP_STYLE }}
      theme="light"
      // Framed so every listed place, up to Place de la Comédie, is visible at once.
      center={[-0.5675, RESIDENCE.latitude + 0.009]}
      zoom={13.4}
      // Page scroll must never be captured by the map: zoom needs Ctrl/⌘ + wheel or two fingers.
      cooperativeGestures
      locale={MAP_LOCALE}
      attributionControl={{ compact: true }}
      className="h-full w-full"
    >
      <MapControls position="top-right" showZoom />

      <MapMarker longitude={RESIDENCE.longitude} latitude={RESIDENCE.latitude}>
        <MarkerContent>
          <span className="relative flex size-5 items-center justify-center">
            <span className="absolute inset-0 rounded-full bg-garden/30 motion-safe:animate-ping" />
            <span className="relative size-3.5 rounded-full border-2 border-paper bg-garden shadow" />
          </span>
          <MarkerLabel position="bottom" className="font-display mt-1.5 text-base text-garden">
            {RESIDENCE.name}
          </MarkerLabel>
        </MarkerContent>
      </MapMarker>

      {NEARBY_PLACES.map((place) => {
        const active = place.id === highlightedId;
        return (
          <MapMarker
            key={place.id}
            longitude={place.longitude}
            latitude={place.latitude}
            onMouseEnter={() => onHighlight(place.id)}
            onMouseLeave={() => onHighlight(null)}
          >
            <MarkerContent>
              <span
                className={cn(
                  "block rounded-full border-2 border-paper bg-ink shadow transition-transform duration-500 ease-out-expo",
                  active ? "size-4 scale-110" : "size-3"
                )}
              />
              <MarkerLabel
                className={cn(
                  "rounded-full bg-paper/90 px-2 py-0.5 text-xs text-ink shadow-sm transition-opacity duration-300",
                  active ? "opacity-100" : "opacity-80"
                )}
              >
                {place.name}
              </MarkerLabel>
            </MarkerContent>
          </MapMarker>
        );
      })}
    </Map>
  );
}
