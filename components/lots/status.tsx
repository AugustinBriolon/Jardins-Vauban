import type { LotStatus } from "@/types";
import { cn } from "@/lib/utils";

/** One visual language for statuses, shared by the facade, legend, table and drawer. */
export const STATUS_STYLES: Record<LotStatus, { swatch: string; label: string; short: string }> = {
  Disponible: { swatch: "bg-garden", label: "Disponible", short: "Libre" },
  Optionné: { swatch: "bg-ochre", label: "Optionné", short: "Option" },
  Vendu: {
    swatch: "bg-sold bg-[repeating-linear-gradient(135deg,transparent_0_3px,rgb(29_28_25/0.18)_3px_4px)]",
    label: "Vendu",
    short: "Vendu",
  },
};

export function StatusDot({ status, className }: { status: LotStatus; className?: string }) {
  return <span aria-hidden className={cn("inline-block size-2.5 rounded-full", STATUS_STYLES[status].swatch, className)} />;
}

export function StatusLabel({ status }: { status: LotStatus }) {
  return (
    <span className="inline-flex items-center gap-2 text-sm">
      <StatusDot status={status} />
      {STATUS_STYLES[status].label}
    </span>
  );
}
