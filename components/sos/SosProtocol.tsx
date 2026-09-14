"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Card";
import { Progress } from "@/components/ui/Progress";
import { cn } from "@/lib/utils";

const CUES = [
  "Klokkehunger",
  "Kjedsomhet",
  "Emosjon",
  "Sosialt",
  "Ekte sult",
] as const;

const REPLACEMENTS = [
  "Protein + vann",
  "10 minutter gange",
  "Ut av kjøkkenet",
  "Meld en person",
] as const;

type SosProtocolProps = {
  open: boolean;
  onClose: () => void;
};

export function SosProtocol({ open, onClose }: SosProtocolProps) {
  const [step, setStep] = useState(0);
  const [cue, setCue] = useState<(typeof CUES)[number] | null>(null);
  const [seconds, setSeconds] = useState(90);
  const [running, setRunning] = useState(false);
  const [replacement, setReplacement] = useState<
    (typeof REPLACEMENTS)[number] | null
  >(null);

  useEffect(() => {
    if (!open) {
      setStep(0);
      setCue(null);
      setSeconds(90);
      setRunning(false);
      setReplacement(null);
    }
  }, [open]);

  useEffect(() => {
    if (!running || seconds <= 0) return;
    const id = window.setInterval(() => {
      setSeconds((current) => {
        if (current <= 1) {
          setRunning(false);
          return 0;
        }
        return current - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [running, seconds]);

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
              Food noise?
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Ikke forhandle med loopen. Navngi den, vent, bytt.
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Lukk
          </Button>
        </div>

        <ol className="mt-6 space-y-3">
          <StepRow active={step === 0} done={step > 0} label="1. Navngi signalet">
            <div className="mt-3 flex flex-wrap gap-2">
              {CUES.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => {
                    setCue(item);
                    setStep(1);
                    setRunning(true);
                  }}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-sm",
                    cue === item
                      ? "border-coral/50 bg-coral/15 text-white"
                      : "border-line text-slate-300 hover:border-slate-500",
                  )}
                >
                  {item}
                </button>
              ))}
            </div>
          </StepRow>

          <StepRow active={step === 1} done={step > 1} label="2. 90 sekunders pause">
            <div className="mt-3">
              <p className="text-3xl font-semibold tabular-nums text-white">
                {`${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`}
              </p>
              <Progress
                value={90 - seconds}
                max={90}
                tone="coral"
                className="mt-3"
              />
              <div className="mt-3 flex gap-2">
                <Button
                  size="sm"
                  variant="coral"
                  disabled={seconds > 0}
                  onClick={() => setStep(2)}
                >
                  Fortsett
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setRunning(false);
                    setStep(2);
                  }}
                >
                  Hopp over
                </Button>
              </div>
            </div>
          </StepRow>

          <StepRow active={step === 2} done={step > 2} label="3. Bytt handling">
            <div className="mt-3 flex flex-wrap gap-2">
              {REPLACEMENTS.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => {
                    setReplacement(item);
                    setStep(3);
                  }}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-sm",
                    replacement === item
                      ? "border-sage/50 bg-sage/15 text-white"
                      : "border-line text-slate-300 hover:border-slate-500",
                  )}
                >
                  {item}
                </button>
              ))}
            </div>
          </StepRow>

          <StepRow active={step === 3} done={false} label="4. Lukk loopen">
            {step === 3 ? (
              <div className="mt-3 space-y-3">
                <p className="text-sm text-slate-300">
                  {cue} ble møtt med {replacement?.toLowerCase()}. Vinduet er
                  fortsatt ditt.
                </p>
                <Button variant="sage" onClick={onClose}>
                  Tilbake til Baseline
                </Button>
              </div>
            ) : null}
          </StepRow>
        </ol>
      </div>
    </div>
  );
}

function StepRow({
  label,
  active,
  done,
  children,
}: {
  label: string;
  active: boolean;
  done: boolean;
  children: ReactNode;
}) {
  return (
    <li
      className={cn(
        "rounded-xl border px-4 py-3",
        active && "border-coral/30 bg-coral/6",
        done && "border-sage/20 bg-sage/5",
        !active && !done && "border-line bg-white/2",
      )}
    >
      <p
        className={cn(
          "text-sm font-medium",
          active ? "text-white" : "text-slate-400",
        )}
      >
        {label}
      </p>
      {(active || done) && children}
    </li>
  );
}
