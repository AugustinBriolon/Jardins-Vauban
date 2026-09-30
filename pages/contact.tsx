import Head from "next/head";
import ContactForm from "@/components/contact/ContactForm";
import { SITE } from "@/lib/site";
import { NBSP } from "@/lib/utils";

export default function ContactPage() {
  return (
    <>
      <Head>
        <title>{`Demande d'information — ${SITE.programme}`}</title>
        <meta
          name="description"
          content={`Recevez les plans, les prix et les disponibilités des ${SITE.programme} à Bordeaux. Un conseiller ${SITE.developer} vous rappelle sous 48\u00a0h ouvrées.`}
        />
      </Head>

      <section className="shell grid gap-16 pt-28 pb-24 lg:grid-cols-12 lg:gap-8 lg:pt-36 lg:pb-36">
        <div className="lg:col-span-5">
          <p data-reveal className="eyebrow">Avant-première</p>
          <h1
            data-reveal="lines"
            className="font-display mt-6 text-[clamp(3rem,7vw,6.5rem)] leading-[0.9] tracking-[-0.03em]"
          >
            Parlons de votre projet.
          </h1>
          <p data-reveal className="mt-8 max-w-md text-lg leading-relaxed text-ink-soft">
            Plans détaillés, grille de prix, simulation de financement : un conseiller dédié au programme vous rappelle sous 48{NBSP}h ouvrées.
          </p>

          <dl data-reveal className="mt-14 space-y-6 border-t border-line pt-8 text-sm">
            <div>
              <dt className="eyebrow">Téléphone</dt>
              <dd className="mt-1">
                <a href={SITE.phone.href} className="tabular link-draw font-display text-3xl">{SITE.phone.display}</a>
              </dd>
              <dd className="mt-1 text-ink-soft">{SITE.openingHours}</dd>
            </div>
            <div>
              <dt className="eyebrow">E-mail</dt>
              <dd className="mt-1"><a href={`mailto:${SITE.email}`} className="link-draw">{SITE.email}</a></dd>
            </div>
            <div>
              <dt className="eyebrow">Bureau de vente</dt>
              <dd className="mt-1">{SITE.officeAddress.join(", ")}</dd>
            </div>
          </dl>
        </div>

        <div data-reveal data-reveal-delay="0.2" className="lg:col-span-6 lg:col-start-7">
          <ContactForm />
        </div>
      </section>
    </>
  );
}
