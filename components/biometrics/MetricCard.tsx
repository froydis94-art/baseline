import { Card, Eyebrow } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

type MetricCardProps = {
  label: string;
  value: string;
  hint?: string;
  tone?: "cyan" | "sage";
};

export function MetricCard({
  label,
  value,
  hint,
  tone = "cyan",
}: MetricCardProps) {
  return (
    <Card padding="sm" className="min-w-0">
      <Eyebrow tone={tone}>{label}</Eyebrow>
      <p
        className={cn(
          "mt-3 font-sans text-3xl font-semibold tracking-tight text-white tabular-nums",
        )}
      >
        {value}
      </p>
      {hint ? <p className="mt-1.5 text-xs text-slate-400">{hint}</p> : null}
    </Card>
  );
}
