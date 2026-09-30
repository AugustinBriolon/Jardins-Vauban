"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import type { ContactFormData } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle2, AlertCircle, Loader2, ShieldCheck, Send } from "lucide-react";

interface FormState extends ContactFormData {
  website_hp?: string; // Honeypot anti-spam invisible
}

const EMPTY_FORM: FormState = {
  nom: "",
  prenom: "",
  email: "",
  telephone: "",
  lotSouhaite: "",
  message: "",
  consentement: false,
  website_hp: "",
};

export default function ContactForm() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  // Pré-remplissage sécurisé du lot souhaité depuis l'URL
  useEffect(() => {
    if (router.query.lot) {
      const rawLot = String(router.query.lot).trim();
      // Filtrage strict : seuls caractères alphanumériques et tirets sont autorisés
      if (/^[a-zA-Z0-9_-]{1,20}$/.test(rawLot)) {
        setForm((f) => ({ ...f, lotSouhaite: rawLot }));
      }
    }
  }, [router.query.lot]);

  const update = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setForm((f) => ({
      ...f,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const validateClientSide = (): string | null => {
    if (!form.nom.trim()) return "Veuillez renseigner votre nom.";
    if (!form.prenom.trim()) return "Veuillez renseigner votre prénom.";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      return "Veuillez saisir une adresse email valide.";
    }
    if (form.telephone && !/^[0-9+.\s()-]{6,25}$/.test(form.telephone.trim())) {
      return "Le format du numéro de téléphone n'est pas valide.";
    }
    if (!form.message.trim() || form.message.trim().length < 5) {
      return "Votre message doit comporter au moins 5 caractères.";
    }
    if (!form.consentement) {
      return "Veuillez accepter la politique de traitement des données personnelles pour valider votre demande.";
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const clientError = validateClientSide();
    if (clientError) {
      setErrorMsg(clientError);
      setStatus("error");
      return;
    }

    setStatus("sending");
    setErrorMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      let data: { success?: boolean; error?: string } = {};
      try {
        data = await res.json();
      } catch {
        throw new Error("Réponse inattendue du serveur.");
      }

      if (!res.ok) {
        throw new Error(data.error || "Une erreur est survenue lors de l'envoi.");
      }

      setStatus("success");
      setForm(EMPTY_FORM);
    } catch (err: unknown) {
      setStatus("error");
      setErrorMsg(
        err instanceof Error
          ? err.message
          : "Une erreur est survenue lors de l'envoi de votre demande."
      );
    }
  };

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center space-y-5 animate-in fade-in duration-300">
        <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center border border-emerald-200">
          <CheckCircle2 className="w-9 h-9 text-emerald-600" />
        </div>
        <div>
          <h3 className="font-serif text-2xl font-semibold text-[#1B2A4A] mb-2">
            Demande bien reçue !
          </h3>
          <p className="text-stone-600 font-sans text-sm max-w-md mx-auto leading-relaxed">
            Merci de votre confiance. Notre conseiller dédié au programme{" "}
            <strong>Les Jardins de Vauban</strong> prendra contact avec vous sous 24 heures ouvrées.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => setStatus("idle")}
          className="mt-4 border-stone-300 text-[#1B2A4A] hover:bg-stone-50"
        >
          Envoyer une autre demande
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      {/* Honeypot invisible pour piéger les bots sans gêner les utilisateurs */}
      <div className="sr-only" aria-hidden="true" style={{ display: "none" }}>
        <label htmlFor="website_hp">Ne pas remplir ce champ</label>
        <input
          type="text"
          id="website_hp"
          name="website_hp"
          tabIndex={-1}
          autoComplete="off"
          value={form.website_hp || ""}
          onChange={update}
        />
      </div>

      {/* Nom & Prénom */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-2">
          <Label htmlFor="nom" className="text-xs font-semibold uppercase tracking-wider text-stone-600">
            Nom <span className="text-amber-700">*</span>
          </Label>
          <Input
            id="nom"
            name="nom"
            value={form.nom}
            onChange={update}
            placeholder="Dupont"
            required
            className="h-11 rounded-xl bg-stone-50/50 border-stone-200 focus:border-[#1B2A4A] focus:bg-white text-sm"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="prenom" className="text-xs font-semibold uppercase tracking-wider text-stone-600">
            Prénom <span className="text-amber-700">*</span>
          </Label>
          <Input
            id="prenom"
            name="prenom"
            value={form.prenom}
            onChange={update}
            placeholder="Camille"
            required
            className="h-11 rounded-xl bg-stone-50/50 border-stone-200 focus:border-[#1B2A4A] focus:bg-white text-sm"
          />
        </div>
      </div>

      {/* Email & Téléphone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-stone-600">
            Adresse email <span className="text-amber-700">*</span>
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={update}
            placeholder="camille.dupont@exemple.fr"
            required
            className="h-11 rounded-xl bg-stone-50/50 border-stone-200 focus:border-[#1B2A4A] focus:bg-white text-sm"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="telephone" className="text-xs font-semibold uppercase tracking-wider text-stone-600">
            Téléphone <span className="text-stone-400 font-normal text-[11px]">(recommandé)</span>
          </Label>
          <Input
            id="telephone"
            name="telephone"
            type="tel"
            value={form.telephone || ""}
            onChange={update}
            placeholder="06 12 34 56 78"
            className="h-11 rounded-xl bg-stone-50/50 border-stone-200 focus:border-[#1B2A4A] focus:bg-white text-sm"
          />
        </div>
      </div>

      {/* Référence du lot souhaité */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="lotSouhaite" className="text-xs font-semibold uppercase tracking-wider text-stone-600">
            Lot souhaité
          </Label>
          <span className="text-[11px] text-stone-400 font-sans">Facultatif</span>
        </div>
        <Input
          id="lotSouhaite"
          name="lotSouhaite"
          value={form.lotSouhaite || ""}
          onChange={update}
          placeholder="Ex : A103, B201 — Laissez vide si recherche générale"
          className="h-11 rounded-xl bg-stone-50/50 border-stone-200 focus:border-[#1B2A4A] focus:bg-white text-sm"
        />
      </div>

      {/* Message */}
      <div className="space-y-2">
        <Label htmlFor="message" className="text-xs font-semibold uppercase tracking-wider text-stone-600">
          Votre projet ou question <span className="text-amber-700">*</span>
        </Label>
        <Textarea
          id="message"
          name="message"
          value={form.message}
          onChange={update}
          required
          rows={4}
          placeholder="Résidence principale ou investissement locatif ? Type d'appartement recherché, questions sur la livraison..."
          className="rounded-xl bg-stone-50/50 border-stone-200 focus:border-[#1B2A4A] focus:bg-white resize-none text-sm p-3.5 leading-relaxed"
        />
      </div>

      {/* Encadré consentement RGPD certifié & conforme */}
      <div className="bg-stone-50/80 rounded-2xl p-4 sm:p-5 border border-stone-200/80 space-y-2.5">
        <div className="flex items-start gap-3">
          <Checkbox
            id="consentement"
            checked={form.consentement}
            onCheckedChange={(v) => setForm((f) => ({ ...f, consentement: !!v }))}
            className="mt-0.5 border-stone-400 data-[state=checked]:bg-[#1B2A4A] data-[state=checked]:border-[#1B2A4A]"
          />
          <Label
            htmlFor="consentement"
            className="font-sans text-xs text-stone-600 leading-relaxed cursor-pointer select-none"
          >
            J&apos;accepte que mes données soient traitées par <strong>Kalimo Promotion</strong> pour répondre à ma demande d&apos;information.
            Vos coordonnées sont réservées à notre équipe commerciale et à nos prestataires techniques d&apos;hébergement. Elles sont conservées 12 mois maximum.
            Vous disposez d&apos;un droit d&apos;accès, de rectification, d&apos;effacement, de limitation, d&apos;opposition et de retrait de votre consentement en écrivant à{" "}
            <a href="mailto:contact@kalimo-promotion.fr" className="underline font-medium text-[#1B2A4A] hover:text-[#C9A96E]">
              contact@kalimo-promotion.fr
            </a>. Pour plus de détails, consultez notre{" "}
            <Link href="/politique-de-confidentialite" className="underline font-medium text-[#1B2A4A] hover:text-[#C9A96E]" target="_blank">
              Politique de Confidentialité
            </Link>{" "}
            (droit de réclamation auprès de la CNIL). <span className="text-amber-700 font-bold">*</span>
          </Label>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-stone-400 pl-7">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Données protégées et jamais cédées à des courtiers tiers.</span>
        </div>
      </div>

      {/* Message d'erreur */}
      {status === "error" && (
        <div className="flex items-center gap-2.5 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-3 font-sans animate-in fade-in">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Bouton de soumission */}
      <Button
        type="submit"
        size="lg"
        disabled={status === "sending" || !form.consentement}
        className="w-full h-12 rounded-xl bg-[#1B2A4A] text-white hover:bg-[#243660] font-sans font-bold text-sm tracking-wide shadow-sm transition-all disabled:opacity-50"
      >
        {status === "sending" ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Transmission sécurisée en cours…
          </>
        ) : (
          <>
            <Send className="w-4 h-4 mr-2 text-[#C9A96E]" />
            Transmettre ma demande
          </>
        )}
      </Button>
    </form>
  );
}
