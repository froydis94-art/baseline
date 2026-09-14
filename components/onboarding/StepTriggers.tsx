import { TRIGGER_OPTIONS, type TriggerId } from "@/lib/onboarding";
import { cn } from "@/lib/utils";

export function StepTriggers({
  value,
  onChange,
}: {
  value: TriggerId[];
  onChange: (triggers: TriggerId[]) => void;
}) {
  function toggle(id: TriggerId) {
    onChange(
      value.includes(id)
        ? value.filter((item) => item !== id)
        : [...value, id],
    );
  }

  return (
    <div className="space-y-6">
      <header>
        <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-sage">
          Identifiser støyen
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white">
          Hvilke impulser vil du avlære mens støyen er kjemisk dempet?
        </h1>
        <p className="mt-3 text-base leading-7 text-slate-400">
          Velg alle områder der du vil etablere nye reflekser:
        </p>
      </header>

      <div className="space-y-3">
        {TRIGGER_OPTIONS.map((option) => {
          const selected = value.includes(option.id);
          return (
            <button
              key={option.id}
              type="button"
              aria-pressed={selected}
              onClick={() => toggle(option.id)}
              className={cn(
                "flex w-full items-start gap-4 rounded-2xl border px-5 py-4 text-left transition-colors",
                selected
                  ? "border-sage/40 bg-sage/10"
                  : "border-line bg-white/2 hover:border-slate-500",
              )}
            >
              <span
                aria-hidden
                className={cn(
                  "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border",
                  selected
                    ? "border-sage bg-sage text-obsidian"
                    : "border-line bg-obsidian",
                )}
              >
                {selected ? (
                  <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none">
                    <path
                      d="M3.5 8.2 6.4 11 12.5 4.8"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : null}
              </span>
              <span>
                <span className="text-sm font-medium text-white">
                  {option.emoji} {option.title}
                </span>
                <span className="mt-1 block text-sm text-slate-400">
                  {option.intent}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
