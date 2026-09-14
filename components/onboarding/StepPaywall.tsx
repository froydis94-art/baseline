import { Button } from "@/components/ui/Button";

const TRUST = [
  "7 dager gratis prøveperiode",
  "Ingen binding",
  "Full helsedatakryptering",
];

export function StepPaywall({
  onStartTrial,
}: {
  onStartTrial: () => void;
}) {
  return (
    <div className="space-y-6">
      <header>
        <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-sage">
          Sikre din nye Baseline
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white">
          Lås inn resultatene for resten av livet.
        </h1>
      </header>

      <div className="rounded-2xl border border-line bg-white/2 px-5 py-5">
        <p className="text-sm leading-7 text-slate-300">
          En ukesdose koster opp mot 1 000 kr. Sikre at investeringen varer for{" "}
          <span className="font-semibold text-sage">199 kr/mnd</span>.
        </p>
      </div>

      <ul className="space-y-3">
        {TRUST.map((item) => (
          <li
            key={item}
            className="flex items-center gap-3 text-sm text-slate-200"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-sage" />
            {item}
          </li>
        ))}
      </ul>

      <Button variant="sage" className="h-12 w-full text-base" onClick={onStartTrial}>
        Start 7-dagers prøveperiode
      </Button>
    </div>
  );
}
