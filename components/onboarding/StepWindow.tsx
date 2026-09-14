import { WINDOW_OPTIONS, type WindowPhase } from "@/lib/onboarding";
import { cn } from "@/lib/utils";

export function StepWindow({
  value,
  onChange,
}: {
  value: WindowPhase | null;
  onChange: (phase: WindowPhase) => void;
}) {
  return (
    <div className="space-y-6">
      <header>
        <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-sage">
          The Temporary Window
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white">
          The medication creates the window.
        </h1>
        <p className="mt-3 text-base leading-7 text-slate-400">
          Hvor lenge har du stått på behandlingen din?
        </p>
      </header>

      <div className="space-y-3" role="radiogroup" aria-label="Behandlingsfase">
        {WINDOW_OPTIONS.map((option) => {
          const selected = value === option.id;
          return (
            <button
              key={option.id}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(option.id)}
              className={cn(
                "w-full rounded-2xl border px-5 py-4 text-left transition-colors",
                selected
                  ? "border-sage/40 bg-sage/10"
                  : "border-line bg-white/2 hover:border-slate-500",
              )}
            >
              <p className="text-sm font-medium text-white">{option.title}</p>
              <p className="mt-1 text-sm leading-6 text-slate-400">
                {option.detail}
              </p>
            </button>
          );
        })}
      </div>

      <aside className="rounded-2xl border border-coral/30 bg-coral/8 px-5 py-4">
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-coral">
          Rebound-risiko
        </p>
        <p className="mt-2 text-sm leading-6 text-slate-200">
          Uten nye vaneløkker opplever over 60% en rebound når dosen reduseres.
        </p>
      </aside>
    </div>
  );
}
