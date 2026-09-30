// Copies the MapLibre web worker next to the site's static files, so the map
// loads it from our own origin (see components/ui/map.tsx). Runs on npm install.
import { copyFileSync, mkdirSync } from "node:fs";

const source = "node_modules/maplibre-gl/dist";
const target = "public/maplibre";

mkdirSync(target, { recursive: true });
for (const file of ["maplibre-gl-worker.mjs", "maplibre-gl-shared.mjs"]) {
  copyFileSync(`${source}/${file}`, `${target}/${file}`);
}
