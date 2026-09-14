import { Card, Eyebrow } from "@/components/ui/Card";
import { Progress } from "@/components/ui/Progress";
import {
  WINDOW_COPY,
  type OnboardingProfile,
} from "@/lib/onboarding";
import type { BodyDashboard } from "@/lib/terra";
import { leanMassScore } from "@/lib/terra";
import { signedDelta } from "@/lib/utils";

export function WindowStatus({
  dashboard,
  profile,
}: {
  dashboard: BodyDashboard;
  profile: OnboardingProfile | null;
}) {
  const score = leanMassScore(dashboard);
  const copy = profile?.windowPhase
    ? WINDOW_COPY[profile.windowPhase]
    : WINDOW_COPY["months-2-4"];

  return (
    <Card className="relative overflow-hidden">
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-sage/10 blur-3xl" />
      <Eyebrow tone="sage">{copy.eyebrow}</Eyebrow>
      <h2 className="mt-3 max-w-sm text-2xl font-medium tracking-tight text-white">
        {copy.title}
      </h2>
      <p className="mt-3 max-w-md text-sm leading-6 text-slate-400">
        {copy.body}
      </p>

      <div className="mt-8">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400">
              Lean mass protection
            </p>
            <p className="mt-1 text-5xl font-semibold tracking-tight text-sage tabular-nums">
              {score}
            </p>
          </div>
          <p className="max-w-[12rem] text-right text-xs leading-5 text-slate-400">
            Lean {signedDelta(dashboard.deltas.lean14d)} · fett{" "}
            {signedDelta(dashboard.deltas.fat14d)}
          </p>
        </div>
        <Progress value={score} className="mt-4" />
      </div>
    </Card>
  );
}
