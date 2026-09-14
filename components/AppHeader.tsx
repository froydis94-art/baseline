import { SosTrigger } from "@/components/sos/SosTrigger";
import { Badge } from "@/components/ui/Badge";

export function AppHeader({ onSos }: { onSos: () => void }) {
  return (
    <header className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-slate-400">
          Habit & Body Metrics
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">
          Baseline
        </h1>
        <p className="mt-2 max-w-lg text-sm leading-6 text-slate-400">
          The medication creates the window. Baseline secures your new normal.
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Badge tone="sage">Vindu aktivt</Badge>
        <SosTrigger onOpen={onSos} />
      </div>
    </header>
  );
}
