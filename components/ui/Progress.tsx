import { cn } from "@/lib/utils";

type ProgressProps = {
  value: number;
  max?: number;
  tone?: "sage" | "cyan" | "coral";
  className?: string;
};

export function Progress({
  value,
  max = 100,
  tone = "sage",
  className,
}: ProgressProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div
      className={cn("h-1.5 overflow-hidden rounded-full bg-white/8", className)}
      role="progressbar"
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={cn(
          "h-full rounded-full transition-[width] duration-500",
          tone === "sage" && "bg-sage",
          tone === "cyan" && "bg-cyan",
          tone === "coral" && "bg-coral",
        )}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
