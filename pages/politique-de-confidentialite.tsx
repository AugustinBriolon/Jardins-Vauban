import LegalPage, { type LegalSection } from "@/components/layout/LegalPage";
import { SITE } from "@/lib/site";

const SECTIONS: LegalSection[] = [
  {
    title: "Responsable du traitement",
    body: (
      <p>
        <strong>{SITE.developer} SAS</strong>, {SITE.officeAddress.join(", ")}. Contact pour toute question relative à vos données :{" "}
        <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
      </p>
    ),
  },
  {
    title: "Données collectées et finalités",
    body: (
      <>
        <p>Lorsque vous envoyez une demande d&apos;information sur {SITE.programme}, nous collectons :</p>
        <ul>
          <li>votre identité : nom, prénom ;</li>
          <li>vos coordonnées : e-mail, téléphone (facultatif) ;</li>
          <li>votre projet : lot qui vous intéresse, message ;</li>
          <li>la date de votre demande et de votre accord.</li>
        </ul>
        <p>
          Ces données servent uniquement à répondre à votre demande : vous transmettre plans, prix et disponibilités, et échanger sur votre projet d&apos;achat.
          Base légale : mesures précontractuelles prises à votre demande (article 6.1.b du RGPD).
        </p>
      </>
    ),
  },
  {
    title: "Destinataires",
    body: (
      <>
        <p>Vos données ne sont ni vendues, ni louées, ni cédées. Elles sont accessibles uniquement :</p>
        <ul>
          <li>à l&apos;équipe commerciale de {SITE.developer} chargée du programme ;</li>
          <li>
            à nos sous-traitants techniques (article 28 du RGPD) : <strong>Vercel Inc.</strong> pour l&apos;hébergement du site,
            <strong> Airtable (Formagrid Inc.)</strong> pour la gestion des demandes. Les transferts vers les États-Unis sont encadrés par
            le Data Privacy Framework et les clauses contractuelles types de la Commission européenne.
          </li>
        </ul>
      </>
    ),
  },
  {
    title: "Durée de conservation",
    body: (
      <p>
        Votre demande est conservée 12 mois au plus après notre dernier échange, puis supprimée. Si vous signez un contrat de réservation,
        vos données relèvent alors de ce contrat.
      </p>
    ),
  },
  {
    title: "Mesure d'audience",
    body: (
      <p>
        Nous mesurons la fréquentation du site avec Vercel Web Analytics, sans cookie ni identifiant persistant : aucune donnée ne permet
        de vous reconnaître d&apos;une visite à l&apos;autre. Aucun bandeau de consentement n&apos;est donc nécessaire.
      </p>
    ),
  },
  {
    title: "Carte du quartier",
    body: (
      <p>
        La carte est affichée à partir de tuiles fournies par <strong>OpenFreeMap</strong>. Pour les charger, votre navigateur
        transmet votre adresse IP à ce service, comme pour toute ressource web. Aucun cookie n&apos;est déposé et la carte ne se
        charge que lorsque vous faites défiler la page jusqu&apos;à elle.
      </p>
    ),
  },
  {
    title: "Vos droits",
    body: (
      <>
        <p>
          Vous pouvez à tout moment accéder à vos données, les rectifier, les faire effacer, en limiter l&apos;usage, vous opposer à leur
          traitement ou en demander la portabilité (articles 15 à 22 du RGPD), en écrivant à{" "}
          <a href={`mailto:${SITE.email}`}>{SITE.email}</a>. Nous répondons sous un mois.
        </p>
        <p>
          Si vous estimez que vos droits ne sont pas respectés, vous pouvez adresser une réclamation à la CNIL (
          <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">cnil.fr</a>).
        </p>
      </>
    ),
  },
  {
    title: "Sécurité",
    body: (
      <p>
        Les échanges avec le site sont chiffrés (HTTPS). Le formulaire est protégé contre les envois automatisés et les contenus malveillants.
      </p>
    ),
  },
];

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      title="Politique de confidentialité"
      description={`Comment ${SITE.developer} traite les données personnelles collectées sur le site ${SITE.programme}.`}
      updatedOn="30 septembre 2026"
      sections={SECTIONS}
    />
  );
}
