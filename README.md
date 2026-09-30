# Les Jardins de Vauban

Marketing mini-site for **Les Jardins de Vauban**, a 48-apartment residential programme in Bordeaux by Kalimo Promotion. It captures purchase enquiries before sales open and shows every lot with its live status, price and position on the building.

## Scope and responsibilities

**What this site does:**

- Presents the programme, its neighbourhood and its timeline.
- Lets visitors search by type and budget from the home page, then lists the 48 lots (type, surface, floor, orientation, price, status) on an interactive facade and a sortable table. Filters are kept in the URL (`/lots?type=T3&budget=300000&dispo=1`).
- Gives each lot a quick-view drawer (on the home page and the catalogue) and a dedicated page (`/lots/A012`) with its facts, position on the building, pre-filled enquiry form and similar lots: the link the sales team sends to prospects.
- Shows the neighbourhood on an interactive map (mapcn + OpenFreeMap tiles), with a readable fallback when the device has no WebGL2.
- Records enquiries from the contact form in Airtable, where the sales team reads them.
- Serves the downloadable brochure (`public/brochure.pdf`).

**What this site does not do:**

- Back office: lot statuses are edited directly in Airtable by the sales team.
- Reservations or payments: signing happens offline with a notarised reservation contract.
- Email notifications: handled by an Airtable automation, not by the site.

**Main dependencies:**

- **Airtable**: base with a `Lots` table (read) and a `Demandes` table (write).
- **Vercel**: hosting, serverless API routes and cookie-free Web Analytics.

## Architecture

- **Next.js 16, Pages Router.** `/` and `/lots` are statically generated. An Airtable webhook calls `/api/airtable-webhook` when a lot changes, and the pages are rebuilt within seconds. A daily ISR window is the safety net, sized to the Airtable Free quota of 1,000 API calls per month (see [ADR 0005](docs/adr/0005-revalidate-pages-on-airtable-webhook.md)). `/api/contact` validates enquiries and writes them to Airtable.
- **Lot pages** (`pages/lots/[reference].tsx`) are pre-rendered at build. The webhook reads the Airtable change payloads and rebuilds only the pages of the lots that changed ([ADR 0008](docs/adr/0008-rebuild-changed-lot-pages-from-webhook-payloads.md)); a weekly window is the safety net. If Airtable fails during a rebuild, the last good page keeps being served.
- **Airtable data is validated before display** (`lib/lotRecord.ts`). A lot with a missing field, an unknown status or an implausible price per m² is left out of the site and logged (`[airtable] Lot A012 ignoré : …`), so a typo cannot reach buyers.
- **Pure domain logic** lives in `lib/`: `lots.ts` (filtering, sorting, aggregates, formatting) and `contactSchema.ts` (one Zod schema shared by the form and the API route).
- **Components render, hooks hold state.** `hooks/useLotFilters`, `useSelectedLot` (URL-synced) and `useContactForm` hold the state. Components in `components/` receive props.
- **Motion** is split by responsibility (see [ADR 0002](docs/adr/0002-split-motion-between-gsap-and-motion.md)):
  - GSAP handles scroll choreography, declared with `data-reveal` / `data-parallax` attributes and run from `lib/motion.ts`.
  - Motion (`motion/react`) handles state-driven transitions.
  - Lenis smooths scrolling ([ADR 0004](docs/adr/0004-use-lenis-for-smooth-scrolling.md)).
- **Map**: `components/ui/map.tsx` is the vendored mapcn component, excluded from lint ([ADR 0006](docs/adr/0006-use-mapcn-with-openfreemap-tiles.md)). Its web worker is copied to `public/maplibre/` by `npm install` (postinstall).

```
pages/        routes (index, lots, contact, legal pages, api/)
components/   layout/, lots/, home/, contact/, ui/
hooks/        stateful logic used by pages
lib/          airtable client, domain logic, schema, site facts, motion
styles/       Tailwind v4 design tokens (globals.css)
tests/        Vitest + Testing Library
docs/adr/     architecture decision records
scripts/      Airtable setup and seed
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) >= 20 (developed on Node 24)
- An [Airtable](https://airtable.com) account and a personal access token with `data.records:read`, `data.records:write`, and for the scripts `schema.bases:write`, `schema.bases:read` and `webhook:manage`

### Installation

```bash
npm install
cp .env.local.example .env.local   # then fill in the Airtable values
npx ts-node --skip-project scripts/setup.ts   # creates the Lots and Demandes tables and seeds 48 lots
```

### Run

```bash
npm run dev    # http://localhost:3000
```

### Environment variables

| Variable | Description | Example |
|----------|-------------|---------|
| `AIRTABLE_API_KEY` | Airtable personal access token (server-side only) | `patXXXX.XXXX` |
| `AIRTABLE_BASE_ID` | ID of the Airtable base | `appXXXXXXXXXXXXXX` |
| `NEXT_PUBLIC_SITE_URL` | Public URL, used for Open Graph tags | `https://jardins-de-vauban.vercel.app` |
| `AIRTABLE_WEBHOOK_ID` | Webhook created by `scripts/create-webhook.ts` | `achXXXXXXXXXXXXXX` |
| `AIRTABLE_WEBHOOK_MAC_SECRET` | Secret used to verify webhook pings | printed by the script |
| `AIRTABLE_REFERENCE_FIELD_ID` | Field id of `Référence`, to rebuild only the changed lot pages | printed by the script |
| `CRON_SECRET` | Protects the daily webhook refresh route | any long random string |

## Tests

Unit and component tests run with Vitest in jsdom. They need no network and no Airtable access (`fetch` and `next/router` are mocked).

```bash
npm test              # run once
npm run test:watch    # watch mode
```

Covered: lot filtering, sorting, aggregates and URL serialisation, Airtable record validation, webhook signature checks, the contact schema, and the facade, home search and enquiry form components. There are no end-to-end tests yet.

## Development

| Command | Purpose |
|---------|---------|
| `npm run dev` | Development server |
| `npm run build` | Production build (fetches lots from Airtable) |
| `npm run lint` | ESLint |
| `npx tsc --noEmit` | Type-check |

Conventions:

- Programme facts and contact details live in `lib/site.ts`. Change them there, not in pages.
- Colours, fonts and easings are Tailwind tokens in `styles/globals.css` (`bg-limestone`, `text-ink`, `bg-garden`, `font-display`, `ease-out-expo`).
- To animate an element on scroll, add `data-reveal` (or `"lines"`, `"image"`, `"stagger"`). Do not import GSAP in components; Motion easings come from `lib/easing.ts`.
- A new scrollable overlay needs `data-lenis-prevent`, and must freeze the page with `lockScroll()` from `lib/smoothScroll.ts`.
- Use `{NBSP}` from `lib/utils.ts` instead of `&nbsp;` in JSX: the entity breaks hydration in multi-line text.

### Updating lot statuses

The sales team edits the **Statut** field (Disponible / Optionné / Vendu) of the `Lots` table in Airtable. The site reflects the change within seconds (webhook), or within a day if the webhook is not configured. A lot that fails validation disappears from the site until it is corrected; check the Vercel logs for `[airtable] Lot … ignoré`.

### Brochure

Replace `public/brochure.pdf` with the final brochure. It is served at `/brochure.pdf`.

## Deployment

Hosted on Vercel (Hobby plan). Each push to `main` deploys to production.

1. Import the GitHub repository in Vercel.
2. Add `AIRTABLE_API_KEY`, `AIRTABLE_BASE_ID` and `CRON_SECRET` under *Settings → Environment Variables*.
3. Deploy.
4. Register the webhook once (re-running it replaces the previous one), then add the three printed variables in Vercel and redeploy:

   ```bash
   npx ts-node --skip-project scripts/create-webhook.ts https://<production-url>/api/airtable-webhook
   ```

The daily cron declared in `vercel.json` keeps the webhook alive (Airtable expires it after 7 days otherwise).

<!-- TODO: add the production URL once the custom domain is configured. -->

## Related documentation

- [Architecture decision records](docs/adr/)
- [DECISIONS.md](DECISIONS.md): scope, trade-offs, hosting cost and time spent for the exercise
- Photographs: Unsplash licence, credited in the site footer
