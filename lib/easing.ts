/**
 * Motion (motion/react) easing curves, shared so every state transition
 * moves with the same character. Kept free of GSAP imports on purpose:
 * components may import this file, but never lib/motion.ts.
 */

/** Long, soft deceleration (quint-like): elements glide to rest. */
export const EASE_OUT = [0.22, 1, 0.36, 1] as const;

/** Symmetric curve for layers that travel across the screen (drawer, menu). */
export const EASE_IN_OUT = [0.65, 0, 0.35, 1] as const;
