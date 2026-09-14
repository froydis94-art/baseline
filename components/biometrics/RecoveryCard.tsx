import { Card, Eyebrow } from "@/components/ui/Card";
import type { BodyDashboard } from "@/lib/terra";

export function RecoveryCard({
  dashboard,
  connected,
}: {
  dashboard: BodyDashboard;
  connected: boolean;
}) {
  const hr = dashboard.latest.restingHr;
  const tone =
    hr != null && hr <= 60 ? "Lav og rolig" : hr != null ? "Moderat" : "Ukjent";

  return (
    <Card>
      <Eyebrow tone="cyan">Søvn / hvilepuls</Eyebrow>
      <h2 className="mt-2 text-lg font-medium tracking-tight text-white">
        Nervesystemets restitusjon
      </h2>
      <p className="mt-1 text-sm text-slate-400">
        {connected
          ? "Withings via Terra · nattlig status"
          : "Koble Withings for live restitusjon"}
      </p>
      <dl className="mt-5 grid grid-cols-2 gap-4">
        <div>
          <dt className="text-[11px] uppercase tracking-[0.16em] text-slate-500">
            Hvilepuls
          </dt>
          <dd className="mt-1 text-2xl font-semibold tabular-nums text-cyan">
            {hr ?? "—"}
            <span className="ml-1 text-sm font-normal text-slate-500">bpm</span>
          </dd>
        </div>
        <div>
          <dt className="text-[11px] uppercase tracking-[0.16em] text-slate-500">
            Søvn
          </dt>
          <dd className="mt-1 text-2xl font-semibold tabular-nums text-white">
            7.2
            <span className="ml-1 text-sm font-normal text-slate-500">t</span>
          </dd>
        </div>
      </dl>
      <p className="mt-4 text-sm text-slate-400">
        Status: {tone}. Bruk SOS hvis pulsen og suget stiger sammen.
      </p>
    </Card>
  );
}
