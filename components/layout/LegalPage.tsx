import Head from "next/head";
import type { ReactNode } from "react";
import { SITE } from "@/lib/site";

export interface LegalSection {
  title: string;
  body: ReactNode;
}

interface LegalPageProps {
  title: string;
  description: string;
  updatedOn: string;
  sections: LegalSection[];
}

/** Shared editorial layout for legal notices: numbered sections beside a sticky title. */
export default function LegalPage({ title, description, updatedOn, sections }: LegalPageProps) {
  return (
    <>
      <Head>
        <title>{`${title} — ${SITE.programme}`}</title>
        <meta name="description" content={description} />
      </Head>

      <article className="shell grid gap-12 pt-28 pb-24 lg:grid-cols-12 lg:gap-8 lg:pt-36 lg:pb-36">
        <header className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <p data-reveal className="eyebrow">Informations légales</p>
            <h1 data-reveal="lines" className="font-display mt-6 text-[clamp(2.75rem,5vw,4.5rem)] leading-[0.95] tracking-[-0.02em]">
              {title}
            </h1>
            <p data-reveal className="mt-6 text-sm text-ink-soft">Mise à jour le {updatedOn}</p>
          </div>
        </header>

        <div className="lg:col-span-7 lg:col-start-6">
          {sections.map((section, index) => (
            <section key={section.title} data-reveal className="grid gap-4 border-t border-line py-10 sm:grid-cols-[3rem_1fr]">
              <p className="eyebrow tabular">{String(index + 1).padStart(2, "0")}</p>
              <div>
                <h2 className="font-display text-3xl leading-tight">{section.title}</h2>
                <div className="mt-4 space-y-4 leading-relaxed text-ink-soft [&_a]:text-ink [&_a]:underline [&_a]:underline-offset-4 [&_li]:pl-1 [&_strong]:font-medium [&_strong]:text-ink [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5">
                  {section.body}
                </div>
              </div>
            </section>
          ))}
        </div>
      </article>
    </>
  );
}
