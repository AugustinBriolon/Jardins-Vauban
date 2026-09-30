import Link from "next/link";
import { Separator } from "@/components/ui/separator";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#1B2A4A] mt-auto">
      {/* Contenu principal */}
      <div className="max-w-6xl mx-auto px-8 pt-16 pb-10 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="md:col-span-1">
          <p className="text-[#C9A96E] text-[10px] font-sans tracking-[0.22em] uppercase mb-1">
            Kalimo Promotion
          </p>
          <p className="text-white font-serif text-lg font-semibold leading-tight mb-4">
            Les Jardins de Vauban
          </p>
          <p className="text-white/40 text-xs font-sans leading-relaxed">
            Programme immobilier de 48 logements neufs
            <br />
            Bordeaux — Nouvelle-Aquitaine
          </p>
        </div>

        {/* Navigation */}
        <div>
          <p className="text-white/30 uppercase tracking-[0.15em] text-[10px] font-sans font-semibold mb-4">
            Navigation
          </p>
          <ul className="space-y-2.5 font-sans text-sm text-white/50">
            {[
              { href: "/", label: "Le programme" },
              { href: "/lots", label: "Les lots disponibles" },
              { href: "/contact", label: "Nous contacter" },
            ].map(({ href, label }) => (
              <li key={href}>
                <Link href={href} className="hover:text-[#C9A96E] transition-colors">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Ressources */}
        <div>
          <p className="text-white/30 uppercase tracking-[0.15em] text-[10px] font-sans font-semibold mb-4">
            Ressources
          </p>
          <ul className="space-y-2.5 font-sans text-sm text-white/50">
            <li>
              <Link
                href="/brochure.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#C9A96E] transition-colors"
              >
                Plaquette commerciale
              </Link>
            </li>
            <li>
              <a href="mailto:contact@kalimo-promotion.fr" className="hover:text-[#C9A96E] transition-colors">
                contact@kalimo-promotion.fr
              </a>
            </li>
            <li>
              <a href="tel:+33556000000" className="hover:text-[#C9A96E] transition-colors">
                05 56 00 00 00
              </a>
            </li>
          </ul>
        </div>

        {/* Légal */}
        <div>
          <p className="text-white/30 uppercase tracking-[0.15em] text-[10px] font-sans font-semibold mb-4">
            Informations
          </p>
          <p className="text-white/35 text-xs font-sans leading-relaxed">
            Les visuels présentés ont un caractère indicatif et ne constituent
            pas un engagement contractuel. Livraison estimée T2 2027.
          </p>
        </div>
      </div>

      {/* Barre de copyright */}
      <Separator className="bg-white/10 max-w-6xl mx-auto" />
      <div className="max-w-6xl mx-auto px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p className="text-white/25 text-[11px] font-sans">
          © {year} Kalimo Promotion. Tous droits réservés.
        </p>
        <div className="flex items-center gap-4 text-white/40 text-[11px] font-sans">
          <Link href="/politique-de-confidentialite" className="hover:text-[#C9A96E] transition-colors underline">
            Politique de Confidentialité (RGPD)
          </Link>
          <span>·</span>
          <span>Données hébergées en conformité CNIL</span>
        </div>
      </div>
    </footer>
  );
}
