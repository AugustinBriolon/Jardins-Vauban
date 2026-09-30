import { useEffect } from "react";
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from "motion/react";
import { EASE_OUT } from "@/lib/easing";

/** Counts smoothly from the previous value to the new one (instant under reduced motion). */
export default function AnimatedNumber({ value, className }: { value: number; className?: string }) {
  const motionValue = useMotionValue(value);
  const rounded = useTransform(motionValue, (latest) => Math.round(latest).toString());
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) {
      motionValue.set(value);
      return;
    }
    const controls = animate(motionValue, value, { duration: 0.6, ease: EASE_OUT });
    return () => controls.stop();
  }, [motionValue, value, reduceMotion]);

  return <motion.span className={className}>{rounded}</motion.span>;
}
