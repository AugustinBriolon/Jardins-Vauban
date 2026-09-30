/**
 * Single source for programme facts and contact details reused across pages.
 * Facts are illustrative (fictional brief) and listed as such in DECISIONS.md.
 */
export const SITE = {
  programme: "Les Jardins de Vauban",
  developer: "Kalimo Promotion",
  city: "Bordeaux",
  district: "Nansouty",
  address: "Rue Vauban, 33800 Bordeaux",
  delivery: "4e trimestre 2028",
  deliveryShort: "T4 2028",
  totalLots: 48,
  gardenArea: "2\u00a0400\u00a0m²",
  energyStandard: "RE 2020",
  brochureUrl: "/brochure.pdf",
  phone: { display: "05 56 00 00 00", href: "tel:+33556000000" },
  email: "contact@kalimo-promotion.fr",
  officeAddress: ["12 allée de Tourny", "33000 Bordeaux"],
  openingHours: "Du lundi au vendredi, 9 h – 18 h",
} as const;

export const NAV_LINKS = [
  { href: "/#programme", label: "Le programme" },
  { href: "/lots", label: "Les lots" },
] as const;

/** Residence location (fictional programme, placed between Place Nansouty and the Bergonié tram stop). */
export const RESIDENCE = { name: "Les Jardins de Vauban", latitude: 44.8226, longitude: -0.5752 } as const;

/** Nearby places shown on the map and in the list. Coordinates from OpenStreetMap; times are indicative. */
export const NEARBY_PLACES = [
  { id: "nansouty", name: "Place Nansouty", detail: "Marché et commerces", time: "4 min", mode: "à pied", latitude: 44.82, longitude: -0.5723 },
  { id: "tram", name: "Tram B — Bergonié", detail: "Direct centre historique", time: "5 min", mode: "à pied", latitude: 44.8251, longitude: -0.5782 },
  { id: "gare", name: "Gare Saint-Jean", detail: "Paris en 2 h", time: "8 min", mode: "à vélo", latitude: 44.8259, longitude: -0.557 },
  { id: "victoire", name: "Place de la Victoire", detail: "Université, cafés", time: "12 min", mode: "à pied", latitude: 44.831, longitude: -0.5723 },
  { id: "comedie", name: "Place de la Comédie", detail: "Grand-Théâtre", time: "15 min", mode: "en tram", latitude: 44.8426, longitude: -0.5745 },
] as const;

export const PHOTO_CREDITS = [
  { author: "Mathias Reding", url: "https://unsplash.com/photos/zksAVhip8F4" },
  { author: "Wojciech Rzepka", url: "https://unsplash.com/photos/ZtrpZX8ZGx8" },
] as const;
