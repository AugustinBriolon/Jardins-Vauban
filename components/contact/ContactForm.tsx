import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { Loader2 } from "lucide-react";
import type { ContactField } from "@/lib/contactSchema";
import { useContactForm } from "@/hooks/useContactForm";
import { actionClasses, ActionArrow } from "@/components/ui/ActionLink";
import { SITE } from "@/lib/site";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

export default function ContactForm() {
  const form = useContactForm();

  return (
    <AnimatePresence mode="wait" initial={false}>
      {form.status === "success" ? (
        <SuccessMessage key="success" firstName={form.firstName} onRestart={form.restart} />
      ) : (
        <motion.form
          key="form"
          // Fallback before hydration or without JS: POST keeps personal data out of the URL.
          method="post"
          action="/api/contact"
          noValidate
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.4, ease: EASE }}
          onSubmit={(event) => {
            event.preventDefault();
            form.submit();
          }}
          className="space-y-8"
        >
          {/* Honeypot: invisible to people, filled in by naive bots. */}
          <div aria-hidden className="hidden">
            <label htmlFor="website_hp">Ne pas remplir</label>
            <input
              id="website_hp"
              name="website_hp"
              tabIndex={-1}
              autoComplete="off"
              value={form.values.website_hp ?? ""}
              onChange={(event) => form.setValue("website_hp", event.target.value)}
            />
          </div>

          <div className="grid gap-8 sm:grid-cols-2">
            <TextField form={form} field="prenom" label="Prénom" autoComplete="given-name" required />
            <TextField form={form} field="nom" label="Nom" autoComplete="family-name" required />
            <TextField form={form} field="email" label="E-mail" type="email" autoComplete="email" required />
            <TextField form={form} field="telephone" label="Téléphone" type="tel" autoComplete="tel" hint="Pour être rappelé" />
          </div>
          <TextField form={form} field="lotSouhaite" label="Lot qui vous intéresse" hint="Facultatif, ex. A012" />
          <TextField form={form} field="message" label="Votre projet" multiline required />

          <Consent form={form} />

          <AnimatePresence>
            {form.status === "error" && form.serverError && (
              <motion.p
                role="alert"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="border-l-2 border-ochre pl-4 text-sm"
              >
                {form.serverError} Vous pouvez aussi nous appeler au {SITE.phone.display}.
              </motion.p>
            )}
          </AnimatePresence>

          <button type="submit" disabled={form.status === "sending"} className={actionClasses("solid", "w-full sm:w-auto sm:px-10")}>
            {form.status === "sending" ? (
              <>
                <Loader2 aria-hidden className="size-4 motion-safe:animate-spin" />
                Envoi en cours
              </>
            ) : (
              <>
                Envoyer ma demande
                <ActionArrow />
              </>
            )}
          </button>
        </motion.form>
      )}
    </AnimatePresence>
  );
}

type FormApi = ReturnType<typeof useContactForm>;

interface TextFieldProps {
  form: FormApi;
  field: Exclude<ContactField, "consentement" | "website_hp">;
  label: string;
  type?: string;
  autoComplete?: string;
  hint?: string;
  required?: boolean;
  multiline?: boolean;
}

function TextField({ form, field, label, type = "text", autoComplete, hint, required, multiline }: TextFieldProps) {
  const error = form.visibleError(field);
  const describedBy = error ? `${field}-error` : undefined;
  const shared = {
    id: field,
    name: field,
    value: (form.values[field] as string | undefined) ?? "",
    required,
    autoComplete,
    "aria-invalid": Boolean(error),
    "aria-describedby": describedBy,
    onBlur: () => form.touch(field),
    className: "peer w-full resize-none bg-transparent pt-2 pb-3 text-lg outline-none placeholder:text-transparent",
    placeholder: label,
  };

  return (
    <div>
      <div className="flex items-baseline justify-between">
        <label htmlFor={field} className="eyebrow">
          {label}
          {required && <span aria-hidden> *</span>}
        </label>
        {hint && <span className="text-xs text-ink-soft">{hint}</span>}
      </div>
      <div className="relative">
        {multiline ? (
          <textarea rows={4} {...shared} onChange={(event) => form.setValue(field, event.target.value)} />
        ) : (
          <input type={type} {...shared} onChange={(event) => form.setValue(field, event.target.value)} />
        )}
        <span aria-hidden className={cn("absolute inset-x-0 bottom-0 h-px", error ? "bg-ochre" : "bg-line")} />
        {/* Focus line draws across from the left. */}
        <span
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-ink transition-transform duration-500 ease-out-expo peer-focus:scale-x-100"
        />
      </div>
      <FieldError id={describedBy} message={error} />
    </div>
  );
}

function FieldError({ id, message }: { id?: string; message?: string }) {
  return (
    <AnimatePresence initial={false}>
      {message && (
        <motion.p
          id={id}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3, ease: EASE }}
          className="pt-2 text-sm text-ochre"
        >
          {message}
        </motion.p>
      )}
    </AnimatePresence>
  );
}

function Consent({ form }: { form: FormApi }) {
  const error = form.visibleError("consentement");

  return (
    <div>
      <label htmlFor="consentement" className="flex cursor-pointer items-start gap-4 text-sm leading-relaxed text-ink-soft">
        <input
          id="consentement"
          name="consentement"
          type="checkbox"
          checked={form.values.consentement}
          onChange={(event) => {
            form.setValue("consentement", event.target.checked);
            form.touch("consentement");
          }}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? "consentement-error" : undefined}
          className="mt-1 size-4 shrink-0 cursor-pointer accent-garden"
        />
        <span>
          J&apos;accepte que {SITE.developer} utilise ces informations pour répondre à ma demande sur {SITE.programme}.
          Elles sont conservées 12 mois au plus, jamais cédées à des tiers. Vous pouvez y accéder, les rectifier ou les
          faire effacer à tout moment : <Link href="/politique-de-confidentialite" className="link-draw text-ink">politique de confidentialité</Link>.
        </span>
      </label>
      <FieldError id={error ? "consentement-error" : undefined} message={error} />
    </div>
  );
}

function SuccessMessage({ firstName, onRestart }: { firstName: string; onRestart: () => void }) {
  return (
    <motion.div
      role="status"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: EASE }}
      className="py-10"
    >
      <svg viewBox="0 0 64 64" aria-hidden className="size-16 text-garden">
        <motion.circle
          cx="32" cy="32" r="30" fill="none" stroke="currentColor" strokeWidth="1.5"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8, ease: EASE }}
        />
        <motion.path
          d="M20 33 L28 41 L45 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.5, duration: 0.5, ease: EASE }}
        />
      </svg>
      <h2 className="font-display mt-8 text-5xl leading-none">Merci{firstName ? `, ${firstName}` : ""}.</h2>
      <p className="mt-4 max-w-md text-lg text-ink-soft">
        Votre demande est bien arrivée. Un conseiller vous recontacte sous 48 h ouvrées avec les plans et les prix.
      </p>
      <div className="mt-10 flex flex-wrap items-center gap-6">
        <a href={SITE.brochureUrl} target="_blank" rel="noopener" className={actionClasses("outline")}>
          Télécharger la plaquette
          <ActionArrow />
        </a>
        <button type="button" onClick={onRestart} className="link-draw pb-0.5 text-sm text-ink-soft">
          Envoyer une autre demande
        </button>
      </div>
    </motion.div>
  );
}
