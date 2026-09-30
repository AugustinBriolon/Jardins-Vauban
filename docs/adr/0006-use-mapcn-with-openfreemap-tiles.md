# 6. Use mapcn with OpenFreeMap tiles for the neighbourhood map

Date: 2026-09-30

## Status

Proposed

## Context

Buyers judge a programme on its location. The first version showed a hand-drawn SVG diagram, which reviewers found unclear. The map must show the residence and nearby landmarks on real streets, need no API key, allow commercial use (Kalimo is a commercial developer), and carry no risk of exceeding the 20 €/month budget. The client requested mapcn, a set of React map components.

## Decision

We will use the **mapcn** `Map` component (built on MapLibre GL) with **OpenFreeMap** "positron" tiles.

- The component is vendored as published in `components/ui/map.tsx`. It has one local change: the MapLibre web worker is self-hosted (`/maplibre/`, copied by `scripts/copy-maplibre-worker.mjs` on `npm install`) instead of loaded from unpkg.
- Its default CARTO basemap is **not** used. CARTO's free tier allows commercial use only up to a monthly tile-request quota, then moves to paid plans (from 500 $/month at the time of writing). OpenFreeMap is free, keyless, allows commercial use and has no quota, so traffic can never create a bill.
- The vendored file is excluded from ESLint and opted out of React Compiler (`"use no memo"`). It mutates refs during render, which our lint rules forbid and which the compiler cannot optimise safely.
- The map is loaded client-side only, when its frame approaches the viewport (`next/dynamic` + `useInView`), with cooperative gestures so it never captures page scroll.

## Options considered

### Option A — Hand-drawn SVG diagram (previous version)
- Pros: no third party, no weight.
- Cons: not recognisable as Bordeaux, and reviewers could not read it.

### Option B — Google Maps or Mapbox
- Pros: familiar, rich.
- Cons: API key and billing account, usage-based cost, cookies or tracking that require consent.

### Option C — OpenStreetMap iframe embed
- Pros: free, one line.
- Cons: cannot be styled to match the site, no custom markers, needs `frame-src` opened in the CSP.

### Option D — mapcn + MapLibre + OpenFreeMap (chosen)
- Pros: styled markers and labels matching the design system, list and map interactions linked, free for commercial use with no quota, no key.
- Cons: MapLibre is heavy (about 300 kB gzip for the main bundle and its shared chunk, measured), and we carry a ~2,600-line vendored file that does not follow our lint rules.

## Consequences

### Positive
- The map is readable, on-brand, and costs 0 €.
- The heavy map bundle is not downloaded until the visitor scrolls near the neighbourhood section.

### Negative
- Visitors' browsers request tiles from `tiles.openfreemap.org`, which receives their IP address. This is listed in the privacy policy, and the CSP allows only that host.
- Updating mapcn means re-fetching `https://mapcn.dev/r/map.json` and re-applying the worker change marked in the file.

### Neutral
- `styles/globals.css` maps the shadcn tokens the component expects (`bg-background`, `text-foreground`…) onto the site palette.

## References
- `components/ui/map.tsx`, `components/home/NeighbourhoodMap.tsx`, `components/home/Neighbourhood.tsx`
- https://mapcn.dev
- https://openfreemap.org
- https://docs.carto.com/faqs/carto-basemaps (free tier and quotas of the default mapcn basemap)
