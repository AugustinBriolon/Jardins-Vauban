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
  { href: "/#quartier", label: "Le quartier" },
] as const;

export const PHOTO_CREDITS = [
  { author: "Mathias Reding", url: "https://unsplash.com/photos/zksAVhip8F4" },
  { author: "Vince Gx", url: "https://unsplash.com/photos/WuOeUt-emsk" },
  { author: "Wojciech Rzepka", url: "https://unsplash.com/photos/ZtrpZX8ZGx8" },
] as const;
