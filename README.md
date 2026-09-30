# Les Jardins de Vauban

Marketing mini-site for **Les Jardins de Vauban**, a 48-apartment residential programme in Bordeaux by Kalimo Promotion. It captures purchase enquiries before sales open and shows every lot with its live status, price and position on the building.

## Scope and responsibilities

**What this site does:**

- Presents the programme, its neighbourhood and its timeline.
- Lists the 48 lots (type, surface, floor, orientation, price, status) on an interactive facade and a sortable table, filterable by type, budget and availability.
- Gives each lot a shareable URL (`/lots?lot=A012`) that opens its detail panel.
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

- **Next.js 16, Pages Router.** `/` and `/lots` are statically generated with ISR (`revalidate: 60`, see `lib/staticProps.ts`), so a status changed in Airtable is live within a minute without a redeploy. `/api/contact` validates enquiries and writes them to Airtable.
- **Pure domain logic** lives in `lib/`: `lots.ts` (filtering, sorting, aggregates, formatting) and `contactSchema.ts` (one Zod schema shared by the form and the API route).
- **Components render, hooks hold state.** `hooks/useLotFilters`, `useSelectedLot` (URL-synced) and `useContactForm` hold the state. Components in `components/` receive props.
- **Motion** is split by responsibility (see [ADR 0002](docs/adr/0002-split-motion-between-gsap-and-motion.md)):
  - GSAP handles scroll choreography, declared with `data-reveal` / `data-parallax` attributes and run from `lib/motion.ts`.
  - Motion (`motion/react`) handles state-driven transitions.

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
- An [Airtable](https://airtable.com) account and a personal access token with `data.records:read`, `data.records:write` and, for the setup script, `schema.bases:write`

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

## Tests

Unit and component tests run with Vitest in jsdom. They need no network and no Airtable access (`fetch` and `next/router` are mocked).

```bash
npm test              # run once
npm run test:watch    # watch mode
```

Covered: lot filtering, sorting and aggregates, the contact schema, the facade component and the enquiry form (validation, lot pre-fill, success and error states). There are no end-to-end tests yet.

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
- To animate an element on scroll, add `data-reveal` (or `"lines"`, `"image"`, `"stagger"`). Do not import GSAP in components.
- Use `{NBSP}` from `lib/utils.ts` instead of `&nbsp;` in JSX: the entity breaks hydration in multi-line text.

### Updating lot statuses

The sales team edits the **Statut** field (Disponible / Optionné / Vendu) of the `Lots` table in Airtable. The site reflects the change within 60 seconds.

### Brochure

Replace `public/brochure.pdf` with the final brochure. It is served at `/brochure.pdf`.

## Deployment

Hosted on Vercel (Hobby plan). Each push to `main` deploys to production.

1. Import the GitHub repository in Vercel.
2. Add `AIRTABLE_API_KEY` and `AIRTABLE_BASE_ID` under *Settings → Environment Variables*.
3. Deploy.

<!-- TODO: add the production URL once the custom domain is configured. -->

## Related documentation

- [Architecture decision records](docs/adr/)
- [DECISIONS.md](DECISIONS.md): scope, trade-offs, hosting cost and time spent for the exercise
- Photographs: Unsplash licence, credited in the site footer
