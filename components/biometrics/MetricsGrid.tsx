import { MetricCard } from "@/components/biometrics/MetricCard";
import type { BodyDashboard } from "@/lib/terra";
import { formatKg, formatPercent, signedDelta } from "@/lib/utils";

export function MetricsGrid({ dashboard }: { dashboard: BodyDashboard }) {
  const { latest, deltas } = dashboard;
  return (
    <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
      <MetricCard
        label="Vekt"
        value={formatKg(latest.weightKg)}
        hint={`${signedDelta(deltas.weight14d)} · 14 dager`}
      />
      <MetricCard
        label="Lean mass"
        value={formatKg(latest.leanMassKg)}
        hint={`${signedDelta(deltas.lean14d)} · holdt`}
        tone="sage"
      />
      <MetricCard
        label="Kroppsfett"
        value={formatPercent(latest.bodyFatPercent)}
        hint={`${signedDelta(deltas.fat14d)} fettmasse`}
      />
      <MetricCard
        label="Hvilepuls"
        value={latest.restingHr ? `${latest.restingHr}` : "—"}
        hint={latest.restingHr ? "bpm · Withings" : "Ingen pulsdata"}
      />
    </div>
  );
}
