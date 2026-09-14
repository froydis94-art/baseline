"use client";

import { useCallback, useEffect, useState } from "react";
import { BreathingRing } from "@/components/onboarding/BreathingRing";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Card";
import { TRIGGER_OPTIONS, type TriggerId } from "@/lib/onboarding";
import { cn } from "@/lib/utils";

type SosProtocolProps = {
  open: boolean;
  triggers: TriggerId[];
  onClose: () => void;
};

export function SosProtocol({ open, triggers, onClose }: SosProtocolProps) {
  const cues =
    triggers.length > 0
      ? TRIGGER_OPTIONS.filter((option) => triggers.includes(option.id))
      : TRIGGER_OPTIONS;
  const [cue, setCue] = useState<TriggerId | null>(null);
  const [running, setRunning] = useState(false);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if (!open) {
      setCue(null);
      setRunning(false);
      setFinished(false);
    }
  }, [open]);

  const handleFinished = useCallback(() => {
    setRunning(false);
    setFinished(true);
  }, []);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-obsidian/70 p-4 backdrop-blur-sm sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="sos-title"
    >
      <div className="w-full max-w-lg rounded-2xl border border-coral/25 bg-glass p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <Eyebrow tone="coral">Intervensjon</Eyebrow>
            <h2
              id="sos-title"
              className="mt-2 text-xl font-medium tracking-tight text-white"
            >
              Kjenner du et sug?
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              {cue
                ? "4 sekunder inn, 6 sekunder ut. Ikke forhandle med loopen."
                : "Velg hvilken impuls som melder seg. Deretter starter vagus-pusten."}
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Lukk
          </Button>
        </div>

        {!cue ? (
          <div className="mt-5 flex flex-wrap gap-2">
            {cues.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => {
                  setCue(option.id);
                  setRunning(true);
                }}
                className={cn(
                  "rounded-full border border-line px-3 py-1.5 text-sm text-slate-200 hover:border-coral/50 hover:bg-coral/10",
                )}
              >
                {option.emoji} {option.title}
              </button>
            ))}
          </div>
        ) : (
          <div className="mt-5">
            <p className="text-center text-sm text-slate-300">
              {cues.find((option) => option.id === cue)?.title}
            </p>
            <BreathingRing running={running} onFinished={handleFinished} />
            {finished ? (
              <div className="mt-2 space-y-3 text-center">
                <p className="text-sm text-slate-300">
                  Sug surfet. Vinduet er fortsatt ditt.
                </p>
                <Button variant="sage" onClick={onClose}>
                  Tilbake til Baseline
                </Button>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
