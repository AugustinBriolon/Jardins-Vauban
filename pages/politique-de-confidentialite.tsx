import Head from "next/head";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, Mail, Lock, Clock, FileText } from "lucide-react";

export default function PolitiqueConfidentialitePage() {
  return (
    <>
      <Head>
        <title>Politique de Confidentialité — Les Jardins de Vauban | Kalimo Promotion</title>
        <meta
          name="description"
          content="Politique de protection des données personnelles (RGPD) du programme Les Jardins de Vauban par Kalimo Promotion."
        />
      </Head>

      <div className="bg-[#1B2A4A] text-white">
        <div className="max-w-4xl mx-auto px-6 py-14">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-sans text-[#C9A96E] hover:text-[#DFC093] mb-6 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Retour à l&apos;accueil
          </Link>
          <div className="flex items-center gap-2 text-[#C9A96E] text-xs font-sans uppercase tracking-[0.2em] mb-2">
            <ShieldCheck className="w-4 h-4" /> Conformité RGPD
          </div>
          <h1 className="font-serif text-3xl md:text-5xl font-semibold mb-3">
            Politique de Confidentialité
          </h1>
          <p className="font-sans text-white/70 text-sm">
            Dernière mise à jour : 30 septembre 2026 · Conforme au Règlement Général sur la Protection des Données (UE 2016/679)
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-14">
        <div className="bg-white rounded-3xl border border-stone-200/80 p-8 sm:p-12 shadow-sm space-y-10 font-sans text-stone-700 leading-relaxed text-sm">
          
          {/* 1. Responsable de traitement */}
          <section className="space-y-3">
            <h2 className="font-serif text-xl font-bold text-[#1B2A4A] flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#C9A96E]" />
              1. Responsable du traitement
            </h2>
            <p>
              Les données à caractère personnel collectées sur ce site sont traitées par :
            </p>
            <div className="bg-stone-50 rounded-2xl p-5 border border-stone-200/70 text-xs space-y-1.5 text-stone-600">
              <p className="font-semibold text-stone-800">KALIMO PROMOTION SAS</p>
              <p>12 allée de Tourny, 33000 Bordeaux, France</p>
              <p>RCS Bordeaux · SIREN : 890 000 000</p>
              <p>
                Contact référent RGPD :{" "}
                <a href="mailto:contact@kalimo-promotion.fr" className="text-[#1B2A4A] underline font-medium">
                  contact@kalimo-promotion.fr
                </a>
              </p>
            </div>
          </section>

          {/* 2. Données collectées et finalités */}
          <section className="space-y-3">
            <h2 className="font-serif text-xl font-bold text-[#1B2A4A]">
              2. Données collectées et finalités du traitement
            </h2>
            <p>
              Dans le cadre de votre demande de renseignement relative au programme <strong>« Les Jardins de Vauban »</strong>, nous collectons les catégories de données suivantes :
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-stone-600">
              <li><strong>Données d&apos;identité :</strong> nom, prénom.</li>
              <li><strong>Données de contact :</strong> adresse électronique (email), numéro de téléphone (facultatif).</li>
              <li><strong>Données relatives au projet :</strong> lot souhaité, message ou description de votre projet d&apos;acquisition.</li>
              <li><strong>Données techniques de traçabilité :</strong> date et heure de recueil du consentement.</li>
            </ul>
            <p className="pt-2">
              <strong>Finalités :</strong> Ces données sont traitées exclusivement pour vous apporter une réponse personnalisée, vous transmettre la plaquette commerciale et échanger avec vous sur la disponibilité des lots.
            </p>
            <p>
              <strong>Base légale :</strong> Exécution de mesures précontractuelles à la demande de la personne concernée (article 6.1.b du RGPD) et consentement explicite pour le suivi commercial (article 6.1.a).
            </p>
          </section>

          {/* 3. Destinataires et sous-traitants */}
          <section className="space-y-3">
            <h2 className="font-serif text-xl font-bold text-[#1B2A4A] flex items-center gap-2">
              <Lock className="w-5 h-5 text-[#C9A96E]" />
              3. Destinataires des données et sous-traitance
            </h2>
            <p>
              Vos données personnelles ne sont <strong>jamais commercialisées, louées ni transmises à des tiers non autorisés</strong> (courtiers non mandatés, régies publicitaires externes).
            </p>
            <p>Elles sont exclusivement accessibles par :</p>
            <ul className="list-disc pl-5 space-y-1.5 text-stone-600">
              <li>L&apos;équipe commerciale interne de KALIMO Promotion en charge de la commercialisation du programme.</li>
              <li>
                Nos prestataires techniques d&apos;infrastructure, agissant en qualité de sous-traitants au sens de l&apos;article 28 du RGPD :
                <ul className="list-circle pl-5 pt-1 space-y-1">
                  <li><strong>Vercel Inc. :</strong> Hébergement du site web et fonctions serverless (chiffrement TLS 1.3, conformité DPA).</li>
                  <li><strong>Airtable (Formagrid Inc.) :</strong> Base de gestion technique des demandes, opérée sous garanties de conformité avec les Clauses Contractuelles Types (CCT) de la Commission Européenne et le Data Privacy Framework (DPF).</li>
                </ul>
              </li>
            </ul>
          </section>

          {/* 4. Durée de conservation */}
          <section className="space-y-3">
            <h2 className="font-serif text-xl font-bold text-[#1B2A4A] flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#C9A96E]" />
              4. Durée de conservation des données
            </h2>
            <p>
              Conformément au principe de limitation de conservation (article 5.1.e du RGPD), les demandes de renseignement sont conservées pour une durée maximale de <strong>12 mois</strong> à compter de votre dernier contact ou jusqu&apos;à l&apos;achèvement de la commercialisation des lots du programme.
            </p>
            <p className="text-xs text-stone-500">
              À l&apos;issue de ce délai, vos données sont définitivement purgées de nos bases de données.
            </p>
          </section>

          {/* 5. Vos droits */}
          <section className="space-y-3">
            <h2 className="font-serif text-xl font-bold text-[#1B2A4A]">
              5. Vos droits sur vos données
            </h2>
            <p>
              Conformément aux articles 15 à 22 du RGPD, vous disposez des droits suivants à tout moment :
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {[
                { title: "Droit d'accès", desc: "Obtenir la confirmation et la copie des données vous concernant." },
                { title: "Droit de rectification", desc: "Corriger des données inexactes ou incomplètes." },
                { title: "Droit à l'effacement", desc: "Demander la suppression définitive de vos coordonnées." },
                { title: "Droit à la limitation", desc: "Geler temporairement l'utilisation de vos données." },
                { title: "Droit d'opposition", desc: "Vous opposer à tout moment aux démarches de suivi." },
                { title: "Droit à la portabilité", desc: "Recevoir vos données dans un format structuré et lisible." },
              ].map((d) => (
                <div key={d.title} className="bg-stone-50 rounded-xl p-3.5 border border-stone-200/60">
                  <p className="font-semibold text-xs text-[#1B2A4A] mb-0.5">{d.title}</p>
                  <p className="text-[12px] text-stone-500">{d.desc}</p>
                </div>
              ))}
            </div>

            <p className="pt-3">
              Pour exercer l&apos;un de ces droits, il vous suffit de nous adresser un courriel mentionnant l&apos;objet de votre demande à :
            </p>
            <p className="font-semibold text-[#1B2A4A] flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#C9A96E]" />
              <a href="mailto:contact@kalimo-promotion.fr" className="underline hover:text-[#C9A96E]">
                contact@kalimo-promotion.fr
              </a>
            </p>
            <p className="text-xs text-stone-500 pt-1">
              Si vous estimez, après nous avoir contactés, que vos droits ne sont pas respectés, vous pouvez introduire une réclamation auprès de l&apos;autorité de contrôle française compétente : la <strong>CNIL</strong> (Commission Nationale de l&apos;Informatique et des Libertés — www.cnil.fr).
            </p>
          </section>

          {/* 6. Mesures de sécurité */}
          <section className="space-y-3">
            <h2 className="font-serif text-xl font-bold text-[#1B2A4A]">
              6. Sécurité des transmissions
            </h2>
            <p>
              Toutes les communications entre votre navigateur et notre plateforme sont chiffrées selon le protocole <strong>HTTPS / TLS</strong>. Nos formulaires intègrent des mécanismes stricts de validation de contenu, de protection contre le déni de service (rate limiting) et de neutralisation des attaques par injection.
            </p>
          </section>

        </div>
      </div>
    </>
  );
}
