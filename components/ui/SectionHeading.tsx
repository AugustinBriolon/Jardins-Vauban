import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  index: string;
  label: string;
  title: ReactNode;
  className?: string;
  tone?: "ink" | "paper";
}

/** Numbered editorial heading: "01 — Le programme" above a large serif title. */
export default function SectionHeading({
  index,
  label,
  title,
  className,
  tone = "ink",
}: SectionHeadingProps) {
  return (
    <div className={cn("grid gap-6 lg:grid-cols-12", className)}>
      <p
        data-reveal
        className={cn("eyebrow lg:col-span-3 lg:pt-4", tone === "paper" && "text-paper/60")}
      >
        <span className="tabular">{index}</span>
        <span aria-hidden className="mx-2">—</span>
        {label}
      </p>
      <h2
        data-reveal="lines"
        className="font-display text-[clamp(2.5rem,6vw,5.5rem)] leading-[0.95] tracking-[-0.02em] lg:col-span-9"
      >
        {title}
      </h2>
    </div>
  );
}
