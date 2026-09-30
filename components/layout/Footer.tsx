import Link from "next/link";
import { NAV_LINKS, PHOTO_CREDITS, SITE } from "@/lib/site";

const LEGAL_LINKS = [
  { href: "/mentions-legales", label: "Mentions légales" },
  { href: "/politique-de-confidentialite", label: "Politique de confidentialité" },
];

export default function Footer() {
  return (
    <footer className="bg-ink text-paper">
      <div className="shell pt-20 pb-10 lg:pt-28">
        <div className="grid gap-12 border-b border-paper/15 pb-16 md:grid-cols-12">
          <div className="md:col-span-6">
            <p className="eyebrow text-paper/50">Un programme {SITE.developer}</p>
            <p className="font-display mt-4 max-w-md text-4xl leading-[1.05] sm:text-5xl">
              Quarante-huit logements, un jardin en partage.
            </p>
          </div>

          <nav aria-label="Pied de page" className="space-y-3 text-sm md:col-span-3">
            <p className="eyebrow text-paper/50">Explorer</p>
            {[...NAV_LINKS, { href: "/contact", label: "Contact" }].map((link) => (
              <Link key={link.href} href={link.href} className="link-draw block w-fit text-paper/80 hover:text-paper">
                {link.label}
              </Link>
            ))}
            <a href={SITE.brochureUrl} target="_blank" rel="noopener" className="link-draw block w-fit text-paper/80 hover:text-paper">
              Plaquette PDF
            </a>
          </nav>

          <address className="space-y-3 text-sm not-italic md:col-span-3">
            <p className="eyebrow text-paper/50">Bureau de vente</p>
            <p className="text-paper/80">
              {SITE.officeAddress.map((line) => (
                <span key={line} className="block">{line}</span>
              ))}
            </p>
            <a href={SITE.phone.href} className="link-draw block w-fit text-paper">{SITE.phone.display}</a>
            <a href={`mailto:${SITE.email}`} className="link-draw block w-fit text-paper/80 hover:text-paper">
              {SITE.email}
            </a>
            <p className="text-paper/50">{SITE.openingHours}</p>
          </address>
        </div>

        <div className="flex flex-col gap-4 pt-8 text-xs text-paper/50 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} {SITE.developer} — Visuels non contractuels.</p>
          <p>
            Photos :{" "}
            {PHOTO_CREDITS.map((credit, index) => (
              <span key={credit.url}>
                <a href={credit.url} target="_blank" rel="noopener noreferrer" className="link-draw hover:text-paper">
                  {credit.author}
                </a>
                {index < PHOTO_CREDITS.length - 1 ? ", " : " / Unsplash"}
              </span>
            ))}
          </p>
          <ul className="flex gap-6">
            {LEGAL_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="link-draw hover:text-paper">{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
