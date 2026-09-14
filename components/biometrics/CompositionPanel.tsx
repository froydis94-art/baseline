import { Card, Eyebrow } from "@/components/ui/Card";
import type { BodyDashboard } from "@/lib/terra";
import { formatKg, formatPercent } from "@/lib/utils";

function Sparkline({ values }: { values: number[] }) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const w = 220;
  const h = 56;
  const points = values
    .map((value, index) => {
      const x = (index / (values.length - 1)) * w;
      const y = h - ((value - min) / span) * (h - 6) - 3;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className="h-14 w-full"
      aria-hidden="true"
    >
      <polyline
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
        points={points}
        className="text-cyan"
      />
    </svg>
  );
}

function CompositionRing({
  lean,
  fat,
}: {
  lean: number;
  fat: number;
}) {
  const total = lean + fat;
  const leanPct = lean / total;
  const radius = 42;
  const circ = 2 * Math.PI * radius;
  const leanLen = circ * leanPct;

  return (
    <svg viewBox="0 0 108 108" className="h-[108px] w-[108px]" aria-hidden="true">
      <circle
        cx="54"
        cy="54"
        r={radius}
        fill="none"
        stroke="#1E293B"
        strokeWidth="10"
      />
      <circle
        cx="54"
        cy="54"
        r={radius}
        fill="none"
        stroke="#10B981"
        strokeWidth="10"
        strokeDasharray={`${leanLen} ${circ - leanLen}`}
        strokeLinecap="round"
        transform="rotate(-90 54 54)"
      />
      <circle
        cx="54"
        cy="54"
        r={radius}
        fill="none"
        stroke="#06B6D4"
        strokeWidth="10"
        strokeDasharray={`${circ * (1 - leanPct)} ${circ}`}
        strokeDashoffset={-leanLen}
        strokeLinecap="round"
        transform="rotate(-90 54 54)"
      />
    </svg>
  );
}

export function CompositionPanel({
  dashboard,
  connected = false,
}: {
  dashboard: BodyDashboard;
  connected?: boolean;
}) {
  const { latest, series } = dashboard;
  const sourceLabel =
    latest.source === "withings" || connected
      ? "Withings via Terra"
      : "Prototype · Terra-mock";

  return (
    <Card className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Eyebrow tone="cyan">Biometri · Withings</Eyebrow>
          <h2 className="mt-2 text-lg font-medium tracking-tight text-white">
            Kroppssammensetning
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            {sourceLabel} · sist {latest.measuredAt.slice(0, 10)} 07:14
          </p>
        </div>
        <span className="rounded-full border border-cyan/25 bg-cyan/8 px-2.5 py-1 text-[11px] uppercase tracking-[0.16em] text-cyan">
          BMI {latest.bmi}
        </span>
      </div>

      <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
        <CompositionRing lean={latest.leanMassKg} fat={latest.fatMassKg} />
        <dl className="grid flex-1 grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-slate-400">Lean</dt>
            <dd className="mt-1 text-base text-sage tabular-nums">
              {formatKg(latest.leanMassKg)} ·{" "}
              {formatPercent((latest.leanMassKg / latest.weightKg) * 100)}
            </dd>
          </div>
          <div>
            <dt className="text-slate-400">Fettmasse</dt>
            <dd className="mt-1 text-base text-cyan tabular-nums">
              {formatKg(latest.fatMassKg)} · {formatPercent(latest.bodyFatPercent)}
            </dd>
          </div>
          <div>
            <dt className="text-slate-400">Muskel</dt>
            <dd className="mt-1 text-base text-white tabular-nums">
              {formatKg(latest.muscleMassKg)}
            </dd>
          </div>
          <div>
            <dt className="text-slate-400">Vekttrend</dt>
            <dd className="text-cyan">
              <Sparkline values={series.map((point) => point.weightKg)} />
            </dd>
          </div>
        </dl>
      </div>
    </Card>
  );
}
