# 4. Use Lenis for smooth scrolling

Date: 2026-09-30

## Status

Proposed

## Context

The site relies on scroll-linked motion ([ADR 0002](0002-split-motion-between-gsap-and-motion.md)): parallax photos and scrubbed reveals. With native wheel scrolling, the page jumps by about 100 px per wheel notch, so scrubbed parallax visibly steps instead of gliding. The client asked for smooth, elegant motion as part of a premium positioning.

Smooth-scroll libraries replace native scrolling with an interpolated one, which has known accessibility risks: vestibular discomfort, broken nested scroll areas, and fighting with modals.

## Decision

We will use **Lenis** (`lib/smoothScroll.ts`, mounted once in `pages/_app.tsx`), driven by the GSAP ticker so Lenis, ScrollTrigger and tweens update on the same frame.

- Lenis keeps the document's native scroll (no transformed wrapper): `position: sticky`, anchors, find-in-page and scroll restoration keep working.
- `respectReducedMotion` (Lenis default) disables smoothing for visitors who ask for reduced motion.
- Scrollable layers (lot drawer, mobile menu) carry `data-lenis-prevent`.
- `lockScroll()` is the single way to freeze the page behind a modal: it calls `lenis.stop()`.

## Options considered

### Option A — Native scrolling with CSS `scroll-behavior: smooth`
- Pros: no dependency, no accessibility risk.
- Cons: only smooths programmatic and anchor scrolls, not wheel input, so parallax still steps.

### Option B — GSAP ScrollSmoother
- Pros: same vendor as the scroll animations.
- Cons: wraps the whole page in a transformed container. That breaks `position: sticky` (used by the lots filter column and legal pages' titles) and requires restructuring `_app`.

### Option C — Lenis (chosen)
- Pros: small (about 5 kB gzip, measured), native scroll position preserved, reduced-motion support built in, documented GSAP integration.
- Cons: one more dependency. Every future scrollable overlay must remember `data-lenis-prevent`.

## Consequences

### Positive
- Parallax and scrubbed animations interpolate between wheel notches instead of stepping.
- Scroll locking is centralised in `lockScroll()` instead of being duplicated in each modal.

### Negative
- Touch devices keep native scrolling (Lenis default), so the feel differs slightly between trackpad or mouse and touch.
- A new scrollable overlay without `data-lenis-prevent` will not scroll with the wheel. The rule is documented in the README.

### Neutral
- `scroll-behavior: smooth` was removed from the global CSS; Lenis handles anchor links with a header offset.

## References
- `lib/smoothScroll.ts`
- https://github.com/darkroomengineering/lenis
