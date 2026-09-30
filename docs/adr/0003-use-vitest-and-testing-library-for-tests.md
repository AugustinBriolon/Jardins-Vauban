# 3. Use Vitest and Testing Library for tests

Date: 2026-09-30

## Status

Proposed

## Context

The project had no tests. The site will be handed over to a junior developer who needs a safety net before changing lot filtering, the enquiry form or its validation. The code is organised so that domain logic is pure (`lib/lots.ts`, `lib/contactSchema.ts`) and components receive data through props, which makes it testable without a browser.

## Decision

We will use **Vitest** with **jsdom**, **@testing-library/react** and **@testing-library/user-event**. Tests live in `tests/`, named `<unit>.test.ts(x)`, and run with `npm test`.

- Pure logic (`lib/`) is tested directly.
- Components are tested through their accessible roles and labels, as a user would find them, never through class names.
- `next/router` and `fetch` are mocked at the test boundary. Airtable is never called from tests.

## Options considered

### Option A — Jest + Testing Library
- Pros: most widespread, extensive documentation.
- Cons: needs a Babel/SWC transform setup for TypeScript, ESM and the `@/` alias. It is slower to start, and its configuration is heavier for a junior developer to maintain.

### Option B — Vitest + Testing Library (chosen)
- Pros: native TypeScript and ESM, Jest-compatible API, one small config file (`vitest.config.ts`) that reuses the `@/` alias, runs in about 1 s.
- Cons: a second toolchain (Vite) next to Next.js for tests only.

### Option C — Playwright end-to-end only
- Pros: tests the real app in a browser.
- Cons: slow, needs a running server and Airtable data, gives no fast feedback on pure logic. Kept as a later addition for the lot → enquiry flow, not a replacement.

## Consequences

### Positive
- 27 tests run in about 1 s and cover filtering, sorting, aggregates, the shared validation schema, the facade, and the form's error, success and pre-fill behaviour.
- The Zod schema is shared by the browser and the API route, so one test suite guards both.

### Negative
- Animations (GSAP, Motion) are not asserted. Tests check the resulting state, not the motion.
- No end-to-end coverage yet of the deployed stack (Next.js + Airtable).

### Neutral
- Vitest runs without globals, so `tests/setup.ts` registers Testing Library's `cleanup` explicitly.

## References
- `vitest.config.ts`, `tests/`
- https://vitest.dev
- https://testing-library.com/docs/queries/about#priority
