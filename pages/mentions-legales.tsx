import Link from "next/link";
import LegalPage, { type LegalSection } from "@/components/layout/LegalPage";
import { PHOTO_CREDITS, SITE } from "@/lib/site";

// Placeholders in brackets must be completed by the client before going live (see DECISIONS.md).
const SECTIONS: LegalSection[] = [
  {
    title: "Éditeur du site",
    body: (
      <p>
        <strong>{SITE.developer} SAS</strong>, au capital de [capital] €, immatriculée au RCS de Bordeaux sous le numéro [SIREN].
        Siège : {SITE.officeAddress.join(", ")}. Téléphone : {SITE.phone.display}. E-mail : <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
        Directeur de la publication : [nom du représentant légal].
      </p>
    ),
  },
  {
    title: "Hébergement",
    body: <p><strong>Vercel Inc.</strong>, 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis — vercel.com.</p>,
  },
  {
    title: "Informations commerciales",
    body: (
      <p>
        Les visuels, surfaces et prix présentés sont indicatifs et non contractuels. Seuls les documents remis lors de la signature du contrat
        de réservation engagent {SITE.developer}. Les disponibilités sont mises à jour par l&apos;équipe commerciale et peuvent évoluer à tout moment.
      </p>
    ),
  },
  {
    title: "Propriété intellectuelle",
    body: (
      <p>
        Les contenus du site sont la propriété de {SITE.developer}, sauf les photographies, publiées sous licence Unsplash :{" "}
        {PHOTO_CREDITS.map((credit) => credit.author).join(", ")}.
      </p>
    ),
  },
  {
    title: "Données personnelles",
    body: (
      <p>
        Le traitement des informations transmises via le formulaire est décrit dans notre{" "}
        <Link href="/politique-de-confidentialite">politique de confidentialité</Link>.
      </p>
    ),
  },
];

export default function LegalNoticePage() {
  return (
    <LegalPage
      title="Mentions légales"
      description={`Mentions légales du site ${SITE.programme}, édité par ${SITE.developer}.`}
      updatedOn="30 septembre 2026"
      sections={SECTIONS}
    />
  );
}
