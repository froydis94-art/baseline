"use client";

import { useCallback, useState } from "react";
import { BreathingRing } from "@/components/onboarding/BreathingRing";
import { Button } from "@/components/ui/Button";

export function StepDefense({
  calibrated,
  onCalibrate,
}: {
  calibrated: boolean;
  onCalibrate: () => void;
}) {
  const [running, setRunning] = useState(false);
  const [finished, setFinished] = useState(calibrated);

  const handleFinished = useCallback(() => {
    setRunning(false);
    setFinished(true);
  }, []);

  return (
    <div className="space-y-6">
      <header>
        <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-coral">
          2-Minutters Habit Defense
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white">
          Når vanene melder seg, trenger du en kretsbryter.
        </h1>
        <p className="mt-3 text-base leading-7 text-slate-400">
          Test den beroligende intervensjonen (Vagus-pust 4s inn / 6s ut +
          erstatningshandling).
        </p>
      </header>

      <div className="rounded-2xl border border-coral/25 bg-coral/6 px-4 py-5">
        <BreathingRing running={running} onFinished={handleFinished} />
        <div className="mt-2 flex flex-col gap-2 sm:flex-row">
          <Button
            variant="line"
            className="flex-1"
            disabled={running}
            onClick={() => {
              setFinished(false);
              setRunning(true);
            }}
          >
            {finished ? "Kjør testen på nytt" : "Start 10-sekunders test"}
          </Button>
          <Button
            variant="coral"
            className="flex-1"
            disabled={!finished && !calibrated}
            onClick={onCalibrate}
          >
            {calibrated ? "Kretsbryter kalibrert" : "Fullfør test"}
          </Button>
        </div>
      </div>
    </div>
  );
}
