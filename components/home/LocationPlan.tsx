const PLACES = [
  { x: 250, y: 58, label: "Place de la Comédie", anchor: "start" as const },
  { x: 372, y: 196, label: "Gare Saint-Jean", anchor: "end" as const },
  { x: 250, y: 252, label: "Place Nansouty", anchor: "start" as const },
];

const SITE_POINT = { x: 196, y: 300 };

/**
 * Hand-drawn situation diagram (not to scale). Replaces a third-party map embed:
 * no tiles loaded from an external server, so no visitor IP is shared with it.
 */
export default function LocationPlan() {
  return (
    <figure className="relative">
      <svg
        viewBox="0 0 480 420"
        role="img"
        aria-labelledby="plan-title"
        className="h-auto w-full bg-paper font-sans"
      >
        <title id="plan-title">
          Schéma de situation : la résidence se trouve dans le quartier Nansouty, au sud du centre historique de Bordeaux, près de la gare Saint-Jean.
        </title>

        {/* Street fabric */}
        <g stroke="currentColor" className="text-ink/10" strokeWidth="1" fill="none">
          {[40, 90, 140, 190, 240, 290, 340, 390].map((y) => (
            <path key={`h${y}`} d={`M0 ${y} Q 200 ${y + 12} 420 ${y - 6}`} />
          ))}
          {[60, 130, 200, 270, 340].map((x) => (
            <path key={`v${x}`} d={`M${x} 0 Q ${x + 14} 210 ${x - 8} 420`} />
          ))}
        </g>

        {/* Garonne */}
        <path d="M430 0 C 370 110, 480 210, 420 300 S 400 400, 440 420 L 480 420 L 480 0 Z" className="fill-garden-soft" />
        <text x="452" y="150" className="fill-garden text-[11px] tracking-[0.2em] uppercase" transform="rotate(78 452 150)">
          Garonne
        </text>

        {/* Tram line */}
        <path
          d="M250 58 C 240 140, 232 200, 214 290"
          fill="none"
          strokeWidth="2"
          strokeDasharray="6 5"
          className="stroke-garden"
        />

        {/* Walking radius */}
        <circle cx={SITE_POINT.x} cy={SITE_POINT.y} r="62" fill="none" strokeDasharray="2 4" className="stroke-ink/40" />
        <circle cx={SITE_POINT.x} cy={SITE_POINT.y} r="124" fill="none" strokeDasharray="2 4" className="stroke-ink/25" />
        <text x={SITE_POINT.x - 62} y={SITE_POINT.y + 78} className="fill-ink-soft text-[10px]">5 min à pied</text>
        <text x={SITE_POINT.x - 108} y={SITE_POINT.y + 136} className="fill-ink-soft text-[10px]">10 min</text>

        {PLACES.map((place) => (
          <g key={place.label}>
            <circle cx={place.x} cy={place.y} r="4" className="fill-ink" />
            <text
              x={place.anchor === "start" ? place.x + 10 : place.x - 10}
              y={place.y + 4}
              textAnchor={place.anchor}
              className="fill-ink text-[12px]"
            >
              {place.label}
            </text>
          </g>
        ))}

        {/* The residence */}
        <circle cx={SITE_POINT.x} cy={SITE_POINT.y} r="16" className="origin-center motion-safe:animate-ping fill-garden/30 [transform-box:fill-box]" />
        <circle cx={SITE_POINT.x} cy={SITE_POINT.y} r="8" className="fill-garden" />
        <text x={SITE_POINT.x - 14} y={SITE_POINT.y + 4} textAnchor="end" className="fill-garden text-[13px] font-medium">
          Les Jardins de Vauban
        </text>
      </svg>
      <figcaption className="mt-3 flex justify-between text-xs text-ink-soft">
        <span>Schéma de situation, non contractuel.</span>
        <a
          href="https://www.openstreetmap.org/?mlat=44.8235&mlon=-0.5720#map=15/44.8235/-0.5720"
          target="_blank"
          rel="noopener noreferrer"
          className="link-draw text-ink"
        >
          Ouvrir la carte
        </a>
      </figcaption>
    </figure>
  );
}
