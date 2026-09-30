# 2. Split motion between GSAP (scroll) and Motion (React state)

Date: 2026-09-30

## Status

Proposed

## Context

The site sells a residential programme against competing proposals. Its motion design is a deliberate part of the premium positioning: headings revealed line by line, images unveiled and drifting on scroll, the building facade assembling floor by floor, a lot drawer sliding in, filter results reflowing, a form success state.

These animations fall into two families with different technical needs:

1. **Scroll choreography**: triggered by scroll position, sometimes scrubbed (parallax), and needing text split into lines. Nothing in React state changes.
2. **State transitions**: triggered by React state (a lot is selected, a filter changes, the form is sent). They include **exit** animations of elements React unmounts.

The site will be handed over to a junior developer, so the rules for "where does an animation live" must be obvious. Visitors who ask for reduced motion must get a static site.

## Decision

We will use two libraries, each confined to one family:

- **GSAP + ScrollTrigger + SplitText** for scroll choreography. It is driven by `useScrollChoreography` in `lib/motion.ts` and mounted once in `pages/_app.tsx`. Components never import GSAP. They declare intent with data attributes (`data-reveal`, `data-reveal="lines" | "image" | "stagger"`, `data-reveal-delay`, `data-parallax`).
- **Motion (`motion/react`)** for everything driven by React state: `LotDrawer`, `LotTable` row layout and exit, `LotFilters` switch and reset button, `AnimatedNumber`, `ContactForm` errors and success state, the mobile menu and the header's hide-on-scroll.

Reduced motion is honoured in both: `gsap.matchMedia` shows content immediately, and `<MotionConfig reducedMotion="user">` plus `useReducedMotion` disable Motion transforms.

## Options considered

### Option A — CSS only (transitions + scroll-driven animations)
- Pros: zero JavaScript, no dependency.
- Cons: `animation-timeline: view()` is not supported in Safari and Firefox stable, so scroll reveals would silently disappear for a large share of visitors. No line splitting for headings. Exit animations on unmount are not possible without extra state plumbing.

### Option B — Motion only
- Pros: one library, declarative, idiomatic React (`whileInView`, `AnimatePresence`, `layout`).
- Cons: no text splitting. Scrubbed, timeline-coordinated scroll effects are more verbose. Every reveal must become a `motion.*` element, which spreads animation code across all presentational components.

### Option C — GSAP only
- Pros: one library, best-in-class scroll and timeline tooling, SplitText included (GSAP is free, plugins included, since 2025).
- Cons: imperative. Animating React unmounts (drawer close, filtered-out rows) requires delaying unmount by hand. Layout animations of a re-sorted table would have to be reimplemented with the Flip plugin and refs.

### Option D — GSAP for scroll, Motion for state (chosen)
- Pros: each library does what it is best at. Presentational components stay pure (data attributes only for scroll). State transitions are declared next to the state they reflect.
- Cons: two dependencies and two mental models. A developer must know which family an animation belongs to.

## Consequences

### Positive
- Adding a scroll reveal is a one-attribute change (`data-reveal`) with no import. This is easy to demonstrate and hard to get wrong.
- Scroll logic lives in a single ~150-line module (`lib/motion.ts`) that can be removed or replaced without touching components.
- Exit and layout animations (drawer, table rows) need no manual unmount timing.

### Negative
- JavaScript weight grows by about 50 kB gzip for GSAP core + ScrollTrigger + SplitText (measured from `node_modules/gsap/dist/*.min.js`), plus the Motion components used. That is acceptable for a marketing site, but it must not grow further without review.
- Content tagged `data-reveal` is hidden until GSAP runs (class `js-motion` set before first paint). As a safety net, a CSS animation restores visibility after 2.5 s if the script fails.
- Two libraries to learn for the developer taking over. This ADR and the header comment in `lib/motion.ts` are the entry points.

### Neutral
- The boundary rule is enforceable by review: `import gsap` is allowed only in `lib/motion.ts`.

## References
- `lib/motion.ts`, `pages/_app.tsx`, `pages/_document.tsx`
- https://gsap.com/docs/v3/Plugins/ScrollTrigger/
- https://motion.dev/docs/react
- https://caniuse.com/mdn-css_properties_animation-timeline_view
