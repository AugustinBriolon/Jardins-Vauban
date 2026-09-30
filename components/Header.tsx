import Link from "next/link";
import { useRouter } from "next/router";
import { buttonVariants } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import { Menu, X, Phone } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/", label: "Le programme" },
  { href: "/lots", label: "Nos lots" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const { pathname } = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="bg-[#1B2A4A] sticky top-0 z-50">
      {/* Bandeau téléphone — confiance immédiate */}
      <div className="border-b border-white/10 hidden md:block">
        <div className="max-w-6xl mx-auto px-8 py-1.5 flex items-center justify-end gap-6 text-[11px] text-white/50 font-sans">
          <a href="tel:+33556000000" className="flex items-center gap-1.5 hover:text-[#C9A96E] transition-colors">
            <Phone className="w-3 h-3" /> 05 56 00 00 00
          </a>
          <span>Bordeaux — Nouvelle-Aquitaine</span>
        </div>
      </div>

      {/* Nav principale */}
      <div className="max-w-6xl mx-auto px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex flex-col leading-tight group" onClick={() => setMobileOpen(false)}>
          <span className="text-[#C9A96E] text-[10px] font-sans tracking-[0.22em] uppercase">
            Kalimo Promotion
          </span>
          <span className="text-white font-serif text-[17px] font-semibold group-hover:text-[#C9A96E] transition-colors">
            Les Jardins de Vauban
          </span>
        </Link>

        {/* Nav desktop */}
        <nav className="hidden md:flex items-center gap-0.5">
          {nav.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              prefetch={true}
              className={cn(
                "font-sans text-[13px] px-4 py-2 rounded-lg transition-colors",
                pathname === href
                  ? "text-[#C9A96E] bg-white/5 font-medium"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              )}
            >
              {label}
            </Link>
          ))}
          <div className="w-px h-5 bg-white/15 mx-3" />
          <Link
            href="/contact"
            prefetch={true}
            className={cn(
              buttonVariants({ size: "sm" }),
              "bg-[#C9A96E] text-[#1B2A4A] hover:bg-[#DFC093] font-sans text-xs font-bold tracking-wide px-5"
            )}
          >
            Demander un renseignement
          </Link>
        </nav>

        {/* Burger mobile */}
        <Button
          variant="ghost"
          size="icon-sm"
          className="md:hidden hover:bg-white/10 text-white"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </div>

      {/* Nav mobile — overlay */}
      {mobileOpen && (
        <div className="md:hidden bg-[#1B2A4A] border-t border-white/10 px-8 pb-6 pt-4 flex flex-col gap-1 animate-in slide-in-from-top-2 duration-200">
          {nav.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "font-sans text-sm py-2.5 px-3 rounded-lg transition-colors",
                pathname === href
                  ? "text-[#C9A96E] bg-white/5 font-medium"
                  : "text-white/60 hover:text-white"
              )}
            >
              {label}
            </Link>
          ))}
          <div className="h-px bg-white/10 my-2" />
          <Link
            href="/contact"
            onClick={() => setMobileOpen(false)}
            className={cn(
              buttonVariants({ size: "default" }),
              "bg-[#C9A96E] text-[#1B2A4A] hover:bg-[#DFC093] font-bold w-full justify-center"
            )}
          >
            Demander un renseignement
          </Link>
          <a href="tel:+33556000000" className="text-center text-white/40 text-xs mt-2 font-sans">
            ou appelez le 05 56 00 00 00
          </a>
        </div>
      )}
    </header>
  );
}
