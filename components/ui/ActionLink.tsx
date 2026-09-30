import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "solid" | "outline" | "inverse" | "text";

const VARIANTS: Record<Variant, string> = {
  solid: "bg-ink text-paper hover:bg-garden-deep",
  outline: "border border-ink/25 text-ink hover:border-ink hover:bg-ink hover:text-paper",
  inverse: "bg-paper text-ink hover:bg-limestone",
  text: "px-0! h-auto! text-ink",
};

export function actionClasses(variant: Variant = "solid", className?: string) {
  return cn(
    "group/action inline-flex h-12 items-center justify-center gap-3 rounded-full px-6 text-sm font-medium tracking-tight",
    "transition-[background-color,color,border-color] duration-500 ease-out-expo",
    "disabled:pointer-events-none disabled:opacity-40",
    VARIANTS[variant],
    className
  );
}

/** Arrow that slides diagonally out and back in on hover of the parent action. */
export function ActionArrow() {
  return (
    <span aria-hidden className="relative inline-flex size-4 overflow-hidden">
      <ArrowUpRight className="absolute inset-0 size-4 transition-transform duration-500 ease-out-expo group-hover/action:translate-x-full group-hover/action:-translate-y-full" />
      <ArrowUpRight className="absolute inset-0 size-4 -translate-x-full translate-y-full transition-transform duration-500 ease-out-expo group-hover/action:translate-x-0 group-hover/action:translate-y-0" />
    </span>
  );
}

interface ActionLinkProps extends Omit<ComponentProps<typeof Link>, "children"> {
  variant?: Variant;
  children: ReactNode;
  withArrow?: boolean;
}

export default function ActionLink({
  variant = "solid",
  withArrow = true,
  className,
  children,
  ...props
}: ActionLinkProps) {
  return (
    <Link className={actionClasses(variant, className)} {...props}>
      <span className={cn(variant === "text" && "link-draw pb-0.5")}>{children}</span>
      {withArrow && <ActionArrow />}
    </Link>
  );
}
